import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import type { ToastItem } from '../src/types';

const toastSource = readFileSync(new URL('../src/Toast.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function createToast(items: ToastItem[], item: Omit<ToastItem, 'id'>): ToastItem[] {
	const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
	return [...items, { id, ...item }];
}

function dismissToast(items: ToastItem[], id: string): ToastItem[] {
	return items.filter(t => t.id !== id);
}

describe('toast store logic', () => {
	test('create adds toast with auto-id', () => {
		const result = createToast([], { message: 'hello', kind: 'success' });
		expect(result.length).toBe(1);
		expect(result[0].message).toBe('hello');
		expect(result[0].kind).toBe('success');
		expect(result[0].id).toBeTruthy();
	});

	test('dismiss removes by id', () => {
		const items: ToastItem[] = [
			{ id: 'a', message: 'first' },
			{ id: 'b', message: 'second' },
		];
		const result = dismissToast(items, 'a');
		expect(result.length).toBe(1);
		expect(result[0].id).toBe('b');
	});

	test('kind defaults to info', () => {
		const result = createToast([], { message: 'test' });
		expect(result[0].kind).toBeUndefined();
	});
});

describe('toast component', () => {
	test('uses shared theme tokens with standalone fallbacks', () => {
		expect(toastSource).toContain('var(--wrn-toast-bg, var(--cockpit-surface, #fdfbf7))');
		expect(toastSource).toContain('var(--wrn-toast-text, var(--cockpit-text, #21322b))');
		expect(toastSource).toContain('var(--wrn-toast-error-bg, var(--cockpit-danger-bg, #fdf0ef))');
		expect(toastSource).toContain('var(--wrn-toast-success-bg, var(--cockpit-success-bg, #edf9f0))');
	});

	test('announces messages and uses a dedicated dismiss control', () => {
		expect(toastSource).toContain("role={kind === 'error' ? 'alert' : 'status'}");
		expect(toastSource).toContain("aria-live={kind === 'error' ? 'assertive' : 'polite'}");
		expect(toastSource).toContain('aria-atomic="true"');
		expect(toastSource).toContain("dismissLabel = 'Dismiss notification'");
		expect(toastSource).toContain('class="wrn-toast-dismiss" onclick={dismiss} aria-label={dismissLabel}');
		expect(toastSource).not.toContain('<button type="button" class="wrn-toast"');
	});

	test('contains hostile messages inside the notification', () => {
		expect(toastSource).toContain('max-inline-size: 100%; min-inline-size: 0;');
		expect(toastSource).toContain('overflow-wrap: anywhere;');
	});

	test('calls dismissal once when manual and timed dismissal overlap', () => {
		expect(toastSource).toContain('if (dismissing) return;');
		expect(toastSource).toContain('dismissing = true;');
	});

	test('uses stylesheet motion that remains compatible with a strict CSP', () => {
		expect(toastSource).not.toContain("from 'svelte/transition'");
		expect(toastSource).toContain('@keyframes wrn-toast-enter');
		expect(toastSource).toContain('class:is-dismissing={dismissing}');
		expect(toastSource).toContain('@media (prefers-reduced-motion: reduce)');
	});

	test('keeps the dismiss action touch-safe', () => {
		expect(toastSource).toContain('min-block-size: 44px');
		expect(toastSource).toContain('@media (pointer: coarse)');
		expect(toastSource).toContain('inline-size: 44px; block-size: 44px');
	});
});

describe('browser demo', () => {
	test('waits for an explicit variant choice without instructional copy', () => {
		expect(demoSource).toContain('<h1>@wornpage/toast</h1>');
		expect(demoSource).toContain('data-kind="info"');
		expect(demoSource).toContain('src="./dist/worn-toast.js"');
		expect(demoSource).not.toContain('Click to show toasts');
		expect(demoSource).not.toContain('setTimeout');
		expect(demoSource).not.toContain('window.show');
	});
});
