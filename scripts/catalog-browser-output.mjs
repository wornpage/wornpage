import assert from 'node:assert/strict';
import { mkdir, rm } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const CATALOG_OUTPUT_RELATIVE_PATH = 'output/playwright/catalog';

export function catalogOutputDirectory(repositoryRoot) {
  const resolvedRoot = resolve(repositoryRoot);
  const outputDirectory = resolve(resolvedRoot, ...CATALOG_OUTPUT_RELATIVE_PATH.split('/'));
  const relativeOutput = relative(resolvedRoot, outputDirectory).replaceAll('\\', '/');

  assert.equal(
    relativeOutput,
    CATALOG_OUTPUT_RELATIVE_PATH,
    `Catalog browser output must resolve to ${CATALOG_OUTPUT_RELATIVE_PATH}, received ${relativeOutput}`,
  );
  return outputDirectory;
}

export async function prepareCatalogOutput({ repositoryRoot, clean }) {
  const outputDirectory = catalogOutputDirectory(repositoryRoot);
  if (clean) await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  return outputDirectory;
}
