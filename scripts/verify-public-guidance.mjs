import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

function currentLibraryLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && !url.port && !url.username && !url.password
      && /^\/wornpage\/components(?:\/|$)/u.test(url.pathname);
  } catch { return false; }
}
assert.equal(currentLibraryLink('https://github.com/wornpage/components'), true);
assert.equal(currentLibraryLink('https://github.com.evil.example/wornpage/components'), false);
assert.equal(currentLibraryLink('https://evil.example/github.com/wornpage/components'), false);
assert.equal(currentLibraryLink('https://github.com/wornpage/components-other'), false);
const documents = ['README.md', 'CONTRIBUTING.md', 'docs/getting-started.md', 'docs/repository-map.md'];
for (const file of documents) {
  const text = readFileSync(file, 'utf8');
  const links = [...text.matchAll(/\]\((https:\/\/[^)\s]+)\)/gu)].map(match => match[1]);
  assert.ok(links.some(currentLibraryLink), `${file} must point to the active library`);
  assert.doesNotMatch(text, /https:\/\/github\.com\/wornpage\/(?:projects-pr-machine|wornpage\/releases\/download)\b/u, `${file} contains a retired installation link`);
}
const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : null;
const base = process.argv[2] || event?.pull_request?.base?.sha || event?.before;
const head = process.env.GITHUB_SHA || 'HEAD';
if (base && !/^0+$/u.test(base)) {
  assert.match(base, /^[a-f0-9]{40}$/u, 'Expected an exact base commit');
  const changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' }).trim().split(/\r?\n/u).filter(Boolean);
  const allowed = new Set([...documents, '.github/workflows/workspace.yml', 'scripts/verify-public-guidance.mjs']);
  assert.deepEqual(changed.filter(file => !allowed.has(file)), [], 'New implementation and release work belongs in wornpage/components; historical sources must remain unchanged');
  console.log(`Verified ${changed.length} guidance-only changes; historical package source is unchanged.`);
}
console.log('Public guidance points to the canonical library and public runner. No packages are built or published from this historical workspace.');
