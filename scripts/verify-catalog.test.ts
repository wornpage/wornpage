import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Writable } from 'node:stream';
import { CATALOG_VERIFY_STAGES, resolveBunExecutable, runCatalogVerification } from './verify-catalog.mjs';

const temporaryRoots: string[] = [];
const quietTarget = { write() {} };

function inlineStage(id: string, source: string) {
  return {
    id,
    label: `${id} fixture`,
    command: `fixture ${id}`,
    executable: process.execPath,
    args: ['-e', source],
  };
}

async function temporaryRoot() {
  const root = await mkdtemp(join(tmpdir(), 'wornpage-verify-catalog-'));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('catalog verification runner', () => {
  test('checks consumer types before tests, release packing, and browser verification', () => {
    expect(CATALOG_VERIFY_STAGES.map(({ command }) => command)).toEqual([
      'bun run check:workspace',
      'bun run check:components',
      'bun run --cwd packages/theme check:types',
      'bun test',
      'bun run pack:components',
      'bun run test:toast:focus',
      'bun run build',
      'bun run test:catalog:browser',
    ]);
    expect(() => resolveBunExecutable({ npm_execpath: '/tools/npm' }, '/tools/node')).toThrow(/must be launched with Bun/);
  });

  test('records ordered positive stage output, exit codes, and timing', async () => {
    const root = await temporaryRoot();
    const outputRoot = join(root, 'evidence');
    const result = await runCatalogVerification({
      rootDir: root,
      outputRoot,
      runId: 'positive-run',
      stages: [
        inlineStage('first', 'console.log("first stdout"); console.error("first stderr")'),
        inlineStage('second', 'console.log("second stdout")'),
      ],
      stdoutTarget: quietTarget,
      stderrTarget: quietTarget,
    });

    expect(result.exitCode).toBe(0);
    expect(result.summary.status).toBe('passed');
    expect(result.summary.stages.map(({ id, status, exitCode }) => ({ id, status, exitCode }))).toEqual([
      { id: 'first', status: 'passed', exitCode: 0 },
      { id: 'second', status: 'passed', exitCode: 0 },
    ]);
    expect(result.summary.stages.every(({ durationMs }) => Number.isInteger(durationMs) && durationMs >= 0)).toBe(true);
    expect(await readFile(join(outputRoot, result.summary.stages[0].stdout), 'utf8')).toContain('first stdout');
    expect(await readFile(join(outputRoot, result.summary.stages[0].stderr), 'utf8')).toContain('first stderr');
    expect(JSON.parse(await readFile(result.summaryPath, 'utf8')).status).toBe('passed');
  });

  test('preserves a failure exit, logs it, skips later work, and leaves source unchanged', async () => {
    const root = await temporaryRoot();
    const outputRoot = join(root, 'evidence');
    const sourcePath = join(root, 'source.txt');
    const laterMarker = join(root, 'later-ran.txt');
    await writeFile(sourcePath, 'canonical source\n');
    const result = await runCatalogVerification({
      rootDir: root,
      outputRoot,
      runId: 'negative-run',
      stages: [
        inlineStage('first', 'console.log("first passed")'),
        inlineStage('failing', 'console.error("deterministic failure evidence"); process.exit(7)'),
        inlineStage('later', `require("node:fs").writeFileSync(${JSON.stringify(laterMarker)}, "should not exist")`),
      ],
      stdoutTarget: quietTarget,
      stderrTarget: quietTarget,
    });

    expect(result.exitCode).toBe(7);
    expect(result.summary.status).toBe('failed');
    expect(result.summary.failedStage).toBe('failing');
    expect(result.summary.stages.map(({ status }) => status)).toEqual(['passed', 'failed', 'skipped']);
    expect(result.summary.stages[2].skipReason).toBe('blocked by failed failing stage');
    expect(await readFile(join(outputRoot, result.summary.stages[1].stderr), 'utf8')).toContain('deterministic failure evidence');
    expect(await readFile(sourcePath, 'utf8')).toBe('canonical source\n');
    expect(existsSync(laterMarker)).toBe(false);
    expect(JSON.parse(await readFile(join(outputRoot, 'latest.json'), 'utf8')).exitCode).toBe(7);
  });

  test('records spawn failure context and does not start the next stage', async () => {
    const root = await temporaryRoot();
    const laterMarker = join(root, 'later-ran.txt');
    const result = await runCatalogVerification({
      rootDir: root,
      outputRoot: join(root, 'evidence'),
      runId: 'spawn-failure-run',
      stages: [
        { id: 'spawn', label: 'spawn fixture', command: 'missing executable', executable: join(root, 'missing-executable'), args: [] },
        inlineStage('later', `require("node:fs").writeFileSync(${JSON.stringify(laterMarker)}, "should not exist")`),
      ],
      stdoutTarget: quietTarget,
      stderrTarget: quietTarget,
    });

    expect(result.summary.status).toBe('failed');
    expect(result.summary.failedStage).toBe('spawn');
    expect(result.summary.stages[0].error).toMatch(/ENOENT|not found/i);
    expect(result.summary.stages[1].status).toBe('skipped');
    expect(existsSync(laterMarker)).toBe(false);
  });

  test('records an asynchronous log-write failure and stops its owned child', async () => {
    const root = await temporaryRoot();
    const result = await runCatalogVerification({
      rootDir: root,
      outputRoot: join(root, 'evidence'),
      runId: 'log-failure-run',
      stages: [inlineStage('logging', 'console.log("trigger log write"); setTimeout(() => {}, 5000)')],
      stdoutTarget: quietTarget,
      stderrTarget: quietTarget,
      logStreamFactory() {
        const stream = new Writable({
          write(_chunk, _encoding, callback) { callback(new Error('deterministic log write failure')); },
        });
        queueMicrotask(() => stream.emit('open', 1));
        return stream;
      },
    });

    expect(result.summary.status).toBe('failed');
    expect(result.summary.failedStage).toBe('logging');
    expect(result.summary.stages[0].error).toContain('deterministic log write failure');
    expect(result.summary.durationMs).toBeLessThan(5000);
    expect(JSON.parse(await readFile(join(root, 'evidence', 'latest.json'), 'utf8')).status).toBe('failed');
  });

  test('returns nonzero when log finalization fails after a child exits zero', async () => {
    const root = await temporaryRoot();
    const result = await runCatalogVerification({
      rootDir: root,
      outputRoot: join(root, 'evidence'),
      runId: 'log-finalization-failure-run',
      stages: [inlineStage('finalizing', 'console.log("successful child")')],
      stdoutTarget: quietTarget,
      stderrTarget: quietTarget,
      logStreamFactory() {
        const stream = new Writable({
          write(_chunk, _encoding, callback) { callback(); },
          final(callback) { callback(new Error('deterministic log finalization failure')); },
        });
        queueMicrotask(() => stream.emit('open', 1));
        return stream;
      },
    });

    expect(result.exitCode).toBe(1);
    expect(result.summary.status).toBe('failed');
    expect(result.summary.stages[0].exitCode).toBe(0);
    expect(result.summary.stages[0].error).toContain('deterministic log finalization failure');
  });
});
