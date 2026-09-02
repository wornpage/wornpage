<script lang="ts">
	import NavIconView from './NavIcon.svelte';
	import { assertSafeNavigationHref, shouldInterceptNavigationClick } from './navigation.js';
	import type { NavIcon } from './types.js';

	interface Props {
		href?: string;
		label: string;
		icon?: NavIcon;
		badge?: number;
		badgeVariant?: 'default' | 'danger';
		active?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: any;
	}
	let { href = '#', label, icon, badge, badgeVariant = 'default', active = false, onclick, children }: Props = $props();
	const validatedHref = $derived(assertSafeNavigationHref(href, 'SidebarItem href'));

	function handleClick(event: MouseEvent) {
		if (!shouldInterceptNavigationClick(event, Boolean(onclick))) return;
		event.preventDefault();
		onclick?.(event);
	}
</script>

<a href={validatedHref} class="worn-nav-item" class:active onclick={handleClick}>
	{#if icon}
		<NavIconView {icon}/>
	{/if}
	<span class="worn-nav-label">{label}</span>
	{#if badge !== undefined && badge > 0}
		<span class="worn-nav-badge" class:is-danger={badgeVariant === 'danger'}>{badge}</span>
	{/if}
	{@render children?.()}
</a>
