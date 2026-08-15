<svelte:options customElement={{
  tag: 'worn-drawer',
  shadow: 'none',
  props: {
    open: { reflect: true, type: 'Boolean' },
    title: { reflect: true, type: 'String' },
    description: { reflect: true, type: 'String' },
    side: { reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Drawer from './WornDrawer.svelte';

  let {
    open = false,
    title = '',
    description = '',
    side = 'end',
  }: {
    open?: boolean;
    title?: string;
    description?: string;
    side?: 'start' | 'end' | 'bottom';
  } = $props();
  const host = $host<HTMLElement>();

  function handleClose() {
    open = false;
    setTimeout(() => host.dispatchEvent(new CustomEvent('close')), 0);
  }
</script>

<Drawer bind:open {title} {side} onclose={handleClose}>
  {#if description}<p class="worn-drawer-element-description">{description}</p>{/if}
</Drawer>

<style>
  .worn-drawer-element-description {
    margin: 0;
    color: var(--cockpit-text-muted);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
</style>
