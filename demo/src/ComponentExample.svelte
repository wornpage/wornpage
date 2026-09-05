<script lang="ts">
  import { Alert } from '@wornpage/alert';
  import { Empty, ErrorState, Skeleton, Spinner } from '@wornpage/async-states';
  import { Checkbox, Switch } from '@wornpage/binary-controls';
  import { Button } from '@wornpage/button';
  import { Kbd, Toolbar } from '@wornpage/command-surfaces';
  import { Avatar, Badge, Chip, Progress, Timeline } from '@wornpage/data-display';
  import { DateInput } from '@wornpage/date-input';
  import { Dialog } from '@wornpage/dialog';
  import { Accordion, Collapsible } from '@wornpage/disclosure';
  import { Drawer } from '@wornpage/drawer';
  import { Input, Range, Select, Textarea } from '@wornpage/form-fields';
  import { Divider, Panel } from '@wornpage/layout-surfaces';
  import { MultiSelect } from '@wornpage/multi-select';
  import { Breadcrumb, Pagination } from '@wornpage/navigation-surfaces';
  import { WornReceipt } from '@wornpage/receipt';
  import { SCENARIOS } from '@wornpage/scenarios';
  import { SegmentedControl } from '@wornpage/segmented-control';
  import { SelectCard } from '@wornpage/select-card';
  import { generateSyncCode, syncQR } from '@wornpage/sync';
  import { Tabs, tabDomIds } from '@wornpage/tabs';
  import { Toast } from '@wornpage/toast';
  import { createUndoStack, UndoReceipt } from '@wornpage/undo';
  import { buildStandupText, hasBlocker, orderPacks, primaryCommand, type DemoPack } from '@wornpage/workflow';
  import { onDestroy } from 'svelte';
  import { DEMO_CATALOG, type DemoCatalogId } from './sections';

  let { id, openPalette }: { id: DemoCatalogId; openPalette: () => void } = $props();
  type AsyncState = 'loading' | 'success' | 'empty' | 'error';

  let alertVisible = $state(true);
  let asyncState = $state<AsyncState>('loading');
  let includeArchived = $state(false);
  let emailUpdates = $state(true);
  let buttonOutcome = $state('No command selected.');
  let buttonActionCount = $state(0);
  let chipPressed = $state(false);
  let displayProgress = $state(7);
  let dueDate = $state('2026-08-22');
  let dialogOpen = $state(false);
  let approvedReviews = $state(0);
  let sourceOpen = $state(false);
  let drawerOpen = $state(false);
  let drawerDensity = $state('compact');
  let appliedDensity = $state('comfortable');
  let projectTitle = $state('Catalog coverage');
  let projectContext = $state('Verify every standalone component.');
  let owner = $state('priya');
  let progress = $state(68);
  let formStatus = $state('Draft values are local to this example.');
  let priorities = $state(['high']);
  let page = $state(1);
  let receiptVisible = $state(true);
  let itemArchived = $state(true);
  let period = $state('week');
  let selectedPlan = $state('pro');
  let activeTab = $state('overview');
  let toastVersion = $state(0);
  let toastVisible = $state(false);
  let syncCode = $state('');
  let draftTitle = $state('Catalog notes');
  let savedTitle = $state('Catalog notes');
  let previewVisible = $state(false);
  let commandStatus = $state('No local changes.');
  let undoTitle = $state('Draft catalog');
  let canUndo = $state(false);
  let canRedo = $state(false);
  let workflowBlocked = $state(true);
  let exampleRoot = $state<HTMLElement>();
  let asyncRequest = 0;

  const undoStack = createUndoStack<{ title: string }>();
  const redoStack = createUndoStack<{ title: string }>();
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'history', label: 'History' },
  ];
  const timelineEntries = [
    { iter: 26, date: '2026-08-15', title: 'Catalog complete', description: 'Every standalone component has a live example.' },
    { iter: 25, date: '2026-08-14', title: 'Contracts expanded', description: 'Coverage follows the repository denominator.' },
  ];
  const catalogPageSize = 4;
  const totalCatalogPages = Math.ceil(DEMO_CATALOG.length / catalogPageSize);
  const pageStart = $derived((page - 1) * catalogPageSize);
  const visibleCatalogEntries = $derived(DEMO_CATALOG.slice(pageStart, pageStart + catalogPageSize));
  const undoAction = { type: 'action' as const, packId: 'catalog-demo', label: 'Renamed catalog draft', createdAt: Date.now() };
  const workflowPacks = $derived.by<DemoPack[]>(() => [
    { id: '1', title: 'Navigation coverage', status: workflowBlocked ? 'blocked' : 'active', blocker: workflowBlocked ? 'Review compact layout' : 'none', next: workflowBlocked ? 'Review' : 'Open', owner: 'Design', due: '2026-08-18', doneWhen: 'No horizontal overflow' },
    { id: '2', title: 'Component examples', status: 'active', blocker: 'none', next: 'Open', owner: 'UI', due: '2026-08-20', doneWhen: 'All package exports render' },
    { id: '3', title: 'Catalog contract', status: 'done', blocker: 'none', next: 'Done', owner: 'QA', due: '2026-08-15', doneWhen: 'Denominator is derived' },
  ]);
  const standup = $derived(buildStandupText(orderPacks(workflowPacks)));

  onDestroy(() => { asyncRequest += 1; });

  function resetBinaryControls() { includeArchived = false; emailUpdates = true; }
  function runButtonAction(label: string) { buttonActionCount += 1; buttonOutcome = `${label} — run ${buttonActionCount}.`; }
  function selectAsyncState(state: AsyncState) { asyncRequest += 1; asyncState = state; }
  async function retryAsync() {
    const request = ++asyncRequest;
    asyncState = 'loading';
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (request === asyncRequest) asyncState = 'success';
  }
  function saveLocalDocument() { savedTitle = draftTitle; commandStatus = `Saved “${draftTitle}” in this local example.`; }
  function handleScopedShortcut(event: KeyboardEvent) {
    if (id !== 'command-surfaces' || !exampleRoot?.contains(document.activeElement)) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveLocalDocument(); }
  }
  function resetForm() {
    projectTitle = 'Catalog coverage'; projectContext = 'Verify every standalone component.'; owner = 'priya'; progress = 68;
    formStatus = 'Draft values reset locally.';
  }
  function validateForm() { formStatus = projectTitle.trim() ? `Local validation passed for “${projectTitle.trim()}”.` : 'Project is required.'; }
  function archiveItem() { itemArchived = true; receiptVisible = true; }
  function undoArchive() { itemArchived = false; receiptVisible = false; }
  function renameDraft() {
    if (undoTitle === 'Reviewed catalog') return;
    undoStack.commit(undoStack.snapshot({ title: undoTitle })); undoTitle = 'Reviewed catalog'; redoStack.clear(); canUndo = true; canRedo = false;
  }
  function undoRename() {
    const previous = undoStack.pop(); if (!previous) return;
    redoStack.commit(redoStack.snapshot({ title: undoTitle })); undoTitle = previous.title; canUndo = undoStack.length > 0; canRedo = true;
  }
  function redoRename() {
    const next = redoStack.pop(); if (!next) return;
    undoStack.commit(undoStack.snapshot({ title: undoTitle })); undoTitle = next.title; canUndo = true; canRedo = redoStack.length > 0;
  }
  function resetUndo() { undoStack.clear(); redoStack.clear(); undoTitle = 'Draft catalog'; canUndo = false; canRedo = false; }
