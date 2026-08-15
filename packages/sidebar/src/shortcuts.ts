import type { NavItem } from './types.js';

export interface CurrentPagePlacement {
	item: NavItem;
	group: 'pinned' | 'canonical';
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
