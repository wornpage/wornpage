import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function resolveBunExecutable(environment = process.env, currentExecutable = process.execPath) {
  if (/(?:^|[\\/])bun(?:\.exe)?$/iu.test(currentExecutable)) return currentExecutable;
  const candidate = environment.npm_execpath;
  if (typeof candidate !== 'string' || !/(?:^|[\\/])bun(?:\.exe)?$/iu.test(candidate)) {
    throw new Error('verify:catalog must be launched with Bun so every stage uses the pinned Bun runtime.');
  }
  return candidate;
}

const bunExecutable = resolveBunExecutable();

export const CATALOG_VERIFY_STAGES = Object.freeze([
  { id: 'workspace', label: 'Workspace dependency contract', command: 'bun run check:workspace', executable: bunExecutable, args: ['run', 'check:workspace'] },
  { id: 'delivery', label: 'Component delivery contract', command: 'bun run check:components', executable: bunExecutable, args: ['run', 'check:components'] },
  { id: 'tests', label: 'Cross-package Bun tests', command: 'bun test', executable: bunExecutable, args: ['test'] },
  { id: 'packages', label: 'Build and pack component releases', command: 'bun run pack:components', executable: bunExecutable, args: ['run', 'pack:components'] },
  { id: 'build', label: 'Production catalog build', command: 'bun run build', executable: bunExecutable, args: ['run', 'build'] },
  { id: 'browser', label: 'Built-catalog browser verification', command: 'bun run test:catalog:browser', executable: bunExecutable, args: ['run', 'test:catalog:browser'] },
]);

function safeRunId(value) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/u.test(value)) throw new Error(`Unsafe catalog verification run id: ${value}`);
  return value;
}

function defaultRunId() {
  return `${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}-${process.pid}`;
}

function logPath(outputRoot, path) {
  return relative(outputRoot, path).replaceAll('\\', '/');
}

async function closeStream(stream) {
  if (!stream || stream.closed || stream.destroyed) return;
  await new Promise((resolveClose) => {
    stream.once('close', resolveClose);
    stream.once('finish', resolveClose);
    stream.end();
  });
}

async function openLogStream(path, recordError, logStreamFactory) {
  let stream;
  try {
    stream = logStreamFactory(path, { flags: 'wx' });
  } catch (error) {
    recordError(error);
    throw error;
  }
  stream.on('error', recordError);
  await new Promise((resolveOpen, reject) => {
    stream.once('open', resolveOpen);
    stream.once('error', reject);
  });
  return stream;
}

