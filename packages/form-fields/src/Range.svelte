<script lang="ts">
  import type { RangeProps } from './types.js';

  let {
    value = $bindable(0),
    valueText = '',
    min = 0,
    max = 100,
    step = 1,
    label = '',
    suffix = '',
    oninput,
    onchange,
    disabled = false,
    class: className = '',
    ...rest
  }: RangeProps = $props();

  let percentage = $derived(
    max > min
      ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
      : 0
  );
  let visibleValue = $derived(valueText || `${value}${suffix}`);
</script>

<div
  class="worn-range {className}"
  class:is-disabled={disabled}
  role="group"
  aria-label={label || 'Range slider'}
  aria-disabled={disabled}
>
  <div class="worn-range-control">
    <input
      class="worn-range-input"
      type="range"
      {min}
      {max}
      {step}
      bind:value
      {oninput}
      {onchange}
      {disabled}
      aria-label={label || 'Value'}
      aria-valuetext={valueText || undefined}
      {...rest}
    />
    <svg class="worn-range-track" aria-hidden="true" focusable="false">
      <rect class="worn-range-fill" width={`${percentage}%`} height="100%"></rect>
    </svg>
  </div>
  <span class="worn-range-value" aria-hidden="true" title={visibleValue}>{visibleValue}</span>
</div>

<style>
  .worn-range {
    --_worn-range-default-fill: var(--worn-focus, var(--worn-text, #21322b));
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
  }

  .worn-range-control {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-block-size: 44px;
    min-inline-size: 44px;
  }

  .worn-range-input {
    position: absolute;
    z-index: 1;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    touch-action: pan-y;
    -webkit-appearance: none;
    appearance: none;
  }

  .worn-range-input:disabled {
    cursor: not-allowed;
  }

  .worn-range-track {
    position: relative;
    display: block;
    flex: 1 1 auto;
    inline-size: 100%;
    min-inline-size: 44px;
    block-size: 8px;
    overflow: hidden;
    border-radius: var(--worn-range-radius, 4px);
    background: var(--worn-range-track, var(--worn-border, #d8d2c8));
  }

  .worn-range-input:focus-visible + .worn-range-track {
    outline: 2px dashed var(--worn-range-focus, var(--worn-field-focus, var(--worn-focus, var(--worn-text, #21322b))));
    outline-offset: 3px;
  }

  .worn-range-fill {
    fill: var(--worn-range-fill, var(--_worn-range-default-fill));
    pointer-events: none;
    transition: width 0.15s ease;
  }

  @supports (color: color-mix(in srgb, black, white)) {
    .worn-range {
      --_worn-range-default-fill: color-mix(in srgb, var(--worn-accent, #0f766e) 55%, var(--worn-text, #21322b));
    }
  }

  .worn-range-value {
    flex: 0 1 auto;
    min-inline-size: 32px;
    max-inline-size: 40%;
    overflow: hidden;
    color: var(--worn-range-value, var(--worn-text-muted, #506058));
    font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
    font-size: 13px;
    line-height: 1.4;
    text-align: end;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
  }

  .worn-range.is-disabled .worn-range-track {
    background: var(--worn-bg-secondary, #ece6dd);
    box-shadow: inset 0 0 0 1px var(--worn-border, #d8d2c8);
  }

  .worn-range.is-disabled .worn-range-fill {
    fill: var(--worn-text-muted, #506058);
  }

  .worn-range.is-disabled .worn-range-value {
    color: var(--worn-text-secondary, #394b43);
  }

  @media (pointer: coarse) {
    .worn-range-input { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-range-fill { transition: none; }
  }
</style>
