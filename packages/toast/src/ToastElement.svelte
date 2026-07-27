<svelte:options customElement={{ tag: 'worn-toast', shadow: 'none', props: { message: {}, kind: {}, duration: { type: 'Number' } } }} />

<script lang="ts">
	import Toast from './Toast.svelte';

	let { message = '', kind = 'info', duration = 3000 }: { message?: string; kind?: string; duration?: number } = $props();

	let el: HTMLElement;

	function emit(name: string, detail: any) { el?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true })); }
</script>

<div bind:this={el}>
<Toast {message} kind={kind as 'info' | 'error' | 'success'} {duration} ondismiss={() => emit('worn-dismiss', {})} />
</div>
