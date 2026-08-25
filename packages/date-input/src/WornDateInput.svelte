<script lang="ts">
	interface Props {
		value?: string;
		oninput?: (event: Event) => void;
		onchange?: (event: Event) => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onblur?: (event: FocusEvent) => void;
		required?: boolean;
		disabled?: boolean;
		placeholder?: string;
		id?: string;
		class?: string;
		min?: string;
		max?: string;
		step?: string;
		[key: string]: unknown;
	}

	let {
		value = $bindable(''),
		oninput,
		onchange,
		onkeydown,
		onblur,
		required = false,
		disabled = false,
		placeholder = '',
		id,
		class: className = '',
		min,
		max,
		step,
		...rest
	}: Props = $props();
</script>

<input
	class="worn-date-input {className}"
	{id}
	type="date"
	bind:value
	{placeholder}
	{oninput}
	{onchange}
	{onkeydown}
	{onblur}
	{required}
	{disabled}
	{min}
	{max}
	{step}
	autocomplete="off"
	{...rest}
/>

<style>
	.worn-date-input {
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
		cursor: text;
		touch-action: manipulation;
	}

	.worn-date-input:focus {
		outline: 2px dashed var(--worn-date-input-focus, var(--cockpit-focus, var(--cockpit-text, currentColor)));
		outline-offset: 2px;
		border-color: var(--cockpit-accent);
		box-shadow: 0 0 0 1px var(--cockpit-accent-50);
	}

	.worn-date-input:disabled {
		background-color: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text-muted);
		cursor: not-allowed;
	}

	@media (pointer: coarse) {
		.worn-date-input {
			font-size: 16px;
			min-height: 44px;
		}
	}
</style>
