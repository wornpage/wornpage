import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { tabDomIds } from '../src/ids.js';
import { pagedScrollLeft, visibleScrollLeft } from '../src/scroll.js';

const source = readFileSync(new URL('../src/Tabs.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/TabsElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');

describe('tab semantics', () => {
	test('names an oriented tablist and exposes stable panel relationships', () => {
		expect(source).toMatch(/role="tablist"\s+aria-label=\{label\}\s+aria-orientation="horizontal"/u);
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
	});

	test('keeps tab-button touch manipulation without restricting strip panning', () => {
		expect(source).toMatch(/\.worn-tab\s*\{[^}]*touch-action: manipulation;/u);
		expect(source).not.toContain('touch-action: pan-x;');
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
		expect(source).toContain('requestAnimationFrame(() => {');
		expect(source).toContain('ensureActiveTabVisible();');
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

	test('limits hover feedback to hover-capable fine pointers', () => {
		expect(source).toMatch(/@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*\.worn-tabs-control:hover:not\(:disabled\)[\s\S]*\.worn-tab:hover[\s\S]*\}/u);
	});

	test('owns one state-aware focus token across tabs and overflow controls', () => {
		expect(source).toMatch(/\.worn-tabs-control:focus-visible,\s*\.worn-tab:focus-visible \{\s*outline: 2px dashed var\(--worn-tabs-focus, currentColor\);\s*outline-offset: -2px;\s*\}/u);
		expect(source).not.toContain('outline: 2px dashed var(--cockpit-accent);');
	});
});

describe('overflow controls', () => {
	test('calculates bounded horizontal scroll pages without touching the document', () => {
		expect(pagedScrollLeft({ scrollLeft: 0, clientWidth: 314, scrollWidth: 553, direction: 1 })).toBe(239);
		expect(pagedScrollLeft({ scrollLeft: 239, clientWidth: 314, scrollWidth: 553, direction: -1 })).toBe(0);
		expect(pagedScrollLeft({ scrollLeft: 120, clientWidth: 300, scrollWidth: 1000, direction: 1 })).toBe(360);
	});

	test('measures overflow from a stable shell outside ResizeObserver delivery', () => {
		expect(source).toContain('tablist.scrollWidth > tabstrip.clientWidth + 1');
		expect(source).toContain('new ResizeObserver(scheduleScrollStateUpdate)');
		expect(source).toMatch(/observer\.observe\(tabstrip\);/u);
		expect(source).not.toMatch(/observer\.observe\(tablist\);/u);
		expect(source).toContain('scrollStateFrame = requestAnimationFrame(() => {');
		expect(source).toContain('scrollStateFrame = undefined;');
		expect(source).toContain('updateScrollState();');
		expect(source).toContain('onscroll={updateScrollState}');
		expect(source).toContain('disabled={!canScrollBackward}');
		expect(source).toContain('disabled={!canScrollForward}');
		expect(source).toContain('{#if hasOverflow}');
		expect(source).toContain('role="tablist"');
	});

	test('remeasures after tab id or label changes and cleans up scheduled frames', () => {
		expect(source).toContain("tabs.map((tab) => `${tab.id}\\u0000${tab.label}`).join('\\u0001')");
		expect(source).toContain('if (selectedId && tabSignature) ensureActiveTabVisible();');
		expect(source).toContain('if (scrollStateFrame !== undefined) cancelAnimationFrame(scrollStateFrame);');
		expect(source).toContain('if (overflowVisibilityFrame !== undefined) cancelAnimationFrame(overflowVisibilityFrame);');
	});

	test('keeps controls touch-safe, labelled, and motion-aware', () => {
		expect(source).toContain('aria-label="Scroll to previous tabs"');
		expect(source).toContain('aria-label="Scroll to next tabs"');
		expect(source).toContain('inline-size: 44px;');
		expect(source).toContain('min-block-size: 44px;');
		expect(source).toMatch(/\.worn-tabs-control\s*\{[\s\S]*touch-action: manipulation;/u);
		expect(source).toContain("behavior: prefersReducedMotion() ? 'auto' : 'smooth'");
	});

	test('rechecks selected-tab visibility after overflow controls commit their layout', () => {
		expect(source).toContain('const overflowChanged = nextHasOverflow !== hasOverflow;');
		expect(source).toContain('if (overflowChanged) scheduleActiveTabVisibility();');
		expect(source).toContain('overflowVisibilityFrame = requestAnimationFrame(() => {');
		expect(source).toContain('ensureActiveTabVisible();');
		expect(source).toContain('if (overflowVisibilityFrame !== undefined) cancelAnimationFrame(overflowVisibilityFrame);');
	});

	test('hands terminal overflow focus to the enabled opposite control', () => {
		expect(source).toContain("onfocusout={(event) => recoverOverflowFocus(event, 'Scroll to next tabs')}");
		expect(source).toContain("onfocusout={(event) => recoverOverflowFocus(event, 'Scroll to previous tabs')}");
		expect(source).toContain('if (!(event.currentTarget instanceof HTMLButtonElement) || !event.currentTarget.disabled) return;');
		expect(source).toContain('tabstrip?.querySelector<HTMLButtonElement>(`.worn-tabs-control[aria-label="${label}"]`)');
		expect(source).toContain('queueMicrotask(() => {');
		expect(source).toContain('Tabs overflow focus target is unavailable');
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
