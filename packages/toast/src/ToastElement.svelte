<svelte:options customElement={{ tag: 'worn-toast', shadow: 'none', props: { message: {}, kind: {}, dismissLabel: { attribute: 'dismiss-label' }, duration: { type: 'Number' } } }} />

<script lang="ts">
	import Toast from './Toast.svelte';

	let { message = '', kind = 'info', dismissLabel = 'Dismiss notification', duration = 3000 }: { message?: string; kind?: string; dismissLabel?: string; duration?: number } = $props();

	let el: HTMLElement;

	function emit(name: string, detail: any) { el?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true })); }
</script>

<div bind:this={el}>
<Toast {message} kind={kind as 'info' | 'error' | 'success'} {dismissLabel} {duration} ondismiss={() => emit('worn-dismiss', {})} />
</div>
