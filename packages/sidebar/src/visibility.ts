import type { NavItem } from './types.js';

// Keep the original item shape while pruning hidden leaf routes and empty
// groups. This lets consumers restore their own navigation without a second
// source of truth for the menu hierarchy.
export function visibleNavItems(items: NavItem[], hidden: ReadonlySet<string>): NavItem[] {
	return items.flatMap((item) => {
		if (hidden.has(item.id)) return [];
		if (!item.children) return [item];

		const children = visibleNavItems(item.children, hidden);
		return children.length > 0 ? [{ ...item, children }] : [];
	});
}
