<svelte:options customElement={{
  tag: 'worn-alert',
  shadow: 'open',
  props: {
    tone: { reflect: true, type: 'String' },
    dismissible: { reflect: true, type: 'Boolean' },
    title: { reflect: true, type: 'String' },
    dismissLabel: { attribute: 'dismiss-label', reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Alert from './Alert.svelte';
  import type { AlertTone } from './types.js';

  let {
    tone = 'info',
    dismissible = false,
    title = '',
    dismissLabel = '',
  }: {
    tone?: AlertTone;
    dismissible?: boolean;
    title?: string;
    dismissLabel?: string;
  } = $props();
  const host = $host<HTMLElement>();

  function handleDismiss() {
    host.dispatchEvent(new CustomEvent('dismiss', {
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
<Alert {tone} {dismissible} {title} {dismissLabel} ondismiss={handleDismiss} {children} />

<style>
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
  }

  .worn-element-slot { display: contents; }
</style>
