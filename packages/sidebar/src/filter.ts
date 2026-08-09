import type { NavItem } from './types.js';

function normalizeQuery(query: string): string {
	return query.trim().toLowerCase();
}

export function matchesNavItem(item: NavItem, query: string): boolean {
	const q = normalizeQuery(query);
	if (!q) return true;
	return item.label.toLowerCase().includes(q) || item.children?.some((child) => matchesNavItem(child, q)) === true;
}

export function filterNavItems(items: NavItem[], query: string): NavItem[] {
	if (!query.trim()) return items;
	return items.filter((item) => matchesNavItem(item, query));
}

export function hasNavFilterResults(items: NavItem[], query: string): boolean {
	return !query.trim() || filterNavItems(items, query).length > 0;
}

export function filterNavLinks(items: NavItem[], query: string, favoriteIds = new Set<string>()): NavItem[] {
	return filterNavItems(items, query).flatMap((item) => {
		if (favoriteIds.has(item.id)) return [];
		const links = item.children ? filterNavChildren(item, query) : [item];
		return links.filter((link) => !favoriteIds.has(link.id));
	});
}

export function shouldClearNavFilter(key: string, query: string): boolean {
	return key === 'Escape' && query.length > 0;
}

export function filterNavChildren(item: NavItem, query: string): NavItem[] {
	const children = item.children ?? [];
	if (!query.trim() || item.label.toLowerCase().includes(normalizeQuery(query))) return children;
	return filterNavItems(children, query);
}

export function shouldOpenNavSection(item: NavItem, query: string, openSections: Set<string>): boolean {
	return openSections.has(item.id) || (query.trim().length > 0 && filterNavChildren(item, query).length > 0);
}
