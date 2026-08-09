<script lang="ts">
	import Button from './WornButton.svelte';
	import { mount } from 'svelte';
</script>

<!-- Web component wrapper for @wornpage/button -->
<script lang="ts" module>
	let instance: ReturnType<typeof mount>;
	export function mountButton(target: HTMLElement, props: Record<string, unknown>) {
		if (instance) unmountButton();
		instance = mount(Button, { target, props });
		return () => { unmountButton(); };
	}
	function unmountButton() {
		if (instance) { import('svelte').then(({unmount}) => unmount(instance)); instance = undefined; }
	}
</script>
