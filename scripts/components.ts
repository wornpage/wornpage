import release from '../components-release.json' with { type: 'json' };

export type ComponentReleaseIdentity = { version: string; releaseTag: string };

const RELEASE_TAG_PATTERN = /^components-\d{4}\.\d{2}\.\d{2}(?:\.\d+)?$/u;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;

export function validateAuthoredRelease(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('components-release.json must be an object.');
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== 2) throw new Error('components-release.json must use authored schemaVersion 2.');
  if (typeof candidate.baselineReleaseTag !== 'string' || !RELEASE_TAG_PATTERN.test(candidate.baselineReleaseTag)) {
    throw new Error('components-release.json must declare an explicit dated baselineReleaseTag.');
  }
  if (!candidate.packages || typeof candidate.packages !== 'object' || Array.isArray(candidate.packages)) {
    throw new Error('components-release.json must declare per-package release identities.');
  }
  for (const [name, identity] of Object.entries(candidate.packages)) {
    if (!identity || typeof identity !== 'object' || Array.isArray(identity)) {
      throw new Error(`Component ${name} must declare an explicit version and releaseTag.`);
    }
    const fields = Object.keys(identity).sort();
    if (JSON.stringify(fields) !== JSON.stringify(['releaseTag', 'version'])) {
      throw new Error(`Component ${name} release identity must contain only version and releaseTag.`);
    }
    const { version, releaseTag } = identity as Record<string, unknown>;
    if (typeof version !== 'string' || !VERSION_PATTERN.test(version)) throw new Error(`Component ${name} has an invalid version.`);
    if (typeof releaseTag !== 'string' || !RELEASE_TAG_PATTERN.test(releaseTag)) throw new Error(`Component ${name} has an invalid releaseTag.`);
  }
  return candidate as {
    schemaVersion: 2;
    baselineReleaseTag: string;
    packages: Record<string, ComponentReleaseIdentity>;
    peers: Record<string, string[]>;
  };
}

const authoredRelease = validateAuthoredRelease(release);

export const COMPONENT_NAMES = Object.keys(authoredRelease.packages).sort();
export const COMPONENT_BASELINE_RELEASE_TAG = authoredRelease.baselineReleaseTag;
export const COMPONENT_RELEASES = authoredRelease.packages;
export const COMPONENT_VERSIONS = Object.fromEntries(COMPONENT_NAMES.map((name) => [name, COMPONENT_RELEASES[name].version]));
export const COMPONENT_RELEASE_TAGS = Object.fromEntries(COMPONENT_NAMES.map((name) => [name, COMPONENT_RELEASES[name].releaseTag]));
export const COMPONENT_PEERS = authoredRelease.peers;

export function resolveComponentRelease(name: string, releases: Record<string, ComponentReleaseIdentity>) {
  const identity = releases[name];
  if (!identity) throw new Error(`Unknown Wornpage component: ${name}`);
  const repositoryUrl = 'https://github.com/wornpage/wornpage';
  const filename = `wornpage-${name}-${identity.version}.tgz`;
  return {
    repositoryUrl,
    releaseTag: identity.releaseTag,
    version: identity.version,
    filename,
    sourceUrl: `${repositoryUrl}/tree/${identity.releaseTag}/packages/${name}`,
    archiveUrl: `${repositoryUrl}/releases/download/${identity.releaseTag}/${filename}`,
  };
}

export function componentRelease(name: string) {
  return resolveComponentRelease(name, COMPONENT_RELEASES);
}

export function buildComponentInstallCommand(
  name: string,
  releases: Record<string, ComponentReleaseIdentity>,
  peers: Record<string, string[]>,
) {
  const ordered: string[] = [];
  const visiting = new Set<string>();
  function visit(component: string) {
    if (visiting.has(component)) throw new Error(`Circular component peer dependency: ${component}`);
    if (ordered.includes(component)) return;
    resolveComponentRelease(component, releases);
    visiting.add(component);
    for (const peer of peers[component] ?? []) visit(peer);
    visiting.delete(component);
    ordered.push(component);
  }
  visit(name);
  return `bun add ${ordered.map(component => `"${resolveComponentRelease(component, releases).archiveUrl}"`).join(' ')}`;
}

export function componentInstallCommand(name: string) {
  return buildComponentInstallCommand(name, COMPONENT_RELEASES, COMPONENT_PEERS);
}
