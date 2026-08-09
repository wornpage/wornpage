import { describe, it, expect } from 'bun:test';
import { VALID_SCENARIOS, SCENARIOS, WELCOME_METHODS, METHOD_CARDS } from '../src/index.ts';

const EXPECTED_IDS = [
  'default', 'due-view', 'empty', 'healthy', 'onboarding', 'review',
  'ai-prompts', 'ai-evals', 'ops-day', 'sales', 'ai-companion', 'demo'
];

describe('VALID_SCENARIOS', () => {
  it('matches the complete known scenario set', () => {
    expect([...VALID_SCENARIOS]).toEqual(EXPECTED_IDS);
  });
});

describe('SCENARIOS', () => {
  it('is the source for every valid scenario id', () => {
    expect(SCENARIOS.map(({ id }) => id)).toEqual(EXPECTED_IDS);
    expect(new Set(SCENARIOS.map(({ id }) => id)).size).toBe(SCENARIOS.length);
  });

  it('provides rendered metadata for every scenario', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.label.length).toBeGreaterThan(0);
      expect(scenario.desc.length).toBeGreaterThan(0);
      expect(scenario.route).toMatch(/^\//);
    }
  });
});

describe('WELCOME_METHODS', () => {
  it('has 5 entries', () => expect(WELCOME_METHODS.length).toBe(5));
  it('all have valid scenario ids', () => {
    for (const m of WELCOME_METHODS) expect(VALID_SCENARIOS.has(m.id)).toBe(true);
  });
});

describe('METHOD_CARDS', () => {
  it('has 5 entries', () => expect(METHOD_CARDS.length).toBe(5));
  it('all have valid scenario ids', () => {
    for (const m of METHOD_CARDS) expect(VALID_SCENARIOS.has(m.id)).toBe(true);
  });
});
