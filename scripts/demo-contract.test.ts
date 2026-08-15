import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { COMPONENT_REPOSITORIES } from './component-repositories.ts';
import { DEMO_CATALOG } from '../demo/src/sections.ts';

const appSource = readFileSync(new URL('../demo/src/App.svelte', import.meta.url), 'utf8');
const exampleSource = readFileSync(new URL('../demo/src/ComponentExample.svelte', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../demo/vite.config.ts', import.meta.url), 'utf8');
const cmdkSource = readFileSync(new URL('../packages/cmdk/src/Cmdk.svelte', import.meta.url), 'utf8');
const cmdkIndexSource = readFileSync(new URL('../packages/cmdk/src/index.ts', import.meta.url), 'utf8');
const sidebarIndexSource = readFileSync(new URL('../packages/sidebar/src/index.ts', import.meta.url), 'utf8');
const sidebarItemSource = readFileSync(new URL('../packages/sidebar/src/SidebarItem.svelte', import.meta.url), 'utf8');
const themeIndexSource = readFileSync(new URL('../packages/theme/src/index.ts', import.meta.url), 'utf8');
const demoPackage = JSON.parse(readFileSync(new URL('../demo/package.json', import.meta.url), 'utf8')) as {
  dependencies: Record<string, string>;
};
const combinedDemoSource = `${appSource}\n${exampleSource}`;

describe('aggregate demo contract', () => {
  test('derives catalog coverage from the component repository denominator', () => {
    const expectedIds = [...COMPONENT_REPOSITORIES].sort();
    const catalogIds = DEMO_CATALOG.map(({ id }) => id).sort();

    expect(catalogIds).toEqual(expectedIds);
    expect(new Set(catalogIds).size).toBe(expectedIds.length);
    expect(DEMO_CATALOG.every(({ category, description }) => category && description)).toBe(true);
  });

  test('depends directly on every displayed workspace package', () => {
    const expectedDependencies = COMPONENT_REPOSITORIES.map((id) => `@wornpage/${id}`).sort();

    expect(Object.keys(demoPackage.dependencies).sort()).toEqual(expectedDependencies);
    for (const dependency of expectedDependencies) {
      expect(demoPackage.dependencies[dependency]).toBe('workspace:*');
    }
  });

  test('uses the explicit catalog for grouped navigation and rendered sections', () => {
    expect(appSource).toContain('const sections = DEMO_CATALOG.map(({ id }) => id);');
    expect(appSource).toContain('const sidebarItems: NavItem[] = CATALOG_GROUPS.map');
    expect(appSource).toContain('{#each CATALOG_GROUPS as group (group.id)}');
    expect(appSource).toContain('{#each group.entries as entry (entry.id)}');
    expect(appSource).toContain('<ComponentExample id={entry.id} {openPalette} />');
  });

  test('renders one package-owned example for every catalog entry', () => {
    for (const entry of DEMO_CATALOG) {
      expect(combinedDemoSource).toContain(`from '@wornpage/${entry.id}'`);
      const marker = entry.exampleKind === 'component' ? `<${entry.exampleMarker}` : entry.exampleMarker;
      expect(combinedDemoSource).toContain(marker);
    }
  });

  test('mounts one native command palette for both open actions', () => {
    expect(combinedDemoSource.match(/<Cmdk\b/gu)?.length).toBe(1);
    expect(appSource).toContain('<Cmdk bind:this={cmdkRef} items={cmdkItems} />');
    expect(combinedDemoSource.match(/onclick=\{openPalette\}/gu)?.length).toBe(2);
    expect(combinedDemoSource).not.toContain('cmdk-overlay');
  });

  test('preserves hash navigation, scrolling, and compact containment', () => {
    expect(appSource).toContain("window.matchMedia('(max-width: 720px)').matches");
    expect(appSource).toContain("window.history.pushState(null, '', hash)");
    expect(appSource).toContain("scrollIntoView({ behavior: 'smooth', block: 'start' })");
    expect(appSource).toContain('grid-template-columns: auto minmax(0, 1fr)');
    expect(appSource).toContain('.demo-main { box-sizing: border-box; min-width: 0;');
    expect(appSource).toContain('--wrn-theme-text: var(--cockpit-text');
    expect(exampleSource).toContain('.table-scroll { max-width: 100%; overflow-x: auto; }');
  });

  test('fails the build instead of accepting Svelte warnings', () => {
    expect(viteSource).toContain('onwarn(warning)');
    expect(viteSource).toContain('throw new Error(`[svelte:${warning.code}] ${warning.message}`);');
  });

  test('keeps custom-element wrappers out of established Svelte package roots', () => {
    expect(cmdkSource).not.toContain('<svelte:options customElement');
    expect(cmdkIndexSource).not.toContain('CmdkElement');
    expect(sidebarIndexSource).not.toContain('SidebarElement');
    expect(themeIndexSource).not.toContain('ThemeElement');
    expect(sidebarItemSource).not.toContain('on:click');
  });
});
