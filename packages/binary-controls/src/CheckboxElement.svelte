<svelte:options customElement={{
  tag: 'worn-checkbox',
  shadow: 'open',
  props: {
    checked: { reflect: true, type: 'Boolean' },
    disabled: { reflect: true, type: 'Boolean' },
    label: { reflect: true, type: 'String' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Checkbox from './Checkbox.svelte';

  let { checked = false, disabled = false, label = '', ariaLabel = '' } = $props();
  const host = $host<HTMLElement>();
  let inputLabel = $derived(ariaLabel || host.getAttribute('aria-label') || '');

  function handleChange(event: Event) {
    checked = (event.currentTarget as HTMLInputElement).checked;
    host.dispatchEvent(new CustomEvent('change', {
      detail: { checked },
      bubbles: true,
    }));
  }
</script>

<Checkbox bind:checked {disabled} {label} ariaLabel={inputLabel} onchange={handleChange} />

<style>
  :host {
    display: inline-block;
    max-inline-size: 100%;
    min-inline-size: 44px;
    vertical-align: middle;
  }
</style>
