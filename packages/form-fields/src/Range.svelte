<script lang="ts">
  import type { RangeProps } from './types.js';

  let {
    value = $bindable(0),
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
      ? Math.min(100, Math.max(0, Math.round(((value - min) / (max - min)) * 100)))
      : 0
  );
  let bucket = $derived(Math.round(percentage / 5) * 5);
  let visibleValue = $derived(`${value}${suffix}`);
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
      {...rest}
    />
    <div class="worn-range-track">
      <div class="worn-range-fill worn-range-fill-{bucket}"></div>
    </div>
  </div>
  <span class="worn-range-value" aria-hidden="true" title={visibleValue}>{visibleValue}</span>
</div>

<style>
  .worn-range {
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
    flex: 1 1 auto;
    min-inline-size: 44px;
    block-size: 8px;
    overflow: hidden;
    border-radius: var(--worn-range-radius, 4px);
    background: var(--worn-range-track, var(--cockpit-border, #d8d2c8));
  }

  .worn-range-input:focus-visible + .worn-range-track {
    outline: 2px dashed var(--worn-range-focus, var(--cockpit-accent, #0f766e));
    outline-offset: 3px;
  }

  .worn-range-fill {
    block-size: 100%;
    min-inline-size: 0;
    border-radius: inherit;
    background: var(--worn-range-fill, var(--cockpit-accent, #0f766e));
    pointer-events: none;
    transition: width 0.15s ease;
  }

  .worn-range-value {
    flex: 0 1 auto;
    min-inline-size: 32px;
    max-inline-size: 40%;
    overflow: hidden;
    color: var(--worn-range-value, var(--cockpit-text-muted, #506058));
    font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
    font-size: 13px;
    line-height: 1.4;
    text-align: end;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
  }

  .worn-range.is-disabled .worn-range-track {
    background: var(--cockpit-bg-secondary, #ece6dd);
    box-shadow: inset 0 0 0 1px var(--cockpit-border, #d8d2c8);
  }

  .worn-range.is-disabled .worn-range-fill {
    background: var(--cockpit-text-muted, #506058);
  }

  .worn-range.is-disabled .worn-range-value {
    color: var(--cockpit-text-secondary, #394b43);
  }

  .worn-range-fill-0 { width: 0%; }
  .worn-range-fill-5 { width: 5%; }
  .worn-range-fill-10 { width: 10%; }
  .worn-range-fill-15 { width: 15%; }
  .worn-range-fill-20 { width: 20%; }
  .worn-range-fill-25 { width: 25%; }
  .worn-range-fill-30 { width: 30%; }
  .worn-range-fill-35 { width: 35%; }
  .worn-range-fill-40 { width: 40%; }
  .worn-range-fill-45 { width: 45%; }
  .worn-range-fill-50 { width: 50%; }
  .worn-range-fill-55 { width: 55%; }
  .worn-range-fill-60 { width: 60%; }
  .worn-range-fill-65 { width: 65%; }
  .worn-range-fill-70 { width: 70%; }
  .worn-range-fill-75 { width: 75%; }
  .worn-range-fill-80 { width: 80%; }
  .worn-range-fill-85 { width: 85%; }
  .worn-range-fill-90 { width: 90%; }
  .worn-range-fill-95 { width: 95%; }
  .worn-range-fill-100 { width: 100%; }

  @media (pointer: coarse) {
    .worn-range-input { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-range-fill { transition: none; }
  }
</style>
