import { describe, test, expect } from 'bun:test';

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  let qi = 0;
  for (let i = 0; i < target.length && qi < query.length; i++) {
    if (target[i].toLowerCase() === query[qi].toLowerCase()) qi++;
  }
  return qi === query.length;
}

function fuzzySearch<T extends { label: string; keywords?: string[] }>(
  items: T[], query: string
): T[] {
  if (!query) return items;
  return items.filter(item => {
    if (fuzzyMatch(query, item.label)) return true;
    if (item.keywords) return item.keywords.some(kw => fuzzyMatch(query, kw));
    return false;
  });
}

describe('fuzzyMatch', () => {
  test('exact match', () => expect(fuzzyMatch('home', 'home')).toBe(true));
  test('subsequence match', () => expect(fuzzyMatch('hm', 'home')).toBe(true));
  test('case insensitive', () => expect(fuzzyMatch('HOME', 'home')).toBe(true));
  test('no match', () => expect(fuzzyMatch('zz', 'home')).toBe(false));
  test('empty query matches all', () => expect(fuzzyMatch('', 'anything')).toBe(true));
  test('characters must be in order', () => expect(fuzzyMatch('mh', 'home')).toBe(false));
});

describe('fuzzySearch', () => {
  const items = [
    { label: 'Home', keywords: [] },
    { label: 'Dashboard' },
    { label: 'Review', keywords: ['blocked', 'needs action'] },
    { label: 'Settings' },
  ];

  test('empty query returns all', () => expect(fuzzySearch(items, '').length).toBe(4));
  test('exact label match', () => expect(fuzzySearch(items, 'home')[0].label).toBe('Home'));
  test('fuzzy match', () => expect(fuzzySearch(items, 'dash')[0].label).toBe('Dashboard'));
  test('keyword match', () => expect(fuzzySearch(items, 'blocked')[0].label).toBe('Review'));
  test('no match', () => expect(fuzzySearch(items, 'zzz').length).toBe(0));
  test('case insensitive', () => expect(fuzzySearch(items, 'HOME')[0].label).toBe('Home'));
});
