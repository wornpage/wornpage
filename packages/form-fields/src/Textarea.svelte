<script lang="ts">
  import type { TextareaProps } from './types.js';

  let {
    value = $bindable(''),
    placeholder = '',
    rows = 3,
    oninput,
    onchange,
    onkeydown,
    onblur,
    required = false,
    disabled = false,
    readonly = false,
    autocomplete,
    spellcheck = false,
    id,
    class: className = '',
    ...rest
  }: TextareaProps = $props();
</script>

<div class="worn-textarea-wrap">
  <textarea
    class="worn-textarea {className}"
    {id}
    bind:value
    {placeholder}
    {rows}
    {oninput}
    {onchange}
    {onkeydown}
    {onblur}
    {required}
    {disabled}
    {readonly}
    {autocomplete}
    spellcheck={spellcheck === true}
    {...rest}
  ></textarea>
</div>

<style>
  .worn-textarea-wrap {
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    position: relative;
  }

  .worn-textarea {
    --worn-field-boundary: color-mix(in srgb, var(--worn-border-strong) 30%, var(--worn-text-muted));
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 100%;
    min-block-size: 72px;
    min-inline-size: 0;
    padding: 8px 12px;
    border: 1px solid var(--worn-field-boundary);
    border-radius: var(--worn-radius-sm);
    background: var(--worn-surface);
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      var(--worn-border) 27px,
      var(--worn-border) 28px
    );
    background-attachment: local;
    color: var(--worn-text);
    font-family: var(--font-typewriter);
    font-size: 14px;
    line-height: 28px;
    resize: vertical;
    touch-action: manipulation;
    transition: background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
  }

  .worn-textarea:focus-visible {
    outline: 2px dashed var(--worn-field-focus, var(--worn-focus, var(--worn-text, #21322b)));
    outline-offset: 2px;
    border-color: var(--worn-accent);
    box-shadow: 0 0 0 1px var(--worn-accent-50);
  }

  .worn-textarea::placeholder {
    color: var(--worn-text-muted);
    opacity: 1;
  }

  .worn-textarea:read-only:not(:disabled) {
    background-color: var(--worn-bg-secondary);
    color: var(--worn-text-secondary, var(--worn-text));
  }

  .worn-textarea:disabled {
    background-color: var(--worn-bg-secondary);
    border-color: var(--worn-field-boundary);
    color: var(--worn-text-muted);
    -webkit-text-fill-color: var(--worn-text-muted);
    cursor: not-allowed;
    opacity: 1;
  }

  @media (pointer: coarse) {
    .worn-textarea {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-textarea { transition: none; }
  }
</style>
