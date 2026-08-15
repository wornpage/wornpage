<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value?: string[];
		onchange?: (event: Event) => void;
		options: Option[];
		disabled?: boolean;
		class?: string;
		size?: number;
		[key: string]: unknown;
	}

	let {
		value = $bindable([]),
		onchange,
		options,
		disabled = false,
		class: className = '',
		size,
		...rest
	}: Props = $props();

	$effect(() => {
		if (!Array.isArray(value)) value = [];
	});
</script>

<select
	multiple
	class="worn-multi-select {className}"
	bind:value
	{onchange}
	{disabled}
	{size}
	{...rest}
>
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	.worn-multi-select {
		width: 100%;
		box-sizing: border-box;
		font-family: var(--font-typewriter);
		font-size: 14px;
		line-height: 1.4;
		padding: 9px 12px;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius-sm);
		background: var(--cockpit-surface);
		color: var(--cockpit-text);
		min-height: 120px;
	}

	.worn-multi-select:focus {
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: 2px;
		border-color: var(--cockpit-accent);
		box-shadow: 0 0 0 1px var(--cockpit-accent-50);
	}

	.worn-multi-select:disabled {
		background-color: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text-muted);
	}
</style>
