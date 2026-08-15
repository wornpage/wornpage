<script lang="ts">
	import { tabDomIds } from './ids.js';
	import { visibleScrollLeft } from './scroll.js';
	import type { TabOption, TabsProps } from './types.js';

	let {
		active = $bindable(''),
		tabs,
		onchange,
		id,
		label = 'Sections',
	}: TabsProps = $props();
	let tablist: HTMLDivElement | undefined;

	$effect(() => {
		if (tabs.length && !tabs.some((tab) => tab.id === active)) active = tabs[0].id;
	});

	$effect(() => {
		const selectedId = active;
		const tabCount = tabs.length;
		if (!selectedId || !tabCount) return;

		const frame = requestAnimationFrame(ensureActiveTabVisible);
		return () => cancelAnimationFrame(frame);
	});

	function ensureActiveTabVisible() {
		if (!tablist) return;
		const selected = tablist.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
		if (!selected) return;

		const listBounds = tablist.getBoundingClientRect();
		const tabBounds = selected.getBoundingClientRect();
		const nextLeft = visibleScrollLeft({
			scrollLeft: tablist.scrollLeft,
			clientWidth: tablist.clientWidth,
			scrollWidth: tablist.scrollWidth,
			itemLeft: tabBounds.left - listBounds.left,
			itemRight: tabBounds.right - listBounds.left,
		});
		if (Math.abs(nextLeft - tablist.scrollLeft) > 0.5) {
			tablist.scrollTo({ left: nextLeft, behavior: 'auto' });
		}
	}

	function idsFor(tab: TabOption) {
		if (!id) return { tabId: tab.tabId, panelId: tab.panelId };
		const generated = tabDomIds(id, tab.id);
		return {
			tabId: tab.tabId || generated.tabId,
			panelId: tab.panelId || generated.panelId,
		};
	}

	function select(tabId: string) {
		active = tabId;
		onchange?.(tabId);
	}

	function handleKeydown(event: KeyboardEvent, index: number) {
		let target = -1;
		if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
		else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
		else if (event.key === 'Home') target = 0;
		else if (event.key === 'End') target = tabs.length - 1;
		if (target < 0) return;

		event.preventDefault();
		select(tabs[target].id);
		const targetButton = (event.currentTarget as HTMLButtonElement).parentElement?.children.item(target);
		if (targetButton instanceof HTMLElement) targetButton.focus();
	}
</script>

<div bind:this={tablist} class="worn-tabs" role="tablist" aria-label={label} aria-orientation="horizontal">
	{#each tabs as tab, index (tab.id)}
		{@const domIds = idsFor(tab)}
		<button
			type="button"
			class="worn-tab"
			role="tab"
			id={domIds.tabId}
			aria-controls={domIds.panelId}
			aria-selected={tab.id === active}
			tabindex={tab.id === active ? 0 : -1}
			onclick={() => select(tab.id)}
			onkeydown={(event) => handleKeydown(event, index)}
		><span class="worn-tab-label">{tab.label}</span></button>
	{/each}
</div>

<style>
	.worn-tabs {
		display: flex;
		max-inline-size: 100%;
		min-inline-size: 0;
		gap: 0;
		border-block-end: 2px solid var(--cockpit-border);
		margin-block-end: 16px;
		overflow-x: auto;
		overscroll-behavior-inline: contain;
		scroll-padding-inline: 8px;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.worn-tabs::-webkit-scrollbar {
		display: none;
	}

	.worn-tab {
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		max-inline-size: 24ch;
		min-inline-size: 0;
		min-block-size: 44px;
		padding: 8px 16px;
		border: 0;
		border-block-end: 2px solid transparent;
		margin-block-end: -2px;
		font-family: var(--font-typewriter);
		font-size: 13px;
		font-weight: 560;
		white-space: nowrap;
		background: transparent;
		color: var(--cockpit-text-muted);
		cursor: pointer;
		touch-action: manipulation;
		transition: color 0.12s ease, border-color 0.12s ease;
	}

	.worn-tab-label {
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.worn-tab:hover {
		color: var(--cockpit-text);
	}

	.worn-tab[aria-selected='true'] {
		color: var(--cockpit-link);
		border-block-end-color: var(--cockpit-accent);
	}

	.worn-tab:focus-visible {
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: -2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-tab {
			transition: none;
		}
	}
</style>
