<svelte:options customElement={{
  tag: 'worn-accordion',
  shadow: 'open',
  props: {
    label: { reflect: true, type: 'String' },
    description: { reflect: true, type: 'String' },
    open: { reflect: true, type: 'Boolean' },
    panelId: { attribute: 'panel-id', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Accordion from './Accordion.svelte';

  let { label = '', description = '', open = false, panelId = '' } = $props();
  const host = $host<HTMLElement>();

  function handleChange(nextOpen: boolean) {
    (host as HTMLElement & { open: boolean }).open = nextOpen;
    host.dispatchEvent(new CustomEvent('change', {
      detail: { open: nextOpen },
      bubbles: true,
      composed: true,
    }));
  }

  function attachLightDomSlot(node: HTMLElement) {
    const slot = document.createElement('slot');
    node.append(slot);
    return { destroy: () => slot.remove() };
  }
</script>

{#snippet children()}<div class="worn-element-slot" use:attachLightDomSlot></div>{/snippet}
<Accordion {label} {description} bind:open {panelId} onchange={handleChange} {children} />

<style>
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
  }

  .worn-element-slot { display: contents; }
</style>
