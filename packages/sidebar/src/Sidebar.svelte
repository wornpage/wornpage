<script lang="ts">
	import type { NavItem } from './types.js';

	interface Props {
		items: NavItem[];
		activeHref?: string;
		collapsed?: boolean;
		rounded?: 'sm' | 'md' | 'lg' | 'pill';
		onnavigate?: (href: string) => void;
		oncollapsed?: (collapsed: boolean) => void;
	}

	let { items, activeHref = '', collapsed = $bindable(false), rounded = 'md', onnavigate, oncollapsed }: Props = $props();

	let moreOpen = $state(true);
	let filterText = $state('');
	let focusedIndex = $state(-1);
	let favorites = $state<Set<string>>(new Set());
	let recentRoutes = $state<string[]>([]);
	let contextMenu = $state<{ x: number; y: number; id: string } | null>(null);
	let indicatorEl: HTMLDivElement | undefined = $state();
	let contextMenuEl: HTMLDivElement | undefined = $state();

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
			const v = localStorage.getItem('wornpage-sidebar-more-open');
			if (v === '0') moreOpen = false;
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
		contextMenu = { x: e.clientX, y: e.clientY, id };
	}
	function closeContextMenu() { contextMenu = null; }
	// Set CSS custom properties for context menu positioning (CSP-safe)
	$effect(() => {
		if (contextMenu && contextMenuEl) {
			contextMenuEl.style.setProperty('--worn-cm-x', `${contextMenu.x}px`);
			contextMenuEl.style.setProperty('--worn-cm-y', `${contextMenu.y}px`);
		}
	});
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

	function filterList(list: NavItem[]): NavItem[] {
		if (!filterText) return list;
		const q = filterText.toLowerCase();
		return list.filter(i => i.label.toLowerCase().includes(q));
	}

	const topLevel = $derived(filterList(items));
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

	const allVisible = $derived([
		...favItems,
		...topLevel.filter(i => !favorites.has(i.id) && !i.children),
		...(moreOpen ? topLevel.filter(i => !favorites.has(i.id) && i.children) : []),
	]);

	function handleKeydown(e: KeyboardEvent) {
		const len = allVisible.length;
		if (len === 0) return;
		if (e.key === 'ArrowDown') { e.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, len - 1); focusItem(focusedIndex); }
		else if (e.key === 'ArrowUp') { e.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0); focusItem(focusedIndex); }
		else if (e.key === 'Home') { e.preventDefault(); focusedIndex = 0; focusItem(0); }
		else if (e.key === 'End') { e.preventDefault(); focusedIndex = len - 1; focusItem(len - 1); }
		else if ((e.key === 'Enter' || e.key === ' ') && focusedIndex >= 0) { e.preventDefault(); const item = allVisible[focusedIndex]; if (item?.href) onnavigate?.(item.href); }
	}

	function focusItem(index: number) {
		const el = navEl?.querySelectorAll<HTMLAnchorElement>('[data-nav-id]')[index];
		el?.focus();
	}

	function handleNav(e: MouseEvent, href?: string) {
		e.preventDefault(); if (href) onnavigate?.(href);
	}

	function isActive(item: NavItem): boolean {
		return item.href ? activeHref === item.href : false;
	}

	function handleCollapse() { collapsed = !collapsed; oncollapsed?.(collapsed); }

	let navEl: HTMLElement | undefined = $state();

	$effect(() => {
		const radii: Record<string, string> = { sm: '4px', md: '8px', lg: '12px', pill: '999px' };
		try { document.documentElement.style.setProperty('--worn-nav-radius', radii[rounded] || '8px'); } catch {}
	});

	function updateIndicator() {
		if (!navEl || !indicatorEl || collapsed) { return; }
		const active = navEl.querySelector<HTMLElement>('.worn-nav-item.active');
		if (active) {
			const navRect = navEl.getBoundingClientRect();
			const rect = active.getBoundingClientRect();
			indicatorEl.style.setProperty('--worn-indicator-top', `${rect.top - navRect.top}px`);
			indicatorEl.style.setProperty('--worn-indicator-height', `${rect.height}px`);
		}
	}

	$effect(() => { activeHref; collapsed; requestAnimationFrame(() => updateIndicator()); });
</script>

