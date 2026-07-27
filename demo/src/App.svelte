<script lang="ts">
  import { sectionContent } from './sections.ts';

  let currentTheme = $state('light');
  let showReceipt = $state(false);

  const sidebarItems = [
    { id: 'sidebar', href: '#sidebar', label: 'Sidebar', icon: '📋', kind: 'section' as const },
    { id: 'cmdk', href: '#cmdk', label: 'Command Palette', icon: '⌨️', kind: 'section' as const },
    { id: 'theme', href: '#theme', label: 'Theme', icon: '🎨', kind: 'section' as const },
    { id: 'receipt', href: '#receipt', label: 'Receipt', icon: '📝', kind: 'section' as const },
    { id: 'workflow', href: '#workflow', label: 'Workflow', icon: '⚙️', kind: 'section' as const },
    { id: 'toast', href: '#toast', label: 'Toast', icon: '🔔', kind: 'section' as const },
    { id: 'undo', href: '#undo', label: 'Undo', icon: '↩️', kind: 'section' as const },
    { id: 'sync', href: '#sync', label: 'Sync', icon: '🔄', kind: 'section' as const },
    { id: 'cli', href: '#cli', label: 'CLI', icon: '🛠️', kind: 'section' as const },
  ];

  function onnavigate(href: string) { window.location.hash = href; }
</script>

<div class="app-shell">
  <aside class="demo-sidebar">
    <nav class="demo-nav">
      <div class="demo-brand">Wornpage</div>
      {#each sidebarItems as item}
        <a href={item.href} class="demo-nav-item">
          <span class="demo-nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  </aside>

  <main class="demo-main">
    <header class="demo-header">
      <h1>Wornpage</h1>
      <p>Svelte 5 component library + dev toolkit — 9 component packages, 3 tools, 1 CLI</p>
      <div class="header-actions">
        <a href="https://github.com/wornpage/wornpage" class="demo-btn">GitHub</a>
        <button class="demo-btn" onclick={() => currentTheme = currentTheme === 'light' ? 'dark' : 'light'}>
          {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>

    {#each sidebarItems as item}
      <section id={item.id} class="demo-section">
        <h2>{item.icon} {item.label}</h2>
        {@html sectionContent(item.id)}
      </section>
    {/each}

    <footer>
      <p><a href="https://github.com/wornpage/wornpage">github.com/wornpage/wornpage</a> · MIT</p>
    </footer>
  </main>
</div>

<style>
  :root {
    --cockpit-bg: #f5f3ef;
  }
  .app-shell { display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; }
  .demo-sidebar { background: var(--cockpit-surface); border-right: 1px solid var(--cockpit-border); padding: 16px 12px; }
  .demo-brand { font-weight: 700; font-size: 16px; padding: 4px 8px 16px; }
  .demo-nav { display: flex; flex-direction: column; gap: 2px; }
  .demo-nav-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; text-decoration: none; color: inherit; font-size: 13px; }
  .demo-nav-item:hover { background: var(--cockpit-hover-bg); }
  .demo-nav-item:target { background: var(--cockpit-accent); color: var(--cockpit-accent-text); }
  .demo-nav-icon { font-size: 16px; width: 24px; text-align: center; }
  .demo-main { padding: 24px 32px; max-width: 800px; }
  .demo-header { margin-bottom: 32px; }
  .demo-header h1 { margin: 0; font-size: 28px; }
  .demo-header p { color: var(--cockpit-text-muted); margin: 4px 0 16px; }
  .header-actions { display: flex; gap: 8px; }
  .demo-btn { padding: 8px 16px; border: 1px solid var(--cockpit-border); border-radius: 8px; background: var(--cockpit-surface); cursor: pointer; font-size: 14px; color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
  .demo-btn:hover { background: var(--cockpit-hover-bg); }
  .demo-section { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--cockpit-border); }
  .demo-section h2 { margin: 0 0 4px; font-size: 18px; }
  .demo-section :global(code) { display: inline-block; padding: 4px 10px; background: var(--cockpit-surface); border: 1px solid var(--cockpit-border); border-radius: 6px; font-size: 13px; margin: 8px 0; }
  .demo-section :global(p) { color: var(--cockpit-text-muted); margin: 0 0 8px; line-height: 1.5; }
  .demo-section :global(table) { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  .demo-section :global(th), .demo-section :global(td) { padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--cockpit-border); }
  .demo-section :global(th) { font-weight: 600; color: var(--cockpit-text-muted); text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
  .demo-section :global(.status-blocked) { color: #e74c3c; font-weight: 600; }
  .demo-section :global(.status-active) { color: var(--cockpit-accent); font-weight: 600; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--cockpit-border); text-align: center; }
  footer a { color: var(--cockpit-accent); text-decoration: none; }
</style>