</script>

<svelte:window onkeydown={handleScopedShortcut} />

<div bind:this={exampleRoot} class="example-surface" data-example-id={id} data-example-kind={id === 'scenarios' || id === 'layout-surfaces' ? 'read-only' : 'interactive'}>
  {#if id === 'alert'}
    {#if alertVisible}
      <Alert tone="warning" title="Review needed" dismissible ondismiss={() => alertVisible = false}>Two compact viewport checks remain.</Alert>
    {:else}
      <p class="live-output" role="status">The alert was dismissed without changing catalog data.</p>
      <Button data-action="reset-alert" onclick={() => alertVisible = true}>Restore alert</Button>
    {/if}

  {:else if id === 'async-states'}
    <Toolbar label="Async state example">
      {#each ['loading', 'success', 'empty', 'error'] as state}
        <Button size="sm" aria-pressed={asyncState === state} onclick={() => selectAsyncState(state as AsyncState)}>{state}</Button>
      {/each}
    </Toolbar>
    <div data-async-state={asyncState}>
      {#if asyncState === 'loading'}
        <div class="example-stack"><Spinner size="sm" label="Loading catalog preview" /><Skeleton lines={3} /></div>
      {:else if asyncState === 'success'}
        <Alert tone="success" title="Preview loaded">Three reviewed component records are ready.</Alert>
      {:else if asyncState === 'empty'}
        <Empty title="No matching previews" description="Change the local example filter to show component previews." />
      {:else}
        <ErrorState message="Preview unavailable" detail="Retry moves through loading and resolves to the local success fixture." onretry={retryAsync} />
      {/if}
    </div>

  {:else if id === 'binary-controls'}
    <div class="control-row"><Checkbox bind:checked={includeArchived} label="Include archived" /><Switch bind:checked={emailUpdates} label="Email updates" /><Switch checked={false} disabled label="Managed by policy" /></div>
    <p class="live-output" data-output="binary">Archived: {includeArchived ? 'included' : 'hidden'}; updates: {emailUpdates ? 'on' : 'off'}</p>
    <Button size="sm" onclick={resetBinaryControls}>Reset controls</Button>

  {:else if id === 'button'}
    <div class="control-row">
      <Button variant="primary" onclick={() => runButtonAction('Primary action prepared locally')}>Primary</Button>
      <Button onclick={() => runButtonAction('Default action selected locally')}>Default</Button>
      <Button variant="danger" onclick={() => runButtonAction('Danger action reviewed locally; nothing was deleted')}>Danger</Button>
      <Button disabled>Disabled</Button>
    </div>
    <p class="live-output" data-output="button" aria-live="polite">{buttonOutcome}</p><Button size="sm" onclick={() => { buttonActionCount = 0; buttonOutcome = 'No command selected.'; }}>Reset outcome</Button>

  {:else if id === 'cmdk'}
    <Button variant="primary" onclick={openPalette}>Open command palette</Button>
    <p class="live-output">Selecting a result closes the native dialog, updates the URL, and focuses that catalog heading.</p>

  {:else if id === 'command-surfaces'}
    <label class="field-label" for="toolbar-draft">Local document title</label><Input id="toolbar-draft" bind:value={draftTitle} autocomplete="off" />
    <Toolbar label="Document actions">
      <Button size="sm" disabled={draftTitle === savedTitle} onclick={saveLocalDocument}>Save</Button>
      <Button size="sm" onclick={() => { previewVisible = !previewVisible; commandStatus = previewVisible ? 'Local preview opened.' : 'Local preview closed.'; }}>Preview</Button><Kbd keys={['Ctrl', 'S']}>Shortcut</Kbd>
    </Toolbar>
    {#if previewVisible}<div class="local-preview" data-output="toolbar-preview"><strong>Preview:</strong> {draftTitle || 'Untitled'}</div>{/if}
    <p class="live-output" aria-live="polite">{commandStatus}</p>
    <Button size="sm" onclick={() => { draftTitle = 'Catalog notes'; savedTitle = 'Catalog notes'; previewVisible = false; commandStatus = 'No local changes.'; }}>Reset document</Button>

  {:else if id === 'data-display'}
    <div class="control-row"><Avatar name="Ada Lovelace" status="online" /><Badge label="In review" variant="accent" /><Chip label="Assigned to me" count={8} pressed={chipPressed} onclick={() => chipPressed = !chipPressed} /></div>
    <Progress value={displayProgress} max={10} label="Review complete" />
    <div class="control-row"><Button size="sm" disabled={displayProgress >= 10} onclick={() => displayProgress += 1}>Advance progress</Button><Button size="sm" onclick={() => { displayProgress = 7; chipPressed = false; }}>Reset display</Button></div><Timeline entries={timelineEntries} headingLevel={3} />

  {:else if id === 'date-input'}
    <label class="field-label" for="catalog-due-date">Due date</label><DateInput id="catalog-due-date" bind:value={dueDate} min="2026-08-15" max="2026-12-31" required />
    <label class="field-label" for="disabled-date">Locked release date</label><DateInput id="disabled-date" value="2026-09-01" disabled />
    <p class="live-output">Selected: {dueDate || 'No date'}</p><Button size="sm" onclick={() => dueDate = '2026-08-22'}>Reset date</Button>

  {:else if id === 'dialog'}
    <Button variant="primary" onclick={() => dialogOpen = true}>Open dialog</Button><p class="live-output" data-output="dialog">Approved reviews: {approvedReviews}</p>
    <Dialog bind:open={dialogOpen} title="Confirm catalog review" size="sm"><p>This local confirmation increments the visible review count.</p><div class="control-row"><Button variant="primary" onclick={() => { approvedReviews += 1; dialogOpen = false; }}>Confirm</Button><Button onclick={() => dialogOpen = false}>Cancel</Button></div></Dialog>
    <Button size="sm" disabled={approvedReviews === 0} onclick={() => approvedReviews = 0}>Reset approvals</Button>

  {:else if id === 'disclosure'}
    <Accordion label="Release notes" description="August 15"><p>Aggregate catalog coverage follows the canonical repository list.</p></Accordion>
    <Collapsible summary="Inspect disclosure contract" ariaLabel="Inspect disclosure contract" bind:open={sourceOpen}><p>Native details owns the accordion; the controlled disclosure uses a real button and linked panel.</p></Collapsible>
    <Button size="sm" disabled={!sourceOpen} onclick={() => sourceOpen = false}>Collapse controlled panel</Button>

  {:else if id === 'drawer'}
    <Button variant="primary" onclick={() => { drawerDensity = appliedDensity; drawerOpen = true; }}>Open details drawer</Button><p class="live-output" data-output="drawer">Applied density: {appliedDensity}</p>
    <div class="drawer-density-preview" class:is-compact={appliedDensity === 'compact'} data-output="drawer-preview"><strong>Preview row</strong><span>Density changes this row's spacing.</span></div>
    <Drawer bind:open={drawerOpen} title="Component details" side="end"><label class="field-label" for="drawer-density">Preview density</label><Select id="drawer-density" bind:value={drawerDensity} options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }]} /><div class="control-row"><Button variant="primary" onclick={() => { appliedDensity = drawerDensity; drawerOpen = false; }}>Apply</Button><Button onclick={() => drawerOpen = false}>Cancel</Button></div></Drawer>
    <Button size="sm" onclick={() => appliedDensity = 'comfortable'}>Reset density</Button>

  {:else if id === 'form-fields'}
    <div class="form-grid">
      <label class="field-label" for="project-title">Project</label><Input id="project-title" bind:value={projectTitle} required autocomplete="organization" />
      <label class="field-label" for="project-context">Context</label><Textarea id="project-context" bind:value={projectContext} rows={2} autocomplete="off" />
      <label class="field-label" for="project-owner">Owner</label><Select id="project-owner" bind:value={owner} options={[{ value: 'priya', label: 'Priya Shah' }, { value: 'sam', label: 'Sam Lee' }]} />
      <Range bind:value={progress} label="Progress" suffix="%" /><label class="field-label" for="locked-field">Verified source</label><Input id="locked-field" value="Reviewed commit" readonly />
    </div>
    <div class="control-row"><Button size="sm" variant="primary" onclick={validateForm}>Validate locally</Button><Button size="sm" onclick={resetForm}>Reset form</Button></div><p class="live-output" data-output="form" aria-live="polite">{formStatus}</p>

  {:else if id === 'layout-surfaces'}
    <p class="contract-note">Read-only composition example</p><Panel sectionLabel="Delivery" heading="Launch readiness" headingLevel={3}><p>All 26 package examples are connected to one catalog.</p><Divider label="Evidence" /><strong>Workspace, component, build, and browser checks are required.</strong></Panel>

  {:else if id === 'multi-select'}
    <label class="field-label" for="catalog-priorities">Priorities</label><MultiSelect id="catalog-priorities" aria-label="Priorities" size={3} bind:value={priorities} options={[{ value: 'low', label: 'Low' }, { value: 'high', label: 'High' }, { value: 'paused', label: 'Paused', disabled: true }]} />
    <p class="live-output" data-output="multi-select">Selected: {priorities.join(', ') || 'None'}</p><Button size="sm" onclick={() => priorities = ['high']}>Reset priorities</Button>

  {:else if id === 'navigation-surfaces'}
    <Breadcrumb items={[{ label: 'Components', href: '#sidebar' }, { label: 'Navigation surfaces' }]} label="Catalog path" /><Pagination bind:current={page} total={totalCatalogPages} label="Catalog result pages" />
    <p class="live-output">Showing {pageStart + 1}–{Math.min(pageStart + catalogPageSize, DEMO_CATALOG.length)} of {DEMO_CATALOG.length} components</p>
    <div class="data-list" data-output="pagination" aria-live="polite">{#each visibleCatalogEntries as result}<div><strong>{result.label}</strong><span>Page {page}</span></div>{/each}</div><Button size="sm" disabled={page === 1} onclick={() => page = 1}>Reset page</Button>

  {:else if id === 'receipt'}
    <p class="live-output" data-output="receipt-model">Catalog draft: {itemArchived ? 'archived' : 'active'}</p>
    {#if receiptVisible}<WornReceipt summary="Catalog draft archived locally." cells={[{ label: 'Before', value: 'Active' }, { label: 'After', value: 'Archived' }]} undoAvailable onundo={undoArchive} ondone={() => receiptVisible = false} />{:else}<p class="live-output">The receipt is dismissed; the model remains {itemArchived ? 'archived' : 'active'}.</p>{/if}
    <Button size="sm" disabled={itemArchived && receiptVisible} onclick={archiveItem}>Archive again</Button>

  {:else if id === 'scenarios'}
    <p class="contract-note">Read-only output: showing 5 of {SCENARIOS.length} canonical scenarios</p><div class="data-list" aria-label="Scenario catalog output">{#each SCENARIOS.slice(0, 5) as scenario (scenario.id)}<div><strong>{scenario.label}</strong><span>{scenario.id} / {scenario.route}</span></div>{/each}</div>

  {:else if id === 'segmented-control'}
    <SegmentedControl label="Reporting period" name="catalog-period" options={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }]} bind:active={period} /><p class="live-output" data-output="period">Period: {period}</p><Button size="sm" onclick={() => period = 'week'}>Reset period</Button>

  {:else if id === 'select-card'}
    <div class="selection-grid"><SelectCard label="Standard" description="Core catalog checks" pressed={selectedPlan === 'standard'} onclick={() => selectedPlan = 'standard'} /><SelectCard label="Pro" description="Extended visual checks" pressed={selectedPlan === 'pro'} onclick={() => selectedPlan = 'pro'} /><SelectCard label="Enterprise" description="Unavailable in this local sample" disabled /></div>
    <p class="live-output" data-output="select-card">Selected plan: {selectedPlan}</p><Button size="sm" onclick={() => selectedPlan = 'pro'}>Reset plan</Button>

  {:else if id === 'sidebar'}
    <p class="contract-note">Live application-level example</p><p class="live-output">The grouped navigation beside the catalog is the live Sidebar. Its search filters destinations; selection updates history and focuses the chosen heading.</p>

  {:else if id === 'sync'}
    <div class="control-row"><Button variant="primary" onclick={() => syncCode = generateSyncCode()}>Generate local sync code</Button><Button disabled={!syncCode} onclick={() => syncCode = ''}>Reset code</Button></div>{#if syncCode}<div class="sync-result" data-output="sync"><div class="qr-output">{@html syncQR(syncCode, window.location.origin)}</div><strong>{syncCode}</strong></div>{/if}

  {:else if id === 'tabs'}
    <Tabs id="catalog-tabs" label="Catalog example views" {tabs} bind:active={activeTab} />
    {#each tabs as tab (tab.id)}{@const ids = tabDomIds('catalog-tabs', tab.id)}<div id={ids.panelId} role="tabpanel" aria-labelledby={ids.tabId} hidden={tab.id !== activeTab} class="tab-panel">{#if tab.id === activeTab}{tab.label} content remains linked to its tab.{/if}</div>{/each}
    <Button size="sm" disabled={activeTab === 'overview'} onclick={() => activeTab = 'overview'}>Reset tab</Button>

  {:else if id === 'theme'}
    <p class="contract-note">Live application-level example</p><div class="theme-swatches" aria-label="Theme token sample"><span>Background</span><span>Surface</span><span>Accent</span><span>Danger</span></div><p class="live-output">The header Theme control is the sole preference owner. It persists valid choices; System follows the operating-system light or dark preference.</p>

  {:else if id === 'toast'}
    <div class="control-row"><Button onclick={() => { toastVersion += 1; toastVisible = true; }}>Show local notification</Button><Button disabled={!toastVisible} onclick={() => toastVisible = false}>Reset notification</Button></div>{#if toastVisible}{#key toastVersion}<Toast message="Catalog draft saved locally." kind="success" duration={0} dismissLabel="Dismiss catalog notification" ondismiss={() => toastVisible = false} />{/key}{/if}

  {:else if id === 'undo'}
    <div class="control-row"><Button variant="primary" disabled={undoTitle === 'Reviewed catalog'} onclick={renameDraft}>Rename local draft</Button><Button onclick={resetUndo}>Reset history</Button></div><p class="live-output" data-output="undo-model">Title: {undoTitle}</p><UndoReceipt action={undoAction} {canUndo} {canRedo} onundo={undoRename} onredo={redoRename} />

  {:else if id === 'workflow'}
    <div class="control-row"><Button size="sm" onclick={() => workflowBlocked = !workflowBlocked}>{workflowBlocked ? 'Clear local blocker' : 'Restore local blocker'}</Button><Button size="sm" disabled={workflowBlocked} onclick={() => workflowBlocked = true}>Reset workflow</Button></div><p class="standup" data-output="workflow"><strong>Standup:</strong> {standup}<span>Navigation coverage: {workflowBlocked ? 'blocked' : 'active'}</span></p>
    <div class="table-scroll"><table><thead><tr><th>Title</th><th>Status</th><th>Next</th></tr></thead><tbody>{#each orderPacks(workflowPacks) as pack (pack.id)}<tr><td>{pack.title}</td><td>{pack.status}</td><td>{hasBlocker(pack) ? 'Review blocker' : primaryCommand(pack).label}</td></tr>{/each}</tbody></table></div>
  {/if}
</div>

<style>
  .example-surface { box-sizing: border-box; display: grid; gap: 12px; max-width: 100%; min-width: 0; }
  .example-stack { display: grid; gap: 12px; min-width: 0; }
  .control-row { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; min-width: 0; }
  .live-output, .standup { color: var(--worn-text-muted); font-size: 13px; line-height: 1.5; margin: 0; overflow-wrap: anywhere; }
  .standup span { display: block; }
  .contract-note { color: var(--worn-text-secondary); font-size: 12px; font-weight: 700; letter-spacing: .03em; margin: 0; text-transform: uppercase; }
  .form-grid { display: grid; gap: 7px; max-width: 32rem; min-width: 0; }
  .field-label { color: var(--worn-text-muted); font-size: 12px; font-weight: 650; }
  .selection-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
  .data-list { border-block: 1px solid var(--worn-border); display: grid; min-width: 0; }
  .data-list > div { align-items: baseline; border-bottom: 1px solid var(--worn-border); display: flex; flex-wrap: wrap; gap: 4px 12px; justify-content: space-between; min-width: 0; padding: 9px 0; }
  .data-list > div:last-child { border-bottom: 0; }
  .data-list strong, .data-list span { min-width: 0; overflow-wrap: anywhere; }
  .data-list span { color: var(--worn-text-muted); font-family: var(--font-typewriter); font-size: 12px; }
  .local-preview { background: var(--worn-surface); border: 1px solid var(--worn-border); border-radius: var(--worn-radius-sm); color: var(--worn-text); padding: 12px; }
  .drawer-density-preview { background: var(--worn-surface); border: 1px solid var(--worn-border); border-radius: var(--worn-radius-sm); display: grid; gap: 4px; padding: 16px; }
  .drawer-density-preview.is-compact { padding: 8px; }
  .drawer-density-preview span { color: var(--worn-text-muted); font-size: 12px; }
  .sync-result { align-items: center; display: flex; flex-wrap: wrap; gap: 14px; min-width: 0; }
  .sync-result strong { font-family: var(--font-typewriter); overflow-wrap: anywhere; }
  .qr-output { background: #fff; box-sizing: border-box; inline-size: 120px; max-inline-size: 100%; padding: 6px; }
  .qr-output :global(svg) { display: block; height: auto; max-width: 100%; }
  .tab-panel { border-bottom: 1px solid var(--worn-border); color: var(--worn-text-muted); font-size: 13px; min-width: 0; overflow-wrap: anywhere; padding: 12px 4px; }
  .theme-swatches { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .theme-swatches span { align-items: center; border: 1px solid var(--worn-border); border-radius: var(--worn-radius-sm); display: flex; font-size: 11px; justify-content: center; min-height: 52px; padding: 6px; text-align: center; }
  .theme-swatches span:nth-child(1) { background: var(--worn-bg); color: var(--worn-text); }
  .theme-swatches span:nth-child(2) { background: var(--worn-surface); color: var(--worn-text); }
  .theme-swatches span:nth-child(3) { background: var(--worn-accent); color: var(--worn-accent-text); }
  .theme-swatches span:nth-child(4) { background: var(--worn-danger-bg); color: var(--worn-danger-text); }
  .table-scroll { max-width: 100%; overflow-x: auto; }
  table { border-collapse: collapse; font-size: 13px; min-width: 32rem; width: 100%; }
  th, td { border-bottom: 1px solid var(--worn-border); padding: 8px 10px; text-align: left; }
  th { color: var(--worn-text-muted); font-size: 11px; text-transform: uppercase; }
  @media (max-width: 480px) {
    .selection-grid, .theme-swatches { grid-template-columns: minmax(0, 1fr); }
    .control-row { align-items: stretch; flex-direction: column; }
    :global(input), :global(textarea), :global(select) { font-size: 16px; }
  }
</style>
