<script lang="ts">
  import { Sidebar } from '@wornpage/sidebar';
  import { Cmdk } from '@wornpage/cmdk';
  import type { CmdkItem } from '@wornpage/cmdk';
  import { Theme } from '@wornpage/theme';
  import { WornReceipt } from '@wornpage/receipt';
  import { filterPacks, orderPacks, buildStandupText, primaryCommand, hasBlocker } from '@wornpage/workflow';
  import type { DemoPack } from '@wornpage/workflow';

  // Theme
  let currentTheme = $state('light');
  $effect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  });

  // Sidebar
  let sidebarCollapsed = $state(false);
  const sidebarItems = [
    { id: 'sidebar', href: '#sidebar', label: 'Sidebar', icon: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>', kind: 'section' as const },
    { id: 'cmdk', href: '#cmdk', label: 'Command Palette', icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', kind: 'section' as const },
    { id: 'theme', href: '#theme', label: 'Theme', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/>', kind: 'section' as const },
    { id: 'receipt', href: '#receipt', label: 'Receipt', icon: '<polyline points="20 6 9 17 4 12"/>', kind: 'section' as const },
    { id: 'workflow', href: '#workflow', label: 'Workflow', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', kind: 'section' as const },
    { id: 'toast', href: '#toast', label: 'Toast', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', kind: 'section' as const },
    { id: 'undo', href: '#undo', label: 'Undo', icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>', kind: 'section' as const },
    { id: 'sync', href: '#sync', label: 'Sync', icon: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>', kind: 'section' as const },
    { id: 'cli', href: '#cli', label: 'CLI', icon: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>', kind: 'section' as const },
  ];

  let activeSection = $state('sidebar');

  // CMDK
  let cmdkOpen = $state(false);
  const cmdkItems: CmdkItem[] = sidebarItems.map(i => ({ id: i.id, label: i.label, href: i.href }));

  // Receipt demo
  let receiptVisible = $state(false);
  let receiptCells = $state<Array<{ label: string; value: string }>>([]);

  function showReceiptDemo() {
    receiptCells = [
      { label: 'Action', value: 'Started' },
      { label: 'Pack', value: 'Fix navigation bug' },
      { label: 'From', value: 'blocked' },
      { label: 'To', value: 'active' }
    ];
    receiptVisible = true;
  }

  // Workflow demo
  const demoPacks: DemoPack[] = [
    { id: '1', title: 'Fix navigation bug', status: 'blocked', blocker: 'Waiting on API response', next: 'Start', owner: 'Dev', due: '2026-08-01', doneWhen: 'All nav links work on mobile', energy: 'medium', purpose: 'Mobile nav is broken since the CSS diet' },
    { id: '2', title: 'Update README', status: 'active', blocker: 'none', next: 'Open', owner: 'Docs', due: null, doneWhen: 'README reflects current API surface', energy: 'low', purpose: 'Docs are stale' },
    { id: '3', title: 'Publish v0.2.0', status: 'done', blocker: 'none', next: 'Done', owner: 'Release', due: '2026-07-20', doneWhen: 'Package on npm', energy: 'high', purpose: 'First major release' },
  ];
  const ordered = orderPacks(demoPacks);
  const standup = buildStandupText(ordered);

  function onnavigate(href: string) {
    activeSection = href.replace('#', '') || 'sidebar';
    cmdkOpen = false;
  }
</script>

<div class="app-shell">
  <aside class="demo-sidebar" class:collapsed={sidebarCollapsed}>
    <Sidebar
      items={sidebarItems}
      activeHref={'#' + activeSection}
      {onnavigate}
      collapsed={sidebarCollapsed}
      oncollapsed={(c: boolean) => sidebarCollapsed = c}
    />
  </aside>

  <main class="demo-main">
    <header class="demo-header">
      <h1>Wornpage</h1>
      <p>Svelte 5 component library + dev toolkit — 9 packages, 3 tools, 1 CLI</p>
      <div class="header-actions">
        <button class="demo-btn" onclick={() => cmdkOpen = !cmdkOpen}>⌘K Search</button>
        <Theme {currentTheme} onchange={(t: string) => currentTheme = t} />
        <a href="https://github.com/wornpage/wornpage" class="demo-btn">GitHub</a>
      </div>
    </header>

    <!-- Sidebar -->
    <section id="sidebar" class="demo-section" class:active={activeSection === 'sidebar'}>
      <h2>📋 Sidebar</h2>
      <p>Collapsible navigation with keyboard nav, search, favorites, drag-reorder, and collapsible groups. The sidebar on the left IS this component — try collapsing it with the ◀ button.</p>
      <code>bun add @wornpage/sidebar</code>
    </section>

    <!-- CMDK -->
    <section id="cmdk" class="demo-section" class:active={activeSection === 'cmdk'}>
      <h2>⌨️ Command Palette</h2>
      <p>Fuzzy-search command palette using native &lt;dialog&gt; for focus trapping. 11 tests.</p>
      <code>bun add @wornpage/cmdk</code>
      <div class="demo-preview">
        <button class="demo-btn" onclick={() => cmdkOpen = true}>Open palette</button>
        {#if cmdkOpen}
          <div class="cmdk-overlay" onclick={() => cmdkOpen = false}>
            <div class="cmdk-wrapper" onclick={(e: MouseEvent) => e.stopPropagation()}>
              <Cmdk
                items={cmdkItems}
                onselect={(id: string) => {
                  const item = cmdkItems.find(i => i.id === id);
                  if (item?.href) onnavigate(item.href);
                }}
                onclose={() => cmdkOpen = false}
              />
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- Theme -->
    <section id="theme" class="demo-section" class:active={activeSection === 'theme'}>
      <h2>🎨 Theme</h2>
      <p>8-palette theme switcher with system detection. The toggle in the header IS this component. Try changing themes — the whole page responds.</p>
      <code>bun add @wornpage/theme</code>
      <div class="demo-preview">
        <div class="theme-swatches">
          {#each ['system','light','dark','forest','ocean','sepia'] as t}
            <button class="swatch" class:active={currentTheme === t} onclick={() => currentTheme = t}>
              {t === 'system' ? '💻' : t === 'light' ? '☀️' : t === 'dark' ? '🌙' : t === 'forest' ? '🌲' : t === 'ocean' ? '🌊' : '🏜️'}
              <small>{t}</small>
            </button>
          {/each}
        </div>
      </div>
    </section>

    <!-- Receipt -->
    <section id="receipt" class="demo-section" class:active={activeSection === 'receipt'}>
      <h2>📝 Receipt</h2>
      <p>Action confirmation cards with undo support. Fly transition, accessible markup.</p>
      <code>bun add @wornpage/receipt</code>
      <div class="demo-preview">
        <button class="demo-btn" onclick={showReceiptDemo}>
          {receiptVisible ? 'Reset' : 'Show receipt'}
        </button>
        {#key receiptVisible}
          {#if receiptVisible}
            <WornReceipt
              summary="Pack started successfully."
              cells={receiptCells}
              undoAvailable={true}
              onundo={() => receiptVisible = false}
              ondone={() => receiptVisible = false}
            />
          {/if}
        {/key}
      </div>
    </section>

    <!-- Workflow -->
    <section id="workflow" class="demo-section" class:active={activeSection === 'workflow'}>
      <h2>⚙️ Workflow</h2>
      <p>Pack state machine — the core logic of wornpage. Pure functions, zero UI dependency. 21 tests.</p>
      <code>bun add @wornpage/workflow</code>
      <div class="demo-preview">
        <p class="standup"><strong>Standup:</strong> {standup}</p>
        <table class="packs-table">
          <thead><tr><th>Title</th><th>Status</th><th>Blocker</th><th>Next Action</th><th>Energy</th></tr></thead>
          <tbody>
            {#each ordered as pack}
              <tr>
                <td>{pack.title}</td>
                <td><span class="status-{pack.status}">{pack.status}</span></td>
                <td>{pack.blocker}</td>
                <td>{hasBlocker(pack) ? 'Review blocker' : primaryCommand(pack).label}</td>
                <td>{pack.energy ?? '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Toast -->
    <section id="toast" class="demo-section" class:active={activeSection === 'toast'}>
      <h2>🔔 Toast</h2>
      <p>Notification web component with Svelte fly transition. Framework-agnostic via custom element.</p>
      <code>bun add @wornpage/toast</code>
      <div class="demo-preview">
        <p class="demo-field-help">Toasts appear in the bottom-right corner. Import the web component and call <code>pushToast('Message', 'success')</code>.</p>
      </div>
    </section>

    <!-- Undo -->
    <section id="undo" class="demo-section" class:active={activeSection === 'undo'}>
      <h2>↩️ Undo</h2>
      <p>Undo/redo stack with snapshot-before-mutate pattern. Powers the receipt's undo button.</p>
      <code>bun add @wornpage/undo</code>
      <div class="demo-preview">
        <p class="demo-field-help">Create a stack with <code>createUndoStack()</code>, call <code>snapshot(pack)</code> before each mutation, and <code>undo()</code> to restore. Used by every pack action in the main app.</p>
      </div>
    </section>

    <!-- Sync -->
    <section id="sync" class="demo-section" class:active={activeSection === 'sync'}>
      <h2>🔄 Sync</h2>
      <p>Demo state sync code generation — no accounts, share a code to share state. 10 tests.</p>
      <code>bun add @wornpage/sync</code>
      <div class="demo-preview">
        <p class="demo-field-help"><code>generateSyncCode()</code> → "ABCD-EFGH-JKLM-NPQR" · <code>normalizeSyncCode(raw)</code> · <code>syncClientId(code)</code></p>
      </div>
    </section>

    <!-- CLI -->
    <section id="cli" class="demo-section" class:active={activeSection === 'cli'}>
      <h2>🛠️ CLI</h2>
      <p>Scaffold and ship new @wornpage packages. Two commands: <code>new</code> and <code>ship</code>.</p>
      <code>bunx wornpage new my-component</code>
      <div class="demo-preview">
        <p class="demo-field-help">Creates <code>package.json</code>, <code>src/WornMyComponent.svelte</code>, <code>src/index.ts</code>, <code>tests/test.ts</code>, <code>.gitignore</code>. The <code>ship</code> command runs tests, builds, bumps version, commits, tags, pushes, and publishes.</p>
      </div>
    </section>

    <footer>
      <p><a href="https://github.com/wornpage/wornpage">github.com/wornpage/wornpage</a> · MIT · 66 tests · 9 packages</p>
    </footer>
  </main>
</div>

<style>
  .app-shell { display: grid; grid-template-columns: auto 1fr; min-height: 100vh; }
  .demo-sidebar { background: var(--cockpit-surface, #fff); border-right: 1px solid var(--cockpit-border, #ddd); }
  .demo-sidebar.collapsed { width: 48px; }
  .demo-main { padding: 24px 32px; max-width: 900px; }
  .demo-header { margin-bottom: 32px; }
  .demo-header h1 { margin: 0; font-size: 28px; }
  .demo-header p { color: var(--cockpit-text-muted, #666); margin: 4px 0 16px; }
  .header-actions { display: flex; gap: 8px; align-items: center; }
  .demo-btn { padding: 6px 14px; border: 1px solid var(--cockpit-border, #ddd); border-radius: 999px; background: var(--cockpit-surface, #fff); cursor: pointer; font-size: 13px; color: inherit; text-decoration: none; font-weight: 500; }
  .demo-btn:hover { background: var(--cockpit-hover-bg, rgba(0,0,0,.05)); }
  .demo-section { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--cockpit-border, #ddd); opacity: 0.6; transition: opacity 0.3s; }
  .demo-section.active { opacity: 1; }
  .demo-section h2 { margin: 0 0 4px; font-size: 20px; }
  .demo-section p { color: var(--cockpit-text-muted, #666); margin: 0 0 8px; line-height: 1.5; }
  .demo-section :global(code) { padding: 2px 8px; background: var(--cockpit-surface, #fff); border: 1px solid var(--cockpit-border, #ddd); border-radius: 4px; font-size: 13px; }
  .demo-preview { margin-top: 12px; }
  .demo-field-help { font-size: 13px; color: var(--cockpit-text-muted, #888); }
  .demo-field-help :global(code) { font-size: 12px; }
  .standup { font-size: 14px; color: var(--cockpit-text-muted, #666); margin-bottom: 12px; }
  .packs-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  .packs-table th, .packs-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--cockpit-border, #ddd); }
  .packs-table th { font-weight: 600; color: var(--cockpit-text-muted, #666); text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
  .status-blocked { color: #e74c3c; font-weight: 600; }
  .status-active { color: var(--cockpit-accent, #0d9488); font-weight: 600; }
  .status-done { color: var(--cockpit-text-muted, #999); }
  .cmdk-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; }
  .cmdk-wrapper { width: 500px; max-width: 90vw; }
  .theme-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
  .swatch { padding: 8px 14px; border: 2px solid var(--cockpit-border, #ddd); border-radius: 8px; background: var(--cockpit-surface, #fff); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 16px; }
  .swatch.active { border-color: var(--cockpit-accent, #0d9488); }
  .swatch small { font-size: 10px; color: var(--cockpit-text-muted, #666); }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--cockpit-border, #ddd); text-align: center; font-size: 13px; color: var(--cockpit-text-muted, #666); }
  footer a { color: var(--cockpit-accent, #0d9488); text-decoration: none; }
</style>