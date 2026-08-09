<svelte:options customElement={{ tag: 'worn-cmdk', shadow: 'none', props: { items: { type: 'Array' }, placeholder: {} } }} />

<script lang="ts">
	import type { CmdkItem } from './types.js';
	import { groupCmdkItems } from './group.js';

	interface Props {
		items?: string | CmdkItem[];
		placeholder?: string;
	}

	let { items = '[]', placeholder = 'Search…' }: Props = $props();

	// Parse items — supports both attribute (JSON string) and property (object array)
	let parsedItems = $derived<CmdkItem[]>(typeof items === 'string' ? JSON.parse(items) : items);

	let dialogEl: HTMLDialogElement;
	let inputEl: HTMLInputElement;
	let query = $state('');
	let selected = $state(0);

	const MAX_ROWS = 40;

	function fuzzyMatch(needle: string, target: string): boolean {
		if (!needle) return true;
		const q = needle.toLowerCase();
		const t = target.toLowerCase();
		let qi = 0;
		for (let ti = 0; ti < t.length && qi < q.length; ti++) {
			if (t[ti] === q[qi]) qi++;
		}
		return qi === q.length;
	}

	function matches(item: CmdkItem, needle: string): boolean {
		if (fuzzyMatch(needle, item.label)) return true;
		if (item.hint && fuzzyMatch(needle, item.hint)) return true;
		if (item.keywords) for (const k of item.keywords) { if (fuzzyMatch(needle, k)) return true; }
		return false;
	}

	const filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		const matched = needle ? parsedItems.filter(i => matches(i, needle)) : parsedItems;
		return matched.slice(0, MAX_ROWS);
	});

	$effect(() => { void filtered; selected = 0; });

	export function open() {
		if (!dialogEl || dialogEl.open) return;
		query = ''; selected = 0;
		if (typeof dialogEl.showModal === 'function') dialogEl.showModal();
		inputEl?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		const count = displayedItems.length;
		if (e.key === 'ArrowDown' && count) { e.preventDefault(); selected = (selected + 1) % count; scrollActive(); }
		else if (e.key === 'ArrowUp' && count) { e.preventDefault(); selected = (selected - 1 + count) % count; scrollActive(); }
		else if (e.key === 'Enter') { e.preventDefault(); displayedItems[selected]?.onSelect?.(); dialogEl?.close(); dispatchEvent(new CustomEvent('close')); }
	}

	function scrollActive() {
		setTimeout(() => dialogEl?.querySelector('.cmdk-item.is-active')?.scrollIntoView({ block: 'nearest' }), 0);
	}

	function handleSelect(index: number) {
		displayedItems[index]?.onSelect?.();
		dialogEl?.close();
		dispatchEvent(new CustomEvent('close'));
	}

	const grouped = $derived(groupCmdkItems(filtered));
	const displayedItems = $derived(grouped.orderedItems);
</script>

<dialog bind:this={dialogEl} class="cmdk" aria-label="Command palette"
	onclose={() => dispatchEvent(new CustomEvent('close'))} onkeydown={(e) => e.key === 'Escape' && dispatchEvent(new CustomEvent('close'))}>
	<input bind:this={inputEl} bind:value={query} class="cmdk-input" type="text"
		autocomplete="off" spellcheck="false" {placeholder}
		aria-label="Command palette search" role="combobox" aria-expanded="true"
		aria-controls="cmdk-list" aria-activedescendant={displayedItems.length ? `cmdk-option-${selected}` : undefined}
		onkeydown={onKeydown} />
	<ul id="cmdk-list" class="cmdk-list" role="listbox" aria-label="Results">
		{#each grouped.noGroup as item, i (item.id)}
			<li role="presentation">
				<button id={`cmdk-option-${i}`} type="button" class="cmdk-item" class:is-active={selected === i}
					role="option" aria-selected={selected === i}
					onclick={() => handleSelect(i)}>
					<span>{item.label}</span>
					{#if item.hint}<small>{item.hint}</small>{/if}
				</button>
			</li>
		{/each}
		{#each grouped.groups as group (group.name)}
			<li class="cmdk-group-label" role="separator">{group.name}</li>
			{#each group.items as item, gi (item.id)}
				{@const idx = group.startIndex + gi}
				<li role="presentation">
					<button id={`cmdk-option-${idx}`} type="button" class="cmdk-item" class:is-active={selected === idx}
						role="option" aria-selected={selected === idx}
						onclick={() => handleSelect(idx)}>
						<span>{item.label}</span>
						{#if item.hint}<small>{item.hint}</small>{/if}
					</button>
				</li>
			{/each}
		{/each}
		{#if filtered.length === 0}
			<li class="cmdk-empty" role="option" aria-selected="false">No matches.</li>
		{/if}
	</ul>
</dialog>

<style>
	@keyframes cmdk-in { from { opacity: 0; transform: scale(0.96) translateY(-6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
	.cmdk { animation: cmdk-in 0.15s ease-out; width: min(520px, 92vw); max-width: 92vw; padding: 0;
		border: 1px solid var(--cmdk-border, #d0cac1); border-radius: var(--cmdk-radius, 8px);
		background: var(--cmdk-surface, #fff); color: var(--cmdk-text, #21322b);
		box-shadow: 0 12px 40px rgba(0,0,0,0.3); margin: 12vh auto auto; }
	.cmdk::backdrop { background: rgba(0,0,0,0.45); }
	.cmdk-input { width: 100%; box-sizing: border-box; border: 0;
		border-bottom: 1px solid var(--cmdk-border, #e2ddd5); background: transparent;
		color: inherit; font: inherit; font-size: 15px; padding: 14px 16px; outline: none; }
	.cmdk-list { list-style: none; margin: 0; padding: 6px; max-height: 46vh; overflow-y: auto; }
	.cmdk-item { display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
		padding: 8px 10px; border-radius: var(--cmdk-radius-sm, 6px); cursor: pointer;
		width: 100%; border: 0; background: transparent; color: inherit; font: inherit; font-size: 14px;
		text-align: left; }
	.cmdk-item.is-active { background: var(--cmdk-selected-bg, #d7efe7); }
	.cmdk-item small { color: var(--cmdk-text-muted, #63746a); font-size: 11px; white-space: nowrap; }
	.cmdk-group-label { padding: 8px 10px 4px; font-size: 10px; font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.04em; color: var(--cmdk-text-muted, #63746a); }
	.cmdk-empty { padding: 12px 10px; color: var(--cmdk-text-muted, #63746a); font-size: 13px; }
</style>
