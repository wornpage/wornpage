<script lang="ts">
  import { Alert } from '@wornpage/alert';
  import { ErrorState, Skeleton, Spinner } from '@wornpage/async-states';
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
  import { UndoReceipt } from '@wornpage/undo';
  import {
    buildStandupText,
    hasBlocker,
    orderPacks,
    primaryCommand,
    type DemoPack,
  } from '@wornpage/workflow';
  import type { DemoCatalogId } from './sections';

  let { id, openPalette }: { id: DemoCatalogId; openPalette: () => void } = $props();

  let alertVisible = $state(true);
  let asyncLoading = $state(true);
  let includeArchived = $state(false);
  let emailUpdates = $state(true);
  let chipPressed = $state(false);
  let dueDate = $state('2026-08-22');
  let dialogOpen = $state(false);
  let sourceOpen = $state(false);
  let drawerOpen = $state(false);
  let projectTitle = $state('Catalog coverage');
  let projectContext = $state('Verify every standalone component.');
  let owner = $state('priya');
  let progress = $state(68);
  let priorities = $state(['high']);
  let page = $state(2);
  let receiptVisible = $state(true);
  let period = $state('week');
  let selectedPlan = $state('pro');
  let activeTab = $state('overview');
  let toastVersion = $state(0);
  let undoAvailable = $state(true);
  let undoStatus = $state('Ready to restore the previous status.');
  let syncCode = $state('');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'history', label: 'History' },
  ];

  const timelineEntries = [
    { iter: 26, date: '2026-08-15', title: 'Catalog complete', description: 'Every standalone component has a live example.' },
    { iter: 25, date: '2026-08-14', title: 'Contracts expanded', description: 'Coverage follows the repository denominator.' },
  ];

  const undoAction = {
    type: 'done' as const,
    packId: 'catalog-demo',
    label: 'Marked catalog as complete',
    createdAt: Date.now(),
  };

  const demoPacks: DemoPack[] = [
    { id: '1', title: 'Navigation coverage', status: 'blocked', blocker: 'Review compact layout', next: 'Review', owner: 'Design', due: '2026-08-18', doneWhen: 'No horizontal overflow' },
    { id: '2', title: 'Component examples', status: 'active', blocker: 'none', next: 'Open', owner: 'UI', due: '2026-08-20', doneWhen: 'All package exports render' },
    { id: '3', title: 'Catalog contract', status: 'done', blocker: 'none', next: 'Done', owner: 'QA', due: '2026-08-15', doneWhen: 'Denominator is derived' },
  ];

  const standup = buildStandupText(orderPacks(demoPacks));
</script>

