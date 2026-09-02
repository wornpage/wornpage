<script lang="ts">
	import type { MultiSelectProps } from './types.js';

	let {
		value = $bindable([]),
		onchange,
		options,
		disabled = false,
		class: className = '',
		size,
		...rest
	}: MultiSelectProps = $props();

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
		<option value={option.value} disabled={option.disabled}>{option.label}</option>
	{/each}
</select>

<style>
	.worn-multi-select {
		--worn-multi-select-boundary: color-mix(
			in srgb,
			var(--worn-border-strong) 30%,
			var(--worn-text-muted)
		);
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 100%;
		min-block-size: 44px;
		min-inline-size: 0;
		font-family: var(--font-typewriter);
		font-size: 14px;
		line-height: 1.4;
		padding: 9px 12px;
		border: 1px solid var(--worn-multi-select-boundary);
		border-radius: var(--worn-radius-sm);
		background: var(--worn-surface);
		color: var(--worn-text);
		touch-action: manipulation;
	}

	.worn-multi-select:focus-visible {
		outline: 2px dashed var(--worn-multi-select-focus, var(--worn-focus, var(--worn-text, currentColor)));
		outline-offset: 2px;
		border-color: var(--worn-accent);
		box-shadow: 0 0 0 1px var(--worn-accent-50);
	}

	.worn-multi-select:disabled {
		background-color: var(--worn-bg-secondary);
		border-color: var(--worn-multi-select-boundary);
		color: var(--worn-text-muted);
		-webkit-text-fill-color: var(--worn-text-muted);
		cursor: not-allowed;
		opacity: 1;
	}

	@media (pointer: coarse) {
		.worn-multi-select {
			font-size: 16px;
		}
	}
</style>
