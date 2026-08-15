<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '@wornpage/button';
  import { Cmdk, type CmdkHandle, type CmdkItem } from '@wornpage/cmdk';
  import { Select } from '@wornpage/form-fields';
  import { Sidebar, type NavItem } from '@wornpage/sidebar';
  import { Theme } from '@wornpage/theme';
  import ComponentExample from './ComponentExample.svelte';
  import { CATALOG_GROUPS, DEMO_CATALOG, type CatalogCategory, type DemoCatalogId } from './sections';

  let currentTheme = $state('light');
  $effect(() => document.documentElement.setAttribute('data-theme', currentTheme));

  const sections = DEMO_CATALOG.map(({ id }) => id);

  function sectionFromHash(hash: string): DemoCatalogId {
    const section = hash.replace(/^#/, '');
    return (sections.includes(section as DemoCatalogId) ? section : sections[0]) as DemoCatalogId;
  }

  let sidebarCollapsed = $state(typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches);
  let activeSection = $state<DemoCatalogId>(typeof window === 'undefined' ? sections[0] : sectionFromHash(window.location.hash));

  onMount(() => {
    const syncActiveSection = () => activeSection = sectionFromHash(window.location.hash);
    window.addEventListener('hashchange', syncActiveSection);
    window.addEventListener('popstate', syncActiveSection);

    if (window.location.hash) {
      requestAnimationFrame(() => document.getElementById(activeSection)?.scrollIntoView({ block: 'start' }));
    }

    return () => {
      window.removeEventListener('hashchange', syncActiveSection);
      window.removeEventListener('popstate', syncActiveSection);
    };
  });

  function iconForCategory(category: CatalogCategory): string {
    if (category === 'status') return '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>';
    if (category === 'inputs') return '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="18" r="2"/>';
    if (category === 'commands') return '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>';
    if (category === 'layout') return '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>';
    return '<path d="M6 3h12v6H6z"/><path d="M6 15h12v6H6z"/><path d="M12 9v6"/>';
  }

  const sidebarItems: NavItem[] = CATALOG_GROUPS.map((group) => ({
    id: `category-${group.id}`,
    label: group.label,
    children: group.entries.map((entry) => ({
      id: entry.id,
      href: `#${entry.id}`,
      label: entry.label,
      keywords: [entry.id, entry.description],
      icon: iconForCategory(entry.category),
      kind: 'section' as const,
    })),
  }));

  let cmdkRef = $state<CmdkHandle | null>(null);
  const cmdkItems: CmdkItem[] = DEMO_CATALOG.map((entry) => ({
    id: entry.id,
    label: entry.label,
    group: CATALOG_GROUPS.find((group) => group.id === entry.category)?.label,
    onSelect: () => navigateTo(entry.id),
  }));

  function openPalette() {
    cmdkRef?.open();
  }

  function navigateTo(section: DemoCatalogId) {
    const hash = `#${section}`;
    activeSection = section;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleNavigate(href: string) {
    navigateTo(sectionFromHash(href));
  }

  function handleCatalogSelect(event: Event) {
    navigateTo((event.currentTarget as HTMLSelectElement).value as DemoCatalogId);
  }
</script>

<div class="app-shell">
  <aside class="demo-sidebar" class:collapsed={sidebarCollapsed} aria-label="Component catalog">
    <Sidebar
      items={sidebarItems}
      activeHref={'#' + activeSection}
      onnavigate={handleNavigate}
      collapsed={sidebarCollapsed}
      oncollapsed={(collapsed: boolean) => sidebarCollapsed = collapsed}
    />
  </aside>

  <Cmdk bind:this={cmdkRef} items={cmdkItems} />

  <main class="demo-main">
    <header class="demo-header">
      <div>
        <h1>Wornpage</h1>
        <p>26 standalone component repositories, one inspectable catalog.</p>
      </div>
      <div class="header-actions">
        <Button onclick={openPalette}>Search catalog</Button>
        <Theme bind:theme={currentTheme} />
        <a href="https://github.com/wornpage/wornpage" class="repo-link">GitHub</a>
      </div>
      <div class="catalog-jump">
        <label for="catalog-jump">Jump to component</label>
        <Select
          id="catalog-jump"
          value={activeSection}
          onchange={handleCatalogSelect}
          options={DEMO_CATALOG.map((entry) => ({ value: entry.id, label: entry.label }))}
        />
      </div>
    </header>

    {#each CATALOG_GROUPS as group (group.id)}
      <div class="category-heading">
        <span>{group.label}</span>
        <span>{group.entries.length}</span>
      </div>
      {#each group.entries as entry (entry.id)}
        <section id={entry.id} class="demo-section" class:active={activeSection === entry.id} data-component={entry.id}>
          <div class="section-heading">
            <div>
              <h2>{entry.label}</h2>
              <p>{entry.description}</p>
            </div>
            <code>@wornpage/{entry.id}</code>
          </div>
          <ComponentExample id={entry.id} {openPalette} />
        </section>
      {/each}
    {/each}

    <footer>
      <a href="https://github.com/wornpage/wornpage">github.com/wornpage/wornpage</a>
      <span>MIT</span>
      <span>{DEMO_CATALOG.length} components</span>
    </footer>
  </main>
</div>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) { margin: 0; overflow-x: clip; }
  .app-shell { display: grid; grid-template-columns: auto minmax(0, 1fr); min-height: 100vh; max-width: 100%; }
  .demo-sidebar { align-self: start; background: var(--cockpit-surface, #fff); border-right: 1px solid var(--cockpit-border, #ddd); height: 100vh; overflow-y: auto; position: sticky; top: 0; width: 248px; z-index: 20; }
  .demo-sidebar.collapsed { width: 72px; }
  .demo-main { box-sizing: border-box; min-width: 0; padding: 24px 32px 40px; width: min(100%, 980px); }
  .demo-header { border-bottom: 1px solid var(--cockpit-border, #ddd); display: grid; gap: 16px; margin-bottom: 28px; padding-bottom: 22px; }
  .demo-header h1 { font-size: 28px; letter-spacing: 0; margin: 0; }
  .demo-header p { color: var(--cockpit-text-muted, #666); line-height: 1.5; margin: 4px 0 0; }
  .header-actions {
    --wrn-theme-active-bg: var(--cockpit-accent, #23796d);
    --wrn-theme-active-text: var(--cockpit-accent-text, #fff);
    --wrn-theme-border: var(--cockpit-border-strong, #bbb);
    --wrn-theme-btn-bg: var(--cockpit-surface, #fff);
    --wrn-theme-hover: var(--cockpit-hover-bg, rgba(0,0,0,.05));
    --wrn-theme-text: var(--cockpit-text, #1a1a1a);
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }
  .repo-link { align-items: center; background: var(--cockpit-surface, #fff); border: 1px solid var(--cockpit-border, #ddd); border-radius: 6px; color: inherit; display: inline-flex; font-size: 13px; min-height: 36px; padding: 6px 12px; text-decoration: none; }
  .repo-link:hover { background: var(--cockpit-hover-bg, rgba(0,0,0,.05)); }
  .repo-link:focus-visible { outline: 2px dashed var(--cockpit-accent, currentColor); outline-offset: 2px; }
  .catalog-jump { display: grid; gap: 6px; max-width: 22rem; min-width: 0; }
  .catalog-jump label { color: var(--cockpit-text-secondary, #4e5f57); font-size: 12px; font-weight: 650; }
  .category-heading { align-items: center; border-bottom: 2px solid var(--cockpit-border, #ddd); color: var(--cockpit-text-secondary, #555); display: flex; font-size: 12px; font-weight: 700; justify-content: space-between; margin: 36px 0 0; padding: 0 0 8px; text-transform: uppercase; }
  .category-heading span:last-child { color: var(--cockpit-text-muted, #666); font-variant-numeric: tabular-nums; }
  .demo-section { border-bottom: 1px solid var(--cockpit-border, #ddd); min-width: 0; padding: 24px 0 28px; scroll-margin-top: 16px; }
  .demo-section.active { border-bottom-color: var(--cockpit-accent, #23796d); }
  .section-heading { align-items: start; display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; margin-bottom: 16px; min-width: 0; }
  .section-heading > div { flex: 1 1 20rem; min-width: 0; }
  .section-heading h2 { font-size: 19px; letter-spacing: 0; margin: 0 0 4px; }
  .section-heading p { color: var(--cockpit-text-muted, #666); line-height: 1.5; margin: 0; overflow-wrap: anywhere; }
  .section-heading code { background: var(--cockpit-bg-secondary, var(--cockpit-surface, #fff)); border: 1px solid var(--cockpit-border, #ddd); border-radius: 4px; color: var(--cockpit-text-secondary, #555); flex: 0 1 auto; font-size: 12px; max-width: 100%; overflow-wrap: anywhere; padding: 4px 7px; }
  footer { align-items: center; color: var(--cockpit-text-muted, #666); display: flex; flex-wrap: wrap; font-size: 12px; gap: 8px 16px; padding-top: 32px; }
  footer a { color: var(--cockpit-accent, #23796d); overflow-wrap: anywhere; }
  @media (max-width: 720px) {
    .demo-main { padding: 16px 14px 32px; }
    .demo-header { margin-bottom: 20px; }
    .section-heading > div { flex-basis: 100%; }
  }
  @media (max-width: 360px) {
    .demo-main { padding-inline: 10px; }
    .header-actions { align-items: stretch; flex-direction: column; }
    .header-actions > :global(*) { max-width: 100%; }
  }
</style>
