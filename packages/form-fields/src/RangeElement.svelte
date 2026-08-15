<svelte:options customElement={{
  tag: 'worn-range',
  shadow: 'open',
  props: {
    value: { reflect: true, type: 'Number' },
    min: { reflect: true, type: 'Number' },
    max: { reflect: true, type: 'Number' },
    step: { reflect: true, type: 'Number' },
    suffix: { reflect: true, type: 'String' },
    disabled: { reflect: true, type: 'Boolean' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Range from './Range.svelte';

  let {
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    suffix = '',
    disabled = false,
    ariaLabel = '',
  } = $props();

  const host = $host<HTMLElement>();
  let inputLabel = $derived(ariaLabel || host.getAttribute('aria-label') || 'Value');

  function syncValue(event: Event) {
    const next = Number((event.currentTarget as HTMLInputElement).value);
    value = next;
    (host as HTMLElement & { value: number }).value = next;
  }
</script>

<Range
  bind:value
  {min}
  {max}
  {step}
  label={inputLabel}
  {suffix}
  {disabled}
  oninput={syncValue}
  onchange={syncValue}
/>

<style>
  :host {
    display: inline-block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    vertical-align: middle;
  }
</style>
