export interface UndoAction {
	type: 'action' | 'create' | 'memory' | 'snapshot';
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

export const MAX_UNDO = 50;
export const UNDO_LABELS: Record<string, string> = {
	done: 'Marked as done',
	block: 'Set blocker',
	unblock: 'Cleared blocker',
	open: 'Reopened',
	start: 'Started',
	create: 'Created',
	memory: 'Added memory',
};
