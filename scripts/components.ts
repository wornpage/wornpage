import release from '../components-release.json' with { type: 'json' };

export const COMPONENT_NAMES = Object.keys(release.packages).sort();
export const COMPONENT_RELEASE_TAG = release.tag;
export const COMPONENT_VERSIONS = release.packages as Record<string, string>;
export const COMPONENT_PEERS = release.peers as Record<string, string[]>;

export function componentRelease(name: string) {
  const version = COMPONENT_VERSIONS[name];
  if (!version) throw new Error(`Unknown Wornpage component: ${name}`);
  const repositoryUrl = 'https://github.com/wornpage/wornpage';
  const filename = `wornpage-${name}-${version}.tgz`;
  return {
    repositoryUrl,
    releaseTag: COMPONENT_RELEASE_TAG,
    version,
    filename,
    sourceUrl: `${repositoryUrl}/tree/${COMPONENT_RELEASE_TAG}/packages/${name}`,
    archiveUrl: `${repositoryUrl}/releases/download/${COMPONENT_RELEASE_TAG}/${filename}`,
  };
}

export function componentInstallCommand(name: string) {
  const ordered: string[] = [];
  const visiting = new Set<string>();
  function visit(component: string) {
    if (visiting.has(component)) throw new Error(`Circular component peer dependency: ${component}`);
    if (ordered.includes(component)) return;
    componentRelease(component);
    visiting.add(component);
    for (const peer of COMPONENT_PEERS[component] ?? []) visit(peer);
    visiting.delete(component);
    ordered.push(component);
  }
  visit(name);
  return `bun add ${ordered.map(component => `"${componentRelease(component).archiveUrl}"`).join(' ')}`;
}
