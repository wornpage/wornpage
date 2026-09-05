import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, test } from 'bun:test';
import { catalogOutputDirectory, prepareCatalogOutput } from './catalog-browser-output.mjs';

const temporaryRoots = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function temporaryRepository() {
  const root = await mkdtemp(join(tmpdir(), 'wornpage-catalog-output-'));
  temporaryRoots.push(root);
  return root;
}

describe('catalog browser output ownership', () => {
  test('resolves only the dedicated catalog artifact directory', async () => {
    const repositoryRoot = await temporaryRepository();

    assert.equal(
      catalogOutputDirectory(repositoryRoot),
      join(repositoryRoot, 'output', 'playwright', 'catalog'),
    );
  });

  test('cleans stale catalog artifacts for a full run without touching sibling evidence', async () => {
    const repositoryRoot = await temporaryRepository();
    const catalogOutput = catalogOutputDirectory(repositoryRoot);
    const verifierOutput = join(repositoryRoot, 'output', 'verify-catalog');
    await mkdir(catalogOutput, { recursive: true });
    await mkdir(verifierOutput, { recursive: true });
    await writeFile(join(catalogOutput, 'report.json'), 'stale full-run report');
    await writeFile(join(verifierOutput, 'summary.json'), 'durable verifier evidence');

    const prepared = await prepareCatalogOutput({ repositoryRoot, clean: true });

    assert.equal(prepared, catalogOutput);
    await assert.rejects(readFile(join(catalogOutput, 'report.json')));
    assert.equal(await readFile(join(verifierOutput, 'summary.json'), 'utf8'), 'durable verifier evidence');
  });

  test('preserves full-run artifacts for the bounded focus diagnostic', async () => {
    const repositoryRoot = await temporaryRepository();
    const catalogOutput = catalogOutputDirectory(repositoryRoot);
    await mkdir(catalogOutput, { recursive: true });
    await writeFile(join(catalogOutput, 'report.json'), 'current full-run report');

    await prepareCatalogOutput({ repositoryRoot, clean: false });

    assert.equal(await readFile(join(catalogOutput, 'report.json'), 'utf8'), 'current full-run report');
  });
});
