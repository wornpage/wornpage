<svelte:options customElement={{
  tag: 'worn-textarea',
  shadow: 'open',
  props: {
    value: { reflect: true, type: 'String' },
    placeholder: { reflect: true, type: 'String' },
    rows: { reflect: true, type: 'Number' },
    required: { reflect: true, type: 'Boolean' },
    disabled: { reflect: true, type: 'Boolean' },
    readonly: { reflect: true, type: 'Boolean' },
    autocomplete: { reflect: true, type: 'String' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Textarea from './Textarea.svelte';

  let {
    value = '',
    placeholder = '',
    rows = 3,
    required = false,
    disabled = false,
    readonly = false,
    autocomplete,
    ariaLabel = '',
  } = $props();
  const host = $host<HTMLElement>();
  let inputLabel = $derived(ariaLabel || host.getAttribute('aria-label') || '');

  function syncValue(event: Event) {
    (host as HTMLElement & { value: string }).value = (event.currentTarget as HTMLTextAreaElement).value;
  }
</script>

<Textarea
  bind:value
  {placeholder}
  {rows}
  {required}
  {disabled}
  {readonly}
  {autocomplete}
  aria-label={inputLabel || undefined}
  oninput={syncValue}
  onchange={syncValue}
/>

<style>
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
  }
</style>
