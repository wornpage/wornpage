export const CATALOG_CATEGORIES = [
  { id: 'status', label: 'Status and feedback' },
  { id: 'inputs', label: 'Inputs and selection' },
  { id: 'commands', label: 'Commands and navigation' },
  { id: 'layout', label: 'Layout and overlays' },
  { id: 'workflow', label: 'Workflow utilities' },
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number]['id'];

export interface DemoCatalogEntry {
  id: string;
  label: string;
  category: CatalogCategory;
  description: string;
  exampleMarker: string;
  exampleKind: 'component' | 'output';
}

export const DEMO_CATALOG = [
  { id: 'alert', label: 'Alert', category: 'status', description: 'Inline feedback with clear tone and dismiss semantics.', exampleMarker: 'Alert', exampleKind: 'component' },
  { id: 'async-states', label: 'Async states', category: 'status', description: 'Loading, empty, and retry states for bounded application workflows.', exampleMarker: 'Spinner', exampleKind: 'component' },
  { id: 'data-display', label: 'Data display', category: 'status', description: 'Compact identity, status, progress, and timeline primitives.', exampleMarker: 'Progress', exampleKind: 'component' },
  { id: 'receipt', label: 'Receipt', category: 'status', description: 'Action confirmation with explicit result cells and undo support.', exampleMarker: 'WornReceipt', exampleKind: 'component' },
  { id: 'toast', label: 'Toast', category: 'status', description: 'Dismissible, motion-aware notifications for transient results.', exampleMarker: 'Toast', exampleKind: 'component' },
  { id: 'undo', label: 'Undo', category: 'status', description: 'Snapshot history and a focused undo or redo receipt.', exampleMarker: 'UndoReceipt', exampleKind: 'component' },

  { id: 'binary-controls', label: 'Binary controls', category: 'inputs', description: 'Native checkbox and switch controls with full-surface targets.', exampleMarker: 'Checkbox', exampleKind: 'component' },
  { id: 'date-input', label: 'Date input', category: 'inputs', description: 'A compact native date picker with touch-safe behavior.', exampleMarker: 'DateInput', exampleKind: 'component' },
  { id: 'form-fields', label: 'Form fields', category: 'inputs', description: 'Native text, select, textarea, and range controls with shared styling.', exampleMarker: 'Input', exampleKind: 'component' },
  { id: 'multi-select', label: 'Multi-select', category: 'inputs', description: 'A native multiple-selection listbox with controlled values.', exampleMarker: 'MultiSelect', exampleKind: 'component' },
  { id: 'segmented-control', label: 'Segmented control', category: 'inputs', description: 'A named radio group with compact equal-width options.', exampleMarker: 'SegmentedControl', exampleKind: 'component' },
  { id: 'select-card', label: 'Select card', category: 'inputs', description: 'A controlled, card-shaped selection button with pressed state.', exampleMarker: 'SelectCard', exampleKind: 'component' },
  { id: 'tabs', label: 'Tabs', category: 'inputs', description: 'Roving keyboard tabs with stable panel relationships.', exampleMarker: 'Tabs', exampleKind: 'component' },

  { id: 'button', label: 'Button', category: 'commands', description: 'Shared command styling for primary, neutral, and destructive actions.', exampleMarker: 'Button', exampleKind: 'component' },
  { id: 'cmdk', label: 'Command palette', category: 'commands', description: 'A native-dialog command palette with fuzzy keyboard search.', exampleMarker: 'Cmdk', exampleKind: 'component' },
  { id: 'command-surfaces', label: 'Command surfaces', category: 'commands', description: 'Grouped command toolbars and readable shortcut hints.', exampleMarker: 'Toolbar', exampleKind: 'component' },
  { id: 'navigation-surfaces', label: 'Navigation surfaces', category: 'commands', description: 'Breadcrumb and pagination controls with native semantics.', exampleMarker: 'Breadcrumb', exampleKind: 'component' },
  { id: 'sidebar', label: 'Sidebar', category: 'commands', description: 'Collapsible, searchable, grouped navigation with keyboard movement.', exampleMarker: 'Sidebar', exampleKind: 'component' },
  { id: 'theme', label: 'Theme', category: 'commands', description: 'A system-aware palette control shared by every catalog example.', exampleMarker: 'Theme', exampleKind: 'component' },

  { id: 'dialog', label: 'Dialog', category: 'layout', description: 'A focus-trapped modal dialog with responsive size presets.', exampleMarker: 'Dialog', exampleKind: 'component' },
  { id: 'disclosure', label: 'Disclosure', category: 'layout', description: 'Native accordion and collapsible content controls.', exampleMarker: 'Accordion', exampleKind: 'component' },
  { id: 'drawer', label: 'Drawer', category: 'layout', description: 'A focus-managed secondary surface for compact viewports.', exampleMarker: 'Drawer', exampleKind: 'component' },
  { id: 'layout-surfaces', label: 'Layout surfaces', category: 'layout', description: 'Named panels, containers, dividers, cards, and resizable panes.', exampleMarker: 'Panel', exampleKind: 'component' },

  { id: 'scenarios', label: 'Scenarios', category: 'workflow', description: 'Canonical scenario metadata and validation for demo applications.', exampleMarker: 'SCENARIOS', exampleKind: 'output' },
  { id: 'sync', label: 'Sync', category: 'workflow', description: 'Shareable codes and QR output without an account.', exampleMarker: 'generateSyncCode', exampleKind: 'output' },
  { id: 'workflow', label: 'Workflow', category: 'workflow', description: 'Pure pack ordering, blocker, command, and standup decisions.', exampleMarker: 'buildStandupText', exampleKind: 'output' },
] as const satisfies readonly DemoCatalogEntry[];

export type DemoCatalogId = (typeof DEMO_CATALOG)[number]['id'];

export const CATALOG_GROUPS = CATALOG_CATEGORIES.map((category) => ({
  ...category,
  entries: DEMO_CATALOG.filter((entry) => entry.category === category.id),
}));
