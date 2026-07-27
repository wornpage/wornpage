<script lang="ts">
	interface Props {
		href?: string;
		label: string;
		icon?: string;
		badge?: number;
		badgeVariant?: 'default' | 'danger';
		active?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: any;
	}
	let { href = '#', label, icon, badge, badgeVariant = 'default', active = false, onclick, children }: Props = $props();
</script>

<a {href} class="worn-nav-item" class:active on:click|preventDefault={onclick}>
	{#if icon}
		<span class="worn-nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html icon}</svg></span>
	{/if}
	<span class="worn-nav-label">{label}</span>
	{#if badge !== undefined && badge > 0}
		<span class="worn-nav-badge" class:is-danger={badgeVariant === 'danger'}>{badge}</span>
	{/if}
	{@render children?.()}
</a>
