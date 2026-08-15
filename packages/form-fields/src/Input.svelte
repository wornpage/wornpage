<script lang="ts">
  import type { InputProps } from './types.js';

  let {
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    oninput,
    onchange,
    onkeydown,
    onblur,
    required = false,
    disabled = false,
    readonly = false,
    autocomplete,
    inputmode,
    spellcheck = false,
    rows,
    id,
    class: className = '',
    ...rest
  }: InputProps = $props();

  let isTextarea = $derived(type === 'textarea' || rows !== undefined);
</script>

{#if isTextarea}
  <textarea
    class="worn-input worn-input-textarea {className}"
    {id}
    bind:value
    {placeholder}
    {oninput}
    {onchange}
    {onkeydown}
    {onblur}
    {required}
    {disabled}
    {readonly}
    {autocomplete}
    spellcheck={spellcheck === true}
    {rows}
    {...rest}
  ></textarea>
{:else}
  <input
    class="worn-input {className}"
    {id}
    {type}
    bind:value
    {placeholder}
    {oninput}
    {onchange}
    {onkeydown}
    {onblur}
    {required}
    {disabled}
    {readonly}
    {autocomplete}
    {inputmode}
    spellcheck={spellcheck === true}
    {...rest}
  />
{/if}

<style>
  .worn-input {
    --worn-field-boundary: color-mix(in srgb, var(--cockpit-border-strong) 30%, var(--cockpit-text-muted));
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 44px;
    min-inline-size: 0;
    padding: 9px 12px;
    border: 1px solid var(--worn-field-boundary);
    border-radius: var(--cockpit-radius-sm);
    background: var(--cockpit-surface);
    color: var(--cockpit-text);
    font-family: var(--font-typewriter);
    font-size: 14px;
    line-height: 1.4;
    touch-action: manipulation;
    transition: background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
  }

  .worn-input-textarea {
    min-block-size: 72px;
    padding: 8px 12px;
    resize: vertical;
    line-height: 28px;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      var(--cockpit-border) 27px,
      var(--cockpit-border) 28px
    );
    background-attachment: local;
  }

  .worn-input:focus-visible {
    outline: 2px dashed var(--cockpit-accent);
    outline-offset: 2px;
    border-color: var(--cockpit-accent);
    box-shadow: 0 0 0 1px var(--cockpit-accent-50);
  }

  .worn-input::placeholder {
    color: var(--cockpit-text-muted);
    opacity: 1;
  }

  .worn-input:read-only:not(:disabled) {
    background-color: var(--cockpit-bg-secondary);
    color: var(--cockpit-text-secondary, var(--cockpit-text));
  }

  .worn-input:disabled {
    background-color: var(--cockpit-bg-secondary);
    border-color: var(--worn-field-boundary);
    color: var(--cockpit-text-muted);
    -webkit-text-fill-color: var(--cockpit-text-muted);
    cursor: not-allowed;
    opacity: 1;
  }

  @media (pointer: coarse) {
    .worn-input { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-input { transition: none; }
  }
</style>
