import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const input = read('../src/Input.svelte');
const textarea = read('../src/Textarea.svelte');
const select = read('../src/Select.svelte');
const range = read('../src/Range.svelte');
const inputElement = read('../src/InputElement.svelte');
const textareaElement = read('../src/TextareaElement.svelte');
const selectElement = read('../src/SelectElement.svelte');
const rangeElement = read('../src/RangeElement.svelte');
const index = read('../src/index.ts');
const demo = read('../index.html');
const packageJson = JSON.parse(read('../package.json'));

describe('native field contract', () => {
  test('preserves bindable values and forwards remaining native attributes', () => {
    for (const source of [input, textarea, select]) {
      expect(source).toContain("value = $bindable('')");
      expect(source).toContain('{...rest}');
    }
    expect(input).toContain('{autocomplete}');
    expect(input).toContain('{inputmode}');
    expect(input).toContain('{readonly}');
    expect(input).not.toContain("autocomplete = 'off'");
    expect(textarea).toContain('{readonly}');
    expect(select).toContain('disabled={option.disabled}');
  });

  test('makes each producer own its touch target and responsive containment', () => {
    for (const source of [input, textarea, select]) {
      expect(source).toContain('max-inline-size: 100%;');
      expect(source).toContain('min-inline-size: 0;');
      expect(source).toContain('touch-action: manipulation;');
      expect(source).toContain('@media (pointer: coarse)');
      expect(source).toContain('font-size: 16px;');
    }
    expect(input).toContain('min-block-size: 44px;');
    expect(textarea).toContain('min-block-size: 72px;');
    expect(select).toContain('min-block-size: 44px;');
    expect(range).toContain('max-inline-size: 100%;');
    expect(range).toContain('min-block-size: 44px;');
    expect(range).toContain('min-inline-size: 44px;');
    expect(range).toContain('touch-action: pan-y;');
  });

  test('keeps range semantics native and hostile values from consuming the track', () => {
    expect(range).toContain('type="range"');
    expect(range).toContain('bind:value');
    expect(range).toContain("aria-label={label || 'Value'}");
    expect(range).toContain('min-inline-size: 44px;');
    expect(range).toContain('max-inline-size: 40%;');
    expect(range).toContain('text-overflow: ellipsis;');
    expect(range).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

describe('theme and state behavior', () => {
  test('uses a theme-derived boundary and select arrow', () => {
    for (const source of [input, textarea, select]) {
      expect(source).toContain('--worn-field-boundary: color-mix(');
      expect(source).toContain('border: 1px solid var(--worn-field-boundary);');
      expect(source).toContain(':focus-visible');
      expect(source).toContain('@media (prefers-reduced-motion: reduce)');
      expect(source).toContain('transition: none;');
    }
    expect(range).toContain('var(--cockpit-border, #d8d2c8)');
    expect(range).toContain('var(--cockpit-accent, #0f766e)');
    expect(range).toContain('var(--cockpit-text-muted, #506058)');
    expect(select).toContain('linear-gradient(45deg, transparent 50%, currentColor 50%)');
    expect(select).not.toContain('data:image/svg+xml');
  });

  test('keeps placeholder, read-only, and disabled states explicit', () => {
    for (const source of [input, textarea]) {
      expect(source).toContain('::placeholder');
      expect(source).toContain('opacity: 1;');
      expect(source).toContain(':read-only:not(:disabled)');
    }
    for (const source of [input, textarea, select]) {
      expect(source).toContain('-webkit-text-fill-color: var(--cockpit-text-muted);');
      expect(source).toContain('cursor: not-allowed;');
    }
  });
});

describe('delivery contract', () => {
  test('exports all direct Svelte components and one browser bundle', () => {
    expect(index).toContain("export { default as Input } from './Input.svelte';");
    expect(index).toContain("export { default as Textarea } from './Textarea.svelte';");
    expect(index).toContain("export { default as Select } from './Select.svelte';");
    expect(index).toContain("export { default as Range } from './Range.svelte';");
    expect(packageJson.wornpage).toEqual({ contractVersion: 2, delivery: 'browser-bundle' });
    expect(packageJson.main).toBe('./dist/worn-form-fields.js');
    expect(demo).toContain('src="./dist/worn-form-fields.js"');
    expect(demo).toContain('<worn-range aria-label="Progress"');
  });

  test('registers accessible custom elements with typed public properties', () => {
    expect(inputElement).toContain("tag: 'worn-input'");
    expect(textareaElement).toContain("tag: 'worn-textarea'");
    expect(selectElement).toContain("tag: 'worn-select'");
    expect(rangeElement).toContain("tag: 'worn-range'");
    for (const source of [inputElement, textareaElement, selectElement]) {
      expect(source).toContain("ariaLabel: { attribute: 'aria-label'");
      expect(source).toContain("$derived(ariaLabel || host.getAttribute('aria-label') || '')");
      expect(source).toContain('(host as HTMLElement & { value: string }).value =');
      expect(source).toContain('max-inline-size: 100%;');
      expect(source).toContain('min-inline-size: 0;');
    }
    expect(selectElement).toContain("options: { type: 'Array' }");
    expect(rangeElement).toContain("value: { reflect: true, type: 'Number' }");
    expect(rangeElement).toContain("ariaLabel: { attribute: 'aria-label'");
  });
});
