import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const kbd = read('Kbd');
const toolbar = read('Toolbar');

describe('@wornpage/command-surfaces', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/command-surfaces');
		expect(pkg.version).toBe('0.1.0');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
	});

	it('exports and compiles both surfaces', async () => {
		const mod = await import('../src/index.ts');
		expect(mod.Kbd).toBeDefined();
		expect(mod.Toolbar).toBeDefined();
		for (const [name, source] of Object.entries({ Kbd: kbd, Toolbar: toolbar })) {
			expect(() => compile(source, { filename: `${name}.svelte`, generate: 'client' })).not.toThrow();
		}
	});

	it('renders duplicate key labels with position-based separators', () => {
		expect(kbd).toContain('{#each keys as key, index (index)}');
		expect(kbd).toContain('{#if index < keys.length - 1}');
		expect(kbd).not.toContain('key !== keys[keys.length - 1]');
	});

	it('contains hostile key labels without changing native kbd semantics', () => {
		expect(kbd).toContain('<kbd class="worn-kbd">{key}</kbd>');
		expect(kbd).toContain('flex-wrap: wrap;');
		expect(kbd).toContain('max-inline-size: 100%;');
		expect(kbd).toContain('overflow-wrap: anywhere;');
		expect(kbd).toContain('white-space: normal;');
	});

	it('keeps normal Tab behavior through a named group', () => {
		expect(toolbar).toContain('role="group"');
		expect(toolbar).toContain("aria-label={label?.trim() || 'Toolbar'}");
		expect(toolbar).not.toContain('role="toolbar"');
	});

	it('wraps both layouts without clipping controls or focus rings', () => {
		expect(toolbar).toMatch(/\.worn-toolbar \{[\s\S]*?display: flex;[\s\S]*?flex-wrap: wrap;[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow: visible;/u);
		expect(toolbar).toMatch(/\.worn-toolbar\.is-chips \{[\s\S]*?display: grid;[\s\S]*?minmax\(min\(128px, 100%\), 1fr\)/u);
		expect(toolbar).toContain(':global(.worn-toolbar > *)');
		expect(toolbar).toContain('@media (prefers-reduced-motion: reduce)');
	});
});
