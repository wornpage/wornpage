import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const buttonSource = readFileSync(new URL('../src/WornButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const iconButtonSource = readFileSync(new URL('../src/WornIconButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const reactionButtonSource = readFileSync(new URL('../src/ReactionButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const distUrl = new URL('../dist/worn-button.js', import.meta.url);
const distSource = existsSync(distUrl)
	? readFileSync(distUrl, 'utf8').replace(/\r\n/gu, '\n')
	: null;
const elementSource = readFileSync(new URL('../src/ButtonElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const viteConfigSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const typesSource = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('public contract', () => {
	test('compiles every Svelte surface', () => {
		for (const source of [buttonSource, iconButtonSource, reactionButtonSource, elementSource]) {
			expect(() => compile(source, { generate: 'client', runes: true })).not.toThrow();
		}
	});

	test('merges consumer classes for button and link modes', () => {
		expect(typesSource).toContain('class?: string;');
		expect(buttonSource).toContain('class: className,');
		expect(buttonSource.match(/class=\{className \? `worn-btn \$\{className\}` : 'worn-btn'\}/gu)).toHaveLength(2);
		expect(indexSource).toContain("export type { ButtonProps, IconButtonProps, ReactionButtonProps } from './types';");
	});

	test('exports an accessible icon-button primitive', () => {
		expect(indexSource).toContain("export { default as IconButton } from './WornIconButton.svelte';");
		expect(indexSource).toContain('ButtonProps, IconButtonProps');
		expect(typesSource).toContain('label: string;');
		expect(iconButtonSource).toContain('aria-label={label}');
		expect(iconButtonSource).toContain('title = label,');
		expect(iconButtonSource).toContain('{@render children?.()}');
		expect(iconButtonSource).toContain('{...rest}');
	});

	test('exports a controlled reaction-button primitive', () => {
		expect(indexSource).toContain("export { default as ReactionButton } from './ReactionButton.svelte';");
		expect(typesSource).toContain('export interface ReactionButtonProps');
		expect(reactionButtonSource).toContain('aria-label={accessibleLabel}');
		expect(reactionButtonSource).toContain('aria-pressed={pressed}');
		expect(reactionButtonSource).toContain('onclick={onclick}');
		expect(reactionButtonSource).not.toContain('fetch(');
	});

	test('owns link presentation and long-label containment', () => {
		expect(buttonSource).toContain('box-sizing: border-box;');
		expect(buttonSource).toContain('max-inline-size: 100%;');
		expect(buttonSource).toContain('min-inline-size: 0;');
		expect(buttonSource).toContain('overflow-wrap: anywhere;');
		expect(buttonSource).toContain('text-decoration: none;');
		expect(buttonSource).toContain('white-space: normal;');
	});

	test('uses restrained non-geometric primary hover and pressed states', () => {
		expect(buttonSource).not.toContain('rotate(');
		expect(buttonSource).not.toContain('transition: transform');
		expect(buttonSource).toContain('{href}');
		expect(buttonSource).toContain('if (disabled) { e.preventDefault(); return; }');
		expect(buttonSource).toContain('tabindex={disabled ? -1 : undefined}');
		expect(buttonSource).toContain('{disabled}');
		expect(buttonSource).toContain('.worn-btn.is-primary:hover:not(:disabled):not([aria-disabled=\'true\']) {');
		expect(buttonSource).toContain('box-shadow: 0 2px 4px rgb(0 0 0 / 0.14);');
		expect(buttonSource).toContain('.worn-btn.is-primary:active:not(:disabled):not([aria-disabled=\'true\']) {');
		expect(buttonSource).toContain('box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.16);');
		expect(buttonSource).toContain('filter: brightness(0.94);');
		expect(buttonSource).toContain(".worn-btn[aria-pressed='true']:not(:disabled):not([aria-disabled='true']) {");
		expect(buttonSource).toContain('box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.14);');
	});

	test('uses restrained non-geometric press states across every control', () => {
		for (const source of [buttonSource, iconButtonSource, reactionButtonSource]) {
			expect(source).not.toContain('translateY(');
			expect(source).not.toContain('rotate(');
			expect(source).not.toContain('transition: transform');
			expect(source).toContain('box-shadow: inset 0 1px 2px');
			expect(source).toContain('filter: brightness(0.94);');
		}
	});

	test('keeps source-only controls out of the browser bundle', () => {
		expect(indexSource).toContain("export { default as IconButton } from './WornIconButton.svelte';");
		expect(indexSource).toContain("export { default as ReactionButton } from './ReactionButton.svelte';");
		expect(viteConfigSource).toContain("entry: 'src/ButtonElement.svelte'");
		expect(viteConfigSource).toContain("fileName: () => 'worn-button.js'");
		if (distSource === null) return;
		expect(distSource).toContain('worn-button');
		expect(distSource).not.toContain('worn-icon-btn');
		expect(distSource).not.toContain('worn-reaction-btn');
		expect(distSource).not.toContain('rotate(');
		expect(distSource).not.toContain('translateY(');
		expect(distSource).toContain("[aria-pressed='true']");
		expect(distSource).toContain('brightness(0.98)');
	});
});

describe('disabled state', () => {
	test('is owned by the package for buttons and links', () => {
		expect(buttonSource).toContain(".worn-btn.worn-btn:disabled,\n\t.worn-btn.worn-btn[aria-disabled='true'] {");
		expect(buttonSource).toContain('background: var(--cockpit-bg-secondary);');
		expect(buttonSource).toContain('color: var(--cockpit-text-muted);');
		expect(buttonSource).toContain('cursor: not-allowed;');
		expect(buttonSource).toContain('opacity: 1;');
		expect(buttonSource).toContain('animation: none;');
	});

	test('does not apply interactive states to disabled links', () => {
		expect(buttonSource).toContain(":hover:not(:disabled):not([aria-disabled='true'])");
		expect(buttonSource).toContain(":active:not(:disabled):not([aria-disabled='true'])");
		expect(buttonSource).toContain("[aria-pressed='true']:not(:disabled):not([aria-disabled='true'])");
		expect(buttonSource).not.toContain('.worn-btn:hover:not(:disabled) {');
		expect(buttonSource).not.toContain('.worn-btn:active:not(:disabled) {');
		expect(buttonSource.indexOf("[aria-pressed='true']:not(:disabled):not([aria-disabled='true'])"))
		.toBeLessThan(buttonSource.indexOf(".worn-btn.worn-btn[aria-disabled='true'] {"));
	});
});

describe('compact and touch interactions', () => {
	test('keeps compact desktop controls while reserving 44px targets for touch input', () => {
		expect(buttonSource).toContain('font-size: 13px;');
		expect(buttonSource).toContain(".worn-btn.is-sm {\n\t\tfont-size: 12px;");
		expect(buttonSource).toContain('min-height: 36px;');
		expect(buttonSource).toContain("@media (pointer: coarse) {");
		expect(buttonSource).toContain(".worn-btn,\n\t\t.worn-btn.is-sm {\n\t\t\tfont-size: 14px;");
		expect(buttonSource).toContain('min-width: 44px;');
		expect(buttonSource).toContain('min-height: 44px;');
	});

	test('suppresses browser gesture delay and decorative transitions when appropriate', () => {
		expect(buttonSource).toContain('touch-action: manipulation;');
		expect(buttonSource).toContain('outline: 2px dashed var(--worn-button-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)));');
		expect(buttonSource).toContain('@media (prefers-reduced-motion: reduce) {');
		expect(buttonSource).toContain('transition: none;');
	});

	test('keeps icon actions measurable and pointer-safe', () => {
		expect(iconButtonSource).toContain('flex: 0 0 44px;');
		expect(iconButtonSource).toContain('inline-size: 44px;');
		expect(iconButtonSource).toContain('min-block-size: 44px;');
		expect(iconButtonSource).toContain('touch-action: manipulation;');
		expect(iconButtonSource).toContain('-webkit-tap-highlight-color: transparent;');
		expect(iconButtonSource).toContain("class:is-lg={size === 'lg'}");
		expect(iconButtonSource).toContain('flex-basis: 48px;');
		expect(iconButtonSource).toContain('inline-size: 48px;');
		expect(iconButtonSource).toContain('min-block-size: 48px;');
		expect(typesSource).toContain("size?: 'sm' | 'md' | 'lg';");
		expect(readme).toContain('`size="lg"` provides a 48px floating-control target');
		expect(iconButtonSource).toContain('@media (pointer: coarse) {');
		expect(iconButtonSource).toContain('@media (prefers-reduced-motion: reduce) {');
	});

	test('owns icon-button theme and focus states', () => {
		expect(iconButtonSource).toContain('color: var(--cockpit-text);');
		expect(iconButtonSource).toContain('background: var(--cockpit-bg-secondary);');
		expect(iconButtonSource).toContain('color: var(--cockpit-danger-text);');
		expect(iconButtonSource).toContain('.worn-icon-btn:focus-visible {');
		expect(iconButtonSource).toContain('outline: 2px dashed var(--worn-button-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)));');
		expect(iconButtonSource).toContain('.worn-icon-btn:disabled {');
		expect(iconButtonSource).toContain('opacity: 1;');
	});

	test('keeps reactions touch-safe, legible, and theme-aware', () => {
		expect(reactionButtonSource).toContain('min-block-size: 44px;');
		expect(reactionButtonSource).toContain('min-inline-size: 44px;');
		expect(reactionButtonSource).toContain('touch-action: manipulation;');
		expect(reactionButtonSource).toContain('overflow-wrap: anywhere;');
		expect(reactionButtonSource).toContain('.worn-reaction-btn:focus-visible {');
		expect(reactionButtonSource).toContain('var(--cockpit-focus, var(--cockpit-text, #21322b))');
		expect(reactionButtonSource).toContain('.worn-reaction-btn.is-pressed {');
		expect(reactionButtonSource).toContain('@media (prefers-reduced-motion: reduce)');
		expect(reactionButtonSource).toContain('@media (forced-colors: active)');
		expect(reactionButtonSource).toContain('opacity: 1;');
	});
});

describe('browser wrapper', () => {
	test('delegates its public attributes to the canonical Svelte button', () => {
		expect(elementSource).toContain("tag: 'worn-button'");
		expect(elementSource).toContain("disabled: { type: 'Boolean' }");
		expect(elementSource).toContain('<Button {variant} {disabled} {size} {type} {href}>{label}</Button>');
	});
});
