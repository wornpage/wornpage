export interface ScenarioCatalogEntry {
  id: string;
  label: string;
  desc: string;
  route: string;
}

/** Canonical scenario metadata for selectors, launchers, and validation. */
export const SCENARIOS = [
  { id: 'default', label: 'Default', desc: 'Standard sample work across several states.', route: '/' },
  { id: 'due-view', label: 'Due view', desc: 'Due dates for Calendar and Timeline.', route: '/work' },
  { id: 'empty', label: 'Empty', desc: 'Start from scratch.', route: '/review' },
  { id: 'healthy', label: 'Healthy', desc: 'Clear next actions and no blockers.', route: '/work' },
  { id: 'onboarding', label: 'Onboarding', desc: 'Work path, next actions, and profiles.', route: '/' },
  { id: 'review', label: 'Review', desc: 'Blockers and missing next actions.', route: '/review' },
  { id: 'ai-prompts', label: 'AI Prompts', desc: 'AI prompt copy profile.', route: '/review' },
  { id: 'ai-evals', label: 'AI Evals', desc: 'Evaluation sources and proof targets.', route: '/review' },
  { id: 'ops-day', label: 'Ops Day', desc: 'Milestones and locations.', route: '/review' },
  { id: 'sales', label: 'Sales', desc: 'Sales copy profile.', route: '/review' },
  { id: 'ai-companion', label: 'AI Companion', desc: 'AI-assisted workflows.', route: '/work' },
  { id: 'demo', label: 'Demo', desc: 'Examples across app features.', route: '/work' }
] as const satisfies readonly ScenarioCatalogEntry[];

export type ScenarioId = (typeof SCENARIOS)[number]['id'];

/** Valid demo scenario identifiers. Derived from the canonical catalog. */
export const VALID_SCENARIOS: ReadonlySet<string> = new Set(SCENARIOS.map(({ id }) => id));

export interface ScenarioDef extends ScenarioCatalogEntry {
  icon: string;
}

/** Method cards shown on the home page welcome screen */
export const WELCOME_METHODS: ScenarioDef[] = [
  { id: 'ops-day', label: 'Daily Operations', desc: 'Restock, payroll, maintenance, onboarding — everything a small business tracks.', icon: '🏪', route: '/review' },
  { id: 'ai-prompts', label: 'Prompt Engineering', desc: 'Library, evals, model comparison, agent chains. Prove what works.', icon: '🤖', route: '/review' },
  { id: 'sales', label: 'Sales Pipeline', desc: 'Prospect, qualify, close. Track owners, blockers, and next actions.', icon: '💰', route: '/review' },
  { id: 'default', label: 'Project Work', desc: 'Blocker management, next actions, proof targets, memory notes.', icon: '📋', route: '/work' },
  { id: 'empty', label: 'Start from scratch', desc: 'Blank canvas. Your vocabulary, your workflow.', icon: '✨', route: '/review' }
];

/** Compact method cards shown on the dashboard strip */
export const METHOD_CARDS: ScenarioDef[] = [
  { id: 'ops-day', label: 'Daily Operations', desc: 'Restock, payroll, maintenance, onboarding — everything a small business tracks.', icon: '🏪', route: '/review' },
  { id: 'ai-prompts', label: 'Prompt Engineering', desc: 'Prompt library, evals, model comparison.', icon: '🤖', route: '/review' },
  { id: 'sales', label: 'Sales Pipeline', desc: 'Prospect, qualify, and close leads.', icon: '💰', route: '/review' },
  { id: 'ai-companion', label: 'AI Companion', desc: 'Emotional support, pragmatic guidance, stoic presence.', icon: '🎭', route: '/work' },
  { id: 'default', label: 'Project Work', desc: 'General-purpose blocker and next-action tracking.', icon: '📋', route: '/work' }
];
