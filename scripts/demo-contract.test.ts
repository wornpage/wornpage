import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { COMPONENT_NAMES } from './components.ts';
import { DEMO_CATALOG } from '../demo/src/sections.ts';

const appSource = readFileSync(new URL('../demo/src/App.svelte', import.meta.url), 'utf8');
const demoIndexSource = readFileSync(new URL('../demo/index.html', import.meta.url), 'utf8');
const exampleSource = readFileSync(new URL('../demo/src/ComponentExample.svelte', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../demo/vite.config.ts', import.meta.url), 'utf8');
const browserCheckSource = readFileSync(new URL('./catalog-browser-check.mjs', import.meta.url), 'utf8');
const renderedReadinessSource = readFileSync(new URL('./catalog-rendered-readiness.mjs', import.meta.url), 'utf8');
const browserOutputSource = readFileSync(new URL('./catalog-browser-output.mjs', import.meta.url), 'utf8');
const catalogVerifierSource = readFileSync(new URL('./verify-catalog.mjs', import.meta.url), 'utf8');
const rootPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
};
const cmdkSource = readFileSync(new URL('../packages/cmdk/src/Cmdk.svelte', import.meta.url), 'utf8');
const cmdkIndexSource = readFileSync(new URL('../packages/cmdk/src/index.ts', import.meta.url), 'utf8');
const sidebarIndexSource = readFileSync(new URL('../packages/sidebar/src/index.ts', import.meta.url), 'utf8');
const sidebarItemSource = readFileSync(new URL('../packages/sidebar/src/SidebarItem.svelte', import.meta.url), 'utf8');
const themeIndexSource = readFileSync(new URL('../packages/theme/src/index.ts', import.meta.url), 'utf8');
const tabsSource = readFileSync(new URL('../packages/tabs/src/Tabs.svelte', import.meta.url), 'utf8');
const demoPackage = JSON.parse(readFileSync(new URL('../demo/package.json', import.meta.url), 'utf8')) as {
  dependencies: Record<string, string>;
};
const combinedDemoSource = `${appSource}\n${exampleSource}`;

describe('aggregate demo contract', () => {
  test('cleans only full-run catalog artifacts while preserving bounded diagnostic evidence', () => {
    expect(browserCheckSource).toContain('clean: !focusOrderingOnly');
    expect(browserOutputSource).toContain("const CATALOG_OUTPUT_RELATIVE_PATH = 'output/playwright/catalog';");
    expect(browserOutputSource).toContain("if (clean) await rm(outputDirectory, { recursive: true, force: true });");
  });

  test('derives catalog coverage from the component repository denominator', () => {
    const expectedIds = [...COMPONENT_NAMES].sort();
    const catalogIds = DEMO_CATALOG.map(({ id }) => id).sort();

    expect(catalogIds).toEqual(expectedIds);
    expect(new Set(catalogIds).size).toBe(expectedIds.length);
    expect(DEMO_CATALOG.every(({ category, description }) => category && description)).toBe(true);
  });

  test('depends directly on every displayed workspace package', () => {
    const expectedDependencies = COMPONENT_NAMES.map((id) => `@wornpage/${id}`).sort();

    expect(Object.keys(demoPackage.dependencies).sort()).toEqual(expectedDependencies);
    for (const dependency of expectedDependencies) {
      expect(demoPackage.dependencies[dependency]).toBe('workspace:*');
    }
  });

  test('uses the explicit catalog for grouped navigation and rendered sections', () => {
    expect(appSource).toContain('const sections = DEMO_CATALOG.map(({ id }) => id);');
    expect(DEMO_CATALOG).toHaveLength(26);
    expect(appSource).toContain('<p>{DEMO_CATALOG.length} components and supporting packages, one interface library.</p>');
    expect(appSource).toContain('function iconForCategory(category: CatalogCategory): NavIcon');
    expect(appSource).not.toMatch(/return ['"]<.+>/u);
    expect(appSource).toContain('const sidebarItems: NavItem[] = CATALOG_GROUPS.map');
    expect(appSource).toContain('{#each CATALOG_GROUPS as group (group.id)}');
    expect(appSource).toContain('{#each group.entries as entry (entry.id)}');
    expect(appSource).toContain('<ComponentExample id={entry.id} {openPalette} />');
  });

  test('links the catalog to its released Projects consumer', () => {
    expect(appSource).toContain('href="https://projects-webmcp-extension.pages.dev/webmcp-challenge"');
    expect(appSource).toContain('class="repo-link release-link">Projects release</a>');
    expect(appSource).toMatch(/@media \(pointer: coarse\)\s*\{\s*\.repo-link \{ min-height: 44px; \}/u);
  });

  test('ships one token owner and a local favicon without placeholder CSS', () => {
    expect(demoIndexSource.match(/<style>/gu)?.length).toBe(1);
    expect(demoIndexSource).not.toContain('...tokens...');
    expect(`${demoIndexSource}\n${combinedDemoSource}`).not.toContain('--cockpit-');
    for (const theme of ['dark', 'forest', 'ocean', 'sepia', 'halloween', 'winter', 'holiday']) {
      expect(demoIndexSource).toContain(`[data-theme="${theme}"]`);
    }
    for (const token of ['--worn-bg', '--worn-surface', '--worn-text', '--worn-text-muted', '--worn-border', '--worn-accent', '--worn-focus']) {
      expect(demoIndexSource).toContain(token);
    }
    expect(demoIndexSource).toContain('<link rel="icon" href="./favicon.svg" type="image/svg+xml" />');
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
    expect(appSource).toContain('<Cmdk bind:this={cmdkRef} items={cmdkItems} onclose={handlePaletteClose} />');
    expect(combinedDemoSource.match(/onclick=\{openPalette\}/gu)?.length).toBe(2);
    expect(combinedDemoSource).not.toContain('cmdk-overlay');
  });

  test('preserves hash navigation, scrolling, and compact containment', () => {
    expect(appSource).toContain("window.matchMedia('(max-width: 720px)').matches");
    expect(appSource).toContain("window.history.pushState(null, '', hash)");
    expect(appSource).toContain("scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })");
    expect(appSource).toContain("compactQuery.addEventListener('change', syncSidebarForViewport)");
    expect(appSource).toContain('Expand navigation');
    expect(appSource).toContain("paletteFocusPhase = 'closing'");
    expect(appSource).toContain('queueMicrotask(() => setTimeout(() => {');
    expect(appSource).toContain('pendingPaletteFocus = section;');
    expect(appSource).toContain('grid-template-columns: auto minmax(0, 1fr)');
    expect(appSource).toContain('.demo-main { box-sizing: border-box; min-width: 0;');
    expect(appSource).toContain('--wrn-theme-text: var(--worn-text);');
    expect(exampleSource).toContain('.table-scroll { max-width: 100%; overflow-x: auto; }');
    expect(tabsSource).toMatch(/\.worn-tabs\s*\{[^}]*overflow-x:\s*auto;/su);
    expect(appSource).not.toContain('overflow-x:');
    expect(exampleSource.match(/overflow-x:\s*auto;/gu)?.length).toBe(1);
    expect(combinedDemoSource).not.toMatch(/:global\((?:html|body)\)[^{]*\{[^}]*overflow-x:\s*(?:clip|hidden)/su);
  });

  test('uses the defined readable muted token for secondary catalog text', () => {
    expect(combinedDemoSource).not.toContain('--cockpit-');
    expect(appSource).toMatch(/\.catalog-jump label\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(appSource).toMatch(/\.category-heading\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(appSource).toMatch(/\.section-heading code\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(exampleSource).toMatch(/\.live-output, \.standup\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(exampleSource).toMatch(/\.field-label\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(exampleSource).toMatch(/\.data-list span\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
    expect(exampleSource).toMatch(/\.tab-panel\s*\{[^}]*color:\s*var\(--worn-text-muted\)/su);
  });

  test('derives reviewed source and install details from the canonical release manifest', () => {
    expect(appSource).toContain('catalogMetadata(entry.id)');
    expect(appSource).toContain('data-component-release={metadata.releaseTag}');
    expect(readFileSync(new URL('../demo/src/sections.ts', import.meta.url), 'utf8')).toContain("componentRelease(id)");
    expect(exampleSource).not.toMatch(/codeload\.github\.com\/wornpage\//u);
  });

  test('runs the durable rendered catalog matrix from the fixed verification gate', () => {
    expect(rootPackage.devDependencies.playwright).toBe('1.62.0');
    expect(rootPackage.scripts['test:catalog:browser']).toBe('node scripts/catalog-browser-check.mjs');
    expect(rootPackage.scripts['verify:catalog']).toBe('node scripts/verify-catalog.mjs');
    for (const command of ['bun run check:workspace', 'bun run check:components', 'bun test', 'bun run pack:components', 'bun run build', 'bun run test:catalog:browser']) {
      expect(catalogVerifierSource).toContain(`command: '${command}'`);
    }
    expect(catalogVerifierSource).toContain("skipped.status = 'skipped'");
    expect(browserCheckSource).toContain('familyOutcomeChecks');
    expect(browserCheckSource).toContain('distinctPaletteSignaturesPerViewport');
    expect(browserCheckSource).toContain('assertPaletteCancellationNavigation(browser, reducedMotion, iterations = 20)');
    expect(browserCheckSource).toContain('40/40 cancellation-to-navigation focus ordering checks passed');
    expect(browserCheckSource).toContain('observeRenderedReadiness(drawer)');
    expect(browserCheckSource).toContain('-drawer-readiness-failure.json');
    expect(browserCheckSource).toContain('-drawer-readiness-failure.png');
    expect(renderedReadinessSource).toContain('requestAnimationFrame(resolve)');
    expect(renderedReadinessSource).toContain('consecutiveStableFrames >= options.stableFrames');
    expect(browserCheckSource).toContain("pendingDeviceCoverage: ['current iOS Safari', 'installed iOS PWA standalone']");
  });

  test('keeps all component packages on their canonical entrypoints', () => {
    const packageAliases = [...viteSource.matchAll(/^\s+'(@wornpage\/[^']+)':/gmu)].map((match) => match[1]);

    expect(packageAliases).toEqual([]);
    expect(exampleSource).toContain("from '@wornpage/undo';");
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
