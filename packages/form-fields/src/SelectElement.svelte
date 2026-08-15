<svelte:options customElement={{
  tag: 'worn-select',
  shadow: 'open',
  props: {
    value: { reflect: true, type: 'String' },
    options: { type: 'Array' },
    required: { reflect: true, type: 'Boolean' },
    disabled: { reflect: true, type: 'Boolean' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Select from './Select.svelte';
  import type { SelectOption } from './types.js';

  let {
    value = '',
    options = [] as SelectOption[],
    required = false,
    disabled = false,
    ariaLabel = '',
  } = $props();
  const host = $host<HTMLElement>();
  let inputLabel = $derived(ariaLabel || host.getAttribute('aria-label') || '');

  function syncValue(event: Event) {
    (host as HTMLElement & { value: string }).value = (event.currentTarget as HTMLSelectElement).value;
  }
</script>

<Select bind:value {options} {required} {disabled} aria-label={inputLabel || undefined} onchange={syncValue} />

<style>
  :host {
    display: inline-block;
    max-inline-size: 100%;
    min-inline-size: 0;
    vertical-align: middle;
  }
</style>
