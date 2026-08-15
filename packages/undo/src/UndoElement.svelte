<svelte:options customElement={{
	tag: 'worn-undo',
	shadow: 'none',
	props: {
		label: {},
		packid: {},
		canundo: { type: 'Boolean' },
		canredo: { type: 'Boolean' },
	},
}} />

<script lang="ts">
	import UndoReceipt from './UndoReceipt.svelte';
	import type { UndoAction, UndoElementEventDetail } from './types.js';

	let {
		label = 'Action',
		packid = '',
		canundo = true,
		canredo = false,
	}: {
		label?: string;
		packid?: string;
		canundo?: boolean;
		canredo?: boolean;
	} = $props();

	const host = $host<HTMLElement>();

	function emit(name: 'wrn-undo' | 'wrn-redo') {
		host.dispatchEvent(new CustomEvent<UndoElementEventDetail>(name, {
			detail: { action },
			bubbles: true,
			composed: true,
		}));
	}

	let action: UndoAction = $derived({
		type: 'action',
		packId: packid,
		label,
		createdAt: Date.now(),
	});
</script>

<UndoReceipt
	{action}
	canUndo={canundo}
	canRedo={canredo}
	onundo={() => emit('wrn-undo')}
	onredo={() => emit('wrn-redo')}
/>
