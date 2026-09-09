import { describe, expect, it } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import {
  COMPONENT_NAMES,
  COMPONENT_VERSIONS,
  COMPONENT_PEERS,
  COMPONENT_RELEASES,
  buildComponentInstallCommand,
  componentRelease,
  componentInstallCommand,
  validateAuthoredRelease,
} from './components.ts';
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

  it('binds every public install and source link to its explicit package release', () => {
    for (const name of COMPONENT_NAMES) {
      const release = componentRelease(name);
      expect(release.archiveUrl).toBe(`https://github.com/wornpage/wornpage/releases/download/${COMPONENT_RELEASES[name].releaseTag}/wornpage-${name}-${COMPONENT_VERSIONS[name]}.tgz`);
      expect(release.sourceUrl).toBe(`https://github.com/wornpage/wornpage/tree/${COMPONENT_RELEASES[name].releaseTag}/packages/${name}`);
    }
    expect(() => componentRelease('unknown')).toThrow('Unknown Wornpage component');
  });

  it('pins mixed-release peers to each package actual immutable release', () => {
    const releases = {
      button: { version: '0.2.2', releaseTag: 'components-2026.09.09' },
      'async-states': { version: '0.1.6', releaseTag: 'components-2026.10.01' },
    };
    expect(buildComponentInstallCommand('async-states', releases, { 'async-states': ['button'] })).toBe(
      'bun add "https://github.com/wornpage/wornpage/releases/download/components-2026.09.09/wornpage-button-0.2.2.tgz" "https://github.com/wornpage/wornpage/releases/download/components-2026.10.01/wornpage-async-states-0.1.6.tgz"',
    );
  });

  it('rejects the retired authored global-tag configuration shape', () => {
    expect(() => validateAuthoredRelease({ tag: 'components-2026.09.09', packages: { button: '0.2.2' } }))
      .toThrow('schemaVersion 2');
  });

  it('rejects missing consumer entries and accidental development files', () => {
    expect(() => validatePackedEntries(['package.json', 'src/index.ts'], ['./dist/widget.js'])).toThrow('missing dist/widget.js');
    expect(() => validatePackedEntries(['src/index.ts', '.env.local'], ['./src/index.ts'])).toThrow('environment file');
    expect(() => validatePackedEntries(['src/index.ts', 'tests/private.test.ts'], ['./src/index.ts'])).toThrow('development');
    expect(() => validatePackedEntries(['package.json', 'src/index.ts', 'dist/widget.js'], ['./src/index.ts', './dist/widget.js'])).not.toThrow();
  });
});
