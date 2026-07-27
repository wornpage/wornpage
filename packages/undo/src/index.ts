
export { default as UndoReceipt } from './UndoReceipt.svelte';
export { default as UndoElement } from './UndoElement.svelte';
export type { UndoAction, UndoStore } from './types.js';
export { MAX_UNDO, UNDO_LABELS } from './types.js';

/**
 * Generic undo stack manager. Build a snapshot before mutation, commit on success.
 * 
 * @example
 * const undo = createUndoStack(50);
 * const snap = undo.snapshot({ value: state.value });
 * state.value++;
 * undo.commit(snap); // only if mutation succeeds
 * undo.pop(); // returns the last committed snapshot or null
 */
export function createUndoStack<T>(maxLength: number = 50) {
  const stack: T[] = [];
  return {
    snapshot(state: T): T { return structuredClone(state); },
    commit(snapshot: T): void {
      stack.push(snapshot);
      if (stack.length > maxLength) stack.shift();
    },
    pop(): T | null { return stack.pop() ?? null; },
    get length(): number { return stack.length; },
    clear(): void { stack.length = 0; }
  };
}