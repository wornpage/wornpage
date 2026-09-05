<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Button } from '@wornpage/button';
  import { Cmdk, type CmdkHandle, type CmdkItem } from '@wornpage/cmdk';
  import { Select } from '@wornpage/form-fields';
  import { Sidebar, type NavIcon, type NavItem } from '@wornpage/sidebar';
  import { Theme, type ThemeName } from '@wornpage/theme';
  import ComponentExample from './ComponentExample.svelte';
  import { CATALOG_GROUPS, DEMO_CATALOG, catalogMetadata, type CatalogCategory, type DemoCatalogId } from './sections';

  let currentTheme = $state<ThemeName>('system');

  const sections = DEMO_CATALOG.map(({ id }) => id);

  function sectionFromHash(hash: string): DemoCatalogId {
    const section = hash.replace(/^#/, '');
    return (sections.includes(section as DemoCatalogId) ? section : sections[0]) as DemoCatalogId;
  }

  let sidebarCollapsed = $state(typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches);
  let activeSection = $state<DemoCatalogId>(typeof window === 'undefined' ? sections[0] : sectionFromHash(window.location.hash));
  let pendingPaletteSection = $state<DemoCatalogId | null>(null);

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  async function revealSection(section: DemoCatalogId, focus: boolean) {
    await tick();
    const target = document.getElementById(section);
    target?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (!focus) return;
    requestAnimationFrame(() => document.getElementById(`${section}-heading`)?.focus({ preventScroll: true }));
  }

  onMount(() => {
    const compactQuery = window.matchMedia('(max-width: 720px)');
    const syncActiveSection = () => {
      activeSection = sectionFromHash(window.location.hash);
      void revealSection(activeSection, true);
    };
    const syncSidebarForViewport = () => sidebarCollapsed = compactQuery.matches;
    window.addEventListener('hashchange', syncActiveSection);
    window.addEventListener('popstate', syncActiveSection);
    compactQuery.addEventListener('change', syncSidebarForViewport);

    if (window.location.hash) {
      void revealSection(activeSection, false);
    }

    return () => {
      window.removeEventListener('hashchange', syncActiveSection);
      window.removeEventListener('popstate', syncActiveSection);
      compactQuery.removeEventListener('change', syncSidebarForViewport);
    };
  });

  function iconForCategory(category: CatalogCategory): NavIcon {
    if (category === 'status') return { shapes: [
      { type: 'circle', cx: 12, cy: 12, r: 9 },
      { type: 'path', d: 'M12 8v4M12 16h.01' },
    ] };
    if (category === 'inputs') return { shapes: [
      { type: 'path', d: 'M4 6h16M4 12h16M4 18h16' },
      { type: 'circle', cx: 9, cy: 6, r: 2 },
      { type: 'circle', cx: 15, cy: 12, r: 2 },
      { type: 'circle', cx: 11, cy: 18, r: 2 },
    ] };
    if (category === 'commands') return { shapes: [
      { type: 'path', d: 'M5 12h14m-6-6 6 6-6 6' },
    ] };
    if (category === 'layout') return { shapes: [
      { type: 'rect', x: 3, y: 4, width: 18, height: 16, rx: 2 },
      { type: 'path', d: 'M9 4v16' },
    ] };
    return { shapes: [
      { type: 'path', d: 'M6 3h12v6H6zM6 15h12v6H6zM12 9v6' },
    ] };
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
    onSelect: () => navigateFromPalette(entry.id),
  }));

  function openPalette() {
    cmdkRef?.open();
  }

  function navigateTo(section: DemoCatalogId, focus = true) {
    const hash = `#${section}`;
    activeSection = section;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    void revealSection(section, focus);
  }

  function navigateFromPalette(section: DemoCatalogId) {
    pendingPaletteSection = section;
    navigateTo(section, false);
  }

  function handlePaletteClose() {
    const destination = pendingPaletteSection;
    pendingPaletteSection = null;
    if (!destination) return;
    setTimeout(() => requestAnimationFrame(() => void revealSection(destination, true)), 0);
  }

  function handleNavigate(href: string) {
    if (window.matchMedia('(max-width: 720px)').matches) sidebarCollapsed = true;
    navigateTo(sectionFromHash(href));
  }

  function handleCatalogSelect(event: Event) {
    navigateTo((event.currentTarget as HTMLSelectElement).value as DemoCatalogId);
  }
</script>

