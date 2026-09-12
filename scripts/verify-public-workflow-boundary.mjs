#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
const VERIFICATION_COMMAND = 'node scripts/verify-public-workflow-boundary.mjs';
const RETAINED_PACKAGE_COUNT = 25;
const BASELINE_DENOMINATORS = Object.freeze({
  packages: 26,
  packageArchives: 26,
  catalogSections: 26,
  bunTests: 529,
  bunTestFiles: 43,
  namedThemeCells: 16,
  catalogPresenceChecks: 416,
  catalogOutcomeChecks: 416,
});
const FORBIDDEN_PATTERNS = [
  ['package identity', /@wornpage\/workflow/u],
  ['workspace package path', /packages[\\/]workflow/u],
  ['standalone repository', /(?:github\.com\/)?wornpage\/workflow/u],
  ['removed implementation export', /\b(?:buildStandupText|dueUrgency|filterPacks|hasBlocker|isMissingNextAction|orderPacks|primaryCommand)\b/u],
];
const INPUT_ROOTS = ['packages', 'demo', 'scripts', '.github'];
const INPUT_FILES = ['README.md', 'package.json', 'bun.lock', 'components-release.json', 'docs/standalone-provenance.json'];
const SCAN_EXCLUSIONS = new Set(['scripts/verify-public-workflow-boundary.mjs']);

function slash(path) {
  return path.replaceAll('\\', '/');
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function filesUnder(root, relativePath, excludedDirectories = new Set()) {
  const absolute = join(root, ...relativePath.split('/'));
  if (!(await pathExists(absolute))) return [];
  const metadata = await stat(absolute);
  if (metadata.isFile()) return [slash(relative(root, absolute))];
  const files = [];
  for (const entry of await readdir(absolute, { withFileTypes: true })) {
    const child = slash(join(relativePath, entry.name));
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    if (entry.isDirectory()) files.push(...await filesUnder(root, child, excludedDirectories));
    else if (entry.isFile()) files.push(child);
    else files.push(child);
  }
  return files;
}

async function forbiddenFindings(root, paths) {
  const findings = [];
  for (const relativePath of paths) {
    const normalized = slash(relativePath);
    if (SCAN_EXCLUSIONS.has(normalized)) continue;
    for (const [label, pattern] of FORBIDDEN_PATTERNS) {
      if (pattern.test(normalized)) findings.push(`${normalized}: forbidden ${label} in path`);
    }
    const absolute = join(root, ...normalized.split('/'));
    const metadata = await stat(absolute);
    if (!metadata.isFile()) {
      findings.push(`${normalized}: non-file entry is not allowed in scanned distribution inputs`);
      continue;
    }
    const content = await readFile(absolute, 'utf8');
    for (const [label, pattern] of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) findings.push(`${normalized}: forbidden ${label} in content`);
    }
  }
  return findings;
}

function assertReleaseInventory(release) {
  assert.equal(release?.schemaVersion, 2, 'components-release.json must retain schemaVersion 2.');
  const names = Object.keys(release?.packages ?? {}).sort();
  assert.equal(names.includes('workflow'), false, 'components-release.json must not distribute workflow.');
  assert.equal(names.length, RETAINED_PACKAGE_COUNT, `Expected ${RETAINED_PACKAGE_COUNT} retained package releases.`);
  return names;
}

