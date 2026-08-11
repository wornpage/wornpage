import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/WornMultiSelect.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('multi-select source', () => {
	test('renders native multi-select', () => {
		expect(source).toContain('multiple');
		expect(source).toContain('bind:value');
	});

	test('supports option list rendering and sizing', () => {
		expect(source).toContain('{#each options as opt');
		expect(source).toContain('{opt.label}');
		expect(source).toContain('{size}');
	});

	test('keeps shared styling tokens', () => {
		expect(source).toContain('border: 1px solid var(--cockpit-border);');
		expect(source).toContain('background: var(--cockpit-surface);');
		expect(source).toContain('color: var(--cockpit-text);');
	});
});
