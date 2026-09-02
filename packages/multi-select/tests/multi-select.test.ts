import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const source = readFileSync(new URL('../src/WornMultiSelect.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const typesSource = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

describe('multi-select source', () => {
	test('compiles as a Svelte 5 component', () => {
		expect(() => compile(source, { generate: 'client', runes: true })).not.toThrow();
	});

	test('renders a native, bindable multi-select', () => {
		expect(source).toContain('multiple');
		expect(source).toContain('bind:value');
	});

	test('renders keyed options and preserves disabled rows', () => {
		expect(source).toContain('{#each options as option');
		expect(source).toContain('{option.label}');
		expect(source).toContain('disabled={option.disabled}');
		expect(typesSource).toContain('disabled?: boolean;');
	});

	test('exports stable option and prop contracts', () => {
		expect(indexSource).toContain("export type { MultiSelectOption, MultiSelectProps } from './types.js';");
		expect(typesSource).toContain('value?: string[];');
		expect(typesSource).toContain('options: MultiSelectOption[];');
	});

	test('lets the native size control visible rows above a touch-safe floor', () => {
		expect(source).toContain('{size}');
		expect(source).toContain('min-block-size: 44px;');
		expect(source).not.toContain('min-height: 120px;');
	});

	test('contains compact layouts and keeps coarse pointers zoom-safe', () => {
		expect(source).toContain('max-inline-size: 100%;');
		expect(source).toContain('min-inline-size: 0;');
		expect(source).toContain('touch-action: manipulation;');
		const coarsePointerOverride = source.match(/@media\s*\(pointer:\s*coarse\)\s*\{([\s\S]*?)\n\t\}/u)?.[1] ?? '';
		expect(coarsePointerOverride).toContain('.worn-multi-select {');
		expect(coarsePointerOverride).toContain('font-size: 16px;');
	});

	test('uses the shared high-contrast field boundary and keyboard focus treatment', () => {
		expect(source).toContain('--worn-multi-select-boundary: color-mix(');
		expect(source).toContain('var(--worn-border-strong) 30%');
		expect(source).toContain('var(--worn-text-muted)');
		expect(source).toContain('.worn-multi-select:focus-visible');
		expect(source).not.toContain('.worn-multi-select:focus {');
	});

	test('owns a public theme-safe focus token', () => {
		const focusRule = source.match(/\.worn-multi-select:focus-visible \{[\s\S]*?\}/u)?.[0] ?? '';
		expect(focusRule).toContain('outline: 2px dashed var(--worn-multi-select-focus, var(--worn-focus, var(--worn-text, currentColor)));');
		expect(focusRule.match(/outline:[^;]+;/u)?.[0] ?? '').not.toContain('--worn-accent');
		expect(readme).toContain('`--worn-multi-select-focus`');
	});

	test('records the focus-owner release version', () => {
		expect(packageJson.version).toBe('0.1.3');
	});

	test('keeps disabled rows legible without browser opacity', () => {
		expect(source).toContain('-webkit-text-fill-color: var(--worn-text-muted);');
		expect(source).toContain('cursor: not-allowed;');
		expect(source).toContain('opacity: 1;');
	});
});
