import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/WornDateInput.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('date input source', () => {
	test('renders native date input', () => {
		expect(source).toContain('type="date"');
	});

	test('keeps shared cockpit styling', () => {
		expect(source).toContain('border: 1px solid var(--cockpit-border);');
		expect(source).toContain('background: var(--cockpit-surface);');
		expect(source).toContain('color: var(--cockpit-text);');
	});

	test('supports accessibility-relevant props', () => {
		expect(source).toContain('{required}');
		expect(source).toContain('{disabled}');
		expect(source).toContain('autocomplete="off"');
	});
});