async function runStage(stage, { cwd, stdoutPath, stderrPath, stdoutTarget, stderrTarget, logStreamFactory }) {
  let stdoutLog;
  let stderrLog;
  let child;
  let spawnError = null;
  let logError = null;
  const recordLogError = (error) => {
    logError ??= error;
    if (child && child.exitCode === null && !child.killed) child.kill();
  };
  try {
    stdoutLog = await openLogStream(stdoutPath, recordLogError, logStreamFactory);
    stderrLog = await openLogStream(stderrPath, recordLogError, logStreamFactory);
  } catch (error) {
    await Promise.all([closeStream(stdoutLog), closeStream(stderrLog)]);
    return { exitCode: 1, signal: null, error: `Unable to open stage logs: ${error?.stack || error}` };
  }
  try {
    child = spawn(stage.executable, stage.args, { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    spawnError = error;
  }
  if (!child) {
    await Promise.all([closeStream(stdoutLog), closeStream(stderrLog)]);
    return { exitCode: 1, signal: null, error: spawnError?.stack || spawnError?.message || 'Stage process did not start' };
  }
  child.stdout.on('data', (chunk) => { stdoutLog.write(chunk); stdoutTarget.write(chunk); });
  child.stderr.on('data', (chunk) => { stderrLog.write(chunk); stderrTarget.write(chunk); });
  child.once('error', (error) => { spawnError = error; });
  const result = await new Promise((resolveExit) => {
    child.once('close', (exitCode, signal) => resolveExit({ exitCode, signal }));
  });
  await Promise.all([closeStream(stdoutLog), closeStream(stderrLog)]);
  const error = logError || spawnError;
  return { ...result, error: error?.stack || error?.message || null };
}

export async function runCatalogVerification({
  rootDir = repositoryRoot,
  outputRoot = join(rootDir, 'output', 'verify-catalog'),
  runId = defaultRunId(),
  stages = CATALOG_VERIFY_STAGES,
  stdoutTarget = process.stdout,
  stderrTarget = process.stderr,
  logStreamFactory = createWriteStream,
} = {}) {
  const normalizedRoot = resolve(rootDir);
  const normalizedOutputRoot = resolve(outputRoot);
  const normalizedRunId = safeRunId(runId);
  if (!Array.isArray(stages) || stages.length === 0) throw new Error('Catalog verification requires at least one stage.');
  const stageIds = stages.map((stage) => safeRunId(stage.id));
  if (new Set(stageIds).size !== stageIds.length) throw new Error('Catalog verification stage ids must be unique.');
  const runDir = join(normalizedOutputRoot, 'runs', normalizedRunId);
  await mkdir(join(normalizedOutputRoot, 'runs'), { recursive: true });
  await mkdir(runDir, { recursive: false });

  const startedAt = new Date().toISOString();
  const summaryPath = join(runDir, 'summary.json');
  const latestPath = join(normalizedOutputRoot, 'latest.json');
  const summary = {
    schemaVersion: 1,
    command: 'bun run verify:catalog',
    runId: normalizedRunId,
    status: 'running',
    startedAt,
    finishedAt: null,
    durationMs: null,
    currentStage: null,
    failedStage: null,
    exitCode: null,
    signal: null,
    evidenceDirectory: logPath(normalizedOutputRoot, runDir),
    stages: stages.map((stage, index) => ({
      index: index + 1,
      id: stage.id,
      label: stage.label,
      command: stage.command,
      status: 'pending',
      startedAt: null,
      finishedAt: null,
      durationMs: null,
      exitCode: null,
      signal: null,
      error: null,
      stdout: logPath(normalizedOutputRoot, join(runDir, `${String(index + 1).padStart(2, '0')}-${stage.id}.stdout.log`)),
      stderr: logPath(normalizedOutputRoot, join(runDir, `${String(index + 1).padStart(2, '0')}-${stage.id}.stderr.log`)),
      skipReason: null,
    })),
  };

  async function persist() {
    const serialized = `${JSON.stringify(summary, null, 2)}\n`;
    await writeFile(summaryPath, serialized, { encoding: 'utf8' });
    await writeFile(latestPath, serialized, { encoding: 'utf8' });
  }

  await persist();
  stdoutTarget.write(`[verify:catalog] evidence ${runDir}\n`);
  const runStarted = performance.now();

  for (const [index, stage] of stages.entries()) {
    const stageEvidence = summary.stages[index];
    const stageStarted = performance.now();
    stageEvidence.status = 'running';
    stageEvidence.startedAt = new Date().toISOString();
    summary.currentStage = stage.id;
    await persist();
    stdoutTarget.write(`[verify:catalog] stage ${index + 1}/${stages.length} start ${stage.id}: ${stage.command}\n`);

    let result;
    try {
      result = await runStage(stage, {
        cwd: normalizedRoot,
        stdoutPath: join(normalizedOutputRoot, stageEvidence.stdout),
        stderrPath: join(normalizedOutputRoot, stageEvidence.stderr),
        stdoutTarget,
        stderrTarget,
        logStreamFactory,
      });
    } catch (error) {
      result = { exitCode: 1, signal: null, error: error?.stack || String(error) };
    }
    stageEvidence.finishedAt = new Date().toISOString();
    stageEvidence.durationMs = Math.round(performance.now() - stageStarted);
    stageEvidence.exitCode = result.exitCode;
    stageEvidence.signal = result.signal;
    stageEvidence.error = result.error;

    if (result.exitCode === 0 && result.signal === null && result.error === null) {
      stageEvidence.status = 'passed';
      stdoutTarget.write(`[verify:catalog] stage ${stage.id} passed in ${stageEvidence.durationMs}ms\n`);
      await persist();
      continue;
    }

    stageEvidence.status = 'failed';
    summary.status = 'failed';
    summary.failedStage = stage.id;
    summary.exitCode = Number.isInteger(result.exitCode) && result.exitCode > 0 && result.exitCode <= 255 ? result.exitCode : 1;
    summary.signal = result.signal;
    for (const skipped of summary.stages.slice(index + 1)) {
      skipped.status = 'skipped';
      skipped.skipReason = `blocked by failed ${stage.id} stage`;
    }
    summary.currentStage = null;
    summary.finishedAt = new Date().toISOString();
    summary.durationMs = Math.round(performance.now() - runStarted);
    stderrTarget.write(`[verify:catalog] stage ${stage.id} failed with exit ${summary.exitCode}${result.signal ? ` signal ${result.signal}` : ''}; later stages skipped\n`);
    await persist();
    return { exitCode: summary.exitCode, summary, summaryPath, runDir };
  }

  summary.status = 'passed';
  summary.currentStage = null;
  summary.exitCode = 0;
  summary.finishedAt = new Date().toISOString();
  summary.durationMs = Math.round(performance.now() - runStarted);
  await persist();
  stdoutTarget.write(`[verify:catalog] passed all ${stages.length} stages in ${summary.durationMs}ms\n`);
  return { exitCode: 0, summary, summaryPath, runDir };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const result = await runCatalogVerification();
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`[verify:catalog] runner failed before completion: ${error?.stack || error}`);
    process.exitCode = 1;
  }
}
