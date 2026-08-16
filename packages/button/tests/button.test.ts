import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const buttonSource = readFileSync(new URL('../src/WornButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const iconButtonSource = readFileSync(new URL('../src/WornIconButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/ButtonElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const typesSource = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('public contract', () => {
	test('merges consumer classes for button and link modes', () => {
		expect(typesSource).toContain('class?: string;');
		expect(buttonSource).toContain('class: className,');
		expect(buttonSource.match(/class=\{className \? `worn-btn \$\{className\}` : 'worn-btn'\}/gu)).toHaveLength(2);
		expect(indexSource).toContain("export type { ButtonProps, IconButtonProps } from './types';");
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

	test('owns link presentation and long-label containment', () => {
		expect(buttonSource).toContain('box-sizing: border-box;');
		expect(buttonSource).toContain('max-inline-size: 100%;');
		expect(buttonSource).toContain('min-inline-size: 0;');
		expect(buttonSource).toContain('overflow-wrap: anywhere;');
		expect(buttonSource).toContain('text-decoration: none;');
		expect(buttonSource).toContain('white-space: normal;');
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
		expect(buttonSource).not.toContain('.worn-btn:hover:not(:disabled) {');
		expect(buttonSource).not.toContain('.worn-btn:active:not(:disabled) {');
	});
});

describe('compact and touch interactions', () => {
	test('keeps compact desktop controls while reserving 44px targets for touch input', () => {
		expect(buttonSource).toContain('min-height: 36px;');
		expect(buttonSource).toContain("@media (pointer: coarse) {");
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
});

describe('browser wrapper', () => {
	test('delegates its public attributes to the canonical Svelte button', () => {
		expect(elementSource).toContain("tag: 'worn-button'");
		expect(elementSource).toContain("disabled: { type: 'Boolean' }");
		expect(elementSource).toContain('<Button {variant} {disabled} {size} {type} {href}>{label}</Button>');
	});
});
