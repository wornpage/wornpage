import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';
import { createUndoStack } from '../src/stack.js';
import { MAX_UNDO, UNDO_LABELS } from '../src/types.js';

const source = readFileSync(new URL('../src/UndoReceipt.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const historySource = readFileSync(new URL('../src/UndoHistoryList.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const elementSource = readFileSync(new URL('../src/UndoElement.svelte', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const indexSource = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const typesSource = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const configSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const demoSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

describe('snapshot stack', () => {
	test('clones snapshots without retaining source references', () => {
		const stack = createUndoStack<{ nested: { value: number } }>();
		const state = { nested: { value: 1 } };
		const snapshot = stack.snapshot(state);
		state.nested.value = 2;
		expect(snapshot.nested.value).toBe(1);
	});

	test('keeps the newest snapshots within its configured bound', () => {
		const stack = createUndoStack<number>(2);
		stack.commit(1);
		stack.commit(2);
		stack.commit(3);
		expect(stack.length).toBe(2);
		expect(stack.pop()).toBe(3);
		expect(stack.pop()).toBe(2);
		expect(stack.pop()).toBeNull();
	});

	test('clears state and keeps a one-entry floor for invalid bounds', () => {
		const stack = createUndoStack<number>(0);
		stack.commit(1);
		stack.commit(2);
		expect(stack.length).toBe(1);
		stack.clear();
		expect(stack.length).toBe(0);
	});
});

describe('receipt semantics and interaction', () => {
	test('compiles all Svelte surfaces', () => {
		expect(() => compile(source, { generate: 'client', runes: true })).not.toThrow();
		expect(() => compile(historySource, { generate: 'client', runes: true })).not.toThrow();
		expect(() => compile(elementSource, { generate: 'client', runes: true, customElement: true })).not.toThrow();
	});

	test('keeps live status text separate from interactive controls', () => {
		expect(source).toContain('<div class="wrn-undo-receipt">');
		expect(source).toContain('role="status" aria-live="polite" aria-atomic="true"');
		expect(source).toContain('aria-hidden="true"');
		expect(source).not.toContain('class="wrn-undo-receipt" role="status"');
	});

	test('renders only actions backed by a capability and handler', () => {
		expect(source).toContain('{#if (canUndo && onundo) || (canRedo && onredo)}');
		expect(source).toContain('{#if canUndo && onundo}');
		expect(source).toContain('{#if canRedo && onredo}');
		expect(source).toContain('aria-label={`Undo ${label}`}');
		expect(source).toContain('aria-label={`Redo ${label}`}');
		expect(source).not.toContain('⌘Z');
	});

	test('contains hostile labels in compact layouts', () => {
		expect(source).toContain('grid-template-columns: auto minmax(0, 1fr) auto;');
		expect(source).toContain('max-width: 100%;');
		expect(source).toContain('min-width: 0;');
		expect(source).toContain('overflow-wrap: anywhere;');
		expect(source).toContain('@media (max-width: 480px)');
		expect(source).toContain('grid-column: 2;');
	});

	test('owns touch, keyboard-focus, theme, and forced-color behavior', () => {
		expect(source).toContain('--wrn-undo-boundary: var(');
		expect(source).toContain('var(--worn-border, #c8c2b9) 60%');
		expect(source).toContain('touch-action: manipulation;');
		expect(source).toContain('@media (pointer: coarse)');
		expect(source).toContain('min-height: 44px;');
		expect(source).toContain('.wrn-undo-btn:focus-visible');
		expect(source).toContain('var(--worn-surface, #fdfbf7)');
		expect(source).toContain('@media (forced-colors: active)');
	});
});

describe('browsable history', () => {
	test('exports a controlled typed timeline without owning snapshots', () => {
		expect(indexSource).toContain("export { default as UndoHistoryList } from './UndoHistoryList.svelte';");
		for (const type of ['UndoHistoryItem', 'UndoHistoryItemState', 'UndoHistoryListProps']) expect(indexSource).toContain(type);
		expect(typesSource).toContain("export type UndoHistoryItemState = 'past' | 'current' | 'undone';");
		expect(historySource).toContain('items,');
		expect(historySource).toContain('onselect,');
		expect(historySource).not.toContain('createUndoStack');
	});

	test('owns timeline semantics, current state, and redo visibility', () => {
		expect(historySource).toContain('<ol class="wrn-history-list" aria-label={ariaLabel}>');
		expect(historySource).toContain('{#each items as item (item.id)}');
		expect(historySource).toContain("disabled={item.state === 'current'}");
		expect(historySource).toContain("aria-current={item.state === 'current' ? 'true' : undefined}");
		expect(historySource).toContain("{#if item.state === 'undone'} · undone{/if}");
		expect(historySource).toContain('onclick={() => onselect(item)}');
		expect(historySource).not.toContain('opacity: 0');
	});

	test('owns accessible focus, touch geometry, hostile text, themes, and motion', () => {
		expect(historySource).toContain('min-block-size: 44px;');
		expect(historySource).toContain('touch-action: manipulation;');
		expect(historySource).toContain('overflow-wrap: anywhere;');
		expect(historySource).toContain('outline: 2px dashed var(--worn-undo-focus, var(--worn-focus, var(--worn-text, #21322b)));');
		expect(historySource).toContain('@media (prefers-reduced-motion: reduce)');
		expect(historySource).toContain('@media (forced-colors: active)');
	});
});

describe('public API and browser delivery', () => {
	test('exports the stack, receipt, and complete action vocabulary without the wrapper component', () => {
		expect(indexSource).toContain("export { createUndoStack } from './stack.js';");
		expect(indexSource).toContain("export { default as UndoReceipt } from './UndoReceipt.svelte';");
		expect(indexSource).not.toContain('default as UndoElement');
		for (const key of Object.keys(UNDO_LABELS)) expect(typesSource).toContain(`| '${key}'`);
		expect(MAX_UNDO).toBe(50);
	});

	test('provides a side-effect-free stack subpath', () => {
		expect(packageJson.exports['.'].types).toBe('./src/index.ts');
		expect(packageJson.exports['./stack']).toEqual({
			types: './src/stack.ts',
			default: './src/stack.ts',
		});
	});

	test('emits composed, bubbling events from the custom-element host', () => {
		expect(elementSource).toContain('const host = $host<HTMLElement>();');
		expect(elementSource).toContain("name: 'wrn-undo' | 'wrn-redo'");
		expect(elementSource).toContain('detail: { action }');
		expect(elementSource).toContain('bubbles: true');
		expect(elementSource).toContain('composed: true');
		expect(elementSource).not.toContain('bind:this');
	});

	test('builds the canonical custom element with both capability properties', () => {
		expect(configSource).toContain("entry: 'src/UndoElement.svelte'");
		expect(elementSource).toContain("tag: 'worn-undo'");
		expect(elementSource).toContain("canundo: { type: 'Boolean' }");
		expect(elementSource).toContain("canredo: { type: 'Boolean' }");
	});

	test('demo exercises real undo and redo state in light and dark themes', () => {
		expect(demoSource).toContain('content="width=device-width, initial-scale=1, viewport-fit=cover"');
		expect(demoSource).toContain('src="./dist/worn-undo.js"');
		expect(demoSource).toContain("receipt.addEventListener('wrn-undo'");
		expect(demoSource).toContain("receipt.addEventListener('wrn-redo'");
		expect(demoSource).toContain('receipt.canundo = previous !== null;');
		expect(demoSource).toContain('receipt.canredo = next !== null;');
		expect(demoSource).toContain('@media (prefers-color-scheme: dark)');
	});
});
