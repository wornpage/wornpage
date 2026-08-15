export interface UndoStack<T> {
	snapshot(state: T): T;
	commit(snapshot: T): void;
	pop(): T | null;
	readonly length: number;
	clear(): void;
}

/** Build a snapshot before mutation and commit it only after the mutation succeeds. */
export function createUndoStack<T>(maxLength = 50): UndoStack<T> {
	const limit = Number.isFinite(maxLength) ? Math.max(1, Math.trunc(maxLength)) : 50;
	const stack: T[] = [];

	return {
		snapshot(state: T): T {
			return structuredClone(state);
		},
		commit(snapshot: T): void {
			stack.push(snapshot);
			if (stack.length > limit) stack.shift();
		},
		pop(): T | null {
			return stack.pop() ?? null;
		},
		get length(): number {
			return stack.length;
		},
		clear(): void {
			stack.length = 0;
		},
	};
}
