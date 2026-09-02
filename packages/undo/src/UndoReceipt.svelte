<script lang="ts">
	import type { UndoReceiptProps } from './types.js';
	import { UNDO_LABELS } from './types.js';

	let {
		action,
		canUndo = true,
		canRedo = false,
		onundo,
		onredo,
	}: UndoReceiptProps = $props();

	let label = $derived(UNDO_LABELS[action.type] ?? action.label ?? 'Action');
</script>

<div class="wrn-undo-receipt">
	<span class="wrn-undo-icon" aria-hidden="true">↩</span>
	<div class="wrn-undo-body" role="status" aria-live="polite" aria-atomic="true">
		<strong>{label}</strong>
		{#if action.packId}
			<small>{action.packId.substring(0, 24)}</small>
		{/if}
	</div>
	{#if (canUndo && onundo) || (canRedo && onredo)}
		<div class="wrn-undo-actions">
			{#if canUndo && onundo}
				<button
					type="button"
					class="wrn-undo-btn"
					aria-label={`Undo ${label}`}
					onclick={() => onundo(action)}
				>Undo</button>
			{/if}
			{#if canRedo && onredo}
				<button
					type="button"
					class="wrn-undo-btn"
					aria-label={`Redo ${label}`}
					onclick={() => onredo(action)}
				>Redo</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrn-undo-receipt {
		--wrn-undo-boundary: var(
			--wrn-undo-border,
			var(
				--worn-border-strong,
				color-mix(
					in srgb,
					var(--worn-border, #c8c2b9) 60%,
					var(--worn-text, #21322b)
				)
			)
		);
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		padding: 10px 14px;
		overflow: hidden;
		background: var(--wrn-undo-bg, var(--worn-surface, #fdfbf7));
		border: 1px solid var(--wrn-undo-boundary);
		border-radius: var(--wrn-undo-radius, 6px);
		font-family: var(--wrn-undo-font, inherit);
		font-size: 13px;
		letter-spacing: 0;
		color: var(--wrn-undo-text, var(--worn-text, #21322b));
		box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
	}

	.wrn-undo-icon {
		flex-shrink: 0;
		font-size: 16px;
		opacity: 0.7;
	}

	.wrn-undo-body {
		display: grid;
		min-width: 0;
		gap: 2px;
	}

	.wrn-undo-body strong,
	.wrn-undo-body small {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.wrn-undo-body strong {
		font-size: 13px;
		font-weight: 600;
	}

	.wrn-undo-body small {
		font-size: 11px;
		color: var(--wrn-undo-muted, var(--worn-muted, #596a61));
	}

	.wrn-undo-actions {
		display: flex;
		max-width: 100%;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 4px;
	}

	.wrn-undo-btn {
		min-height: 32px;
		padding: 4px 10px;
		border: 1px solid var(--wrn-undo-boundary);
		border-radius: 4px;
		background: transparent;
		color: var(--wrn-undo-text, var(--worn-text, #21322b));
		font: inherit;
		font-size: 12px;
		letter-spacing: 0;
		cursor: pointer;
		touch-action: manipulation;
	}

	.wrn-undo-btn:hover {
		background: var(--wrn-undo-hover, var(--worn-subtle, #eaf4f0));
	}

	.wrn-undo-btn:focus-visible {
		outline: 2px solid var(--wrn-undo-focus, var(--worn-accent, #0f766e));
		outline-offset: 2px;
	}

	@media (max-width: 480px) {
		.wrn-undo-receipt {
			grid-template-columns: auto minmax(0, 1fr);
			row-gap: 6px;
		}

		.wrn-undo-actions {
			grid-column: 2;
			justify-content: flex-start;
		}
	}

	@media (pointer: coarse) {
		.wrn-undo-btn {
			min-width: 44px;
			min-height: 44px;
		}
	}

	@media (forced-colors: active) {
		.wrn-undo-receipt,
		.wrn-undo-btn {
			border-color: CanvasText;
		}

		.wrn-undo-btn:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
