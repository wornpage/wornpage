import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const buttonSource = readFileSync(new URL('../src/WornButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/ButtonElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const typesSource = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('public contract', () => {
	test('merges consumer classes for button and link modes', () => {
		expect(typesSource).toContain('class?: string;');
		expect(buttonSource).toContain('class: className,');
		expect(buttonSource.match(/class=\{className \? `worn-btn \$\{className\}` : 'worn-btn'\}/gu)).toHaveLength(2);
		expect(indexSource).toContain("export type { ButtonProps } from './types';");
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
		expect(buttonSource).toContain('@media (prefers-reduced-motion: reduce) {');
		expect(buttonSource).toContain('transition: none;');
	});
});

describe('browser wrapper', () => {
	test('delegates its public attributes to the canonical Svelte button', () => {
		expect(elementSource).toContain("tag: 'worn-button'");
		expect(elementSource).toContain("disabled: { type: 'Boolean' }");
		expect(elementSource).toContain('<Button {variant} {disabled} {size} {type} {href}>{label}</Button>');
	});
});
