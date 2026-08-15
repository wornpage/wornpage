<script lang="ts">
  import type { AccordionProps } from './types.js';

  let {
    label,
    description,
    open = $bindable(false),
    panelId: suppliedPanelId,
    onchange,
    children,
  }: AccordionProps = $props();
  const instanceId = $props.id();
  let panelId = $derived(suppliedPanelId || `worn-accordion-${instanceId}-panel`);

  function handleToggle(event: Event) {
    open = (event.currentTarget as HTMLDetailsElement).open;
    onchange?.(open);
  }
</script>

<details class="worn-accordion" bind:open ontoggle={handleToggle}>
  <summary class="worn-accordion-summary" aria-controls={panelId}>
    <span class="worn-accordion-summary-text">
      <span class="worn-accordion-label">{label}</span>
      {#if description}
        <small class="worn-accordion-desc">{description}</small>
      {/if}
    </span>
    <span class="worn-accordion-icon" aria-hidden="true"></span>
  </summary>
  <div class="worn-accordion-body" id={panelId}>
    {@render children?.()}
  </div>
</details>

<style>
  .worn-accordion {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--cockpit-border);
  }

  .worn-accordion-summary {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
    padding: 4px 0;
    color: var(--cockpit-text-secondary);
    font-family: var(--font-typewriter);
    font-size: 12px;
    font-weight: 550;
    cursor: pointer;
    list-style: none;
    touch-action: manipulation;
  }

  .worn-accordion-summary::-webkit-details-marker { display: none; }

  .worn-accordion-summary:focus-visible {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
  }

  .worn-accordion-summary-text {
    display: block;
    flex: 1 1 auto;
    max-inline-size: 100%;
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }

  .worn-accordion-label {
    display: block;
    max-inline-size: 100%;
    overflow-wrap: anywhere;
  }

  .worn-accordion-desc {
    display: block;
    max-inline-size: 100%;
    margin-top: 1px;
    color: var(--cockpit-text-muted);
    font-size: 11px;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .worn-accordion-icon {
    position: relative;
    inline-size: 16px;
    block-size: 16px;
    flex: 0 0 16px;
    margin-inline-start: 8px;
    color: var(--cockpit-text-muted);
  }

  .worn-accordion-icon::before {
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

  .worn-accordion[open] .worn-accordion-icon::before {
    transform: rotate(45deg);
  }

  .worn-accordion-body {
    box-sizing: border-box;
    max-inline-size: 100%;
    min-inline-size: 0;
    padding-top: 8px;
    overflow-wrap: anywhere;
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-accordion-icon::before { transition: none; }
  }
</style>
