<svelte:options customElement={{ tag: 'worn-undo', shadow: 'none', props: { label: {}, packid: {}, canredo: { type: 'Boolean' } } }} />

<script lang="ts">
	import UndoReceipt from './UndoReceipt.svelte';
	import type { UndoAction } from './types.js';

	let { label = 'Action', packid = '', canredo = false }: { label?: string; packid?: string; canredo?: boolean } = $props();

	let el: HTMLElement;
	function emit(name: string, detail: any) { el?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true })); }

	const action: UndoAction = { type: 'action', packId: packid, label, createdAt: Date.now() };
</script>

<div bind:this={el} style="display:contents">
<UndoReceipt {action} canRedo={canredo} onundo={() => emit('wrn-undo', { action })} onredo={() => emit('wrn-redo', {})} />
</div>
