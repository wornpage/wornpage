<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		keys: string[];
		children?: Snippet;
	}

	let { keys, children }: Props = $props();
</script>

<span class="worn-kbd-wrap">
	{#if children}
		<span class="worn-kbd-label">{@render children()}</span>
	{/if}
	{#each keys as key, index (index)}
		<kbd class="worn-kbd">{key}</kbd>
		{#if index < keys.length - 1}
			<span class="worn-kbd-plus">+</span>
		{/if}
	{/each}
</span>

<style>
	.worn-kbd-wrap {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 3px;
		max-inline-size: 100%;
		min-inline-size: 0;
		vertical-align: middle;
	}

	.worn-kbd-label,
	.worn-kbd {
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-kbd {
		box-sizing: border-box;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 550;
		line-height: 1.2;
		padding: 3px 7px;
		border: 1px solid var(--cockpit-border-strong, #8a948e);
		border-radius: 4px;
		background: var(--cockpit-surface, #ffffff);
		color: var(--cockpit-text-secondary, #3f4b45);
		box-shadow: 0 1px 0 var(--cockpit-border, #c8ceca);
		white-space: normal;
	}

	.worn-kbd-plus {
		flex: 0 0 auto;
		font-size: 11px;
		color: var(--cockpit-text-muted, #64706a);
	}
</style>
