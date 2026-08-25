import type { NavItem } from './types.js';

export interface CurrentPagePlacement {
	item: NavItem;
	group: 'pinned' | 'canonical';
}

/** Resolve saved favorite ids in their persisted order and discard stale ids. */
export function orderedFavoriteItems(items: NavItem[], favoriteIds: Set<string>): NavItem[] {
	const itemsById = new Map(items.map((item) => [item.id, item]));
	return [...favoriteIds]
		.map((id) => itemsById.get(id))
		.filter((item): item is NavItem => Boolean(item));
}

/** Select the sole durable navigation group responsible for the current page. */
export function selectCurrentPagePlacement(
	items: NavItem[],
	activeHref: string,
	favorites: Set<string>
): CurrentPagePlacement | null {
	const item = items.find((candidate) => candidate.href === activeHref);
	if (!item) return null;

	return { item, group: favorites.has(item.id) ? 'pinned' : 'canonical' };
}

/**
 * Shortcut groups mirror canonical links, so they must never render the
 * current route. Filter first so a full shortcut group backfills its limit.
 */
export function filterTransientNavItems(items: NavItem[], activeHref: string, limit: number): NavItem[] {
	return items.filter((item) => !activeHref || item.href !== activeHref).slice(0, limit);
}

/** Decide whether a canonical row remains visible after shortcut promotion. */
export function shouldRenderCanonicalNavItem(
	item: NavItem,
	attentionIds: Set<string>,
	normalizedFilterText: string,
	favoriteIds: Set<string>
): boolean {
	if (favoriteIds.has(item.id)) return false;
	return Boolean(normalizedFilterText) || !attentionIds.has(item.id);
}
