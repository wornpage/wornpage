import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { filterNavChildren, filterNavItems, filterNavLinks, hasNavFilterResults, shouldClearNavFilter, shouldOpenNavSection } from '../src/filter.js';
import { nextNavFocusIndex } from '../src/keyboard.js';
import { shouldInterceptNavigationClick } from '../src/navigation.js';
import { visibleNavItems } from '../src/visibility.js';
import { filterTransientNavItems, selectCurrentPagePlacement } from '../src/shortcuts.js';

const sidebarSource = readFileSync(new URL('../src/Sidebar.svelte', import.meta.url), 'utf8');
const itemSource = readFileSync(new URL('../src/SidebarItem.svelte', import.meta.url), 'utf8');
const elementSource = readFileSync(new URL('../src/SidebarElement.svelte', import.meta.url), 'utf8');
const elementsEntrySource = readFileSync(new URL('../src/elements.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('current page placement', () => {
	const shortcuts = [
		{ id: 'review', href: '/review', label: 'Review', attention: true },
		{ id: 'inbox', href: '/inbox', label: 'Inbox', attention: true },
		{ id: 'tasks', href: '/tasks', label: 'Tasks', attention: true },
		{ id: 'calendar', href: '/calendar', label: 'Calendar', attention: true },
	];

	test('excludes the active route from every transient group before limiting', () => {
		expect(filterTransientNavItems(shortcuts, '/review', 3).map((item) => item.href)).toEqual([
			'/inbox',
			'/tasks',
			'/calendar',
		]);
	});

	test('backfills a transient group after excluding the active item', () => {
		expect(filterTransientNavItems(shortcuts, '/inbox', 3).map((item) => item.href)).toEqual([
			'/review',
			'/tasks',
			'/calendar',
		]);
	});

	test('selects the active item from exactly one durable group', () => {
		expect(selectCurrentPagePlacement(shortcuts, '/review', new Set())).toEqual({
			item: shortcuts[0],
			group: 'canonical',
		});
		expect(selectCurrentPagePlacement(shortcuts, '/review', new Set(['review']))).toEqual({
			item: shortcuts[0],
			group: 'pinned',
		});
		expect(selectCurrentPagePlacement(shortcuts, '/missing', new Set(['review']))).toBeNull();
	});

	test('does not change keyboard or search behavior for rendered navigation', () => {
		expect(nextNavFocusIndex('ArrowDown', 1, 3)).toBe(2);
		expect(filterNavItems(shortcuts, 'review').map((item) => item.id)).toEqual(['review']);
	});

	test('uses the shared placement contract and keeps transient links inactive', () => {
		expect(sidebarSource).toContain("import { filterTransientNavItems, selectCurrentPagePlacement } from './shortcuts.js';");
		expect(sidebarSource).toContain('const currentPage = $derived(selectCurrentPagePlacement(flatItems, activeHref, favorites));');
		expect(sidebarSource).toContain("@render navLink(item, isCurrentPage(item, 'pinned'))");
		expect(sidebarSource.match(/isCurrentPage\((?:child|item), 'canonical'\)/gu)?.length).toBe(2);
		expect(sidebarSource.match(/@render navLink\(item, false\)/gu)?.length).toBe(3);
		expect(demoSource).toContain("sb.activehref = '#review';");
		expect(demoSource).toContain('sb.activehref = e.detail.href;');
	});
});

describe('filter control', () => {
	test('owns one accessible clear affordance', () => {
		expect(sidebarSource).toContain('type="text" role="searchbox" inputmode="search" autocomplete="off"');
		expect(sidebarSource).not.toContain('type="search"');
		expect(sidebarSource.match(/class="worn-filter-clear"/gu)?.length).toBe(1);
		expect(sidebarSource).toContain('aria-label="Clear filter"');
		expect(sidebarSource).toContain('favorites.has(i.id) && matchesNavItem(i, filterText)');
	});
});

