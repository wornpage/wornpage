import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import {
  COMPONENT_BASELINE_RELEASE_TAG,
  COMPONENT_RELEASES,
  type ComponentReleaseIdentity,
} from './components.ts';

const repository = 'wornpage/wornpage';
const workflowPath = '.github/workflows/workspace.yml';
const releaseArtifactPrefix = 'component-release-verification';
const COMMIT_PATTERN = /^[0-9a-f]{40}$/u;
const INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]+={0,2}$/u;
const ARTIFACT_DIGEST_PATTERN = /^sha256:[0-9a-f]{64}$/u;
const VERIFY_STAGES = [
  ['workspace', 'bun run check:workspace'],
  ['delivery', 'bun run check:components'],
  ['theme-types', 'bun run --cwd packages/theme check:types'],
  ['tests', 'bun test'],
  ['packages', 'bun run pack:components'],
  ['toast-focus', 'bun run test:toast:focus'],
  ['build', 'bun run build'],
  ['browser', 'bun run test:catalog:browser'],
];

type PackageManifestEntry = {
  name: string;
  version: string;
  releaseTag: string;
  filename: string;
  integrity: string;
  source: string;
  delivery: string;
};

type ComponentManifest = {
  schemaVersion: 1 | 2;
  manifestReleaseTag: string | null;
  sourceCommit: string;
  sourceTreeClean: boolean;
  packages: PackageManifestEntry[];
};

export type ComponentReleaseConfig = {
  baselineReleaseTag: string;
  packages: Record<string, ComponentReleaseIdentity>;
};

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function positiveInteger(value: unknown, label: string) {
  if (!Number.isInteger(value) || Number(value) <= 0) throw new Error(`${label} must be a positive integer.`);
  return Number(value);
}

function nonNegativeInteger(value: unknown, label: string) {
  if (!Number.isInteger(value) || Number(value) < 0) throw new Error(`${label} must be a non-negative integer.`);
  return Number(value);
}