async function assertCurrentInputs(root) {
  assert.equal(await pathExists(join(root, 'packages', 'workflow')), false, 'packages/workflow must be absent.');

  const release = JSON.parse(await readFile(join(root, 'components-release.json'), 'utf8'));
  const releaseNames = assertReleaseInventory(release);
  const packageNames = (await readdir(join(root, 'packages'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== 'cli')
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(packageNames, releaseNames, 'Retained package directories must match the release inventory exactly.');

  const demo = JSON.parse(await readFile(join(root, 'demo', 'package.json'), 'utf8'));
  const demoNames = Object.keys(demo.dependencies ?? {})
    .filter((name) => name.startsWith('@wornpage/'))
    .map((name) => name.slice('@wornpage/'.length))
    .sort();
  assert.deepEqual(demoNames, releaseNames, 'Demo dependencies must match the retained release inventory exactly.');

  const provenance = JSON.parse(await readFile(join(root, 'docs', 'standalone-provenance.json'), 'utf8'));
  assert.equal(
    provenance.some((entry) => entry.package === '@wornpage/workflow' || entry.repository === 'wornpage/workflow'),
    false,
    'Current standalone provenance must not list the removed workflow package.',
  );

  const scanPaths = [...INPUT_FILES];
  const excludedDirectories = new Set(['dist', 'node_modules']);
  for (const inputRoot of INPUT_ROOTS) scanPaths.push(...await filesUnder(root, inputRoot, excludedDirectories));
  const findings = await forbiddenFindings(root, [...new Set(scanPaths)].sort());
  assert.deepEqual(findings, [], `Forbidden workflow distribution input found:\n${findings.join('\n')}`);
  return { release, releaseNames };
}

async function assertPositiveControls() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'wornpage-workflow-boundary-'));
  try {
    const sourcePath = join(fixtureRoot, 'packages', 'workflow', 'src', 'workflow.ts');
    await mkdir(dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, 'export function buildStandupText() { return "All clear"; }\n');
    const sourceFindings = await forbiddenFindings(fixtureRoot, ['packages/workflow/src/workflow.ts']);
    assert.ok(sourceFindings.length >= 2, 'Positive control did not reject a forbidden workflow source.');
    assert.throws(
      () => assertReleaseInventory({ schemaVersion: 2, packages: { workflow: { version: '0.1.0', releaseTag: 'components-2026.09.09' } } }),
      /must not distribute workflow/u,
      'Positive control did not reject a forbidden workflow release entry.',
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

async function resolveBunExecutable() {
  if (process.platform !== 'win32') return 'bun';
  const pathDirectories = (process.env.PATH ?? '').split(';').filter(Boolean);
  const candidates = [
    ...(process.env.BUN_INSTALL ? [join(process.env.BUN_INSTALL, 'bin', 'bun.exe')] : []),
    ...(process.env.USERPROFILE ? [join(process.env.USERPROFILE, '.bun', 'bin', 'bun.exe')] : []),
    ...pathDirectories.flatMap((directory) => [
      join(directory, 'bun.exe'),
      join(directory, 'node_modules', 'bun', 'bin', 'bun.exe'),
    ]),
  ];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  throw new Error('Could not resolve the Bun executable from the Windows environment.');
}

async function runFullCatalogVerification(root) {
  const child = spawn(await resolveBunExecutable(), ['run', 'verify:catalog'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    windowsHide: true,
  });
  const result = await new Promise((resolvePromise, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolvePromise({ code, signal }));
  });
  assert.equal(result.signal, null, `Catalog verification ended with signal ${result.signal}.`);
  assert.equal(result.code, 0, `Catalog verification failed with exit ${result.code}.`);
}

async function readStageOutput(root, runDirectory, stage) {
  const chunks = [];
  for (const value of [stage.stdout, stage.stderr]) {
    if (!value) continue;
    const path = resolve(runDirectory, value);
    if (await pathExists(path)) chunks.push(await readFile(path, 'utf8'));
    else {
      const rootPath = resolve(root, value);
      if (await pathExists(rootPath)) chunks.push(await readFile(rootPath, 'utf8'));
    }
  }
  return chunks.join('\n');
}

async function assertCurrentOutputs(root, releaseNames) {
  const manifestPath = join(root, 'output', 'components', 'catalog', 'component-manifest.json');
  const browserReportPath = join(root, 'output', 'playwright', 'catalog', 'report.json');
  const catalogSummaryPath = join(root, 'output', 'verify-catalog', 'latest.json');
  const [manifest, browserReport, catalogSummary] = await Promise.all([
    readFile(manifestPath, 'utf8').then(JSON.parse),
    readFile(browserReportPath, 'utf8').then(JSON.parse),
    readFile(catalogSummaryPath, 'utf8').then(JSON.parse),
  ]);

  assert.equal(manifest.sourceTreeClean, true, 'Release manifest must be generated from a clean committed source tree.');
  const manifestNames = manifest.packages.map((entry) => entry.name.replace(/^@wornpage\//u, '')).sort();
  assert.deepEqual(manifestNames, releaseNames, 'Generated release manifest must contain exactly the retained packages.');
  const archiveFiles = (await readdir(dirname(manifestPath)))
    .filter((name) => name.endsWith('.tgz'))
    .sort();
  assert.equal(archiveFiles.length, RETAINED_PACKAGE_COUNT, `Expected ${RETAINED_PACKAGE_COUNT} generated package archives.`);
  assert.equal(archiveFiles.some((name) => name.includes('workflow')), false, 'Generated package archives must not include workflow.');

  const outputPaths = [
    ...await filesUnder(root, 'demo/dist'),
    ...await filesUnder(root, 'output/components/catalog'),
  ];
  const textOutputPaths = outputPaths.filter((path) => !path.endsWith('.tgz'));
  const findings = await forbiddenFindings(root, textOutputPaths);
  assert.deepEqual(findings, [], `Forbidden workflow implementation found in emitted output:\n${findings.join('\n')}`);

  assert.equal(browserReport.namedThemeMatrix.expected, 16, 'Named-theme catalog matrix denominator changed unexpectedly.');
  assert.equal(browserReport.namedThemeMatrix.passed, 16, 'Named-theme catalog matrix did not pass every cell.');
  assert.equal(browserReport.namedThemeMatrix.presenceChecks, 16 * RETAINED_PACKAGE_COUNT, 'Catalog presence denominator must reflect 25 retained packages.');
  assert.equal(browserReport.namedThemeMatrix.familyOutcomeChecks, 16 * RETAINED_PACKAGE_COUNT, 'Catalog outcome denominator must reflect 25 retained packages.');

  assert.equal(catalogSummary.status, 'passed', 'The underlying catalog verification receipt must pass.');
  const testsStage = catalogSummary.stages.find((stage) => stage.id === 'tests');
  assert.equal(testsStage?.status, 'passed', 'The retained Bun test stage must pass.');
  const runDirectory = dirname(catalogSummary.summaryPath ?? catalogSummaryPath);
  const testOutput = await readStageOutput(root, runDirectory, testsStage);
  const testCounts = testOutput.match(/(\d+) pass[\s\S]*?Ran (\d+) tests across (\d+) files/u);
  assert.ok(testCounts, 'Could not read the retained Bun test denominator from catalog evidence.');

  return {
    manifestPath: slash(relative(root, manifestPath)),
    browserReportPath: slash(relative(root, browserReportPath)),
    catalogSummaryPath: slash(relative(root, catalogSummaryPath)),
    current: {
      packages: manifest.packages.length,
      packageArchives: archiveFiles.length,
      catalogSections: RETAINED_PACKAGE_COUNT,
      bunTests: Number(testCounts[2]),
      bunTestFiles: Number(testCounts[3]),
      namedThemeCells: browserReport.namedThemeMatrix.passed,
      catalogPresenceChecks: browserReport.namedThemeMatrix.presenceChecks,
      catalogOutcomeChecks: browserReport.namedThemeMatrix.familyOutcomeChecks,
    },
  };
}

async function main() {
  const { releaseNames } = await assertCurrentInputs(REPOSITORY_ROOT);
  await assertPositiveControls();
  console.log(`Public workflow boundary preflight passed for ${releaseNames.length} retained packages; source and release-entry positive controls passed.`);

  await runFullCatalogVerification(REPOSITORY_ROOT);
  const outputs = await assertCurrentOutputs(REPOSITORY_ROOT, releaseNames);
  const receipt = {
    schemaVersion: 1,
    verificationCommand: VERIFICATION_COMMAND,
    status: 'passed',
    sourceCommit: JSON.parse(await readFile(join(REPOSITORY_ROOT, 'output', 'components', 'catalog', 'component-manifest.json'), 'utf8')).sourceCommit,
    baseline: BASELINE_DENOMINATORS,
    current: outputs.current,
    positiveControls: { forbiddenSource: 'passed', forbiddenReleaseEntry: 'passed' },
    evidence: {
      componentManifest: outputs.manifestPath,
      catalogBrowserReport: outputs.browserReportPath,
      catalogVerificationSummary: outputs.catalogSummaryPath,
    },
    historyLimit: 'This gate covers the current source tree and newly emitted artifacts; it does not erase earlier Git history or immutable release assets.',
    createdAt: new Date().toISOString(),
  };
  const receiptPath = join(REPOSITORY_ROOT, 'output', 'verify-catalog', 'public-workflow-boundary.json');
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`Public workflow boundary passed: packages ${receipt.current.packages}/${BASELINE_DENOMINATORS.packages} baseline, Bun tests ${receipt.current.bunTests}/${BASELINE_DENOMINATORS.bunTests} baseline, catalog checks ${receipt.current.catalogPresenceChecks}/${BASELINE_DENOMINATORS.catalogPresenceChecks} baseline.`);
  console.log(`Boundary receipt: ${slash(relative(REPOSITORY_ROOT, receiptPath))}`);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