{#snippet navLink(item: NavItem)}
	<a href={item.href || '#'} class="worn-nav-item" class:active={isActive(item)} data-nav-id={item.id}
		aria-current={isActive(item) ? 'page' : undefined}
		onclick={(e) => handleNav(e, item.href)}
		oncontextmenu={(e) => showContextMenu(e, item.id)}
	>
		{#if item.icon}
			<span class="worn-nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html item.icon}</svg></span>
		{/if}
		<span class="worn-nav-label">{item.label}</span>
		{#if item.badge !== undefined && item.badge > 0}
			<span class="worn-nav-badge" class:is-danger={item.badgeVariant === 'danger'}>{item.badge}</span>
		{/if}
		{#if favorites.has(item.id)}
			<span class="worn-nav-reorder">
				{#if favItems.indexOf(item) > 0}
					<button type="button" class="worn-reorder-btn" onclick={(e) => { e.stopPropagation(); e.preventDefault(); moveFavorite(item.id, -1); }} title="Move up">▲</button>
				{/if}
				{#if favItems.indexOf(item) < favItems.length - 1}
					<button type="button" class="worn-reorder-btn" onclick={(e) => { e.stopPropagation(); e.preventDefault(); moveFavorite(item.id, 1); }} title="Move down">▼</button>
				{/if}
			</span>
		{/if}
	</a>
{/snippet}

<div class="worn-sidebar" class:is-collapsed={collapsed}>
<div class="worn-sidebar-filter">
	<input type="search" class="worn-filter-input" placeholder="Filter…" bind:value={filterText} onkeydown={handleKeydown} />
	{#if filterText}<button type="button" class="worn-filter-clear" onclick={() => filterText = ''} aria-label="Clear filter">×</button>{/if}
</div>

<nav class="worn-nav" bind:this={navEl}>
	<div class="worn-active-indicator" bind:this={indicatorEl}
	style="top: var(--worn-indicator-top); height: var(--worn-indicator-height);"></div>

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
			<details class="worn-nav-group" bind:open={moreOpen}>
				<summary class="worn-nav-item worn-nav-summary"><span class="worn-nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></span><span class="worn-nav-label">{item.label}</span></summary>
				{#each filterList(item.children).filter(c => !favorites.has(c.id)) as child (child.id)}
					{@render navLink(child)}
				{/each}
			</details>
		{:else}
			{@render navLink(item)}
		{/if}
	{/each}
</nav>

{#if contextMenu}
	<div class="worn-menu-backdrop" onclick={closeContextMenu}></div>
	<div class="worn-context-menu" bind:this={contextMenuEl}
	style="left: var(--worn-cm-x, 0px); top: var(--worn-cm-y, 0px)">
		<button type="button" onclick={() => { toggleFavorite(contextMenu.id); closeContextMenu(); }}>{favorites.has(contextMenu.id) ? '📌 Unpin' : '📌 Pin'}</button>
		<button type="button" onclick={() => hideItem(contextMenu.id)}>👁 Hide</button>
		<button type="button" onclick={resetAll}>🔄 Reset all</button>
	</div>
{/if}

</div>

<style>
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
	.worn-nav-item:hover { background: var(--worn-sidebar-hover, var(--cockpit-hover-bg, rgba(0,0,0,0.05))); }
	.worn-nav-item.active {
		background: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
		color: var(--worn-sidebar-accent-text, var(--cockpit-accent-text, #fff));
	}
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

	.worn-section-label {
		font-size: 9px; font-weight: 600; text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		padding: 4px 12px 2px;
	}
	.worn-section-divider { height: 1px; background: var(--worn-sidebar-border, var(--cockpit-border, #ddd)); margin: 4px 8px; }

	.worn-nav-summary { font-weight: 600; }
	.worn-nav-group { border-top: 1px solid var(--worn-sidebar-border, var(--cockpit-border, #ddd)); margin-top: 4px; padding-top: 4px; }
	.worn-nav-group > .worn-nav-item { padding-left: 24px; }

	.worn-active-indicator {
		position: absolute; left: 2px; width: calc(100% - 4px);
		background: var(--worn-sidebar-accent, var(--cockpit-accent, #0d9488));
		border-radius: 999px;
		transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
		pointer-events: none; z-index: 0; opacity: 0;
	}
	.worn-active-indicator[style*="--worn-indicator-top"] {
		opacity: 0.15;
	}

	.worn-reorder-btn {
		background: none; border: 0;
		color: var(--worn-sidebar-text-muted, var(--cockpit-text-muted, #666));
		cursor: pointer; font-size: 8px; padding: 2px;
		opacity: 0; transition: opacity 0.15s;
		min-height: unset; line-height: 1;
	}
	.worn-nav-item:hover .worn-reorder-btn { opacity: 0.7; }
	.worn-nav-item:hover .worn-reorder-btn:hover { opacity: 1; }

	.worn-menu-backdrop { position: fixed; inset: 0; z-index: 100; }
	.worn-context-menu {
		position: fixed; z-index: 101;
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
</style>