<div class="example-surface">
  {#if id === 'alert'}
    {#if alertVisible}
      <Alert tone="warning" title="Review needed" dismissible ondismiss={() => alertVisible = false}>
        Two compact viewport checks remain.
      </Alert>
    {:else}
      <Button onclick={() => alertVisible = true}>Restore alert</Button>
    {/if}

  {:else if id === 'async-states'}
    <div class="example-stack">
      <Toolbar label="Async state example">
        <Button size="sm" onclick={() => asyncLoading = !asyncLoading}>{asyncLoading ? 'Show result' : 'Show loading'}</Button>
        <Spinner size="sm" label="Background refresh" />
      </Toolbar>
      {#if asyncLoading}
        <Skeleton lines={3} />
      {:else}
        <ErrorState message="Preview unavailable" detail="The retry control restores loading." onretry={() => asyncLoading = true} />
      {/if}
    </div>

  {:else if id === 'binary-controls'}
    <div class="control-row">
      <Checkbox bind:checked={includeArchived} label="Include archived" />
      <Switch bind:checked={emailUpdates} label="Email updates" />
    </div>
    <p class="live-output">Archived: {includeArchived ? 'included' : 'hidden'}; updates: {emailUpdates ? 'on' : 'off'}</p>

  {:else if id === 'button'}
    <div class="control-row">
      <Button variant="primary">Primary</Button>
      <Button>Default</Button>
      <Button variant="danger">Danger</Button>
    </div>

  {:else if id === 'cmdk'}
    <Button variant="primary" onclick={openPalette}>Open command palette</Button>

  {:else if id === 'command-surfaces'}
    <Toolbar label="Document actions">
      <Button size="sm">Save</Button>
      <Button size="sm">Preview</Button>
      <Kbd keys={['Ctrl', 'S']}>Shortcut</Kbd>
    </Toolbar>

  {:else if id === 'data-display'}
    <div class="control-row">
      <Avatar name="Ada Lovelace" status="online" />
      <Badge label="In review" variant="accent" />
      <Chip label="Assigned to me" count={8} pressed={chipPressed} onclick={() => chipPressed = !chipPressed} />
    </div>
    <Progress value={7} max={10} label="Review complete" />
    <Timeline entries={timelineEntries} headingLevel={3} />

  {:else if id === 'date-input'}
    <label class="field-label" for="catalog-due-date">Due date</label>
    <DateInput id="catalog-due-date" bind:value={dueDate} min="2026-08-15" />
    <p class="live-output">Selected: {dueDate || 'No date'}</p>

  {:else if id === 'dialog'}
    <Button variant="primary" onclick={() => dialogOpen = true}>Open dialog</Button>
    <Dialog bind:open={dialogOpen} title="Confirm catalog review" size="sm">
      <p>Keyboard focus remains inside this dialog until it closes.</p>
      <Button onclick={() => dialogOpen = false}>Done</Button>
    </Dialog>

  {:else if id === 'disclosure'}
    <div class="example-stack">
      <Accordion label="Release notes" description="August 15">
        <p>Aggregate catalog coverage now follows the canonical repository list.</p>
      </Accordion>
      <Collapsible summary="Inspect install command" ariaLabel="Inspect disclosure install command" bind:open={sourceOpen}>
        <code>bun add @wornpage/disclosure</code>
      </Collapsible>
    </div>

  {:else if id === 'drawer'}
    <Button variant="primary" onclick={() => drawerOpen = true}>Open details drawer</Button>
    <Drawer bind:open={drawerOpen} title="Component details" side="end">
      <p>This responsive surface keeps focus and scroll state bounded.</p>
      <Button onclick={() => drawerOpen = false}>Close details</Button>
    </Drawer>

  {:else if id === 'form-fields'}
    <div class="form-grid">
      <label class="field-label" for="project-title">Project</label>
      <Input id="project-title" bind:value={projectTitle} />
      <label class="field-label" for="project-context">Context</label>
      <Textarea id="project-context" bind:value={projectContext} rows={2} />
      <label class="field-label" for="project-owner">Owner</label>
      <Select id="project-owner" bind:value={owner} options={[{ value: 'priya', label: 'Priya Shah' }, { value: 'sam', label: 'Sam Lee' }]} />
      <Range bind:value={progress} label="Progress" suffix="%" />
    </div>

  {:else if id === 'layout-surfaces'}
    <Panel sectionLabel="Delivery" heading="Launch readiness" headingLevel={3}>
      <p>All 26 package examples are connected to one catalog.</p>
      <Divider label="Evidence" />
      <strong>Workspace, component, and build checks are required.</strong>
    </Panel>

  {:else if id === 'multi-select'}
    <label class="field-label" for="catalog-priorities">Priorities</label>
    <MultiSelect id="catalog-priorities" aria-label="Priorities" size={3} bind:value={priorities} options={[{ value: 'low', label: 'Low' }, { value: 'high', label: 'High' }, { value: 'paused', label: 'Paused', disabled: true }]} />
    <p class="live-output">Selected: {priorities.join(', ') || 'None'}</p>

  {:else if id === 'navigation-surfaces'}
    <div class="example-stack">
      <Breadcrumb items={[{ label: 'Components', href: '#sidebar' }, { label: 'Navigation surfaces' }]} label="Catalog path" />
      <Pagination bind:current={page} total={8} label="Catalog result pages" />
    </div>

  {:else if id === 'receipt'}
    {#if receiptVisible}
      <WornReceipt summary="Catalog contract passed." cells={[{ label: 'Actual', value: '26' }, { label: 'Expected', value: '26' }]} undoAvailable onundo={() => receiptVisible = false} ondone={() => receiptVisible = false} />
    {:else}
      <Button onclick={() => receiptVisible = true}>Restore receipt</Button>
    {/if}

  {:else if id === 'scenarios'}
    <div class="data-list" aria-label="Scenario catalog output">
      {#each SCENARIOS.slice(0, 5) as scenario (scenario.id)}
        <div><strong>{scenario.label}</strong><span>{scenario.id} / {scenario.route}</span></div>
      {/each}
    </div>

  {:else if id === 'segmented-control'}
    <SegmentedControl label="Reporting period" name="catalog-period" options={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }]} bind:active={period} />
    <p class="live-output">Period: {period}</p>

  {:else if id === 'select-card'}
    <div class="selection-grid">
      <SelectCard label="Standard" description="Core catalog checks" pressed={selectedPlan === 'standard'} onclick={() => selectedPlan = 'standard'} />
      <SelectCard label="Pro" description="Extended visual checks" pressed={selectedPlan === 'pro'} onclick={() => selectedPlan = 'pro'} />
    </div>

  {:else if id === 'sidebar'}
    <p class="live-output">The grouped, searchable navigation beside this catalog is the live Sidebar component.</p>

  {:else if id === 'sync'}
    <Button variant="primary" onclick={() => syncCode = generateSyncCode()}>Generate sync code</Button>
    {#if syncCode}
      <div class="sync-result">
        <div class="qr-output">{@html syncQR(syncCode, window.location.origin)}</div>
        <strong>{syncCode}</strong>
      </div>
    {/if}

  {:else if id === 'tabs'}
    <Tabs id="catalog-tabs" label="Catalog example views" {tabs} bind:active={activeTab} />
    {#each tabs as tab (tab.id)}
      {@const ids = tabDomIds('catalog-tabs', tab.id)}
      <div id={ids.panelId} role="tabpanel" aria-labelledby={ids.tabId} hidden={tab.id !== activeTab} class="tab-panel">
        {#if tab.id === activeTab}{tab.label} content remains linked to its tab.{/if}
      </div>
    {/each}

  {:else if id === 'theme'}
    <p class="live-output">The theme control in the catalog header is the live Theme component. Its selection applies to every example.</p>

  {:else if id === 'toast'}
    <div class="example-stack">
      <Button onclick={() => toastVersion += 1}>Show notification</Button>
      {#key toastVersion}
        <Toast message="Catalog changes saved." kind="success" duration={0} dismissLabel="Dismiss catalog notification" />
      {/key}
    </div>

  {:else if id === 'undo'}
    <UndoReceipt action={undoAction} canUndo={undoAvailable} onundo={() => { undoAvailable = false; undoStatus = 'Previous status restored.'; }} />
    <p class="live-output" aria-live="polite">{undoStatus}</p>
    {#if !undoAvailable}<Button size="sm" onclick={() => { undoAvailable = true; undoStatus = 'Ready to restore the previous status.'; }}>Reset undo</Button>{/if}

  {:else if id === 'workflow'}
    <p class="standup"><strong>Standup:</strong> {standup}</p>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Title</th><th>Status</th><th>Next</th></tr></thead>
        <tbody>
          {#each orderPacks(demoPacks) as pack (pack.id)}
            <tr><td>{pack.title}</td><td>{pack.status}</td><td>{hasBlocker(pack) ? 'Review blocker' : primaryCommand(pack).label}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .example-surface { box-sizing: border-box; display: grid; gap: 12px; max-width: 100%; min-width: 0; }
  .example-stack { display: grid; gap: 12px; min-width: 0; }
  .control-row { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; min-width: 0; }
  .live-output, .standup { color: var(--cockpit-text-muted, #6b6b6b); font-size: 13px; line-height: 1.5; margin: 0; overflow-wrap: anywhere; }
  .form-grid { display: grid; gap: 7px; max-width: 32rem; min-width: 0; }
  .field-label { color: var(--cockpit-text-muted, #6b6b6b); font-size: 12px; font-weight: 650; }
  .selection-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
  .data-list { border-block: 1px solid var(--cockpit-border, #d4cec5); display: grid; min-width: 0; }
  .data-list > div { align-items: baseline; border-bottom: 1px solid var(--cockpit-border, #d4cec5); display: flex; flex-wrap: wrap; gap: 4px 12px; justify-content: space-between; min-width: 0; padding: 9px 0; }
  .data-list > div:last-child { border-bottom: 0; }
  .data-list strong, .data-list span { min-width: 0; overflow-wrap: anywhere; }
  .data-list span { color: var(--cockpit-text-muted, #6b6b6b); font-family: var(--font-typewriter, monospace); font-size: 12px; }
  .sync-result { align-items: center; display: flex; flex-wrap: wrap; gap: 14px; min-width: 0; }
  .sync-result strong { font-family: var(--font-typewriter, monospace); overflow-wrap: anywhere; }
  .qr-output { box-sizing: border-box; inline-size: 120px; max-inline-size: 100%; }
  .qr-output :global(svg) { display: block; height: auto; max-width: 100%; }
  .tab-panel { border-bottom: 1px solid var(--cockpit-border, #d4cec5); color: var(--cockpit-text-muted, #6b6b6b); font-size: 13px; min-width: 0; padding: 12px 4px; overflow-wrap: anywhere; }
  .table-scroll { max-width: 100%; overflow-x: auto; }
  table { border-collapse: collapse; font-size: 13px; min-width: 32rem; width: 100%; }
  th, td { border-bottom: 1px solid var(--cockpit-border, #d4cec5); padding: 8px 10px; text-align: left; }
  th { color: var(--cockpit-text-muted, #65746d); font-size: 11px; text-transform: uppercase; }
  @media (max-width: 480px) {
    .selection-grid { grid-template-columns: minmax(0, 1fr); }
    .control-row { align-items: stretch; flex-direction: column; }
  }
</style>
