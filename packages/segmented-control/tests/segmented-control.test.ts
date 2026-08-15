import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/SegmentedControl.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/SegmentedControlElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('native selection semantics', () => {
	test('renders a labeled native radio group', () => {
		expect(source).toContain('role="radiogroup"');
		expect(source).toContain('aria-label={label || name}');
		expect(source).toContain('type="radio"');
		expect(source).toContain('checked={active === option.id}');
	});

	test('isolates radio instances while preserving the submitted field name', () => {
		expect(source).toContain('const instanceId = $props.id();');
		expect(source).toContain('let radioName = $derived(`${name}-${instanceId}`);');
		expect(source).toContain('<input type="hidden" {name} value={active} />');
		expect(source).toContain('name={radioName}');
	});

	test('updates bindable state and reports changes', () => {
		expect(source).toContain("active = $bindable('')");
		expect(source).toContain('active = option.id;');
		expect(source).toContain('onchange?.(option.id);');
	});
});

describe('compact interaction contract', () => {
	test('contains equal-width segments and wraps long labels', () => {
		expect(source).toContain('max-inline-size: 100%;');
		expect(source).toContain('min-inline-size: 0;');
		expect(source).toContain('flex: 1 1 0;');
		expect(source).toContain('overflow-wrap: anywhere;');
	});

	test('reserves a full touch target and visible keyboard focus', () => {
		expect(source).toContain('min-block-size: 44px;');
		expect(source).toContain('touch-action: manipulation;');
		expect(source).toContain(".worn-segment input[type='radio'] {");
		expect(source).toContain('inset: 0;');
		expect(source).toContain('.worn-segment input:focus-visible + span');
	});

	test('honors reduced-motion preferences', () => {
		expect(source).toContain('@media (prefers-reduced-motion: reduce)');
		expect(source).toContain('transition: none;');
	});
});

describe('browser delivery', () => {
	test('wraps the canonical component and emits a change event', () => {
		expect(elementSource).toContain("tag: 'worn-segmented-control'");
		expect(elementSource).toContain('<SegmentedControl {options} bind:active {name} {label} onchange={handleChange} />');
		expect(elementSource).toContain("new CustomEvent('change', { detail: { id }, bubbles: true })");
	});

	test('demo renders the real compact bundle with duplicate public names', () => {
		expect(demoSource).toContain('src="./dist/worn-segmented-control.js"');
		expect(demoSource).toContain('data-demo="compact"');
		expect(demoSource.match(/name = 'period'/gu)?.length).toBe(2);
		expect(demoSource).toContain("{ id: 'monthly', label: 'Monthly' }");
	});
});
