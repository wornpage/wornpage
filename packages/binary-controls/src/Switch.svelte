<script lang="ts">
  import type { SwitchProps } from './types.js';

  let {
    checked = $bindable(false),
    onchange,
    label,
    ariaLabel,
    disabled = false,
    ...rest
  }: SwitchProps = $props();
</script>

<label class="worn-switch" class:is-disabled={disabled} class:is-labelled={Boolean(label)}>
  <input
    type="checkbox"
    class="worn-switch-input"
    role="switch"
    bind:checked
    {onchange}
    {disabled}
    aria-checked={checked}
    aria-label={ariaLabel || undefined}
    {...rest}
  />
  <span class="worn-switch-track" aria-hidden="true">
    <span class="worn-switch-thumb"></span>
  </span>
  {#if label}
    <span class="worn-switch-label">{label}</span>
  {/if}
</label>

<style>
  .worn-switch {
    --worn-binary-boundary: color-mix(in srgb, var(--cockpit-border-strong) 30%, var(--cockpit-text-muted));
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    max-inline-size: 100%;
    min-inline-size: 44px;
    min-block-size: 44px;
    align-items: center;
    gap: 10px;
    vertical-align: middle;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .worn-switch:not(.is-labelled) {
    justify-content: center;
  }

  .worn-switch.is-disabled {
    cursor: not-allowed;
  }

  .worn-switch-input {
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

  .worn-switch-track {
    position: relative;
    box-sizing: border-box;
    inline-size: 42px;
    block-size: 24px;
    flex: 0 0 42px;
    border: 2px solid var(--worn-binary-boundary);
    border-radius: 12px;
    background: var(--cockpit-border-strong);
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .worn-switch-input:checked + .worn-switch-track {
    border-color: var(--worn-binary-boundary);
    background: var(--cockpit-accent);
  }

  .worn-switch.is-disabled .worn-switch-track,
  .worn-switch.is-disabled .worn-switch-input:checked + .worn-switch-track {
    border-color: var(--cockpit-border-strong);
    background: var(--cockpit-border);
  }

  .worn-switch-thumb {
    position: absolute;
    inset-block-start: 1px;
    inset-inline-start: 1px;
    inline-size: 18px;
    block-size: 18px;
    border-radius: 50%;
    background: var(--cockpit-accent-text);
    box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
    transition: transform 0.15s ease, opacity 0.15s ease;
  }

  .worn-switch-input:checked + .worn-switch-track .worn-switch-thumb {
    transform: translateX(18px);
  }

  .worn-switch.is-disabled .worn-switch-thumb {
    opacity: 0.55;
  }

  .worn-switch-input:focus-visible + .worn-switch-track {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
  }

  .worn-switch-label {
    min-inline-size: 0;
    overflow-wrap: anywhere;
    font-family: var(--font-typewriter);
    font-size: 13px;
    color: var(--cockpit-text);
  }

  .worn-switch.is-disabled .worn-switch-label {
    color: var(--cockpit-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-switch-track,
    .worn-switch-thumb {
      transition: none;
    }
  }
</style>
