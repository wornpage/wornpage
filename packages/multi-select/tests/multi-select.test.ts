import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const source = readFileSync(new URL('../src/WornMultiSelect.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('multi-select source', () => {
	test('compiles as a Svelte 5 component', () => {
		expect(() => compile(source, { generate: 'client', runes: true })).not.toThrow();
	});

	test('renders a native, bindable multi-select', () => {
		expect(source).toContain('multiple');
		expect(source).toContain('bind:value');
	});

	test('renders options and keeps shared tokens', () => {
		expect(source).toContain('{#each options as option');
		expect(source).toContain('{option.label}');
		expect(source).toContain('var(--cockpit-border)');
	});
});
