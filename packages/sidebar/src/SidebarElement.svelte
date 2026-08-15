<svelte:options customElement={{ tag: 'worn-sidebar', shadow: 'none', props: { items: { type: 'Array' }, activehref: {}, collapsed: { type: 'Boolean' }, rounded: {} } }} />

<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import type { NavItem } from './types.js';

	let { items = [], activehref = '', collapsed = false, rounded = 'md' }: {
		items?: NavItem[];
		activehref?: string;
		collapsed?: boolean;
		rounded?: string;
	} = $props();

	let el: HTMLElement;

	function emit(name: string, detail: any) {
		el?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
	}
</script>

<div bind:this={el} class="worn-sidebar-element" class:is-collapsed={collapsed}>
<Sidebar
	{items}
	activeHref={activehref}
	bind:collapsed
	rounded={rounded as 'sm' | 'md' | 'lg' | 'pill'}
	onnavigate={(href) => emit('worn-nav', { href })}
	oncollapsed={(c) => emit('worn-collapse', { collapsed: c })}
/>
</div>

<style>
	:host { display: block; height: 100%; }
	.worn-sidebar-element {
		height: 100%;
		inline-size: var(--worn-sidebar-width, 240px);
		transition: inline-size 0.2s ease;
	}
	.worn-sidebar-element.is-collapsed {
		inline-size: var(--worn-sidebar-collapsed-width, 72px);
	}
	@media (prefers-reduced-motion: reduce) {
		.worn-sidebar-element { transition: none; }
	}
</style>
