import type { CmdkItem } from './types.js';

export interface CmdkGroup {
	name: string;
	items: CmdkItem[];
	startIndex: number;
}

export function groupCmdkItems(items: CmdkItem[]): { noGroup: CmdkItem[]; groups: CmdkGroup[]; orderedItems: CmdkItem[] } {
	const noGroup = items.filter((item) => !item.group);
	const buckets = new Map<string, CmdkItem[]>();

	for (const item of items) {
		if (!item.group) continue;
		const group = buckets.get(item.group) ?? [];
		group.push(item);
		buckets.set(item.group, group);
	}

	let startIndex = noGroup.length;
	const groups = [...buckets.entries()].map(([name, groupItems]) => {
		const group = { name, items: groupItems, startIndex };
		startIndex += groupItems.length;
		return group;
	});

	return { noGroup, groups, orderedItems: [...noGroup, ...groups.flatMap((group) => group.items)] };
}
