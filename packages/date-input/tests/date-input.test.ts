import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const source = readFileSync(new URL('../src/WornDateInput.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('date input source', () => {
	test('compiles as a Svelte 5 component', () => {
		expect(() => compile(source, { generate: 'client', runes: true })).not.toThrow();
	});

	test('renders a native, bindable date input', () => {
		expect(source).toContain('type="date"');
		expect(source).toContain('bind:value');
	});

	test('keeps shared tokens and accessible native props', () => {
		expect(source).toContain('var(--cockpit-border)');
		expect(source).toContain('{required}');
		expect(source).toContain('{disabled}');
		expect(source).toContain('autocomplete="off"');
	});

	test('keeps native date picking touch-safe without replacing the control', () => {
		expect(source).toContain('@media (pointer: coarse)');
		expect(source).toContain('min-height: 44px');
		expect(source).toContain('touch-action: manipulation');
	});
});
