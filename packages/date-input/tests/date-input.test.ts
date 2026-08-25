import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const source = readFileSync(new URL('../src/WornDateInput.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

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
		expect(source).toMatch(/@media \(pointer: coarse\) \{\s*\.worn-date-input \{\s*font-size: 16px;/u);
		expect(source).toContain('min-height: 44px');
		expect(source).toContain('touch-action: manipulation');
	});

	test('owns a standalone-safe focus token without changing themed field accents', () => {
		expect(source).toContain('.worn-date-input:focus {');
		expect(source).toContain('outline: 2px dashed var(--worn-date-input-focus, var(--cockpit-focus, var(--cockpit-text, currentColor)));');
		expect(source).toContain('border-color: var(--cockpit-accent);');
		expect(source).toContain('box-shadow: 0 0 0 1px var(--cockpit-accent-50);');
		expect(source).not.toContain('outline: 2px dashed var(--cockpit-accent);');
		expect(readme).toContain('`--worn-date-input-focus`');
	});
});
