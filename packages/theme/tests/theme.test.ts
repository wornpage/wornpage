import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolveTheme, THEMES, THEME_LABELS } from '../src/types';

const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

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

describe('browser demo', () => {
	test('leads with the real switcher and palette instead of implementation prose', () => {
		expect(demoSource.indexOf('<worn-theme')).toBeLessThan(demoSource.indexOf('<h2>Palette</h2>'));
		expect(demoSource).toContain('src="./dist/worn-theme.js"');
		expect(demoSource).not.toContain('This panel reads only CSS custom properties');
		expect(demoSource).not.toContain('class="lede"');
	});
});
