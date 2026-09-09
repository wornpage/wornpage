import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const readme = read('../README.md');
const caseStudy = read('../docs/portfolio.md');
const app = read('../demo/src/App.svelte');
const index = read('../demo/index.html');

describe('public branding contract', () => {
  test('uses descriptive headings while retaining Wornpage as the technical namespace', () => {
    expect(readme).toContain('# Accessible interfaces and human-controlled AI workflows');
    expect(readme).toMatch(/A collection of accessible interfaces and tools for human-controlled AI\s+workflows, published as `@wornpage`\./u);
    expect(readme).toContain('## Svelte component library');
    expect(app).toContain('<h1>Svelte component library</h1>');
    expect(app).toContain('{DEMO_CATALOG.length} components and supporting packages for clear, keyboard-friendly interfaces.');
    expect(index).toContain('<title>Wornpage — Svelte Component Library</title>');
  });

  test('labels the frozen public challenge honestly without changing its destination', () => {
    expect(readme).toContain('A frozen WebMCP challenge submission, separate from the private production app. Browser agents can inspect visible evidence and prepare drafts for human review.');
    expect(app).toContain('href="https://projects-webmcp-extension.pages.dev/webmcp-challenge" class="repo-link release-link">WebMCP challenge demo</a>');
    expect(app).not.toContain('Projects release');
    expect(`${readme}\n${caseStudy}`).not.toContain('read-only');
    expect(caseStudy).toContain('frozen challenge submission, separate from the private production app.');
  });

  test('links a compact case study and keeps governance claims bounded', () => {
    expect(readme).toContain('[portfolio case study](docs/portfolio.md)');
    for (const phrase of ['Human approval', 'Bounded authority', 'Inspectable evidence', 'Reviewed delivery', 'keyboard support, visible focus, reduced-motion behavior, and theming']) {
      expect(caseStudy).toContain(phrase);
    }
    expect(caseStudy).toContain('They do not certify legal compliance');
    expect(caseStudy).toContain('automatically validate every generated result');
  });
});
