export function sectionContent(id: string): string {
  switch (id) {
    case 'sidebar':
      return `<p>Collapsible navigation sidebar with keyboard nav, search, favorites, drag-reorder, and collapsible groups. 15 KB Svelte 5 component with web component build for framework-agnostic use.</p>
<code>bun add @wornpage/sidebar</code>`;
    case 'cmdk':
      return `<p>Command palette with fuzzy search and keyboard-first navigation. Uses native &lt;dialog&gt; for focus trapping. 11 tests cover the search algorithm.</p>
<code>bun add @wornpage/cmdk</code>`;
    case 'theme':
      return `<p>8-palette theme switcher (system, light, dark, forest, ocean, sepia, halloween, winter). Ships no CSS — pure functions and a Svelte component. Best README in the library.</p>
<code>bun add @wornpage/theme</code>`;
    case 'receipt':
      return `<p>Action confirmation cards with undo support. Svelte fly transition, accessible markup (role="status", aria-live). Used by the workflow engine after every pack action.</p>
<code>bun add @wornpage/receipt</code>`;
    case 'workflow':
      return `<p>Pack state machine — the intellectual core of wornpage. Pure functions for blocker detection, next-action resolution, primary command, pack ordering, filtering, and standup text generation. 21 tests.</p>
<code>bun add @wornpage/workflow</code>
<table><thead><tr><th>Export</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>hasBlocker(pack)</code></td><td>Is the pack blocked?</td></tr>
<tr><td><code>isMissingNextAction(pack)</code></td><td>Does it need a next action?</td></tr>
<tr><td><code>isReview(pack)</code></td><td>Does it need review?</td></tr>
<tr><td><code>primaryCommand(pack)</code></td><td>What should the primary button do?</td></tr>
<tr><td><code>orderPacks(packs)</code></td><td>Sort by urgency (blocked first)</td></tr>
<tr><td><code>filterPacks(packs, filter, query)</code></td><td>Filter by status + text search</td></tr>
<tr><td><code>buildStandupText(packs)</code></td><td>One-sentence summary of state</td></tr>
</tbody></table>`;
    case 'toast':
      return `<p>Toast notification component. Web component wrapper for framework-agnostic use. Svelte fly transition.</p>
<code>bun add @wornpage/toast</code>`;
    case 'undo':
      return `<p>Undo/redo stack with snapshot-before-mutate pattern. Used by receipt cards after every pack action. 5 logic tests.</p>
<code>bun add @wornpage/undo</code>`;
    case 'sync':
      return `<p>Demo state sync code generation (XXXX-XXXX-XXXX-XXXX format, no ambiguous characters). SHA-256 client ID derivation. 10 tests including determinism and uniqueness.</p>
<code>bun add @wornpage/sync</code>`;
    case 'cli':
      return `<p>CLI for scaffolding and shipping new @wornpage packages. Two commands: <code>new</code> (scaffolds a complete package skeleton) and <code>ship</code> (test → build → bump → push → publish). 4 tests.</p>
<code>bunx wornpage new my-component</code>`;
    default:
      return '';
  }
}