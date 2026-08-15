<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import { slide } from 'svelte/transition';
  import type { CollapsibleProps } from './types.js';

  let {
    open = $bindable(false),
    summary,
    ariaLabel = '',
    panelId: suppliedPanelId,
    onchange,
    children,
  }: CollapsibleProps = $props();
  const instanceId = $props.id();
  let panelId = $derived(suppliedPanelId || `worn-collapsible-${instanceId}-panel`);

  function toggle() {
    open = !open;
    onchange?.(open);
  }
</script>

<div class="worn-collapsible" class:is-open={open}>
  <button
    type="button"
    class="worn-collapsible-trigger"
    onclick={toggle}
    aria-expanded={open}
    aria-controls={panelId}
    aria-label={ariaLabel || undefined}
  >
    <span class="worn-collapsible-caret" aria-hidden="true"></span>
    <span class="worn-collapsible-summary">{summary}</span>
  </button>
  {#if open}
    <div class="worn-collapsible-body" id={panelId} transition:slide={{ duration: prefersReducedMotion.current ? 0 : 180 }}>
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .worn-collapsible {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
    overflow: hidden;
    border: 1px solid var(--cockpit-border);
    border-radius: var(--cockpit-radius-sm);
  }

  .worn-collapsible-trigger {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
    padding: 10px 14px;
    border: 0;
    background: var(--cockpit-surface);
    color: var(--cockpit-text);
    font: inherit;
    cursor: pointer;
    text-align: start;
    touch-action: manipulation;
  }

  .worn-collapsible-trigger:hover {
    background: var(--cockpit-hover-bg);
  }

  .worn-collapsible-trigger:focus-visible {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: -2px;
  }

  .worn-collapsible-caret {
    position: relative;
    inline-size: 16px;
    block-size: 16px;
    flex: 0 0 16px;
    color: var(--cockpit-text-muted);
  }

  .worn-collapsible-caret::before {
    content: '';
    position: absolute;
    inset-inline-start: 4px;
    inset-block-start: 4px;
    inline-size: 6px;
    block-size: 6px;
    border-inline-end: 1.5px solid currentColor;
    border-block-end: 1.5px solid currentColor;
    transform: rotate(-45deg);
    transition: transform 0.15s ease;
  }

  .worn-collapsible.is-open .worn-collapsible-caret::before {
    transform: rotate(45deg);
  }

  .worn-collapsible-summary {
    flex: 1 1 auto;
    max-inline-size: 100%;
    min-inline-size: 0;
    font-family: var(--font-typewriter);
    font-size: 13px;
    font-weight: 560;
    overflow-wrap: anywhere;
  }

  .worn-collapsible-body {
    box-sizing: border-box;
    max-inline-size: 100%;
    min-inline-size: 0;
    padding: 12px 14px;
    overflow-wrap: anywhere;
    border-top: 1px solid var(--cockpit-border);
    background: var(--cockpit-bg);
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-collapsible-caret::before { transition: none; }
  }
</style>