function paginatedItems(value: unknown, key: 'workflow_runs' | 'artifacts', label: string) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${label} response must contain at least one page.`);
  const pages = value.map((page, index) => asObject(page, `${label} page ${index + 1}`));
  const total = nonNegativeInteger(pages[0].total_count, `${label} total_count`);
  const items = pages.flatMap((page, index) => {
    if (page.total_count !== total || !Array.isArray(page[key])) throw new Error(`${label} page ${index + 1} is malformed.`);
    return page[key] as unknown[];
  });
  if (items.length !== total) throw new Error(`${label} response is incomplete.`);
  return items;
}

export type SelectedReleaseArtifact = {
  runId: number;
  runAttempt: number;
  artifactId: number;
  artifactName: string;
};

export function selectReleaseArtifact(
  workflowValue: unknown,
  runsValue: unknown,
  artifactsValue: unknown,
  expectedHead: string,
  now = new Date(),
): SelectedReleaseArtifact {
  const workflow = asObject(workflowValue, 'Workspace workflow');
  const workflowId = positiveInteger(workflow.id, 'Workspace workflow id');
  if (workflow.path !== workflowPath) throw new Error(`Workspace workflow path must be ${workflowPath}.`);

  const candidates = paginatedItems(runsValue, 'workflow_runs', 'Workspace workflow runs')
    .map((value, index) => asObject(value, `Workspace workflow run ${index + 1}`))
    .filter((run) => {
      const runRepository = asObject(run.repository, 'Workspace workflow run repository');
      const headRepository = asObject(run.head_repository, 'Workspace workflow run head repository');
      return run.path === workflowPath
        && runRepository.full_name === repository
        && headRepository.full_name === repository
        && run.head_branch === 'main'
        && run.head_sha === expectedHead
        && (run.event === 'push' || run.event === 'workflow_dispatch');
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
  if (candidates.length === 0) throw new Error('No current main workspace run matches the reviewed source commit.');
  const run = candidates[0];
  const runId = positiveInteger(run.id, 'Workspace workflow run id');
  const runAttempt = positiveInteger(run.run_attempt, 'Workspace workflow run attempt');
  if (run.workflow_id !== workflowId) throw new Error('Workspace workflow run has the wrong workflow id.');
  if (run.status !== 'completed' || run.conclusion !== 'success') throw new Error('The current main workspace run did not complete successfully.');
  const runRepository = asObject(run.repository, 'Workspace workflow run repository');
  const headRepository = asObject(run.head_repository, 'Workspace workflow run head repository');
  const repositoryId = positiveInteger(runRepository.id, 'Workspace workflow run repository id');
  const headRepositoryId = positiveInteger(headRepository.id, 'Workspace workflow run head repository id');

  const artifactName = `${releaseArtifactPrefix}-${runId}-${runAttempt}`;
  const matching = paginatedItems(artifactsValue, 'artifacts', 'Workspace run artifacts')
    .map((value, index) => asObject(value, `Workspace run artifact ${index + 1}`))
    .filter((artifact) => artifact.name === artifactName);
  if (matching.length === 0) throw new Error(`Workspace run is missing ${artifactName}.`);
  if (matching.length !== 1) throw new Error(`Workspace run has ambiguous ${artifactName} artifacts.`);
  const artifact = matching[0];
  const artifactId = positiveInteger(artifact.id, 'Release artifact id');
  if (artifact.expired !== false) throw new Error('Release artifact is expired. Rerun the workspace workflow on current main.');
  if (typeof artifact.expires_at !== 'string' || !Number.isFinite(Date.parse(artifact.expires_at)) || Date.parse(artifact.expires_at) <= now.getTime()) {
    throw new Error('Release artifact expiration metadata is invalid or stale. Rerun the workspace workflow on current main.');
  }
  if (typeof artifact.digest !== 'string' || !ARTIFACT_DIGEST_PATTERN.test(artifact.digest)) throw new Error('Release artifact is missing its SHA-256 digest.');
  const artifactRun = asObject(artifact.workflow_run, 'Release artifact workflow run');
  if (artifactRun.id !== runId || artifactRun.repository_id !== repositoryId || artifactRun.head_repository_id !== headRepositoryId
    || artifactRun.head_branch !== 'main' || artifactRun.head_sha !== expectedHead) {
    throw new Error('Release artifact provenance differs from the selected workspace run.');
  }
  return { runId, runAttempt, artifactId, artifactName };
}

function parseJson(value: string, label: string) {
  try { return JSON.parse(value); } catch { throw new Error(`${label} is malformed JSON.`); }
}

async function readVerifiedArtifact(directory: string, expectedHead: string, config: ComponentReleaseConfig) {
  const topLevel = (await readdir(directory, { withFileTypes: true })).sort((left, right) => left.name.localeCompare(right.name));
  if (JSON.stringify(topLevel.map(({ name }) => name)) !== JSON.stringify(['components', 'verify-catalog']) || topLevel.some((entry) => !entry.isDirectory())) {
    throw new Error('Release artifact has an unexpected top-level inventory.');
  }
  const evidenceRoot = join(directory, 'verify-catalog');
  const latest = parseJson(await readFile(join(evidenceRoot, 'latest.json'), 'utf8'), 'Catalog verification receipt');
  const receipt = asObject(latest, 'Catalog verification receipt');
  if (receipt.schemaVersion !== 1 || receipt.command !== 'bun run verify:catalog' || receipt.status !== 'passed' || receipt.exitCode !== 0
    || receipt.failedStage !== null || receipt.currentStage !== null || !Array.isArray(receipt.stages) || receipt.stages.length !== 8) {
    throw new Error('Catalog verification receipt is incomplete or unsuccessful.');
  }
  const stages = receipt.stages.map((value, index) => asObject(value, `Catalog verification stage ${index + 1}`));
  if (stages.some((stage, index) => stage.index !== index + 1 || stage.id !== VERIFY_STAGES[index][0] || stage.command !== VERIFY_STAGES[index][1] || stage.status !== 'passed'
    || stage.exitCode !== 0 || stage.signal !== null || stage.error !== null)) {
    throw new Error('Catalog verification receipt does not prove all eight successful stages.');
  }

  const output = join(directory, 'components', 'catalog');
  const currentValue = parseJson(await readFile(join(output, 'component-manifest.json'), 'utf8'), 'Current component manifest');
  const current = readComponentManifest(currentValue, 'Current component manifest', true);
  if (current.sourceCommit !== expectedHead) throw new Error('Release artifact was not built from the current reviewed source commit.');
  const names = Object.keys(config.packages).sort();
  indexInventory(current, names, 'Current component manifest', true);
  const expectedFiles = ['component-manifest.json', ...current.packages.map(({ filename }) => filename)].sort();
  const actualFiles = (await readdir(output, { withFileTypes: true })).map((entry) => {
    if (!entry.isFile()) throw new Error(`Release artifact contains non-file package output ${entry.name}.`);
    return entry.name;
  }).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) throw new Error('Release artifact package inventory is missing, incomplete, or unexpected.');
  for (const entry of current.packages) {
    const integrity = `sha512-${createHash('sha512').update(await readFile(join(output, entry.filename))).digest('base64')}`;
    if (integrity !== entry.integrity) throw new Error(`Release asset changed after verification: ${entry.name}`);
  }
  return { currentValue, current, output };
}

export function readComponentManifest(value: unknown, label: string, requireCurrentSchema = false): ComponentManifest {
  const manifest = asObject(value, label);
  if (manifest.schemaVersion !== 1 && manifest.schemaVersion !== 2) throw new Error(`${label} has an unsupported schemaVersion.`);
  if (requireCurrentSchema && manifest.schemaVersion !== 2) throw new Error(`${label} must use schemaVersion 2.`);
  if (!COMMIT_PATTERN.test(String(manifest.sourceCommit ?? ''))) throw new Error(`${label} is missing an immutable sourceCommit.`);
  if (manifest.sourceTreeClean !== true) throw new Error(`${label} was not built from a clean source tree.`);
  if (!Array.isArray(manifest.packages)) throw new Error(`${label} is missing its package inventory.`);
  const legacyTag = manifest.schemaVersion === 1 ? manifest.tag : null;
  if (manifest.schemaVersion === 1 && (typeof legacyTag !== 'string' || !legacyTag)) throw new Error(`${label} is missing its historical release tag.`);
  const packages = manifest.packages.map((rawEntry, index) => {
    const entry = asObject(rawEntry, `${label} package ${index + 1}`);
    const releaseTag = manifest.schemaVersion === 1 ? legacyTag : entry.releaseTag;
    for (const field of ['name', 'version', 'filename', 'source', 'delivery']) {
      if (typeof entry[field] !== 'string' || entry[field] === '') throw new Error(`${label} package ${index + 1} is missing ${field}.`);
    }
    if (typeof releaseTag !== 'string' || releaseTag === '') throw new Error(`${label} package ${index + 1} is missing releaseTag.`);
    if (typeof entry.integrity !== 'string' || !INTEGRITY_PATTERN.test(entry.integrity)) {
      throw new Error(`${label} package ${String(entry.name ?? index + 1)} is missing a valid SHA-512 integrity.`);
    }
    return {
      name: entry.name as string,
      version: entry.version as string,
      releaseTag,
      filename: entry.filename as string,
      integrity: entry.integrity,
      source: entry.source as string,
      delivery: entry.delivery as string,
    };
  });
  return {
    schemaVersion: manifest.schemaVersion,
    manifestReleaseTag: typeof legacyTag === 'string' ? legacyTag : null,
    sourceCommit: manifest.sourceCommit as string,
    sourceTreeClean: true,
    packages,
  };
}

function indexInventory(manifest: ComponentManifest, names: string[], label: string, requireExactInventory: boolean) {
  const entries = new Map<string, PackageManifestEntry>();
  const allowedNames = new Set(names);
  for (const entry of manifest.packages) {
    if (!entry.name.startsWith('@wornpage/')) throw new Error(`${label} contains a package outside @wornpage.`);
    const name = entry.name.slice('@wornpage/'.length);
    if (!allowedNames.has(name)) throw new Error(`${label} contains unexpected package ${entry.name}.`);
    if (entries.has(name)) throw new Error(`${label} contains duplicate package ${entry.name}.`);
    if (entry.source !== `packages/${name}`) throw new Error(`${label} has a mismatched source for ${entry.name}.`);
    if (entry.filename !== `wornpage-${name}-${entry.version}.tgz`) throw new Error(`${label} has a mismatched filename for ${entry.name}.`);
    entries.set(name, entry);
  }
  if (requireExactInventory && JSON.stringify([...entries.keys()].sort()) !== JSON.stringify([...names].sort())) {
    throw new Error(`${label} package inventory differs from the canonical manifest.`);
  }
  return entries;
}

export function selectComponentPublication(
  config: ComponentReleaseConfig,
  currentValue: unknown,
  baselineValue: unknown,
) {
  const names = Object.keys(config.packages).sort();
  const current = readComponentManifest(currentValue, 'Current component manifest', true);
  const baseline = readComponentManifest(baselineValue, 'Published baseline manifest');
  if (baseline.manifestReleaseTag && baseline.manifestReleaseTag !== config.baselineReleaseTag) {
    throw new Error(`Published baseline manifest tag differs from ${config.baselineReleaseTag}.`);
  }
  const currentPackages = indexInventory(current, names, 'Current component manifest', true);
  const baselinePackages = indexInventory(baseline, names, 'Published baseline manifest', false);
  const selected: PackageManifestEntry[] = [];

  for (const name of names) {
    const identity = config.packages[name];
    const currentEntry = currentPackages.get(name)!;
    const baselineEntry = baselinePackages.get(name);
    if (currentEntry.version !== identity.version || currentEntry.releaseTag !== identity.releaseTag) {
      throw new Error(`Current manifest release identity differs from components-release.json for ${currentEntry.name}.`);
    }
    if (!baselineEntry) {
      if (currentEntry.releaseTag === config.baselineReleaseTag) {
        throw new Error(`${currentEntry.name} is new but reuses the published baseline releaseTag.`);
      }
      selected.push(currentEntry);
      continue;
    }
    const archiveChanged = currentEntry.integrity !== baselineEntry.integrity;
    const versionChanged = currentEntry.version !== baselineEntry.version;
    const releaseChanged = currentEntry.releaseTag !== baselineEntry.releaseTag;
    if (!archiveChanged && !versionChanged && !releaseChanged) continue;
    if (!archiveChanged) throw new Error(`${currentEntry.name} changed release identity without changed archive bytes.`);
    if (!versionChanged) throw new Error(`${currentEntry.name} source changed without a package version change.`);
    if (!releaseChanged) throw new Error(`${currentEntry.name} changed without a new per-package releaseTag.`);
    selected.push(currentEntry);
  }

  const tags = [...new Set(selected.map((entry) => entry.releaseTag))];
  if (tags.length > 1) throw new Error(`One component publication may target only one new release tag; found ${tags.join(', ')}.`);
  return {
    status: selected.length === 0 ? 'noop' as const : 'publish' as const,
    tag: tags[0] ?? null,
    selected,
    current,
  };
}

async function defaultRun(args: string[], root: string) {
  const child = Bun.spawn(args, { cwd: root, stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  if (code !== 0) throw new Error(`${args.slice(0, 3).join(' ')} failed with exit ${code}: ${stderr.replace(/https?:\/\/\S+/gu, '[redacted URL]').trim()}`);
  return stdout.trim();
}

async function removeTemporaryDirectory(directory: string) {
  const target = resolve(directory);
  const temporaryRoot = resolve(tmpdir());
  if (!target.toLowerCase().startsWith(`${temporaryRoot.toLowerCase()}${sep}`)) throw new Error('Refusing to remove a release directory outside the system temporary directory.');
  await rm(target, { recursive: true, force: true });
}

export async function readPublishedManifestFromGitHub(tag: string, run: (args: string[]) => Promise<string>) {
  const release = JSON.parse(await run(['gh', 'api', `repos/${repository}/releases/tags/${tag}`]));
  if (release.tag_name !== tag) throw new Error(`Published baseline lookup returned ${String(release.tag_name)} instead of ${tag}.`);
  if (release.draft !== false) throw new Error(`Published baseline ${tag} must not be a draft.`);
  if (release.immutable !== true) throw new Error(`Published baseline ${tag} must be immutable.`);
  const asset = release.assets?.find((candidate: { name?: string }) => candidate.name === 'component-manifest.json');
  if (!asset?.url) throw new Error(`Published baseline ${tag} is missing component-manifest.json.`);
  return JSON.parse(await run(['gh', 'api', asset.url, '-H', 'Accept: application/octet-stream']));
}

export async function releaseTagExistsOnGitHub(tag: string, run: (args: string[]) => Promise<string>) {
  try {
    await run(['gh', 'api', `repos/${repository}/releases/tags/${tag}`, '--silent']);
    return true;
  } catch (error) {
    if (/\b404\b|not found/iu.test(String(error))) return false;
    throw error;
  }
}

export async function prepareComponentRelease({
  root = resolve(import.meta.dir, '..'),
  config = { baselineReleaseTag: COMPONENT_BASELINE_RELEASE_TAG, packages: COMPONENT_RELEASES },
  run = (args: string[]) => defaultRun(args, root),
  readPublishedManifest = (tag: string) => readPublishedManifestFromGitHub(tag, run),
  releaseExists = (tag: string) => releaseTagExistsOnGitHub(tag, run),
  makeTemporaryDirectory = () => mkdtemp(join(tmpdir(), 'wornpage-component-release-')),
  downloadArtifact = (runId: number, artifactName: string, directory: string) => run([
    'gh', 'run', 'download', String(runId), '--repo', repository, '--name', artifactName, '--dir', directory,
  ]),
  createDraft = async (tag: string, assets: string[], head: string, notes: string) => run([
    'gh', 'release', 'create', tag, ...assets, '--repo', repository, '--target', head, '--draft',
    '--title', `Wornpage Components ${tag.slice('components-'.length)}`, '--notes-file', notes,
  ]),
} = {}) {
  if (await run(['git', 'status', '--porcelain', '--untracked-files=normal'])) throw new Error('Release source tree must be clean.');
  const head = await run(['git', 'rev-parse', 'HEAD']);
  const remoteHead = await run(['gh', 'api', `repos/${repository}/git/ref/heads/main`, '--jq', '.object.sha']);
  if (head !== remoteHead) throw new Error('Release only the current reviewed default-branch commit.');
  const immutable = JSON.parse(await run(['gh', 'api', `repos/${repository}/immutable-releases`]));
  if (!immutable.enabled) throw new Error('Enable immutable releases before preparing component delivery.');
  const workflowValue = parseJson(await run(['gh', 'api', `repos/${repository}/actions/workflows/workspace.yml`]), 'Workspace workflow response');
  const runsValue = parseJson(await run(['gh', 'api', '--paginate', '--slurp', `repos/${repository}/actions/workflows/${String(asObject(workflowValue, 'Workspace workflow').id)}/runs?branch=main&status=completed&per_page=100`]), 'Workspace workflow runs response');
  const runItems = paginatedItems(runsValue, 'workflow_runs', 'Workspace workflow runs').map((value) => asObject(value, 'Workspace workflow run'));
  const candidate = runItems.filter((value) => value.head_sha === head && value.head_branch === 'main' && (value.event === 'push' || value.event === 'workflow_dispatch')).sort((a, b) => Number(b.id) - Number(a.id))[0];
  if (!candidate) throw new Error('No current main workspace run matches the reviewed source commit.');
  const artifactsValue = parseJson(await run(['gh', 'api', '--paginate', '--slurp', `repos/${repository}/actions/runs/${String(candidate.id)}/artifacts?per_page=100`]), 'Workspace run artifacts response');
  const selectedArtifact = selectReleaseArtifact(workflowValue, runsValue, artifactsValue, head);
  const artifactDirectory = await makeTemporaryDirectory();
  try {
    await downloadArtifact(selectedArtifact.runId, selectedArtifact.artifactName, artifactDirectory);
    const { currentValue, output } = await readVerifiedArtifact(artifactDirectory, head, config);
    const manifestPath = join(output, 'component-manifest.json');
    const baselineValue = await readPublishedManifest(config.baselineReleaseTag);
    const selection = selectComponentPublication(config, currentValue, baselineValue);
    const archivePaths = new Map(selection.current.packages.map((entry) => [entry.name, join(output, entry.filename)]));
    if (selection.status === 'noop') {
      console.log(`No component package changed from published baseline ${config.baselineReleaseTag}; no release created.`);
      return { ...selection, assets: [] as string[] };
    }
    if (await releaseExists(selection.tag!)) throw new Error(`Release ${selection.tag} already exists; immutable releases are never reused.`);
    const notes = join(output, 'release-notes.md');
    await writeFile(notes, `Wornpage Components from reviewed source commit \`${head}\`.\n\nIncludes ${selection.selected.length} changed package${selection.selected.length === 1 ? '' : 's'} from a verified ${Object.keys(config.packages).length}-package catalog. Unchanged packages retain their prior immutable release URLs. SHA-512 digests and per-package source identities are recorded in component-manifest.json.\n`);
    const assets = [manifestPath, ...selection.selected.map((entry) => archivePaths.get(entry.name)!)];
    const receipt = await createDraft(selection.tag!, assets, head, notes);
    console.log(receipt);
    console.log('Draft release prepared. Publish it only after every intended asset is attached; publication locks the tag and assets.');
    return { ...selection, assets };
  } finally {
    await removeTemporaryDirectory(artifactDirectory);
  }
}

if (import.meta.main) await prepareComponentRelease();
