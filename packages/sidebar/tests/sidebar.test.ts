import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { filterNavChildren, filterNavItems, filterNavLinks, hasNavFilterResults, shouldClearNavFilter, shouldOpenNavSection } from '../src/filter.js';

const sidebarSource = readFileSync(new URL('../src/Sidebar.svelte', import.meta.url), 'utf8');

describe('filter control', () => {
	test('owns one accessible clear affordance', () => {
		expect(sidebarSource).toContain('type="text" role="searchbox" inputmode="search" autocomplete="off"');
		expect(sidebarSource).not.toContain('type="search"');
		expect(sidebarSource.match(/class="worn-filter-clear"/gu)?.length).toBe(1);
		expect(sidebarSource).toContain('aria-label="Clear filter"');
	});
});

function flatten(items: { id: string; children?: any[] }[]): { id: string }[] {
  const result: { id: string }[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) result.push(...flatten(item.children));
  }
  return result;
}

describe('flatten', () => {
  test('flat list stays flat', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(flatten(items).map(i => i.id)).toEqual(['a', 'b', 'c']);
  });

  test('nested items are flattened', () => {
    const items = [
      { id: 'a' },
      { id: 'b', children: [{ id: 'b1' }, { id: 'b2' }] },
      { id: 'c' },
    ];
    expect(flatten(items).map(i => i.id)).toEqual(['a', 'b', 'b1', 'b2', 'c']);
  });
});

describe('filterNavItems', () => {
	const items = [
		{ id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }, { id: 'review', label: 'Review' }] },
		{ id: 'settings', label: 'Settings' },
	];

	test('empty query returns all', () => {
		expect(filterNavItems(items, '')).toEqual(items);
	});

	test('keeps a section when a child matches', () => {
		expect(filterNavItems(items, 'h').map((item) => item.id)).toEqual(['today']);
	});

	test('case insensitive', () => {
		expect(filterNavItems(items, 'SETTINGS').map((item) => item.id)).toEqual(['settings']);
	});

	test('no match returns empty', () => {
		expect(filterNavItems(items, 'zzz')).toEqual([]);
	});
});

describe('hasNavFilterResults', () => {
	test('treats an empty or whitespace query as the normal navigation state', () => {
		expect(hasNavFilterResults([], '')).toBe(true);
		expect(hasNavFilterResults([], '   ')).toBe(true);
	});

	test('reports a matching child as a result', () => {
		expect(hasNavFilterResults([{ id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }] }], 'h')).toBe(true);
	});

	test('reports no result for an unmatched query', () => {
		expect(hasNavFilterResults([{ id: 'today', label: 'Today' }], 'zzz')).toBe(false);
	});
});

describe('filterNavLinks', () => {
	const items = [
		{ id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }, { id: 'review', label: 'Review' }] },
		{ id: 'settings', label: 'Settings' },
	];

	test('returns the matching child link instead of its section header', () => {
		expect(filterNavLinks(items, 'h').map((item) => item.id)).toEqual(['home']);
	});

	test('keeps direct top-level links selectable', () => {
		expect(filterNavLinks(items, 'set').map((item) => item.id)).toEqual(['settings']);
	});

	test('does not duplicate favorite links in the filtered navigation list', () => {
		expect(filterNavLinks(items, 'h', new Set(['home'])).map((item) => item.id)).toEqual([]);
	});
});

describe('shouldClearNavFilter', () => {
	test('clears Escape when the filter has text', () => {
		expect(shouldClearNavFilter('Escape', 'home')).toBe(true);
	});

	test('does not intercept other keys or an empty filter', () => {
		expect(shouldClearNavFilter('Escape', '')).toBe(false);
		expect(shouldClearNavFilter('Enter', 'home')).toBe(false);
	});
});

describe('filterNavChildren', () => {
	const section = { id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }, { id: 'review', label: 'Review' }] };

	test('returns the matching child', () => {
		expect(filterNavChildren(section, 'h').map((item) => item.id)).toEqual(['home']);
	});

	test('returns all children when the section matches', () => {
		expect(filterNavChildren(section, 'today').map((item) => item.id)).toEqual(['home', 'review']);
	});
});

describe('shouldOpenNavSection', () => {
	const section = { id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }, { id: 'review', label: 'Review' }] };

	test('opens a closed section when a child matches', () => {
		expect(shouldOpenNavSection({ ...section }, 'h', new Set())).toBe(true);
	});

	test('keeps an unrelated closed section closed', () => {
		expect(shouldOpenNavSection({ ...section }, 'zzz', new Set())).toBe(false);
	});

	test('preserves an explicitly open section without a filter', () => {
		expect(shouldOpenNavSection({ ...section }, '', new Set(['today']))).toBe(true);
	});
});


import { sectionForActiveHref, sectionIds, initialOpenSections } from '../src/sections.js';
import type { NavItem } from '../src/types.js';

const NAV: NavItem[] = [
  { id: 'today', label: 'Today', children: [{ id: 'home', href: '/', label: 'Home' }, { id: 'review', href: '/review', label: 'Review' }] },
  { id: 'agents', label: 'Agents', children: [{ id: 'team', href: '/team', label: 'Team' }] },
  { id: 'analyze', label: 'Analyze', children: [{ id: 'insights', href: '/insights', label: 'Insights' }, { id: 'search', href: '/search', label: 'Search' }] },
  { id: 'settings', href: '/settings', label: 'Settings' },
];

describe('sectionIds', () => {
  test('lists only items with children', () => {
    expect(sectionIds(NAV)).toEqual(['today', 'agents', 'analyze']);
  });
});

describe('sectionForActiveHref', () => {
  test('finds the section holding the active page', () => {
    expect(sectionForActiveHref(NAV, '/insights')?.id).toBe('analyze');
  });

  test('returns null for a top-level page', () => {
    expect(sectionForActiveHref(NAV, '/settings')).toBeNull();
  });

  test('returns null for an unknown href', () => {
    expect(sectionForActiveHref(NAV, '/missing')).toBeNull();
  });

  test('returns null for an empty href', () => {
    expect(sectionForActiveHref(NAV, '')).toBeNull();
  });
});

describe('initialOpenSections', () => {
  test('every section open by default', () => {
    expect([...initialOpenSections(NAV, null)]).toEqual(['today', 'agents', 'analyze']);
  });

  test('persisted state is authoritative (user closed sections stay closed)', () => {
    expect([...initialOpenSections(NAV, ['analyze'])]).toEqual(['analyze']);
    expect([...initialOpenSections(NAV, ['today', 'agents'])]).toEqual(['today', 'agents']);
  });

  test('empty persisted list stays closed for all sections', () => {
    expect([...initialOpenSections(NAV, [])]).toEqual([]);
  });
});


import { activeSectionToForceOpen } from '../src/sections.js';

describe('activeSectionToForceOpen', () => {
  test('returns the section holding the active page when it is closed', () => {
    expect(activeSectionToForceOpen(NAV, '/insights', new Set(['today']))?.id).toBe('analyze');
  });

  test('returns null when the section is already open (no write → no loop)', () => {
    expect(activeSectionToForceOpen(NAV, '/insights', new Set(['today', 'agents', 'analyze']))).toBeNull();
  });

  test('returns null for a top-level page', () => {
    expect(activeSectionToForceOpen(NAV, '/settings', new Set())).toBeNull();
  });

  test('returns null for an empty href', () => {
    expect(activeSectionToForceOpen(NAV, '', new Set())).toBeNull();
  });
});
