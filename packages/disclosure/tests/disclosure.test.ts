import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const accordion = read('../src/Accordion.svelte');
const collapsible = read('../src/Collapsible.svelte');
const accordionElement = read('../src/AccordionElement.svelte');
const collapsibleElement = read('../src/CollapsibleElement.svelte');
const index = read('../src/index.ts');
const demo = read('../index.html');
const packageJson = JSON.parse(read('../package.json'));

describe('semantic disclosure contract', () => {
  test('uses native details and button state without parallel roles', () => {
    expect(accordion).toContain('<details class="worn-accordion" bind:open ontoggle={handleToggle}>');
    expect(accordion).toContain('<summary class="worn-accordion-summary" aria-controls={panelId}>');
    expect(accordion).not.toContain('transition:slide');
    expect(collapsible).toContain('<button');
    expect(collapsible).toContain('type="button"');
    expect(collapsible).toContain('aria-expanded={open}');
    expect(collapsible).toContain('aria-controls={panelId}');
    expect(collapsible).toContain('aria-label={ariaLabel || undefined}');
  });

  test('creates hydration-stable panel relationships', () => {
    for (const source of [accordion, collapsible]) {
      expect(source).toContain('const instanceId = $props.id();');
      expect(source).toContain('panelId: suppliedPanelId');
      expect(source).toContain('id={panelId}');
    }
  });
});

describe('compact and motion behavior', () => {
  test('contains hostile labels and owns the complete trigger target', () => {
    for (const source of [accordion, collapsible]) {
      expect(source).toContain('max-inline-size: 100%;');
      expect(source).toContain('min-inline-size: 0;');
      expect(source).toContain('min-block-size: 44px;');
      expect(source).toContain('overflow-wrap: anywhere;');
      expect(source).toContain('touch-action: manipulation;');
      expect(source).toContain(':focus-visible');
    }
  });

  test('keeps only transitions that can execute and honors reduced motion', () => {
    expect(accordion).not.toContain("import { slide } from 'svelte/transition'");
    expect(accordion).toContain('@media (prefers-reduced-motion: reduce)');
    expect(collapsible).toContain('transition:slide={{ duration: prefersReducedMotion.current ? 0 : 180 }}');
    expect(collapsible).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

describe('browser delivery', () => {
  test('exports both Svelte components and one browser bundle', () => {
    expect(index).toContain("export { default as Accordion } from './Accordion.svelte';");
    expect(index).toContain("export { default as Collapsible } from './Collapsible.svelte';");
    expect(packageJson.wornpage).toEqual({ contractVersion: 2, delivery: 'browser-bundle' });
    expect(packageJson.main).toBe('./dist/worn-disclosure.js');
    expect(demo).toContain('src="./dist/worn-disclosure.js"');
  });

  test('registers reflected custom elements with structured change events', () => {
    expect(accordionElement).toContain("tag: 'worn-accordion'");
    expect(collapsibleElement).toContain("tag: 'worn-collapsible'");
    expect(collapsibleElement).toContain("ariaLabel: { attribute: 'aria-label'");
    for (const source of [accordionElement, collapsibleElement]) {
      expect(source).toContain("const slot = document.createElement('slot');");
      expect(source).toContain('use:attachLightDomSlot');
      expect(source).not.toContain('{#snippet children()}<slot>');
      expect(source).toContain('(host as HTMLElement & { open: boolean }).open = nextOpen;');
      expect(source).toContain("new CustomEvent('change'");
      expect(source).toContain('detail: { open: nextOpen }');
      expect(source).toContain('bubbles: true');
      expect(source).toContain('composed: true');
    }
  });
});
