import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/SelectCard.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/SelectCardElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('selection semantics', () => {
	test('uses one native controlled button with selected and disabled state', () => {
		expect(source).toContain('type="button"');
		expect(source).toContain('aria-pressed={pressed}');
		expect(source).toContain('{disabled}');
		expect(source).toContain('{onclick}');
		expect(source).not.toContain('pressed = !pressed');
	});

	test('forwards additional button attributes', () => {
		expect(source).toContain('...rest');
		expect(source).toContain('{...rest}');
	});
});

describe('responsive interaction contract', () => {
	test('contains long content and reserves a stable target', () => {
		expect(source).toContain('max-inline-size: 100%;');
		expect(source).toContain('min-inline-size: 0;');
		expect(source).toContain('min-block-size: 44px;');
		expect(source).toContain('overflow-wrap: anywhere;');
		expect(source).toContain('font-size: var(--worn-select-card-title-size, 15px);');
	});

	test('supports touch, keyboard focus, and reduced motion', () => {
		expect(source).toContain('touch-action: manipulation;');
		expect(source).toContain('.worn-select-card:focus-visible');
		expect(source).toContain('@media (prefers-reduced-motion: reduce)');
		expect(source).toContain('transition: none;');
	});
});

describe('theme states', () => {
	test('keeps pressed content on the selected foreground', () => {
		expect(source).toContain(".worn-select-card[aria-pressed='true'] {");
		expect(source).toContain('color: var(--cockpit-accent-text);');
		expect(source).toContain(".worn-select-card[aria-pressed='true'] strong,");
	});

	test('keeps disabled state readable without opacity dimming', () => {
		expect(source).toContain('.worn-select-card:disabled {');
		expect(source).toContain('background: var(--cockpit-bg-secondary);');
		expect(source).toContain('color: var(--cockpit-text-muted);');
		expect(source).toContain('opacity: 1;');
	});
});

describe('browser delivery', () => {
	test('wraps the canonical component with typed boolean attributes', () => {
		expect(elementSource).toContain("tag: 'worn-select-card'");
		expect(elementSource).toContain("pressed: { type: 'Boolean' }");
		expect(elementSource).toContain("disabled: { type: 'Boolean' }");
		expect(elementSource).toContain('<SelectCard {label} {description} {pressed} {disabled} />');
	});

	test('demo renders the real bundle and all public states', () => {
		expect(demoSource).toContain('src="./dist/worn-select-card.js"');
		expect(demoSource).toContain('data-option="pro"');
		expect(demoSource).toContain('pressed');
		expect(demoSource).toContain('disabled');
		expect(demoSource).toContain('worn-select-card .worn-select-card { inline-size: 100%; }');
	});
});
