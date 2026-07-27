/** Valid demo scenario identifiers. Mirrors server/src/constants.js */
export const VALID_SCENARIOS = new Set([
  'default', 'due-view', 'empty', 'healthy', 'onboarding', 'review',
  'ai-prompts', 'ai-evals', 'ops-day', 'sales', 'ai-companion'
]);

export interface ScenarioDef {
  id: string;
  label: string;
  desc: string;
  icon: string;
  route: string;
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
