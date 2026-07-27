<script lang="ts">
	import type { UndoAction } from './types.js';
	import { UNDO_LABELS } from './types.js';

	interface Props {
		action: UndoAction;
		canRedo?: boolean;
		onundo?: (action: UndoAction) => void;
		onredo?: () => void;
	}

	let { action, canRedo = false, onundo, onredo }: Props = $props();

	let label = $derived(UNDO_LABELS[action.type] ?? action.label ?? 'Action');
</script>

<div class="wrn-undo-receipt" role="status">
	<span class="wrn-undo-icon">↩</span>
	<div class="wrn-undo-body">
		<strong>{label}</strong>
		<small>{action.packId ? `${action.packId.substring(0, 24)}` : ''}</small>
	</div>
	<div class="wrn-undo-actions">
		<button type="button" class="wrn-undo-btn" onclick={() => onundo?.(action)} title="Undo (⌘Z)">Undo</button>
		{#if canRedo}
			<button type="button" class="wrn-undo-btn" onclick={() => onredo?.()} title="Redo">Redo</button>
		{/if}
	</div>
</div>

<style>
	.wrn-undo-receipt {
		display: flex; align-items: center; gap: 10px;
		padding: 10px 14px;
		background: var(--wrn-undo-bg, #fdfbf7);
		border: 1px solid var(--wrn-undo-border, #e2ddd5);
		border-radius: var(--wrn-undo-radius, 6px);
		font-family: var(--wrn-undo-font, inherit);
		font-size: 13px;
		color: var(--wrn-undo-text, #21322b);
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}
	.wrn-undo-icon { font-size: 16px; opacity: 0.7; flex-shrink: 0; }
	.wrn-undo-body { flex: 1; display: grid; gap: 2px; }
	.wrn-undo-body strong { font-size: 13px; font-weight: 600; }
	.wrn-undo-body small { font-size: 11px; color: var(--wrn-undo-muted, #63746a); }
	.wrn-undo-actions { display: flex; gap: 4px; }
	.wrn-undo-btn {
		padding: 4px 10px; border: 1px solid var(--wrn-undo-border, #e2ddd5);
		border-radius: 4px; background: transparent; cursor: pointer;
		font: inherit; font-size: 12px; color: var(--wrn-undo-text, #21322b);
		min-height: 32px;
	}
	.wrn-undo-btn:hover { background: var(--wrn-undo-hover, #eaf4f0); }
</style>
