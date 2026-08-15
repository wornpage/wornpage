import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const checkbox = read('../src/Checkbox.svelte');
const switchControl = read('../src/Switch.svelte');
const checkboxElement = read('../src/CheckboxElement.svelte');
const switchElement = read('../src/SwitchElement.svelte');
const demo = read('../index.html');
const packageJson = JSON.parse(read('../package.json'));

describe('native control contract', () => {
  test('uses labelled native inputs and preserves bindable change state', () => {
    expect(checkbox).toContain('<label class="worn-checkbox"');
    expect(checkbox).toContain('type="checkbox"');
    expect(checkbox).toContain('checked = $bindable(false)');
    expect(checkbox).toContain('{...rest}');
    expect(switchControl).toContain('<label class="worn-switch"');
    expect(switchControl).toContain('role="switch"');
    expect(switchControl).toContain('aria-checked={checked}');
    expect(switchControl).toContain('checked = $bindable(false)');
    expect(switchControl).toContain('{...rest}');
  });

  test('makes the native input own the complete touch target', () => {
    for (const source of [checkbox, switchControl]) {
      expect(source).toContain('min-inline-size: 44px;');
      expect(source).toContain('min-block-size: 44px;');
      expect(source).toContain('inset: 0;');
      expect(source).toContain('inline-size: 100%;');
      expect(source).toContain('block-size: 100%;');
      expect(source).toContain('touch-action: manipulation;');
    }
  });
});

describe('theme and compact behavior', () => {
  test('uses one explicit state boundary for checked and unchecked controls', () => {
    for (const source of [checkbox, switchControl]) {
      expect(source).toContain('--worn-binary-boundary: color-mix(in srgb, var(--cockpit-border-strong) 30%, var(--cockpit-text-muted));');
      expect(source).toContain('border-color: var(--worn-binary-boundary);');
      expect(source).toContain(':focus-visible +');
    }
  });

  test('contains long labels and honors reduced motion', () => {
    for (const source of [checkbox, switchControl]) {
      expect(source).toContain('max-inline-size: 100%;');
      expect(source).toContain('min-inline-size: 0;');
      expect(source).toContain('overflow-wrap: anywhere;');
      expect(source).toContain('@media (prefers-reduced-motion: reduce)');
      expect(source).toContain('transition: none;');
    }
  });
});

describe('browser delivery', () => {
  test('registers both custom elements and emits structured changes', () => {
    expect(checkboxElement).toContain("tag: 'worn-checkbox'");
    expect(switchElement).toContain("tag: 'worn-switch'");
    for (const source of [checkboxElement, switchElement]) {
      expect(source).toContain("ariaLabel: { attribute: 'aria-label'");
      expect(source).toContain("$derived(ariaLabel || host.getAttribute('aria-label') || '')");
      expect(source).toContain('ariaLabel={inputLabel}');
      expect(source).toContain(':host {');
      expect(source).toContain('display: inline-block;');
      expect(source).toContain('max-inline-size: 100%;');
      expect(source).toContain("new CustomEvent('change'");
      expect(source).toContain('detail: { checked }');
      expect(source).toContain('bubbles: true');
    }
  });

  test('bridges custom-element accessible names to the native input', () => {
    for (const source of [checkbox, switchControl]) {
      expect(source).toContain('aria-label={ariaLabel || undefined}');
      expect(source).toContain('{...rest}');
    }
  });

  test('ships one real bundle and demo surface', () => {
    expect(packageJson.wornpage).toEqual({ contractVersion: 2, delivery: 'browser-bundle' });
    expect(packageJson.main).toBe('./dist/worn-binary-controls.js');
    expect(demo).toContain('src="./dist/worn-binary-controls.js"');
    expect(demo).toContain('<worn-checkbox');
    expect(demo).toContain('<worn-switch');
  });
});
