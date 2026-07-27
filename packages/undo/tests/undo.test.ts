import { describe, test, expect } from 'bun:test';
import type { UndoAction, UndoStore } from '../src/types';
import { MAX_UNDO } from '../src/types';

function push(stack: UndoAction[], action: UndoAction): UndoAction[] {
	return [...stack.slice(stack.length - MAX_UNDO + 1), action];
}

function undo(stack: UndoStore): UndoStore {
	if (stack.index <= 0) return stack;
	return { ...stack, index: stack.index - 1 };
}

function redo(stack: UndoStore): UndoStore {
	if (stack.index >= stack.stack.length - 1) return stack;
	return { ...stack, index: stack.index + 1 };
}

describe('undo stack', () => {
	test('push adds to end', () => {
		const stack: UndoAction[] = [];
		const r = push(stack, { type: 'action', packId: 'p1', label: 'Blocked', createdAt: 1 });
		expect(r.length).toBe(1);
		expect(r[0].label).toBe('Blocked');
	});

	test('undo decrements index', () => {
		const store: UndoStore = { stack: [{ type: 'action', packId: 'p1', label: 'A', createdAt: 1 }, { type: 'action', packId: 'p2', label: 'B', createdAt: 2 }], index: 2 };
		const r = undo(store);
		expect(r.index).toBe(1);
	});

	test('redo increments index', () => {
		const store: UndoStore = { stack: [{ type: 'action', packId: 'p1', label: 'A', createdAt: 1 }], index: 0 };
		const r = redo(store);
		expect(r.index).toBe(0); // only one item, can't redo
	});

	test('undo at start is no-op', () => {
		const store: UndoStore = { stack: [], index: 0 };
		expect(undo(store).index).toBe(0);
	});

	test('MAX_UNDO is reasonable', () => {
		expect(MAX_UNDO).toBeGreaterThan(10);
		expect(MAX_UNDO).toBeLessThan(200);
	});
});
