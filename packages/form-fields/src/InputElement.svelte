<svelte:options customElement={{
  tag: 'worn-input',
  shadow: 'open',
  props: {
    type: { reflect: true, type: 'String' },
    value: { reflect: true, type: 'String' },
    placeholder: { reflect: true, type: 'String' },
    required: { reflect: true, type: 'Boolean' },
    disabled: { reflect: true, type: 'Boolean' },
    readonly: { reflect: true, type: 'Boolean' },
    autocomplete: { reflect: true, type: 'String' },
    inputmode: { reflect: true, type: 'String' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Input from './Input.svelte';

  let {
    type = 'text',
    value = '',
    placeholder = '',
    required = false,
    disabled = false,
    readonly = false,
    autocomplete,
    inputmode,
    ariaLabel = '',
  } = $props();
  const host = $host<HTMLElement>();
  let inputLabel = $derived(ariaLabel || host.getAttribute('aria-label') || '');

  function syncValue(event: Event) {
    (host as HTMLElement & { value: string }).value = (event.currentTarget as HTMLInputElement).value;
  }
</script>

<Input
  {type}
  bind:value
  {placeholder}
  {required}
  {disabled}
  {readonly}
  {autocomplete}
  {inputmode}
  aria-label={inputLabel || undefined}
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
