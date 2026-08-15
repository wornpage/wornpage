import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const appSource = readFileSync(new URL('../demo/src/App.svelte', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../demo/vite.config.ts', import.meta.url), 'utf8');
const cmdkSource = readFileSync(new URL('../packages/cmdk/src/Cmdk.svelte', import.meta.url), 'utf8');
const cmdkIndexSource = readFileSync(new URL('../packages/cmdk/src/index.ts', import.meta.url), 'utf8');
const sidebarIndexSource = readFileSync(new URL('../packages/sidebar/src/index.ts', import.meta.url), 'utf8');
const sidebarItemSource = readFileSync(new URL('../packages/sidebar/src/SidebarItem.svelte', import.meta.url), 'utf8');
const themeIndexSource = readFileSync(new URL('../packages/theme/src/index.ts', import.meta.url), 'utf8');

describe('aggregate demo contract', () => {
  test('mounts one native command palette for both open actions', () => {
    expect(appSource.match(/<Cmdk\b/gu)?.length).toBe(1);
    expect(appSource).toContain('<Cmdk bind:this={cmdkRef} items={cmdkItems} />');
    expect(appSource.match(/onclick=\{openPalette\}/gu)?.length).toBe(2);
    expect(appSource).not.toContain('cmdkOpen');
    expect(appSource).not.toContain('cmdk-overlay');
    expect(appSource).not.toContain('role="dialog"');
  });

  test('keeps the aggregate shell bounded on compact viewports', () => {
    expect(appSource).toContain("window.matchMedia('(max-width: 720px)').matches");
    expect(appSource).toContain('grid-template-columns: auto minmax(0, 1fr)');
    expect(appSource).toContain('.demo-main { box-sizing: border-box; min-width: 0;');
    expect(appSource).toContain('<div class="table-scroll">');
    expect(appSource).toContain('.table-scroll { max-width: 100%; overflow-x: auto; }');
  });

  test('fails the build instead of accepting Svelte warnings', () => {
    expect(viteSource).toContain('onwarn(warning)');
    expect(viteSource).toContain('throw new Error(`[svelte:${warning.code}] ${warning.message}`);');
  });

  test('keeps custom-element wrappers out of Svelte package roots', () => {
    expect(cmdkSource).not.toContain('<svelte:options customElement');
    expect(cmdkIndexSource).not.toContain('CmdkElement');
    expect(sidebarIndexSource).not.toContain('SidebarElement');
    expect(themeIndexSource).not.toContain('ThemeElement');
    expect(sidebarItemSource).not.toContain('on:click');
  });
});