describe('collapsed web component', () => {
	test('owns a visual collapsed state without removing link names', () => {
		expect(sidebarSource).toContain('title={collapsed ? item.label : undefined}');
		expect(sidebarSource).toContain('.worn-sidebar.is-collapsed {');
		expect(sidebarSource).toContain('inline-size: var(--worn-sidebar-collapsed-width, 72px);');
		expect(sidebarSource).toContain('overflow-x: clip;');
		expect(sidebarSource).not.toContain('overflow-x: hidden;');
		expect(sidebarSource).toContain('.worn-sidebar.is-collapsed .worn-nav-label {');
		expect(sidebarSource).toContain('clip-path: inset(50%);');
		expect(sidebarSource).toContain('inline-size: var(--worn-sidebar-collapsed-item-size, 44px);');
		expect(sidebarSource).toContain('margin-inline: auto;');
		expect(sidebarSource).toContain('@media (prefers-reduced-motion: reduce)');
	});

	test('sizes the custom-element host and exposes demo control state', () => {
		expect(elementSource).toContain('class="worn-sidebar-element" class:is-collapsed={collapsed}');
		expect(elementSource).toContain('inline-size: var(--worn-sidebar-width, 240px);');
		expect(elementSource).toContain('.worn-sidebar-element.is-collapsed');
		expect(elementSource).toContain('inline-size: var(--worn-sidebar-collapsed-width, 72px);');
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

describe('consumer layout', () => {
	test('lets expanded rows fill available width and bounds collapsed rows away from scrollbars', () => {
		expect(sidebarSource).toContain('.worn-nav-row > .worn-nav-item {');
		expect(sidebarSource).toContain('inline-size: auto;');
		expect(sidebarSource).not.toContain('.worn-nav-row > .worn-nav-item { box-sizing: border-box; width: 100%; }');
	});
});

describe('package entrypoints', () => {
	test('keeps the custom-element wrapper out of the Svelte consumer entry', () => {
		expect(indexSource).toContain("export { default as Sidebar } from './Sidebar.svelte';");
		expect(indexSource).not.toContain('SidebarElement');
		expect(elementsEntrySource).toBe("import './SidebarElement.svelte';\n");
		expect(viteSource).toContain("entry: 'src/elements.ts'");
		expect(viteSource).toContain("customElement: filename.endsWith('Element.svelte')");
		expect(viteSource).not.toContain('customElement: true');
	});

	test('uses the Svelte 5 click property while preserving native link gestures', () => {
		expect(itemSource).toContain('function handleClick(event: MouseEvent)');
		expect(itemSource).toContain('if (!shouldInterceptNavigationClick(event, Boolean(onclick))) return;');
		expect(itemSource).toContain('event.preventDefault();');
		expect(itemSource).toContain('onclick?.(event);');
		expect(itemSource).toContain('onclick={handleClick}');
		expect(itemSource).not.toContain('on:click');
	});
});

describe('native link interactions', () => {
	const click = (overrides: Partial<Parameters<typeof shouldInterceptNavigationClick>[0]> = {}) => ({
		altKey: false,
		button: 0,
		ctrlKey: false,
		defaultPrevented: false,
		metaKey: false,
		shiftKey: false,
		...overrides,
	});

	test('intercepts only a plain primary click with a navigation handler', () => {
		expect(shouldInterceptNavigationClick(click(), true)).toBe(true);
		expect(shouldInterceptNavigationClick(click(), false)).toBe(false);
		expect(shouldInterceptNavigationClick(click({ defaultPrevented: true }), true)).toBe(false);
		expect(shouldInterceptNavigationClick(click({ button: 1 }), true)).toBe(false);
	});

	test('leaves modified anchor gestures to the browser', () => {
		for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const) {
			expect(shouldInterceptNavigationClick(click({ [modifier]: true }), true)).toBe(false);
		}
		expect(sidebarSource).toContain('if (!href || !shouldInterceptNavigationClick(e, Boolean(onnavigate))) return;');
		expect(sidebarSource).toMatch(/e\.preventDefault\(\);\s*onnavigate\?\.\(href\);/u);
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

describe('keyboard focus', () => {
	test('owns one high-contrast focus token across every sidebar control', () => {
		const focusToken = 'var(--worn-sidebar-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)))';
		expect(sidebarSource.match(new RegExp(`outline: 2px dashed ${focusToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'))).toHaveLength(4);
		expect(sidebarSource).toContain('.worn-filter-input:focus-visible');
		expect(sidebarSource).not.toContain('.worn-filter-input:focus {');
		expect(sidebarSource).toContain('.worn-nav-item:focus-visible');
		expect(sidebarSource).toContain('.worn-sidebar-restore:focus-visible');
		expect(sidebarSource).toContain('.worn-reorder-btn:focus-visible');
		expect(readFileSync(new URL('../README.md', import.meta.url), 'utf8')).toContain('--worn-sidebar-focus');
	});

	test('keeps interactive controls touch-safe on coarse pointers', () => {
		expect(sidebarSource).toMatch(/@media \(pointer: coarse\) \{[\s\S]*?\.worn-filter-input,[\s\S]*?\.worn-filter-clear,[\s\S]*?\.worn-nav-item,[\s\S]*?\.worn-sidebar-restore,[\s\S]*?\.worn-reorder-btn,[\s\S]*?\.worn-context-menu button \{[\s\S]*?min-block-size: 44px;/u);
		expect(sidebarSource).toMatch(/@media \(pointer: coarse\) \{[\s\S]*?\.worn-nav-row\.has-reorder > \.worn-nav-item \{[\s\S]*?padding-inline-end: 104px;/u);
	});
});

describe('context menu', () => {
	test('uses a real control for backdrop dismissal', () => {
		expect(sidebarSource).toContain('<button type="button" class="worn-menu-backdrop" aria-label="Close menu" onclick={closeContextMenu}></button>');
		expect(sidebarSource).not.toContain('<div class="worn-menu-backdrop"');
		expect(sidebarSource).toContain('Hide from sidebar');
		expect(sidebarSource).toContain('Reset shortcuts');
		expect(sidebarSource).not.toContain('📌');
		expect(sidebarSource).not.toContain('👁');
		expect(sidebarSource).not.toContain('🔄');
	});
});

describe('hidden navigation', () => {
	test('removes hidden routes and any group left without visible children', () => {
		const items = [
			{ id: 'today', label: 'Today', children: [{ id: 'home', label: 'Home' }, { id: 'review', label: 'Review' }] },
			{ id: 'settings', label: 'Settings' }
		];

		expect(visibleNavItems(items, new Set(['home']))).toEqual([
			{ id: 'today', label: 'Today', children: [{ id: 'review', label: 'Review' }] },
			{ id: 'settings', label: 'Settings' }
		]);
		expect(visibleNavItems(items, new Set(['home', 'review']))).toEqual([{ id: 'settings', label: 'Settings' }]);
	});

	test('keeps the canonical hierarchy untouched when nothing is hidden', () => {
		const items = [{ id: 'home', label: 'Home' }];
		expect(visibleNavItems(items, new Set())).toEqual(items);
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

	test('matches non-visible search keywords', () => {
		expect(filterNavItems([{ id: 'start', label: 'Start', keywords: ['Home'] }], 'h').map((item) => item.id)).toEqual(['start']);
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

	test('keeps keyword matches selectable', () => {
		expect(filterNavLinks([{ id: 'start', label: 'Start', keywords: ['Home'] }], 'home').map((item) => item.id)).toEqual(['start']);
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
