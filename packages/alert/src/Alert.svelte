<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion';
  import { fly } from 'svelte/transition';
  import type { AlertProps } from './types.js';

  let {
    tone = 'info',
    dismissible = false,
    title = '',
    dismissLabel = '',
    ondismiss,
    children,
  }: AlertProps = $props();

  let visible = $state(true);
  let accessibleDismissLabel = $derived(dismissLabel || (title ? `Dismiss ${title}` : 'Dismiss alert'));

  function dismiss() {
    if (!visible) return;
    visible = false;
    ondismiss?.();
  }
</script>

{#if visible}
  <div
    class="worn-alert"
    class:is-info={tone === 'info'}
    class:is-success={tone === 'success'}
    class:is-warning={tone === 'warning'}
    class:is-danger={tone === 'danger'}
    role={tone === 'danger' ? 'alert' : 'status'}
    aria-live={tone === 'danger' ? 'assertive' : 'polite'}
    aria-atomic="true"
    transition:fly|local={{ y: prefersReducedMotion.current ? 0 : -8, duration: prefersReducedMotion.current ? 0 : 200 }}
  >
    <span class="worn-alert-icon" aria-hidden="true"></span>
    <div class="worn-alert-body">
      {#if title}<strong>{title}</strong>{/if}
      {@render children?.()}
    </div>
    {#if dismissible}
      <button type="button" class="worn-alert-dismiss" onclick={dismiss} aria-label={accessibleDismissLabel}></button>
    {/if}
  </div>
{/if}

<style>
  .worn-alert {
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    margin-block-end: 12px;
    padding: 14px 16px;
    overflow-wrap: anywhere;
    border: 1px solid;
    border-radius: var(--cockpit-radius);
    font-family: var(--font-typewriter);
    font-size: 13px;
    line-height: 1.4;
  }

  .worn-alert.is-info {
    --worn-alert-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 16v-4'/%3E%3Cpath d='M12 8h.01'/%3E%3C/svg%3E");
    background: var(--cockpit-accent-50);
    border-color: var(--cockpit-accent);
    color: var(--cockpit-text);
  }

  .worn-alert.is-success {
    --worn-alert-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m9 12 2 2 4-4'/%3E%3C/svg%3E");
    background: var(--cockpit-success-bg);
    border-color: var(--cockpit-success-border);
    color: var(--cockpit-success-text);
  }

  .worn-alert.is-warning {
    --worn-alert-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'/%3E%3Cpath d='M12 9v4'/%3E%3Cpath d='M12 17h.01'/%3E%3C/svg%3E");
    background: var(--cockpit-warning-bg);
    border-color: var(--cockpit-warning-border);
    color: var(--cockpit-warning-text);
  }

  .worn-alert.is-danger {
    --worn-alert-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m15 9-6 6'/%3E%3Cpath d='m9 9 6 6'/%3E%3C/svg%3E");
    background: var(--cockpit-danger-bg);
    border-color: var(--cockpit-danger-border);
    color: var(--cockpit-danger-text);
  }

  .worn-alert-icon {
    inline-size: 16px;
    block-size: 16px;
    flex: 0 0 16px;
    margin-block-start: 1px;
    background: currentColor;
    mask: var(--worn-alert-icon) center / contain no-repeat;
    -webkit-mask: var(--worn-alert-icon) center / contain no-repeat;
  }

  .worn-alert-body {
    flex: 1 1 auto;
    max-inline-size: 100%;
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }

  .worn-alert-body strong {
    display: block;
    max-inline-size: 100%;
    margin-block-end: 2px;
    overflow-wrap: anywhere;
  }

  .worn-alert-dismiss {
    position: relative;
    display: inline-grid;
    place-items: center;
    inline-size: 44px;
    block-size: 44px;
    min-inline-size: 44px;
    min-block-size: 44px;
    flex: 0 0 44px;
    margin: 0;
    padding: 0;
    border: 1px solid currentColor;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
    touch-action: manipulation;
  }

  .worn-alert-dismiss::before,
  .worn-alert-dismiss::after {
    content: '';
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: 10px;
    block-size: 1.5px;
    border-radius: 1px;
    background: currentColor;
  }

  .worn-alert-dismiss::before { transform: translate(-50%, -50%) rotate(45deg); }
  .worn-alert-dismiss::after { transform: translate(-50%, -50%) rotate(-45deg); }
  .worn-alert-dismiss:hover { background: color-mix(in srgb, currentColor 10%, transparent); }

  .worn-alert-dismiss:focus-visible {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
  }
</style>
