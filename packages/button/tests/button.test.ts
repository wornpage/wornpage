import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const buttonSource = readFileSync(new URL('../src/WornButton.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

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
