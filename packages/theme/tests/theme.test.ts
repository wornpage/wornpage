import { describe, test, expect } from 'bun:test';
import { resolveTheme, THEMES, THEME_LABELS } from '../src/types';

describe('THEMES', () => {
	test('has expected themes', () => {
		expect(THEMES).toContain('light');
		expect(THEMES).toContain('dark');
		expect(THEMES).toContain('system');
		expect(THEMES).toContain('forest');
		expect(THEMES.length).toBe(9);
	});
});

describe('THEME_LABELS', () => {
	test('every theme has a label', () => {
		for (const t of THEMES) {
			expect(THEME_LABELS[t]).toBeTruthy();
		}
	});
});

describe('resolveTheme', () => {
	test('non-system themes pass through', () => {
		expect(resolveTheme('light')).toBe('light');
		expect(resolveTheme('dark')).toBe('dark');
		expect(resolveTheme('forest')).toBe('forest');
	});
});
