import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  COMPONENT_BASELINE_RELEASE_TAG,
  COMPONENT_RELEASES,
  type ComponentReleaseIdentity,
} from './components.ts';
import { COMPONENT_PACK_OUTPUT } from './pack-components.ts';

const repository = 'wornpage/wornpage';
const COMMIT_PATTERN = /^[0-9a-f]{40}$/u;
const INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]+={0,2}$/u;

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
  if (code !== 0) throw new Error(`${args.join(' ')} failed:\n${stdout}\n${stderr}`);
  return stdout.trim();
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

  const output = join(root, COMPONENT_PACK_OUTPUT);
  const manifestPath = join(output, 'component-manifest.json');
  const currentValue = JSON.parse(await readFile(manifestPath, 'utf8'));
  const baselineValue = await readPublishedManifest(config.baselineReleaseTag);
  const selection = selectComponentPublication(config, currentValue, baselineValue);
  if (selection.current.sourceCommit !== head) {
    throw new Error('Build a clean release with bun run verify:catalog at the current source commit.');
  }

  const archivePaths = new Map<string, string>();
  for (const entry of selection.current.packages) {
    const file = join(output, entry.filename);
    const integrity = `sha512-${createHash('sha512').update(await readFile(file)).digest('base64')}`;
    if (integrity !== entry.integrity) throw new Error(`Release asset changed after verification: ${entry.name}`);
    archivePaths.set(entry.name, file);
  }
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
}

if (import.meta.main) await prepareComponentRelease();
