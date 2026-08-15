import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { tabDomIds } from '../src/ids.js';
import { visibleScrollLeft } from '../src/scroll.js';

const source = readFileSync(new URL('../src/Tabs.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/TabsElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('tab semantics', () => {
	test('names an oriented tablist and exposes stable panel relationships', () => {
		expect(source).toContain('role="tablist" aria-label={label} aria-orientation="horizontal"');
		expect(source).toContain('role="tab"');
		expect(source).toContain('id={domIds.tabId}');
		expect(source).toContain('aria-controls={domIds.panelId}');
		expect(source).toContain('aria-selected={tab.id === active}');
	});

	test('keeps the existing bindable selection API and repairs invalid state', () => {
		expect(source).toContain("active = $bindable('')");
		expect(source).toContain('!tabs.some((tab) => tab.id === active)');
		expect(source).toContain('onchange?.(tabId);');
	});

	test('creates deterministic safe ids', () => {
		expect(tabDomIds('catalog', 'Web components')).toEqual({
			tabId: 'catalog-tab-Web-components',
			panelId: 'catalog-panel-Web-components',
		});
	});
});

describe('keyboard and compact behavior', () => {
	test('supports roving Arrow, Home, and End selection', () => {
		expect(source).toContain("event.key === 'ArrowRight'");
		expect(source).toContain("event.key === 'ArrowLeft'");
		expect(source).toContain("event.key === 'Home'");
		expect(source).toContain("event.key === 'End'");
		expect(source).toContain('targetButton.focus();');
	});

	test('owns containment, touch targets, and horizontal overflow', () => {
		expect(source).toContain('max-inline-size: 100%;');
		expect(source).toContain('min-inline-size: 0;');
		expect(source).toContain('overflow-x: auto;');
		expect(source).toContain('overscroll-behavior-inline: contain;');
		expect(source).toContain('min-block-size: 44px;');
		expect(source).toContain('touch-action: manipulation;');
	});

	test('keeps externally selected tabs inside the compact viewport', () => {
		expect(visibleScrollLeft({
			scrollLeft: 0,
			clientWidth: 314,
			scrollWidth: 553,
			itemLeft: 252,
			itemRight: 328,
		})).toBe(22);
		expect(visibleScrollLeft({
			scrollLeft: 205,
			clientWidth: 314,
			scrollWidth: 519,
			itemLeft: -205,
			itemRight: -110,
		})).toBe(0);
		expect(source).toContain('requestAnimationFrame(ensureActiveTabVisible)');
		expect(source).toContain("'[role=\"tab\"][aria-selected=\"true\"]'");
		expect(source).toContain("tablist.scrollTo({ left: nextLeft, behavior: 'auto' });");
	});

	test('bounds hostile labels without changing their accessible text', () => {
		expect(source).toContain('<span class="worn-tab-label">{tab.label}</span>');
		expect(source).toContain('max-inline-size: 24ch;');
		expect(source).toContain('.worn-tab-label {');
		expect(source).toContain('overflow: hidden;');
		expect(source).toContain('text-overflow: ellipsis;');
		expect(source).toContain('white-space: nowrap;');
	});

	test('honors reduced-motion preferences', () => {
		expect(source).toContain('@media (prefers-reduced-motion: reduce)');
		expect(source).toContain('transition: none;');
	});
});

describe('browser delivery', () => {
	test('wraps the canonical component and emits selection changes', () => {
		expect(elementSource).toContain("tag: 'worn-tabs'");
		expect(elementSource).toContain('<Tabs bind:active {tabs} id={controlId} {label} onchange={handleChange} />');
		expect(elementSource).toContain("new CustomEvent('change', { detail: { id }, bubbles: true })");
	});

	test('demo renders the real bundle with matching panels', () => {
		expect(demoSource).toContain('src="./dist/worn-tabs.js"');
		expect(demoSource).toContain("control.controlId = 'portfolio'");
		expect(demoSource).toContain('role="tabpanel"');
		expect(demoSource).toContain("panel.id = `portfolio-panel-${option.id}`");
		expect(demoSource).toContain("panel.setAttribute('aria-labelledby', `portfolio-tab-${option.id}`)");
	});
});
