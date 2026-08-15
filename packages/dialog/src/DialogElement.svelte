<svelte:options customElement={{
  tag: 'worn-dialog',
  shadow: 'none',
  props: {
    open: { reflect: true, type: 'Boolean' },
    title: { reflect: true, type: 'String' },
    description: { reflect: true, type: 'String' },
    size: { reflect: true, type: 'String' },
  },
}} />

<script lang="ts">
  import Dialog from './WornDialog.svelte';

  let {
    open = false,
    title = '',
    description = '',
    size = 'md',
  }: {
    open?: boolean;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
  } = $props();
  const host = $host<HTMLElement>();

  function handleClose() {
    open = false;
    setTimeout(() => host.dispatchEvent(new CustomEvent('close')), 0);
  }
</script>

<Dialog bind:open {title} {size} onclose={handleClose}>
  {#if description}<p class="worn-dialog-element-description">{description}</p>{/if}
</Dialog>

<style>
  .worn-dialog-element-description {
    margin: 0;
    color: var(--cockpit-text-muted);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
</style>
