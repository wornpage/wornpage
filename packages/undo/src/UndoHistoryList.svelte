<script lang="ts">
	import type { UndoHistoryListProps } from './types.js';

	let {
		items,
		onselect,
		ariaLabel = 'Undo history',
		emptyText = 'Nothing recorded yet.'
	}: UndoHistoryListProps = $props();
</script>

{#if !items.length}
	<p class="wrn-history-empty">{emptyText}</p>
{:else}
	<ol class="wrn-history-list" aria-label={ariaLabel}>
		{#each items as item (item.id)}
			<li>
				<button
					type="button"
					class="wrn-history-row"
					class:is-current={item.state === 'current'}
					class:is-undone={item.state === 'undone'}
					data-undo-history-item={item.id}
					data-state={item.state}
					aria-current={item.state === 'current' ? 'true' : undefined}
					disabled={item.state === 'current'}
					onclick={() => onselect(item)}
				>
					<span class="wrn-history-dot" aria-hidden="true"></span>
					<span class="wrn-history-text">
						<span class="wrn-history-label">{item.label}</span>
						<span class="wrn-history-meta">
							{item.meta}
							{#if item.state === 'current'} · on screen now{/if}
							{#if item.state === 'undone'} · undone{/if}
						</span>
					</span>
				</button>
			</li>
		{/each}
	</ol>
{/if}

<style>
	.wrn-history-empty {
		color: var(--cockpit-text-muted, #596a61);
		font-size: 13px;
		margin: 0 0 12px;
	}
	.wrn-history-list {
		display: grid;
		gap: 2px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.wrn-history-row {
		align-items: flex-start;
		appearance: none;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--worn-undo-radius, var(--cockpit-radius, 6px));
		box-sizing: border-box;
		color: var(--cockpit-text, #21322b);
		cursor: pointer;
		display: flex;
		font: inherit;
		gap: 8px;
		inline-size: 100%;
		min-block-size: 44px;
		min-inline-size: 0;
		padding: 8px 10px;
		text-align: start;
		touch-action: manipulation;
		transition: background-color 0.1s ease, border-color 0.1s ease;
		-webkit-tap-highlight-color: transparent;
	}
	.wrn-history-row:hover:not(:disabled) {
		background: var(--cockpit-surface-raised, var(--cockpit-surface, #fdfbf7));
		border-color: var(--cockpit-border, #c8c2b9);
	}
	.wrn-history-row:focus-visible {
		outline: 2px dashed var(--worn-undo-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)));
		outline-offset: 2px;
	}
	.wrn-history-row:disabled {
		cursor: default;
		opacity: 1;
	}
	.wrn-history-row.is-current {
		background: var(--cockpit-surface-raised, var(--cockpit-surface, #fdfbf7));
		border-color: var(--cockpit-border-strong, var(--cockpit-border, #c8c2b9));
	}
	.wrn-history-row.is-undone .wrn-history-label,
	.wrn-history-row.is-undone .wrn-history-meta {
		color: var(--cockpit-text-muted, #596a61);
		text-decoration: line-through;
	}
	.wrn-history-dot {
		background: transparent;
		border: 1px solid var(--cockpit-border-strong, var(--cockpit-border, #c8c2b9));
		border-radius: 50%;
		block-size: 7px;
		flex: none;
		inline-size: 7px;
		margin-block-start: 6px;
	}
	.wrn-history-row.is-current .wrn-history-dot {
		background: var(--cockpit-link, #0f766e);
		border-color: var(--cockpit-link, #0f766e);
	}
	.wrn-history-text {
		display: grid;
		gap: 1px;
		min-inline-size: 0;
	}
	.wrn-history-label {
		font-size: 13px;
		overflow-wrap: anywhere;
	}
	.wrn-history-meta {
		color: var(--cockpit-text-muted, #596a61);
		font-family: var(--font-typewriter, monospace);
		font-size: 11px;
		overflow-wrap: anywhere;
	}
	@media (prefers-reduced-motion: reduce) {
		.wrn-history-row { transition: none; }
	}
	@media (forced-colors: active) {
		.wrn-history-row,
		.wrn-history-row.is-current { border-color: CanvasText; }
		.wrn-history-row:focus-visible { outline-color: Highlight; }
	}
</style>
