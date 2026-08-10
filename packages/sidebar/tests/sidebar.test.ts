import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { filterNavChildren, filterNavItems, filterNavLinks, hasNavFilterResults, shouldClearNavFilter, shouldOpenNavSection } from '../src/filter.js';
import { nextNavFocusIndex } from '../src/keyboard.js';

const sidebarSource = readFileSync(new URL('../src/Sidebar.svelte', import.meta.url), 'utf8');
const elementSource = readFileSync(new URL('../src/SidebarElement.svelte', import.meta.url), 'utf8');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('filter control', () => {
	test('owns one accessible clear affordance', () => {
		expect(sidebarSource).toContain('type="text" role="searchbox" inputmode="search" autocomplete="off"');
		expect(sidebarSource).not.toContain('type="search"');
		expect(sidebarSource.match(/class="worn-filter-clear"/gu)?.length).toBe(1);
		expect(sidebarSource).toContain('aria-label="Clear filter"');
	});
});

describe('collapsed web component', () => {
	test('owns a visual collapsed state without removing link names', () => {
		expect(sidebarSource).toContain('title={collapsed ? item.label : undefined}');
		expect(sidebarSource).toContain('.worn-sidebar.is-collapsed {');
		expect(sidebarSource).toContain('inline-size: var(--worn-sidebar-collapsed-width, 60px);');
		expect(sidebarSource).toContain('.worn-sidebar.is-collapsed .worn-nav-label {');
		expect(sidebarSource).toContain('clip-path: inset(50%);');
		expect(sidebarSource).toContain('@media (prefers-reduced-motion: reduce)');
	});

	test('sizes the custom-element host and exposes demo control state', () => {
		expect(elementSource).toContain('class="worn-sidebar-element" class:is-collapsed={collapsed}');
		expect(elementSource).toContain('inline-size: var(--worn-sidebar-width, 240px);');
		expect(elementSource).toContain('.worn-sidebar-element.is-collapsed');
		expect(demoSource).toContain('aria-controls="sidebar-demo" aria-pressed="false">Collapse sidebar</button>');
		expect(demoSource).toContain("collapseButton.setAttribute('aria-pressed', String(collapsed));");
		expect(demoSource).toContain("collapseButton.textContent = collapsed ? 'Expand sidebar' : 'Collapse sidebar';");
	});

});

describe('standalone demo', () => {
	test('keeps the component and controls while removing documentation panels', () => {
		expect(demoSource).toContain('<h1>@wornpage/sidebar</h1>');
		expect(demoSource).toContain('<h2>Controls</h2>');
		expect(demoSource).not.toContain('Standalone web component');
		expect(demoSource).not.toContain('How to use');
		expect(demoSource).not.toContain('Bundle size');
	});
});

describe('keyboard navigation', () => {
	test('moves through bounded rendered-link indexes', () => {
		expect(nextNavFocusIndex('ArrowDown', -1, 4)).toBe(0);
		expect(nextNavFocusIndex('ArrowDown', 1, 4)).toBe(2);
		expect(nextNavFocusIndex('ArrowDown', 3, 4)).toBe(3);
		expect(nextNavFocusIndex('ArrowUp', 2, 4)).toBe(1);
		expect(nextNavFocusIndex('ArrowUp', 0, 4)).toBe(0);
		expect(nextNavFocusIndex('Home', 3, 4)).toBe(0);
		expect(nextNavFocusIndex('End', 0, 4)).toBe(3);
	});

	test('ignores non-navigation keys and empty link sets', () => {
		expect(nextNavFocusIndex('Enter', 0, 4)).toBeNull();
		expect(nextNavFocusIndex('ArrowDown', -1, 0)).toBeNull();
	});

	test('continues handling keys after focus enters rendered navigation', () => {
		expect(sidebarSource).toMatch(/onclick=\{\(e\) => handleNav\(e, item\.href\)\}\s+onkeydown=\{handleKeydown\}/u);
		expect(sidebarSource).toContain('<nav class="worn-nav" bind:this={navEl}>');
		expect(sidebarSource).toContain("querySelectorAll<HTMLAnchorElement>('[data-nav-id]')");
		expect(sidebarSource).toContain('links.findIndex((link) => link === document.activeElement)');
		expect(sidebarSource).toContain("else if (e.key === ' ' && currentIndex >= 0)");
		expect(sidebarSource).not.toContain('allVisible');
		expect(sidebarSource).not.toContain('focusedIndex');
	});
});

describe('pinned reorder controls', () => {
	test('keeps buttons outside the navigation link', () => {
		const start = sidebarSource.indexOf('{#snippet navLink');
		const end = sidebarSource.indexOf('{/snippet}', start);
		const snippet = sidebarSource.slice(start, end);
		const anchorClose = snippet.indexOf('</a>');
		const firstButton = snippet.indexOf('class="worn-reorder-btn"');

		expect(snippet).toContain('<div class="worn-nav-row" class:has-reorder={favorites.has(item.id) && favItems.length > 1}>');
		expect(anchorClose).toBeGreaterThan(0);
		expect(firstButton).toBeGreaterThan(anchorClose);
		expect(snippet).not.toContain('>▲<');
		expect(snippet).not.toContain('>▼<');
	});

	test('names visible icon controls and reserves their row space', () => {
		expect(sidebarSource).toContain('title="Move up" aria-label={`Move ${item.label} up`}');
		expect(sidebarSource).toContain('title="Move down" aria-label={`Move ${item.label} down`}');
		expect(sidebarSource).toContain('<svg viewBox="0 0 24 24" aria-hidden="true">');
		expect(sidebarSource).toContain('.worn-nav-row.has-reorder > .worn-nav-item { padding-inline-end: 72px; }');
		expect(sidebarSource).toContain('height: 28px;');
		expect(sidebarSource).toContain('width: 28px;');
		expect(sidebarSource).toContain('.worn-reorder-btn:focus-visible');
		expect(sidebarSource).not.toContain('opacity: 0; transition: opacity');
	});
});

describe('context menu', () => {
	test('uses a real control for backdrop dismissal', () => {
		expect(sidebarSource).toContain('<button type="button" class="worn-menu-backdrop" aria-label="Close menu" onclick={closeContextMenu}></button>');
		expect(sidebarSource).not.toContain('<div class="worn-menu-backdrop"');
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
