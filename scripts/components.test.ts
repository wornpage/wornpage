import { describe, expect, it } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import { COMPONENT_NAMES, COMPONENT_RELEASE_TAG, COMPONENT_VERSIONS, COMPONENT_PEERS, componentRelease, componentInstallCommand } from './components.ts';
import { validatePackedEntries } from './pack-components.ts';

describe('canonical component delivery', () => {
  it('covers every component package exactly once at its declared version', () => {
    const packages = readdirSync(new URL('../packages/', import.meta.url), { withFileTypes: true })
      .filter(entry => entry.isDirectory() && entry.name !== 'cli').map(entry => entry.name).sort();
    expect(COMPONENT_NAMES).toEqual(packages);
    expect(COMPONENT_NAMES).toHaveLength(26);
    for (const name of COMPONENT_NAMES) {
      const pkg = JSON.parse(readFileSync(new URL(`../packages/${name}/package.json`, import.meta.url), 'utf8'));
      expect(pkg.name).toBe(`@wornpage/${name}`);
      expect(pkg.version).toBe(COMPONENT_VERSIONS[name]);
      expect(pkg.repository.directory).toBe(`packages/${name}`);
      expect(pkg.repository.url).toBe('https://github.com/wornpage/wornpage.git');
      const internalPeers = Object.keys(pkg.peerDependencies ?? {}).filter(key => key.startsWith('@wornpage/')).map(key => key.slice('@wornpage/'.length)).sort();
      expect(internalPeers).toEqual([...(COMPONENT_PEERS[name] ?? [])].sort());
      for (const peer of internalPeers) expect(pkg.peerDependencies[`@wornpage/${peer}`]).toBe(COMPONENT_VERSIONS[peer]);
    }
  });

  it('installs internal peers from public archives without relying on the npm scope', () => {
    expect(componentInstallCommand('async-states')).toBe(`bun add "${componentRelease('button').archiveUrl}" "${componentRelease('async-states').archiveUrl}"`);
    expect(componentInstallCommand('receipt')).toContain(componentRelease('button').archiveUrl);
    expect(componentInstallCommand('theme')).toBe(`bun add "${componentRelease('theme').archiveUrl}"`);
  });

  it('binds all public install and source links to the same named release', () => {
    for (const name of COMPONENT_NAMES) {
      const release = componentRelease(name);
      expect(release.archiveUrl).toBe(`https://github.com/wornpage/wornpage/releases/download/${COMPONENT_RELEASE_TAG}/wornpage-${name}-${COMPONENT_VERSIONS[name]}.tgz`);
      expect(release.sourceUrl).toBe(`https://github.com/wornpage/wornpage/tree/${COMPONENT_RELEASE_TAG}/packages/${name}`);
    }
    expect(() => componentRelease('unknown')).toThrow('Unknown Wornpage component');
  });

  it('rejects missing consumer entries and accidental development files', () => {
    expect(() => validatePackedEntries(['package.json', 'src/index.ts'], ['./dist/widget.js'])).toThrow('missing dist/widget.js');
    expect(() => validatePackedEntries(['src/index.ts', '.env.local'], ['./src/index.ts'])).toThrow('environment file');
    expect(() => validatePackedEntries(['src/index.ts', 'tests/private.test.ts'], ['./src/index.ts'])).toThrow('development');
    expect(() => validatePackedEntries(['package.json', 'src/index.ts', 'dist/widget.js'], ['./src/index.ts', './dist/widget.js'])).not.toThrow();
  });
});
