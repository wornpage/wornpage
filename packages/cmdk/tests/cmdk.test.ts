import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { groupCmdkItems } from '../src/group.js';
import type { CmdkItem } from '../src/types.js';

const cmdkSource = readFileSync(new URL('../src/Cmdk.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/CmdkElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementsEntrySource = readFileSync(new URL('../src/elements.ts', import.meta.url), 'utf8');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  let qi = 0;
  for (let i = 0; i < target.length && qi < query.length; i++) {
    if (target[i].toLowerCase() === query[qi].toLowerCase()) qi++;
  }
  return qi === query.length;
}

function fuzzySearch<T extends { label: string; keywords?: string[] }>(
  items: T[], query: string
): T[] {
  if (!query) return items;
  return items.filter(item => {
    if (fuzzyMatch(query, item.label)) return true;
    if (item.keywords) return item.keywords.some(kw => fuzzyMatch(query, kw));
    return false;
  });
}

describe('fuzzyMatch', () => {
  test('exact match', () => expect(fuzzyMatch('home', 'home')).toBe(true));
  test('subsequence match', () => expect(fuzzyMatch('hm', 'home')).toBe(true));
  test('case insensitive', () => expect(fuzzyMatch('HOME', 'home')).toBe(true));
  test('no match', () => expect(fuzzyMatch('zz', 'home')).toBe(false));
  test('empty query matches all', () => expect(fuzzyMatch('', 'anything')).toBe(true));
  test('characters must be in order', () => expect(fuzzyMatch('mh', 'home')).toBe(false));
});

describe('fuzzySearch', () => {
  const items = [
    { label: 'Home', keywords: [] },
    { label: 'Dashboard' },
    { label: 'Review', keywords: ['blocked', 'needs action'] },
    { label: 'Settings' },
  ];

  test('empty query returns all', () => expect(fuzzySearch(items, '').length).toBe(4));
  test('exact label match', () => expect(fuzzySearch(items, 'home')[0].label).toBe('Home'));
  test('fuzzy match', () => expect(fuzzySearch(items, 'dash')[0].label).toBe('Dashboard'));
  test('keyword match', () => expect(fuzzySearch(items, 'blocked')[0].label).toBe('Review'));
  test('no match', () => expect(fuzzySearch(items, 'zzz').length).toBe(0));
  test('case insensitive', () => expect(fuzzySearch(items, 'HOME')[0].label).toBe('Home'));
});

describe('groupCmdkItems', () => {
	const action = () => {};
	const items: CmdkItem[] = [
		{ id: 'screen-home', label: 'Home', group: 'Screens', onSelect: action },
		{ id: 'plain', label: 'Plain', onSelect: action },
		{ id: 'screen-work', label: 'Work', group: 'Screens', onSelect: action },
		{ id: 'scenario-default', label: 'Default', group: 'Scenarios', onSelect: action }
	];

	test('assigns stable offsets in displayed order', () => {
		const grouped = groupCmdkItems(items);
		expect(grouped.noGroup.map((item) => item.id)).toEqual(['plain']);
		expect(grouped.groups.map((group) => [group.name, group.startIndex])).toEqual([
			['Screens', 1],
			['Scenarios', 3]
		]);
	});

	test('maps every rendered index back to the matching displayed item', () => {
		const grouped = groupCmdkItems(items);
		expect(grouped.orderedItems.map((item) => item.id)).toEqual([
			'plain',
			'screen-home',
			'screen-work',
			'scenario-default'
		]);
		for (const group of grouped.groups) {
			group.items.forEach((item, index) => {
				expect(grouped.orderedItems[group.startIndex + index].id).toBe(item.id);
			});
		}
	});
});

describe('command palette chrome', () => {
	test('keeps keyboard behavior without a visible shortcut footer', () => {
		expect(cmdkSource).toContain('function onKeydown(e: KeyboardEvent)');
		expect(cmdkSource).toContain('onkeydown={onKeydown}');
		expect(cmdkSource).not.toContain('cmdk-hint');
		expect(cmdkSource).not.toContain('Up/Down to move');
	});

	test('inherits shared theme tokens with standalone fallbacks', () => {
		expect(cmdkSource).toContain('var(--cmdk-surface, var(--cockpit-surface, #fff))');
		expect(cmdkSource).toContain('var(--cmdk-text, var(--cockpit-text, #21322b))');
		expect(cmdkSource).toContain('var(--cmdk-border, var(--cockpit-border-strong, #d0cac1))');
		expect(cmdkSource).toContain('var(--cmdk-selected-bg, var(--cockpit-hover-bg, #d7efe7))');
		expect(cmdkSource).toContain('var(--cmdk-text-muted, var(--cockpit-text-muted, #63746a))');
		expect(cmdkSource).toContain('.cmdk-input::placeholder');
	});

	test('offers mobile-safe close and backdrop dismissal', () => {
		expect(cmdkSource).toContain('function closePalette()');
		expect(cmdkSource).toContain('if (e.target === e.currentTarget) closePalette();');
		expect(cmdkSource).toContain('<button type="button" class="cmdk-close" onclick={closePalette} aria-label="Close command palette"></button>');
		expect(cmdkSource).toContain('.cmdk-close { position: relative; flex: 0 0 auto; width: 44px; height: 44px;');
		expect(cmdkSource).toContain('@media (pointer: coarse) { .cmdk-item { min-height: 44px; } }');
	});

	test('routes one native close callback through the component contract', () => {
		expect(cmdkSource).toContain('onclose={handleDialogClose}');
		expect(cmdkSource).toContain('onclose?.(event);');
		expect(elementSource.match(/new CustomEvent\('close'/gu)?.length).toBe(1);
		expect(elementSource).toContain("{ bubbles: true, composed: true }");
		expect(cmdkSource).toContain("if (e.key === 'Escape') { e.preventDefault(); closePalette(); }");
	});

	test('restores focus to the connected opener after close', () => {
		expect(cmdkSource).toContain('returnFocus = activeElement instanceof HTMLElement');
		expect(cmdkSource).toContain('if (target?.isConnected) target.focus();');
	});

	test('honors reduced-motion preferences', () => {
		expect(cmdkSource).toContain('@media (prefers-reduced-motion: reduce) { .cmdk { animation: none; } }');
	});
});

describe('package entrypoints', () => {
	test('keeps the Svelte component separate from the custom-element wrapper', () => {
		expect(cmdkSource).not.toContain('<svelte:options customElement');
		expect(indexSource).toContain("export { default as Cmdk } from './Cmdk.svelte';");
		expect(indexSource).not.toContain('CmdkElement');
		expect(elementSource).toContain("tag: 'worn-cmdk'");
		expect(elementsEntrySource).toBe("import './CmdkElement.svelte';\n");
	});

	test('compiles custom-element mode only for the browser wrapper', () => {
		expect(viteSource).toContain("entry: 'src/elements.ts'");
		expect(viteSource).toContain("customElement: filename.endsWith('Element.svelte')");
		expect(viteSource).not.toContain('customElement: true');
	});
});

describe('browser demo', () => {
	test('leads with the open action and reports selections without instructions or alerts', () => {
		expect(demoSource).toContain('<h1>@wornpage/cmdk</h1>');
		expect(demoSource).toContain('aria-keyshortcuts="Control+K Meta+K"');
		expect(demoSource).toContain('<output id="selection" aria-live="polite"></output>');
		expect(demoSource).toContain('src="./dist/worn-cmdk.js"');
		expect(demoSource).not.toContain('Press <kbd>');
		expect(demoSource).not.toContain('alert(');
	});
});
