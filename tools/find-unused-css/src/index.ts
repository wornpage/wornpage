#!/usr/bin/env node
// Find unused .demo-* CSS classes from demo.css against all source files
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const CSS = readFileSync('assets/demo.css', 'utf8');
const SRC = 'svelte-frontend/src';

// Extract all .demo-* selectors (minus pseudo-classes, combinators, attribute selectors)
const seen = new Set();
const selectorRe = /\.(demo-[a-z][a-zA-Z0-9-]*)\b/g;
let m;
while ((m = selectorRe.exec(CSS)) !== null) {
  seen.add(m[1]);
}
const selectors = [...seen].sort();
console.log(`Found ${selectors.length} unique .demo-* selectors in demo.css`);

// Recursively collect all source files
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.svelte-kit') {
      walk(p);
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (['.svelte', '.ts', '.js', '.html'].includes(ext)) {
        files.push(p);
      }
    }
  }
}
walk(SRC);
console.log(`Scanning ${files.length} source files...`);

// Check each selector against all source files
const unused = [];
for (const sel of selectors) {
  let found = false;
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (content.includes(sel)) {
      found = true;
      break;
    }
  }
  if (!found) {
    unused.push(sel);
  }
}

// Report
console.log(`\n${unused.length} UNUSED classes:\n`);
unused.forEach(s => console.log(`  ${s}`));
console.log(`\n${selectors.length - unused.length} used, ${unused.length} unused out of ${selectors.length} total`);
