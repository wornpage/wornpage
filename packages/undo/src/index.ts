
export { default as UndoReceipt } from './UndoReceipt.svelte';
export { createUndoStack } from './stack.js';
export type { UndoStack } from './stack.js';
export type {
	UndoAction,
	UndoActionType,
	UndoElementEventDetail,
	UndoReceiptProps,
	UndoStore,
} from './types.js';
export { MAX_UNDO, UNDO_LABELS } from './types.js';
