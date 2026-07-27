<script lang="ts">
	interface Props {
		label: string;
		open?: boolean;
		children?: any;
	}
	let { label, open = true, children }: Props = $props();
</script>

<details class="worn-nav-group" open={open}>
	<summary class="worn-nav-item worn-nav-summary">{label}</summary>
	{@render children?.()}
</details>
