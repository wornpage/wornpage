<script lang="ts">
  import type { CheckboxProps } from './types.js';

  let {
    checked = $bindable(false),
    onchange,
    label,
    ariaLabel,
    disabled = false,
    ...rest
  }: CheckboxProps = $props();
</script>

<label class="worn-checkbox" class:is-disabled={disabled} class:is-labelled={Boolean(label)}>
  <input
    type="checkbox"
    class="worn-checkbox-input"
    bind:checked
    {onchange}
    {disabled}
    aria-label={ariaLabel || undefined}
    {...rest}
  />
  <span class="worn-checkbox-mark" aria-hidden="true">
    <svg viewBox="0 0 12 10" class="worn-checkbox-tick">
      <path d="M1 5l3 3 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  {#if label}
    <span class="worn-checkbox-label">{label}</span>
  {/if}
</label>

<style>
  .worn-checkbox {
    --worn-binary-boundary: color-mix(in srgb, var(--cockpit-border-strong) 30%, var(--cockpit-text-muted));
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    max-inline-size: 100%;
    min-inline-size: 44px;
    min-block-size: 44px;
    align-items: center;
    gap: 8px;
    vertical-align: middle;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .worn-checkbox:not(.is-labelled) {
    justify-content: center;
  }

  .worn-checkbox.is-disabled {
    cursor: not-allowed;
  }

  .worn-checkbox-input {
    position: absolute;
    z-index: 1;
    inset: 0;
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }

  .worn-checkbox-mark {
    display: flex;
    box-sizing: border-box;
    inline-size: 20px;
    block-size: 20px;
    flex: 0 0 20px;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--worn-binary-boundary);
    border-radius: 3px;
    background: var(--cockpit-surface);
    transition: border-color 0.12s ease, background 0.12s ease;
  }

  .worn-checkbox-input:checked + .worn-checkbox-mark {
    border-color: var(--worn-binary-boundary);
    background: var(--cockpit-accent);
  }

  .worn-checkbox.is-disabled .worn-checkbox-mark {
    border-color: var(--cockpit-border-strong);
    background: var(--cockpit-bg-secondary);
  }

  .worn-checkbox-tick {
    inline-size: 10px;
    block-size: 8px;
    color: var(--cockpit-accent-text);
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 0.12s ease, transform 0.12s ease;
  }

  .worn-checkbox-input:checked + .worn-checkbox-mark .worn-checkbox-tick {
    opacity: 1;
    transform: scale(1);
  }

  .worn-checkbox-input:focus-visible + .worn-checkbox-mark {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
  }

  .worn-checkbox-label {
    min-inline-size: 0;
    overflow-wrap: anywhere;
    font-family: var(--font-typewriter);
    font-size: 13px;
    color: var(--cockpit-text);
  }

  .worn-checkbox.is-disabled .worn-checkbox-label {
    color: var(--cockpit-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-checkbox-mark,
    .worn-checkbox-tick {
      transition: none;
    }
  }
</style>
