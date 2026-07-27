import { describe, it, expect } from 'bun:test';
import { VALID_SCENARIOS, WELCOME_METHODS, METHOD_CARDS } from '../src/index.ts';

describe('VALID_SCENARIOS', () => {
  it('includes all known scenarios', () => {
    expect(VALID_SCENARIOS.has('default')).toBe(true);
    expect(VALID_SCENARIOS.has('ai-companion')).toBe(true);
    expect(VALID_SCENARIOS.has('sales')).toBe(true);
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
