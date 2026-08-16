export type UndoActionType =
	| 'action'
	| 'done'
	| 'block'
	| 'unblock'
	| 'open'
	| 'start'
	| 'create'
	| 'memory'
	| 'snapshot';

export interface UndoAction {
	type: UndoActionType;
	packId: string;
	label: string;
	fields?: Record<string, string>;
	memory?: string[];
	createdAt: number;
}

export interface UndoStore {
	stack: UndoAction[];
	index: number;
}

export interface UndoReceiptProps {
	action: UndoAction;
	canUndo?: boolean;
	canRedo?: boolean;
	onundo?: (action: UndoAction) => void;
	onredo?: (action: UndoAction) => void;
}

export type UndoHistoryItemState = 'past' | 'current' | 'undone';

export interface UndoHistoryItem {
	id: string | number;
	label: string;
	meta: string;
	state: UndoHistoryItemState;
}

export interface UndoHistoryListProps {
	items: UndoHistoryItem[];
	onselect: (item: UndoHistoryItem) => void | Promise<void>;
	ariaLabel?: string;
	emptyText?: string;
}

export interface UndoElementEventDetail {
	action: UndoAction;
}

export const MAX_UNDO = 50;
export const UNDO_LABELS: Partial<Record<UndoActionType, string>> = {
	done: 'Marked as done',
	block: 'Set blocker',
	unblock: 'Cleared blocker',
	open: 'Reopened',
	start: 'Started',
	create: 'Created',
	memory: 'Added memory',
};
