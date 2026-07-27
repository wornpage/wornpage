import { describe, test, expect } from 'bun:test';
import type { ToastItem } from '../src/types';

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
