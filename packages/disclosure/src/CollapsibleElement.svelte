<svelte:options customElement={{
  tag: 'worn-collapsible',
  shadow: 'open',
  props: {
    summary: { reflect: true, type: 'String' },
    open: { reflect: true, type: 'Boolean' },
    ariaLabel: { attribute: 'aria-label', reflect: true, type: 'String' },
    panelId: { attribute: 'panel-id', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Collapsible from './Collapsible.svelte';

  let { summary = '', open = false, ariaLabel = '', panelId = '' } = $props();
  const host = $host<HTMLElement>();
  let triggerLabel = $derived(ariaLabel || host.getAttribute('aria-label') || '');

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
<Collapsible {summary} ariaLabel={triggerLabel} bind:open {panelId} onchange={handleChange} {children} />

<style>
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
  }

  .worn-element-slot { display: contents; }
</style>
