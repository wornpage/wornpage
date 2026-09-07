import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { compile } from '../demo/node_modules/svelte/compiler/index.js';
import { componentRelease } from './components.ts';

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
    const button = componentRelease('button');
    const theme = componentRelease('theme');
    expect(guide).toContain(button.archiveUrl);
    expect(guide).toContain(theme.archiveUrl);
    expect(guide).toContain(button.sourceUrl);
    expect(guide).toContain(theme.sourceUrl);
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