<div class="app-shell">
  <aside class="demo-sidebar" class:collapsed={sidebarCollapsed} aria-label="Component catalog">
    <button class="nav-toggle" type="button" aria-expanded={!sidebarCollapsed} onclick={() => sidebarCollapsed = !sidebarCollapsed}>
      <span aria-hidden="true">{sidebarCollapsed ? '›' : '‹'}</span>
      <span>{sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}</span>
    </button>
    <Sidebar
      items={sidebarItems}
      activeHref={'#' + activeSection}
      onnavigate={handleNavigate}
      collapsed={sidebarCollapsed}
      oncollapsed={(collapsed: boolean) => sidebarCollapsed = collapsed}
    />
  </aside>

  <Cmdk bind:this={cmdkRef} items={cmdkItems} onclose={handlePaletteClose} />

  <main class="demo-main">
    <header class="demo-header">
      <div>
        <h1>Wornpage</h1>
        <p>{DEMO_CATALOG.length} standalone component repositories, one inspectable catalog.</p>
      </div>
      <div class="header-actions">
        <Button onclick={openPalette}>Search catalog</Button>
        <Theme bind:theme={currentTheme} />
        <a href="https://github.com/wornpage/wornpage" class="repo-link">GitHub</a>
        <a href="https://projects-webmcp-extension.pages.dev/webmcp-challenge" class="repo-link release-link">Projects release</a>
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
        {@const metadata = catalogMetadata(entry.id)}
        <section id={entry.id} class="demo-section" class:active={activeSection === entry.id} data-component={entry.id} aria-labelledby={`${entry.id}-heading`}>
          <div class="section-heading">
            <div>
              <h2 id={`${entry.id}-heading`} tabindex="-1">{entry.label}</h2>
              <p>{entry.description}</p>
            </div>
            <code>@wornpage/{entry.id}</code>
          </div>
          <ComponentExample id={entry.id} {openPalette} />
          <details class="component-meta" data-component-meta={entry.id} data-source-revision={metadata.revision}>
            <summary>Usage and reviewed source</summary>
            <div class="component-meta-grid">
              <div><strong>Canonical repository</strong><a href={metadata.repositoryUrl}>{metadata.repositoryUrl}</a></div>
              <div><strong>Reviewed revision</strong><a href={metadata.sourceUrl}><code>{metadata.revision}</code></a></div>
              <div><strong>Install reviewed commit</strong><code>{metadata.installCommand}</code></div>
              <div><strong>Example import</strong><code>{metadata.usageImport}</code><small>Adapt this sample import to the exports your application uses.</small></div>
            </div>
          </details>
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
  :global(body) { margin: 0; }
  .app-shell { display: grid; grid-template-columns: auto minmax(0, 1fr); min-height: 100vh; max-width: 100%; }
  .demo-sidebar { align-self: start; background: var(--worn-surface); border-right: 1px solid var(--worn-border); height: 100vh; overflow-y: auto; position: sticky; top: 0; width: 248px; z-index: 20; }
  .demo-sidebar.collapsed { width: 72px; }
  .nav-toggle { align-items: center; background: var(--worn-bg-secondary); border: 0; border-bottom: 1px solid var(--worn-border); color: var(--worn-text); cursor: pointer; display: flex; font: inherit; font-size: 12px; gap: 8px; justify-content: center; min-height: 44px; padding: 6px 10px; position: sticky; top: 0; width: 100%; z-index: 2; }
  .nav-toggle:focus-visible { outline: 2px dashed var(--worn-focus); outline-offset: -4px; }
  .nav-toggle span:first-child { font-size: 22px; line-height: 1; }
  .demo-sidebar.collapsed .nav-toggle span:last-child { border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
  .demo-main { box-sizing: border-box; min-width: 0; padding: 24px 32px 40px; width: min(100%, 980px); }
  .demo-header { border-bottom: 1px solid var(--worn-border); display: grid; gap: 16px; margin-bottom: 28px; padding-bottom: 22px; }
  .demo-header h1 { font-size: 28px; letter-spacing: 0; margin: 0; }
  .demo-header p { color: var(--worn-text-muted); line-height: 1.5; margin: 4px 0 0; }
  .header-actions {
    --wrn-theme-active-bg: var(--worn-accent);
    --wrn-theme-active-text: var(--worn-accent-text);
    --wrn-theme-border: var(--worn-border-strong);
    --wrn-theme-btn-bg: var(--worn-surface);
    --wrn-theme-hover: var(--worn-hover-bg);
    --wrn-theme-text: var(--worn-text);
    --wrn-theme-focus: var(--worn-focus);
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }
  .repo-link { align-items: center; background: var(--worn-surface); border: 1px solid var(--worn-border); border-radius: var(--worn-radius-sm); color: inherit; display: inline-flex; font-size: 13px; min-height: 36px; padding: 6px 12px; text-decoration: none; }
  .repo-link:hover { background: var(--worn-hover-bg); }
  .repo-link:focus-visible { outline: 2px dashed var(--worn-focus); outline-offset: 2px; }
  .release-link { background: var(--worn-accent); border-color: var(--worn-accent); color: var(--worn-accent-text); font-weight: 700; }
  .release-link:hover { filter: brightness(.92); }
  @media (pointer: coarse) {
    .repo-link { min-height: 44px; }
  }
  .catalog-jump { display: grid; gap: 6px; max-width: 22rem; min-width: 0; }
  .catalog-jump label { color: var(--worn-text-muted); font-size: 12px; font-weight: 650; }
  .category-heading { align-items: center; border-bottom: 2px solid var(--worn-border); color: var(--worn-text-muted); display: flex; font-size: 12px; font-weight: 700; justify-content: space-between; margin: 36px 0 0; padding: 0 0 8px; text-transform: uppercase; }
  .category-heading span:last-child { color: var(--worn-text-muted); font-variant-numeric: tabular-nums; }
  .demo-section { border-bottom: 1px solid var(--worn-border); min-width: 0; padding: 24px 0 28px; scroll-margin-top: 16px; }
  .demo-section.active { border-bottom-color: var(--worn-accent); }
  .section-heading { align-items: start; display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; margin-bottom: 16px; min-width: 0; }
  .section-heading > div { flex: 1 1 20rem; min-width: 0; }
  .section-heading h2 { font-size: 19px; letter-spacing: 0; margin: 0 0 4px; }
  .section-heading h2:focus-visible { border-radius: 3px; outline: 3px solid var(--worn-focus); outline-offset: 4px; }
  .section-heading p { color: var(--worn-text-muted); line-height: 1.5; margin: 0; overflow-wrap: anywhere; }
  .section-heading code { background: var(--worn-bg-secondary); border: 1px solid var(--worn-border); border-radius: 4px; color: var(--worn-text-muted); flex: 0 1 auto; font-size: 12px; max-width: 100%; overflow-wrap: anywhere; padding: 4px 7px; }
  .component-meta { background: var(--worn-bg-secondary); border: 1px solid var(--worn-border); border-radius: var(--worn-radius-sm); margin-top: 18px; max-width: 100%; }
  .component-meta summary { cursor: pointer; font-size: 13px; font-weight: 700; min-height: 44px; padding: 12px 14px; }
  .component-meta summary:focus-visible { outline: 2px dashed var(--worn-focus); outline-offset: 2px; }
  .component-meta-grid { border-top: 1px solid var(--worn-border); display: grid; gap: 12px; padding: 14px; }
  .component-meta-grid > div { display: grid; gap: 4px; min-width: 0; }
  .component-meta-grid strong { color: var(--worn-text-muted); font-size: 11px; text-transform: uppercase; }
  .component-meta-grid a { color: var(--worn-link); overflow-wrap: anywhere; }
  .component-meta-grid code { overflow-wrap: anywhere; white-space: normal; }
  .component-meta-grid small { color: var(--worn-text-muted); }
  footer { align-items: center; color: var(--worn-text-muted); display: flex; flex-wrap: wrap; font-size: 12px; gap: 8px 16px; padding-top: 32px; }
  footer a { color: var(--worn-link); overflow-wrap: anywhere; }
  @media (max-width: 720px) {
    .demo-sidebar:not(.collapsed) { box-shadow: var(--worn-shadow-md); height: 100dvh; inset-block: 0; inset-inline-start: 0; position: fixed; width: min(280px, calc(100vw - 16px)); }
    .demo-main { padding: max(16px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) max(32px, env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left)); }
    .demo-header { margin-bottom: 20px; }
    .section-heading > div { flex-basis: 100%; }
  }
  @media (max-width: 360px) {
    .demo-main { padding-inline: 10px; }
    .header-actions { align-items: stretch; flex-direction: column; }
    .header-actions > :global(*) { max-width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .release-link:hover { filter: none; }
  }
</style>
