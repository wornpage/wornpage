<script lang="ts">
	import type { NavItem } from './types.js';
	import { sectionForActiveHref, activeSectionToForceOpen, initialOpenSections } from './sections.js';
	import { filterNavChildren, filterNavItems, hasNavFilterResults, shouldClearNavFilter, shouldOpenNavSection } from './filter.js';
	import { nextNavFocusIndex } from './keyboard.js';

	interface Props {
		items: NavItem[];
		activeHref?: string;
		collapsed?: boolean;
		rounded?: 'sm' | 'md' | 'lg' | 'pill';
		onnavigate?: (href: string) => void;
		oncollapsed?: (collapsed: boolean) => void;
	}

	let { items, activeHref = '', collapsed = $bindable(false), rounded = 'md', onnavigate, oncollapsed }: Props = $props();

	// Per-group open state — a Set of section ids, NOT one shared boolean.
	// Previously every <details> bound to the same `moreOpen`, so toggling
	// any section title flipped ALL sections open/closed together.
	let filterText = $state('');
	let favorites = $state<Set<string>>(new Set());
	let recentRoutes = $state<string[]>([]);
	let contextMenu = $state<string | null>(null);
	let filterInput: HTMLInputElement | undefined = $state();
	let navEl: HTMLElement | undefined = $state();

	// Sections default open; persisted per-section state (wornpage-sidebar-
	// open-sections) is honored, with any NEW section defaulting open; the
	// group holding the active item is forced open so the current page is
	// never hidden inside a collapsed section.
	let openSections = $state<Set<string>>(new Set());
	$effect(() => {
		try {
			const raw = localStorage.getItem('wornpage-sidebar-open-sections');
			const stored = raw ? (JSON.parse(raw) as string[]) : null;
			openSections = initialOpenSections(items, stored);
		} catch {
			openSections = new Set(items.filter((i) => i.children).map((i) => i.id));
		}
	});
	$effect(() => {
		// Force the active item's section open — but only when it is NOT
		// already open. Writing a fresh Set unconditionally here made this
		// effect depend on its own write (new Set !== old Set → re-run → write
		// again), which looped until Svelte threw effect_update_depth_exceeded
		// and the whole sidebar (and every WornReveal on the page) crashed.
		const parent = activeSectionToForceOpen(items, activeHref, openSections);
		if (parent) {
			openSections = new Set(openSections).add(parent.id);
		}
	});
	function toggleSection(id: string, open: boolean) {
		const next = new Set(openSections);
		if (open) next.add(id); else next.delete(id);
		openSections = next;
	}
	$effect(() => {
		try { localStorage.setItem('wornpage-sidebar-open-sections', JSON.stringify([...openSections])); } catch {}
	});

	$effect(() => {
		const path = activeHref;
		if (!path || path === '/' || path === recentRoutes[0]) return;
		try {
			const stored = JSON.parse(localStorage.getItem('wornpage-sidebar-recent') || '[]');
			recentRoutes = [path, ...stored.filter((r: string) => r !== path)].slice(0, 5);
			localStorage.setItem('wornpage-sidebar-recent', JSON.stringify(recentRoutes));
		} catch {}
	});

	$effect(() => {
		try {
			const raw = localStorage.getItem('wornpage-sidebar-favorites');
			if (raw) favorites = new Set(JSON.parse(raw));
		} catch {}
		try {
			const r = localStorage.getItem('wornpage-sidebar-recent');
			if (r) recentRoutes = JSON.parse(r);
		} catch {}
		try {
			// Migrate the legacy single "more-open" flag: '0' meant every
			// section was collapsed. New per-section state lives under
			// wornpage-sidebar-open-sections (read above); only apply the old
			// flag when the new key was never written.
			const v = localStorage.getItem('wornpage-sidebar-more-open');
			const hasNew = localStorage.getItem('wornpage-sidebar-open-sections') !== null;
			if (v === '0' && !hasNew) {
				openSections = new Set();
			}
		} catch {}
	});

	function saveFavorites(set: Set<string>) {
		try { localStorage.setItem('wornpage-sidebar-favorites', JSON.stringify([...set])); } catch {}
	}

	function toggleFavorite(id: string) {
		const next = new Set(favorites);
		if (next.has(id)) next.delete(id); else next.add(id);
		favorites = next;
		saveFavorites(next);
	}

	function moveFavorite(id: string, delta: number) {
		const arr = [...favorites];
		const idx = arr.indexOf(id);
		if (idx < 0) return;
		const newIdx = idx + delta;
		if (newIdx < 0 || newIdx >= arr.length) return;
		[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
		favorites = new Set(arr);
		saveFavorites(favorites);
	}

	function showContextMenu(e: MouseEvent, id: string) {
		e.preventDefault();
		contextMenu = id;
	}
	function closeContextMenu() { contextMenu = null; }
	function hideItem(id: string) {
		const next = new Set(favorites);
		next.delete(id);
		favorites = next;
		saveFavorites(next);
		recentRoutes = recentRoutes.filter(r => r !== '/' + id);
		closeContextMenu();
	}
	function resetAll() {
		favorites = new Set(); saveFavorites(new Set()); recentRoutes = [];
		try { localStorage.removeItem('wornpage-sidebar-recent'); } catch {}
		closeContextMenu();
	}

	function flatten(items: NavItem[]): NavItem[] {
		const result: NavItem[] = [];
		for (const item of items) {
			result.push(item);
			if (item.children) result.push(...flatten(item.children));
		}
		return result;
	}

	const flatItems = $derived(flatten(items));
	const favItems = $derived(flatItems.filter(i => favorites.has(i.id) && (!filterText || i.label.toLowerCase().includes(filterText.toLowerCase()))));

	const topLevel = $derived(filterNavItems(items, filterText));
	const recentItems = $derived(
		recentRoutes
			.map(href => flatItems.find(i => i.href === href))
			.filter(Boolean) as NavItem[]
	);

	const attentionItems = $derived(flatItems.filter(i => i.attention || (i.badge && i.badge > 0)));

	const relatedItems = $derived(
		activeHref
			? flatItems.filter(i => {
					const active = flatItems.find(f => f.href === activeHref);
					return active && i.relatedTo?.includes(active.id);
				})
			: []
	);

	function handleKeydown(e: KeyboardEvent) {
		if (shouldClearNavFilter(e.key, filterText)) {
			e.preventDefault();
			filterText = '';
			filterInput?.focus();
			return;
		}

		const links = Array.from(navEl?.querySelectorAll<HTMLAnchorElement>('[data-nav-id]') ?? []);
		const currentIndex = links.findIndex((link) => link === document.activeElement);
		const nextIndex = nextNavFocusIndex(e.key, currentIndex, links.length);
		if (nextIndex !== null) {
			e.preventDefault();
			links[nextIndex]?.focus();
		} else if (e.key === ' ' && currentIndex >= 0) {
			e.preventDefault();
			links[currentIndex]?.click();
		}
	}

	function handleNav(e: MouseEvent, href?: string) {
		e.preventDefault(); if (href) onnavigate?.(href);
	}

	function isActive(item: NavItem): boolean {
		return item.href ? activeHref === item.href : false;
	}

	function handleCollapse() { collapsed = !collapsed; oncollapsed?.(collapsed); }

</script>

{#snippet navLink(item: NavItem)}
	<div class="worn-nav-row" class:has-reorder={favorites.has(item.id) && favItems.length > 1}>
		<a href={item.href || '#'} class="worn-nav-item" class:active={isActive(item)} class:is-context-anchor={contextMenu === item.id} data-nav-id={item.id}
			aria-current={isActive(item) ? 'page' : undefined}
			title={collapsed ? item.label : undefined}
			onclick={(e) => handleNav(e, item.href)}
			onkeydown={handleKeydown}
			oncontextmenu={(e) => showContextMenu(e, item.id)}
		>
			{#if item.icon}
				<span class="worn-nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html item.icon}</svg></span>
			{/if}
			<span class="worn-nav-label">{item.label}</span>
			{#if item.badge !== undefined && item.badge > 0}
				<span class="worn-nav-badge" class:is-danger={item.badgeVariant === 'danger'} class:is-warning={item.badgeVariant === 'warning'}>{item.badge}</span>
			{/if}
		</a>
		{#if favorites.has(item.id) && favItems.length > 1}
			<span class="worn-nav-reorder">
				{#if favItems.indexOf(item) > 0}
					<button type="button" class="worn-reorder-btn" onclick={() => moveFavorite(item.id, -1)} title="Move up" aria-label={`Move ${item.label} up`}>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
					</button>
				{/if}
				{#if favItems.indexOf(item) < favItems.length - 1}
					<button type="button" class="worn-reorder-btn" onclick={() => moveFavorite(item.id, 1)} title="Move down" aria-label={`Move ${item.label} down`}>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19 12-7 7-7-7"></path><path d="M12 5v14"></path></svg>
					</button>
				{/if}
			</span>
		{/if}
	</div>
{/snippet}

<div class="worn-sidebar" class:is-collapsed={collapsed} data-radius={rounded}>
<div class="worn-sidebar-filter">
	<input type="text" role="searchbox" inputmode="search" autocomplete="off" class="worn-filter-input" placeholder="Filter…" aria-label="Filter navigation" bind:this={filterInput} bind:value={filterText} onkeydown={handleKeydown} />
	{#if filterText}<button type="button" class="worn-filter-clear" onclick={() => filterText = ''} aria-label="Clear filter">×</button>{/if}
</div>

<nav class="worn-nav" bind:this={navEl}>
	<div class="worn-active-indicator"></div>
	{#if filterText.trim() && !hasNavFilterResults(items, filterText)}
		<div class="worn-filter-empty" role="status">No matches</div>
	{/if}

	{#if recentItems.length > 0 && !filterText}
		<div class="worn-section-label">Recent</div>
		{#each recentItems.slice(0, 3) as item (item.id)}{@render navLink(item)}{/each}
		<div class="worn-section-divider"></div>
	{/if}

	{#if attentionItems.length > 0 && !filterText}
		<div class="worn-section-label">Needs attention</div>
		{#each attentionItems.slice(0, 3) as item (item.id)}{@render navLink(item)}{/each}
		<div class="worn-section-divider"></div>
	{/if}

	{#if relatedItems.length > 0 && !filterText}
		<div class="worn-section-label">You might want</div>
		{#each relatedItems.slice(0, 3) as item (item.id)}{@render navLink(item)}{/each}
		<div class="worn-section-divider"></div>
	{/if}

	{#if favItems.length > 0}
		<div class="worn-section-label">Pinned</div>
		{#each favItems as item (item.id)}{@render navLink(item)}{/each}
		<div class="worn-section-divider"></div>
	{/if}

	{#each topLevel.filter(i => !favorites.has(i.id)) as item (item.id)}
		{#if item.children}
			<details class="worn-nav-group" open={shouldOpenNavSection(item, filterText, openSections)} ontoggle={(e) => toggleSection(item.id, (e.currentTarget as HTMLDetailsElement).open)}>
				<summary class="worn-nav-item worn-nav-summary" class:active={sectionForActiveHref(items, activeHref)?.id === item.id}><span class="worn-nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></span><span class="worn-nav-label">{item.label}</span></summary>
				{#each filterNavChildren(item, filterText).filter(c => !favorites.has(c.id)) as child (child.id)}
					{@render navLink(child)}
				{/each}
			</details>
		{:else}
			{@render navLink(item)}
		{/if}
	{/each}
</nav>

{#if contextMenu}
	<button type="button" class="worn-menu-backdrop" aria-label="Close menu" onclick={closeContextMenu}></button>
	<div class="worn-context-menu">
		<button type="button" onclick={() => { toggleFavorite(contextMenu); closeContextMenu(); }}>{favorites.has(contextMenu) ? '📌 Unpin' : '📌 Pin'}</button>
		<button type="button" onclick={() => hideItem(contextMenu)}>👁 Hide</button>
		<button type="button" onclick={resetAll}>🔄 Reset all</button>
	</div>
{/if}

</div>

<style>
	.worn-sidebar {
		inline-size: 100%;
		min-inline-size: 0;
		overflow-x: hidden;
		transition: inline-size 0.2s ease;
	}
	.worn-sidebar.is-collapsed {
		inline-size: var(--worn-sidebar-collapsed-width, 60px);
	}
	.worn-sidebar.is-collapsed .worn-sidebar-filter,
	.worn-sidebar.is-collapsed .worn-nav-badge,
	.worn-sidebar.is-collapsed .worn-nav-reorder,
	.worn-sidebar.is-collapsed .worn-section-label,
	.worn-sidebar.is-collapsed .worn-section-divider {
		display: none;
	}
	.worn-sidebar.is-collapsed .worn-nav-label {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	.worn-sidebar.is-collapsed .worn-nav-item {
		gap: 0;
		justify-content: center;
		padding-inline: 6px;
	}
	.worn-sidebar.is-collapsed .worn-nav-group > .worn-nav-row > .worn-nav-item {
		padding-inline: 6px;
	}
	.worn-sidebar.is-collapsed .worn-nav-icon { margin: 0; }

	.worn-sidebar-filter { position: relative; margin: 4px 8px 8px; }
	.worn-filter-input {
		width: 100%; padding: 6px 28px 6px 10px;
		border: 1px solid var(--worn-sidebar-border, var(--cockpit-border, #ddd));
		border-radius: 6px;
		background: var(--worn-sidebar-bg, var(--cockpit-bg, #f5f5f5));
		color: var(--worn-sidebar-text, var(--cockpit-text, #000));
		font: inherit; font-size: 12px;
		box-sizing: border-box;
	}
	.worn-filter-input:focus { outline: 2px dashed var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488)); outline-offset: -2px; }
	.worn-filter-clear {
		position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
		background: none; border: 0;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		cursor: pointer; font-size: 16px; padding: 2px 6px; line-height: 1;
	}
	.worn-filter-empty {
		padding: 12px;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		font-size: 12px;
		text-align: center;
	}

	.worn-nav { position: relative; }
	.worn-nav-item {
		display: flex; align-items: center; gap: 8px;
		padding: 6px 12px;
		border-radius: var(--worn-nav-radius, 8px);
		color: var(--worn-sidebar-text, var(--cockpit-text, #000));
		text-decoration: none;
		font-size: 13px;
		position: relative;
		cursor: pointer;
		min-height: 36px;
	}
	.worn-nav-row { position: relative; }
	.worn-nav-row > .worn-nav-item { box-sizing: border-box; width: 100%; }
	.worn-nav-row.has-reorder > .worn-nav-item { padding-inline-end: 72px; }
	.worn-nav-item:hover { background: var(--worn-sidebar-hover, var(--cockpit-hover-bg, rgba(0,0,0,0.05))); }
	.worn-nav-item.active {
		background: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
		color: var(--worn-sidebar-accent-text, var(--cockpit-accent-text, #fff));
		anchor-name: --worn-active-item;
	}
	.worn-nav-item.is-context-anchor { anchor-name: --worn-ctx; }
	.worn-sidebar[data-radius="sm"] { --worn-nav-radius: 4px; }
	.worn-sidebar[data-radius="md"] { --worn-nav-radius: 8px; }
	.worn-sidebar[data-radius="lg"] { --worn-nav-radius: 12px; }
	.worn-sidebar[data-radius="pill"] { --worn-nav-radius: 999px; }
	.worn-nav-icon { flex-shrink: 0; display: flex; }
	.worn-nav-icon svg { display: block; }
	.worn-nav-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

	.worn-nav-badge {
		display: inline-flex; align-items: center; justify-content: center;
		min-width: 16px; height: 16px; padding: 0 5px;
		border-radius: 8px;
		background: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
		color: var(--worn-sidebar-accent-text, var(--cockpit-accent-text, #fff));
		font-size: 9px; font-weight: 700; line-height: 16px;
		text-align: center;
	}
	.worn-nav-badge.is-danger { background: var(--worn-sidebar-danger, var(--cockpit-danger-text, #e74c3c)); color: #fff; }
	.worn-nav-badge.is-warning { background: var(--worn-sidebar-warning, var(--cockpit-warning-text, #d97706)); color: #fff; }

	.worn-section-label {
		font-size: 9px; font-weight: 600; text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		padding: 4px 12px 2px;
	}
	.worn-section-divider { height: 1px; background: var(--worn-sidebar-border, var(--cockpit-border, #ddd)); margin: 4px 8px; }

	.worn-nav-summary {
		font-weight: 600;
		/* The summary is the SECTION TITLE, not a child row: it stays flush
		   with the base 12px padding instead of inheriting the child indent.
		   (Previously .worn-nav-group > .worn-nav-item set 24px on BOTH the
		   summary and its children, so section titles sat at the same indent
		   as the rows inside them.) */
		padding-left: 12px;
	}
	.worn-nav-group { border-top: 1px solid var(--worn-sidebar-border, var(--cockpit-border, #ddd)); margin-top: 4px; padding-top: 4px; }
	.worn-nav-group > .worn-nav-row > .worn-nav-item { padding-left: 24px; }

	/* Section title selected state: the summary highlights when the group is
	   open (the arrow row the user clicked) or holds the active page. The
	   chevron rotates to point at the expanded children. */
	.worn-nav-group > .worn-nav-summary.active {
		background: var(--worn-sidebar-hover, var(--cockpit-hover-bg, rgba(0,0,0,0.05)));
		color: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
	}
	.worn-nav-group > .worn-nav-summary .worn-nav-icon { transition: transform 0.18s var(--worn-ease, ease); }
	.worn-nav-group[open] > .worn-nav-summary .worn-nav-icon { transform: rotate(90deg); }

	.worn-active-indicator {
		position: absolute; left: 2px; width: calc(100% - 4px);
		position-anchor: --worn-active-item;
		top: anchor(--worn-active-item top);
		height: anchor(--worn-active-item height);
		background: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
		border-radius: 999px;
		transition: opacity 0.15s ease;
		pointer-events: none; z-index: 0; opacity: 0;
	}
	.worn-sidebar:not(.is-collapsed) .worn-nav:has(.worn-nav-item.active) .worn-active-indicator {
		opacity: 0.15;
	}

	.worn-nav-reorder {
		align-items: center;
		display: flex;
		gap: 2px;
		inset-inline-end: 8px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.worn-reorder-btn {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 4px;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		cursor: pointer;
		display: inline-flex;
		height: 28px;
		justify-content: center;
		padding: 0;
		width: 28px;
	}
	.worn-reorder-btn:hover { background: var(--worn-sidebar-hover, var(--cockpit-hover-bg, rgba(0,0,0,0.05))); color: var(--worn-sidebar-text, var(--cockpit-text, #000)); }
	.worn-reorder-btn:focus-visible { outline: 2px dashed var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488)); outline-offset: 1px; }
	.worn-reorder-btn svg { fill: none; height: 14px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; width: 14px; }
	.worn-nav-row:has(.worn-nav-item.active) .worn-reorder-btn { color: var(--worn-sidebar-accent-text, var(--cockpit-accent-text, #fff)); }

	.worn-menu-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: transparent;
		border: 0;
		padding: 0;
	}
	.worn-context-menu {
		position: fixed; z-index: 101;
		position-anchor: --worn-ctx;
		left: anchor(right);
		top: anchor(bottom);
		background: var(--worn-sidebar-surface, var(--cockpit-surface, #fff));
		border: 1px solid var(--worn-sidebar-border, var(--cockpit-border, #ddd));
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		min-width: 140px; overflow: hidden;
		transform: translate(4px, 4px);
	}
	.worn-context-menu button {
		display: flex; align-items: center; gap: 8px;
		width: 100%; padding: 8px 12px;
		border: 0; background: transparent;
		color: var(--worn-sidebar-text, var(--cockpit-text, #000));
		font: inherit; font-size: 12px;
		cursor: pointer; text-align: left; min-height: 36px;
	}
	.worn-context-menu button:hover { background: var(--worn-sidebar-hover, var(--cockpit-hover-bg, rgba(0,0,0,0.05))); }

	@media (prefers-reduced-motion: reduce) {
		.worn-sidebar { transition: none; }
	}
</style>
