import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import {
	applyTheme,
	createThemeController,
	isThemeName,
	readTheme,
	resolveTheme,
	THEMES,
	THEME_LABELS,
	type ThemeMediaQuery,
} from '../src/types';

const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const componentSource = readFileSync(new URL('../src/Theme.svelte', import.meta.url), 'utf8');
const elementSource = readFileSync(new URL('../src/ThemeElement.svelte', import.meta.url), 'utf8');
const elementsEntrySource = readFileSync(new URL('../src/elements.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');

function runtimeFixture(dark = false) {
	const attributes = new Map<string, string>();
	const values = new Map<string, string>();
	const listeners = new Set<() => void>();
	let isDark = dark;
	let addCount = 0;
	let removeCount = 0;
	const mediaQuery: ThemeMediaQuery = {
		get matches() { return isDark; },
		addEventListener(_type, listener) { addCount += 1; listeners.add(listener); },
		removeEventListener(_type, listener) { removeCount += 1; listeners.delete(listener); },
	};
	return {
		attributes,
		values,
		root: { setAttribute(name: string, value: string) { attributes.set(name, value); } },
		storage: {
			getItem(key: string) { return values.get(key) ?? null; },
			setItem(key: string, value: string) { values.set(key, value); },
		},
		matchMedia: () => mediaQuery,
		setDark(value: boolean) { isDark = value; for (const listener of listeners) listener(); },
		listenerCounts() { return { add: addCount, remove: removeCount, active: listeners.size }; },
	};
}

describe('theme vocabulary', () => {
	test('has a label for every supported theme', () => {
		expect(THEMES).toEqual(['system', 'light', 'dark', 'forest', 'ocean', 'sepia', 'halloween', 'winter', 'holiday']);
		for (const theme of THEMES) expect(THEME_LABELS[theme]).toBeTruthy();
	});

	test('validates values against the active theme subset', () => {
		expect(isThemeName('forest')).toBe(true);
		expect(isThemeName('forest', ['system', 'light', 'dark'])).toBe(false);
		expect(isThemeName('unknown')).toBe(false);
	});
});

describe('runtime helpers', () => {
	test('resolves system while non-system themes pass through', () => {
		expect(resolveTheme('system', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))).toBe('dark');
		expect(resolveTheme('system', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))).toBe('light');
		expect(resolveTheme('forest')).toBe('forest');
	});

	test('applies and persists through configurable runtime boundaries', () => {
		const runtime = runtimeFixture(true);
		const effective = applyTheme('system', {
			root: runtime.root,
			storage: runtime.storage,
			storageKey: 'product-theme',
			matchMedia: runtime.matchMedia,
		});
		expect(effective).toBe('dark');
		expect(runtime.attributes.get('data-theme')).toBe('dark');
		expect(runtime.values.get('product-theme')).toBe('system');
	});

	test('rejects unknown stored and applied values', () => {
		const runtime = runtimeFixture();
		runtime.values.set('product-theme', 'unknown');
		expect(readTheme({ storage: runtime.storage, storageKey: 'product-theme' })).toBeNull();
		expect(() => applyTheme('unknown' as never, { root: runtime.root, storage: runtime.storage })).toThrow('Unknown theme');
	});
});

describe('theme controller', () => {
	test('restores the logical choice without rewriting storage', () => {
		const runtime = runtimeFixture();
		runtime.values.set('product-theme', 'ocean');
		const applied: string[] = [];
		const controller = createThemeController({
			initialTheme: 'system',
			root: runtime.root,
			storage: runtime.storage,
			storageKey: 'product-theme',
			matchMedia: runtime.matchMedia,
			onApply(theme, effective) { applied.push(`${theme}:${effective}`); },
		});
		expect(controller.restore()).toBe('ocean');
		expect(controller.current).toBe('ocean');
		expect(runtime.values.get('product-theme')).toBe('ocean');
		expect(applied).toEqual(['ocean:ocean']);
	});

	test('tracks OS changes only for system and preserves the logical choice', () => {
		const runtime = runtimeFixture(false);
		const controller = createThemeController({
			root: runtime.root,
			storage: runtime.storage,
			storageKey: 'product-theme',
			matchMedia: runtime.matchMedia,
		});
		const stop = controller.start();
		expect(runtime.listenerCounts()).toEqual({ add: 1, remove: 0, active: 1 });
		expect(runtime.attributes.get('data-theme')).toBe('light');
		runtime.setDark(true);
		expect(runtime.attributes.get('data-theme')).toBe('dark');
		expect(runtime.values.has('product-theme')).toBe(false);

		controller.set('forest');
		runtime.setDark(false);
		expect(runtime.attributes.get('data-theme')).toBe('forest');
		expect(runtime.values.get('product-theme')).toBe('forest');
		stop();
		expect(runtime.listenerCounts()).toEqual({ add: 1, remove: 1, active: 0 });
	});

	test('does not stack listeners across repeated starts', () => {
		const runtime = runtimeFixture();
		const controller = createThemeController({ root: runtime.root, storage: runtime.storage, matchMedia: runtime.matchMedia });
		controller.start();
		controller.start();
		expect(runtime.listenerCounts().add).toBe(1);
		controller.stop();
		controller.stop();
		expect(runtime.listenerCounts().remove).toBe(1);
	});
});

describe('component contract', () => {
	test('exposes pressed state, focus treatment, coarse targets, and reduced motion', () => {
		expect(componentSource).toContain('role="group"');
		expect(componentSource).toContain('aria-pressed={theme === option}');
		expect(componentSource).toContain(':focus-visible');
		expect(componentSource).toContain('@media (pointer: coarse)');
		expect(componentSource).toContain('min-height: 44px');
		expect(componentSource).toContain('@media (prefers-reduced-motion: reduce)');
	});

	test('keeps persistence in the controller instead of component wrappers', () => {
		expect(componentSource).not.toContain('localStorage');
		expect(elementSource).not.toContain('localStorage');
		expect(elementSource).toContain('effectiveTheme');
	});
});

describe('package entrypoints', () => {
	test('keeps the custom-element wrapper out of the Svelte consumer entry', () => {
		expect(indexSource).toContain("export { default as Theme } from './Theme.svelte';");
		expect(indexSource).not.toContain('ThemeElement');
		expect(elementsEntrySource).toBe("import './ThemeElement.svelte';\n");
		expect(viteSource).toContain("entry: 'src/elements.ts'");
		expect(viteSource).toContain("filename.endsWith('ThemeElement.svelte')");
	});
});

describe('browser demo', () => {
	test('leads with the real switcher and palette instead of implementation prose', () => {
		expect(demoSource.indexOf('<worn-theme')).toBeLessThan(demoSource.indexOf('<h2>Palette</h2>'));
		expect(demoSource).toContain('src="./dist/worn-theme.js"');
		expect(demoSource).not.toContain('This panel reads only CSS custom properties');
		expect(demoSource).not.toContain('class="lede"');
	});

	test('maps every picker token and uses contrast-safe dark accents', () => {
		for (const token of ['active-bg', 'active-text', 'border', 'focus', 'hover', 'text']) {
			expect(demoSource).toContain(`--wrn-theme-${token}`);
		}
		for (const accent of ['#2f7665', '#3f7a32', '#2563a0', '#8b5e2c', '#c2410c', '#1d4ed8', '#be185d']) {
			expect(demoSource).toContain(`--accent: ${accent}`);
		}
	});
});
