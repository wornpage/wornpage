export { default as UndoReceipt } from '../../../packages/undo/src/UndoReceipt.svelte';
export { createUndoStack } from '../../../packages/undo/src/stack.js';
export type { UndoStack } from '../../../packages/undo/src/stack.js';
export type {
  UndoAction,
  UndoActionType,
  UndoElementEventDetail,
  UndoReceiptProps,
  UndoStore,
} from '../../../packages/undo/src/types.js';
export { MAX_UNDO, UNDO_LABELS } from '../../../packages/undo/src/types.js';
