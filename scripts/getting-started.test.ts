import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { compile } from '../demo/node_modules/svelte/compiler/index.js';
import { COMPONENT_SOURCES } from './component-repositories.ts';

const guidePath = new URL('../docs/getting-started.md', import.meta.url);

async function documentedExample() {
  const guide = await readFile(guidePath, 'utf8');
  const match = guide.match(/```svelte\n([\s\S]*?)\n```/);
  if (!match) throw new Error('Getting-started guide has no Svelte example');
  return { guide, example: match[1] };
}

describe('getting-started guide', () => {
  test('uses reviewed Button and Theme archives with named Svelte imports', async () => {
    const { guide, example } = await documentedExample();
    const button = COMPONENT_SOURCES.find((component) => component.name === 'button');
    const theme = COMPONENT_SOURCES.find((component) => component.name === 'theme');
    if (!button || !theme) throw new Error('Button and Theme must remain in the reviewed source manifest');

    expect(guide).toContain(`https://codeload.github.com/wornpage/button/tar.gz/${button.revision}`);
    expect(guide).toContain(`https://codeload.github.com/wornpage/theme/tar.gz/${theme.revision}`);
    expect(guide).toContain(`https://github.com/wornpage/button/tree/${button.revision}`);
    expect(guide).toContain(`https://github.com/wornpage/theme/tree/${theme.revision}`);
    expect(example).toContain("import { Button } from '@wornpage/button';");
    expect(example).toContain("import { Theme, type ThemeName } from '@wornpage/theme';");
  });

  test('limits the picker to working system, light, and dark choices', async () => {
    const { example } = await documentedExample();

    expect(example).toContain("const themes: ThemeName[] = ['system', 'light', 'dark'];");
    expect(example).toContain('<Theme bind:theme {themes} />');
    expect(example).toContain(":global(html[data-theme='dark']) .setup");
  });

  test('compiles the exact documented Svelte example', async () => {
    const { example } = await documentedExample();
    const result = compile(example, { filename: 'GettingStarted.svelte', generate: 'client', runes: true });

    expect(result.warnings).toEqual([]);
    expect(result.js.code).toContain('Account setup');
  });
});
