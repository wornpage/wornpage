<script lang="ts">
  import type { SelectProps } from './types.js';

  let {
    value = $bindable(''),
    onchange,
    options,
    required = false,
    disabled = false,
    id,
    class: className = '',
    ...rest
  }: SelectProps = $props();
</script>

<select class="worn-select {className}" {id} bind:value {onchange} {required} {disabled} {...rest}>
  {#each options as option (option.value)}
    <option value={option.value} disabled={option.disabled}>{option.label}</option>
  {/each}
</select>

<style>
  .worn-select {
    --worn-field-boundary: color-mix(in srgb, var(--cockpit-border-strong) 30%, var(--cockpit-text-muted));
    box-sizing: border-box;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
    padding: 9px 32px 9px 12px;
    overflow: hidden;
    border: 1px solid var(--worn-field-boundary);
    border-radius: var(--cockpit-radius-sm);
    background-color: var(--cockpit-surface);
    background-image:
      linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position:
      calc(100% - 14px) calc(50% + 1px),
      calc(100% - 9px) calc(50% + 1px);
    background-repeat: no-repeat;
    background-size: 5px 5px, 5px 5px;
    color: var(--cockpit-text);
    font-family: var(--font-typewriter);
    font-size: 14px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
    appearance: none;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
  }

  .worn-select:focus-visible {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
    border-color: var(--cockpit-accent);
    box-shadow: 0 0 0 1px var(--cockpit-accent-50);
  }

  .worn-select:disabled {
    background-color: var(--cockpit-bg-secondary);
    border-color: var(--worn-field-boundary);
    color: var(--cockpit-text-muted);
    -webkit-text-fill-color: var(--cockpit-text-muted);
    cursor: not-allowed;
    opacity: 1;
  }

  @media (pointer: coarse) {
    .worn-select { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-select { transition: none; }
  }
</style>
