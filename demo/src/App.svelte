<script lang="ts">
  import { onMount } from 'svelte';
  import { Sidebar } from '@wornpage/sidebar';
  import { Cmdk } from '@wornpage/cmdk';
  import type { CmdkHandle, CmdkItem } from '@wornpage/cmdk';
  import { Theme } from '@wornpage/theme';
  import { WornReceipt } from '@wornpage/receipt';
  import { Button } from '@wornpage/button';
  
  
  import { filterPacks, orderPacks, buildStandupText, primaryCommand, hasBlocker } from '@wornpage/workflow';
  import type { DemoPack } from '@wornpage/workflow';
  import { generateSyncCode, syncQR } from '@wornpage/sync';
  import { fly, fade } from 'svelte/transition';

  let currentTheme = $state('light');
  $effect(() => document.documentElement.setAttribute('data-theme', currentTheme));

  const sections = ['sidebar','button','cmdk','theme','receipt','workflow','toast','undo','sync','cli'];

  function sectionFromHash(hash: string) {
    const section = hash.replace(/^#/, '');
    return sections.includes(section) ? section : 'sidebar';
  }

  let sidebarCollapsed = $state(typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches);
  let activeSection = $state(typeof window === 'undefined' ? 'sidebar' : sectionFromHash(window.location.hash));

  onMount(() => {
    const syncActiveSection = () => activeSection = sectionFromHash(window.location.hash);
    window.addEventListener('hashchange', syncActiveSection);
    window.addEventListener('popstate', syncActiveSection);

    return () => {
      window.removeEventListener('hashchange', syncActiveSection);
      window.removeEventListener('popstate', syncActiveSection);
    };
  });

  const sidebarItems = sections.map(id => ({
    id, href: '#' + id, label: id.charAt(0).toUpperCase() + id.slice(1),
    icon: id === 'sidebar' ? '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>' :
         id === 'cmdk' ? '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' :
         id === 'theme' ? '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/>' :
         id === 'receipt' ? '<polyline points="20 6 9 17 4 12"/>' :
         id === 'workflow' ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' :
         id === 'toast' ? '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' :
         id === 'undo' ? '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>' :
         id === 'sync' ? '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>' :
         '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    kind: 'section' as const
  }));

  let cmdkRef = $state<CmdkHandle | null>(null);
  const cmdkItems: CmdkItem[] = sidebarItems.map(i => ({ id: i.id, label: i.label, onSelect: () => onnavigate(i.href || "") }));

  function openPalette() {
    cmdkRef?.open();
  }

  let receiptVisible = $state(false);
  let toasts = $state<Array<{ id: number; message: string; kind: string }>>([]);
  let toastId = 0;
  let syncDemoCode = $state('');

  function addToast(msg: string, kind: string = 'success') {
    const id = ++toastId;
    toasts = [...toasts, { id, message: msg, kind }];
    setTimeout(() => toasts = toasts.filter(t => t.id !== id), 3500);
  }

  function showReceiptDemo() {
    receiptVisible = !receiptVisible;
    addToast('Receipt ' + (receiptVisible ? 'shown' : 'dismissed'));
  }

  const demoPacks: DemoPack[] = [
    { id: '1', title: 'Fix navigation bug', status: 'blocked', blocker: 'Waiting on API response', next: 'Start', owner: 'Dev', due: '2026-08-01', doneWhen: 'All nav links work on mobile' },
    { id: '2', title: 'Update README', status: 'active', blocker: 'none', next: 'Open', owner: 'Docs', due: null, doneWhen: 'README reflects current API' },
    { id: '3', title: 'Publish v0.2.0', status: 'done', blocker: 'none', next: 'Done', owner: 'Release', due: '2026-07-20', doneWhen: 'Package on npm' },
  ];
  const standup = buildStandupText(orderPacks(demoPacks));

  function onnavigate(href: string) {
    const section = sectionFromHash(href);
    const hash = '#' + section;

    activeSection = section;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<div class="app-shell">
  <aside class="demo-sidebar" class:collapsed={sidebarCollapsed}>
    <Sidebar items={sidebarItems} activeHref={'#' + activeSection} {onnavigate} collapsed={sidebarCollapsed} oncollapsed={(c: boolean) => sidebarCollapsed = c} />
  </aside>

  <Cmdk bind:this={cmdkRef} items={cmdkItems} />

  <main class="demo-main">
    <header class="demo-header">
      <h1>Wornpage</h1>
      <p>26 standalone components and one release CLI</p>
      <div class="header-actions">
        <Button onclick={openPalette}>Search</Button>
        <Theme bind:theme={currentTheme} />
        <a href="https://github.com/wornpage/wornpage" class="demo-btn">GitHub</a>
      </div>
    </header>

    <section id="sidebar" class="demo-section" class:active={activeSection === 'sidebar'}>
      <h2>Sidebar</h2>
      <p>Collapsible navigation with keyboard nav, search, and groups. The sidebar on the left IS this component.</p>
      <code>bun add @wornpage/sidebar</code>
    </section>

    <section id="button" class="demo-section" class:active={activeSection === 'button'}>
      <h2>Button</h2>
      <p>Shared command styling for buttons and links.</p>
      <code>bun add @wornpage/button</code>
      <div class="demo-preview">
        <Button variant="primary">Primary</Button>
        <Button>Default</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </section>

    <section id="cmdk" class="demo-section" class:active={activeSection === 'cmdk'}>
      <h2>Command Palette</h2>
      <p>Fuzzy-search palette using native dialog. Try it:</p>
      <code>bun add @wornpage/cmdk</code>
      <div class="demo-preview">
        <Button onclick={openPalette}>Open palette</Button>
      </div>
    </section>

    <section id="theme" class="demo-section" class:active={activeSection === 'theme'}>
      <h2>Theme</h2>
      <p>System-aware palette switcher. The toggle in the header IS this component.</p>
      <code>bun add @wornpage/theme</code>
      <div class="demo-preview">
        <div class="theme-swatches">
          {#each ['light','dark','forest','ocean','sepia'] as t}
            <button class="swatch" class:active={currentTheme === t} onclick={() => currentTheme = t}>{t}</button>
          {/each}
        </div>
      </div>
    </section>

    <section id="receipt" class="demo-section" class:active={activeSection === 'receipt'}>
      <h2>Receipt</h2>
      <p>Action confirmation cards with undo. Fly transition.</p>
      <code>bun add @wornpage/receipt</code>
      <div class="demo-preview">
        <Button variant="primary" onclick={showReceiptDemo}>{receiptVisible ? 'Dismiss' : 'Show'} receipt</Button>
        {#key receiptVisible}
          {#if receiptVisible}
            <WornReceipt summary="Pack started." cells={[{ label: 'Status', value: 'Active' }, { label: 'By', value: 'Demo' }]} undoAvailable={true} onundo={() => receiptVisible = false} ondone={() => receiptVisible = false} />
          {/if}
        {/key}
      </div>
    </section>

    <section id="workflow" class="demo-section" class:active={activeSection === 'workflow'}>
      <h2>Workflow</h2>
      <p>Pack state machine built from pure functions.</p>
      <code>bun add @wornpage/workflow</code>
      <div class="demo-preview">
        <p class="standup"><strong>Standup:</strong> {standup}</p>
        <div class="table-scroll">
          <table class="packs-table">
            <thead><tr><th>Title</th><th>Status</th><th>Blocker</th><th>Next</th><th>Energy</th></tr></thead>
            <tbody>
              {#each orderPacks(demoPacks) as pack}
                <tr>
                  <td>{pack.title}</td>
                  <td><span class="status-{pack.status}">{pack.status}</span></td>
                  <td>{pack.blocker}</td>
                  <td>{hasBlocker(pack) ? 'Review' : primaryCommand(pack).label}</td>
                  <td>{pack.energy ?? ''}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="toast" class="demo-section" class:active={activeSection === 'toast'}>
      <h2>Toast</h2>
      <p>Notification component with fly transition. Try it:</p>
      <code>bun add @wornpage/toast</code>
      <div class="demo-preview">
        <Button onclick={() => addToast('Changes saved!', 'success')}>Success</Button>
        <Button variant="danger" onclick={() => addToast('Something went wrong.', 'error')}>Error</Button>
        <Button variant="accent" onclick={() => addToast('Just a heads up.', 'info')}>Info</Button>
      </div>
    </section>

    <section id="undo" class="demo-section" class:active={activeSection === 'undo'}>
      <h2>Undo</h2>
      <p>Undo/redo stack. Powers the receipt Undo button above.</p>
      <code>bun add @wornpage/undo</code>
    </section>

    <section id="sync" class="demo-section" class:active={activeSection === 'sync'}>
      <h2>Sync</h2>
      <p>No-account sharing via sync codes.</p>
      <code>bun add @wornpage/sync</code>
      <div class="demo-preview">
        <Button variant="primary" onclick={() => syncDemoCode = generateSyncCode()}>Generate code</Button>
        {#if syncDemoCode}
          <div class="demo-qr">{@html syncQR(syncDemoCode, window.location.origin)}</div>
          <p class="sync-code-display">{syncDemoCode}</p>
        {/if}
      </div>
    </section>

    <section id="cli" class="demo-section" class:active={activeSection === 'cli'}>
      <h2>CLI</h2>
      <p>Scaffold and ship new packages.</p>
      <code>bunx wornpage new my-component</code>
    </section>

    <footer>
      <p><a href="https://github.com/wornpage/wornpage">github.com/wornpage/wornpage</a> · MIT · 26 components · 1 CLI</p>
    </footer>
  </main>

  {#each toasts as t (t.id)}
    <div class="demo-toast toast-{t.kind}" in:fly={{ y: 20, duration: 200 }} out:fade={{ duration: 150 }}>
      <span>{t.message}</span>
    </div>
  {/each}
</div>

<style>
  .app-shell { display: grid; grid-template-columns: auto minmax(0, 1fr); min-height: 100vh; }
  .demo-sidebar { background: var(--cockpit-surface, #fff); border-right: 1px solid var(--cockpit-border, #ddd); }
  .demo-main { box-sizing: border-box; min-width: 0; padding: 24px 32px; width: min(100%, 900px); }
  .demo-header { margin-bottom: 32px; }
  .demo-header h1 { margin: 0; font-size: 28px; }
  .demo-header p { color: var(--cockpit-text-muted, #666); margin: 4px 0 16px; }
  .header-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .demo-btn { padding: 6px 14px; border: 1px solid var(--cockpit-border); border-radius: 999px; background: var(--cockpit-surface); cursor: pointer; font-size: 13px; color: inherit; text-decoration: none; }
  .demo-btn:hover { background: var(--cockpit-hover-bg, rgba(0,0,0,.05)); }
  .demo-section { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--cockpit-border); opacity: 0.5; transition: opacity 0.3s; }
  .demo-section.active { opacity: 1; }
  .demo-section h2 { margin: 0 0 4px; font-size: 20px; }
  .demo-section p { color: var(--cockpit-text-muted); margin: 0 0 8px; line-height: 1.5; }
  .demo-section :global(code) { display: inline-block; max-width: 100%; overflow-wrap: anywhere; padding: 2px 8px; background: var(--cockpit-surface); border: 1px solid var(--cockpit-border); border-radius: 4px; font-size: 13px; }
  .demo-preview { min-width: 0; margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .standup { font-size: 14px; color: var(--cockpit-text-muted); margin-bottom: 12px; }
  .table-scroll { max-width: 100%; overflow-x: auto; }
  .packs-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  .packs-table th, .packs-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--cockpit-border); }
  .packs-table th { font-weight: 600; color: var(--cockpit-text-muted); text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
  .status-blocked { color: #e74c3c; font-weight: 600; }
  .status-active { color: var(--cockpit-accent); font-weight: 600; }
  .status-done { color: var(--cockpit-text-muted); }
  .theme-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
  .swatch { padding: 8px 14px; border: 2px solid var(--cockpit-border); border-radius: 8px; background: var(--cockpit-surface); cursor: pointer; text-transform: capitalize; font-size: 13px; }
  .swatch.active { border-color: var(--cockpit-accent); }
  .demo-toast { position: fixed; bottom: 20px; right: 20px; padding: 10px 18px; border-radius: 8px; color: #fff; font-size: 13px; z-index: 200; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .toast-success { background: #0d9488; }
  .toast-error { background: #e74c3c; }
  .toast-info { background: #3498db; }
  .sync-code-display { font-family: monospace; font-size: 18px; letter-spacing: 2px; margin: 8px 0; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--cockpit-border); text-align: center; font-size: 13px; color: var(--cockpit-text-muted); }
  footer a { color: var(--cockpit-accent); text-decoration: none; }
  @media (max-width: 720px) {
    .demo-sidebar { position: sticky; top: 0; align-self: start; height: 100vh; z-index: 10; }
    .demo-main { padding: 16px; }
  }
</style> 




