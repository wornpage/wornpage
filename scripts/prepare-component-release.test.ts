import { createHash } from 'node:crypto';
import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  prepareComponentRelease,
  readPublishedManifestFromGitHub,
  releaseTagExistsOnGitHub,
  selectComponentPublication,
  type ComponentReleaseConfig,
} from './prepare-component-release.ts';
import { COMPONENT_PACK_OUTPUT } from './pack-components.ts';

const HEAD = 'a'.repeat(40);
const BASELINE_HEAD = 'b'.repeat(40);
const BASELINE_TAG = 'components-2026.09.09';
const NEXT_TAG = 'components-2026.10.01';
const temporaryRoots: string[] = [];

function integrity(bytes: string) {
  return `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
}

function entry(name: string, version: string, releaseTag: string, bytes: string) {
  return {
    name: `@wornpage/${name}`,
    version,
    releaseTag,
    filename: `wornpage-${name}-${version}.tgz`,
    integrity: integrity(bytes),
    source: `packages/${name}`,
    delivery: 'source',
  };
}

function currentManifest(entries: ReturnType<typeof entry>[]) {
  return { schemaVersion: 2, sourceCommit: HEAD, sourceTreeClean: true, packages: entries };
}

function historicalBaseline(entries: ReturnType<typeof entry>[]) {
  return {
    schemaVersion: 1,
    tag: BASELINE_TAG,
    sourceCommit: BASELINE_HEAD,
    sourceTreeClean: true,
    packages: entries.map(({ releaseTag: _releaseTag, ...rest }) => rest),
  };
}

function config(identities: Record<string, { version: string; releaseTag: string }>): ComponentReleaseConfig {
  return { baselineReleaseTag: BASELINE_TAG, packages: identities };
}

async function fixtureRoot(manifest: ReturnType<typeof currentManifest>, archiveBytes: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'wornpage-selective-release-'));
  temporaryRoots.push(root);
  const output = join(root, COMPONENT_PACK_OUTPUT);
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'component-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  for (const manifestEntry of manifest.packages) {
    await writeFile(join(output, manifestEntry.filename), archiveBytes[manifestEntry.name]);
  }
  return root;
}

function mockRun() {
  const commands: string[][] = [];
  return {
    commands,
    run: async (args: string[]) => {
      commands.push(args);
      const command = args.join(' ');
      if (command.startsWith('git status ')) return '';
      if (command === 'git rev-parse HEAD') return HEAD;
      if (command.includes('/git/ref/heads/main')) return HEAD;
      if (command.includes('/immutable-releases')) return '{"enabled":true}';
      if (command.startsWith('gh release list ')) return '';
      throw new Error(`Unexpected command: ${command}`);
    },
  };
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('selective component publication', () => {
  test('returns a production no-op and performs no GitHub release write when all package bytes are unchanged', async () => {
    const alpha = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const beta = entry('beta', '1.0.0', BASELINE_TAG, 'beta-old');
    const current = currentManifest([alpha, beta]);
    const baseline = historicalBaseline([alpha, beta]);
    const root = await fixtureRoot(current, { '@wornpage/alpha': 'alpha-old', '@wornpage/beta': 'beta-old' });
    const boundary = mockRun();
    let draftCalls = 0;

    const result = await prepareComponentRelease({
      root,
      config: config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG }, beta: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      run: boundary.run,
      readPublishedManifest: async () => baseline,
      createDraft: async () => { draftCalls += 1; return 'must not run'; },
    });

    expect(result.status).toBe('noop');
    expect(result.assets).toEqual([]);
    expect(draftCalls).toBe(0);
    expect(boundary.commands.some((args) => args.join(' ').includes(`/releases/tags/${NEXT_TAG}`))).toBe(false);
  });

  test('uploads only one changed archive plus the full manifest and preserves the unchanged identity', async () => {
    const baselineAlpha = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const baselineBeta = entry('beta', '1.0.0', BASELINE_TAG, 'beta-old');
    const currentAlpha = entry('alpha', '1.1.0', NEXT_TAG, 'alpha-new');
    const currentBeta = entry('beta', '1.0.0', BASELINE_TAG, 'beta-old');
    const current = currentManifest([currentAlpha, currentBeta]);
    const baseline = historicalBaseline([baselineAlpha, baselineBeta]);
    const root = await fixtureRoot(current, { '@wornpage/alpha': 'alpha-new', '@wornpage/beta': 'beta-old' });
    const boundary = mockRun();
    const drafts: { tag: string; assets: string[] }[] = [];

    const result = await prepareComponentRelease({
      root,
      config: config({ alpha: { version: '1.1.0', releaseTag: NEXT_TAG }, beta: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      run: boundary.run,
      readPublishedManifest: async () => baseline,
      releaseExists: async () => false,
      createDraft: async (tag, assets) => { drafts.push({ tag, assets }); return 'draft fixture'; },
    });

    expect(result.status).toBe('publish');
    expect(result.selected.map(({ name }) => name)).toEqual(['@wornpage/alpha']);
    expect(result.current.packages.find(({ name }) => name === '@wornpage/beta')?.releaseTag).toBe(BASELINE_TAG);
    expect(drafts).toHaveLength(1);
    expect(drafts[0].tag).toBe(NEXT_TAG);
    expect(drafts[0].assets.map((path) => path.replaceAll('\\', '/').split('/').at(-1))).toEqual([
      'component-manifest.json',
      'wornpage-alpha-1.1.0.tgz',
    ]);
  });

  test('selects a genuinely new package absent from the published baseline', async () => {
    const alpha = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const beta = entry('beta', '0.1.0', NEXT_TAG, 'beta-new');
    const current = currentManifest([alpha, beta]);
    const root = await fixtureRoot(current, { '@wornpage/alpha': 'alpha-old', '@wornpage/beta': 'beta-new' });
    const boundary = mockRun();
    const drafts: { tag: string; assets: string[] }[] = [];

    const result = await prepareComponentRelease({
      root,
      config: config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG }, beta: { version: '0.1.0', releaseTag: NEXT_TAG } }),
      run: boundary.run,
      readPublishedManifest: async () => historicalBaseline([alpha]),
      releaseExists: async () => false,
      createDraft: async (tag, assets) => { drafts.push({ tag, assets }); return 'new package draft fixture'; },
    });

    expect(result.selected.map(({ name }) => name)).toEqual(['@wornpage/beta']);
    expect(drafts[0].tag).toBe(NEXT_TAG);
    expect(drafts[0].assets.map((path) => path.replaceAll('\\', '/').split('/').at(-1))).toEqual([
      'component-manifest.json',
      'wornpage-beta-0.1.0.tgz',
    ]);
  });

  test('refuses changed package bytes when the package version was not changed', () => {
    const baseline = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const changed = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-new');
    expect(() => selectComponentPublication(
      config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      currentManifest([changed]),
      historicalBaseline([baseline]),
    )).toThrow('source changed without a package version change');
  });

  test('refuses missing integrity and mismatched package source metadata', () => {
    const baseline = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const missingIntegrity = { ...baseline, integrity: '' };
    expect(() => selectComponentPublication(
      config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      currentManifest([missingIntegrity]),
      historicalBaseline([baseline]),
    )).toThrow('valid SHA-512 integrity');
    expect(() => selectComponentPublication(
      config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      currentManifest([{ ...baseline, source: 'packages/not-alpha' }]),
      historicalBaseline([baseline]),
    )).toThrow('mismatched source');
    expect(() => selectComponentPublication(
      config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      currentManifest([baseline]),
      historicalBaseline([baseline, entry('rogue', '1.0.0', BASELINE_TAG, 'rogue')]),
    )).toThrow('unexpected package @wornpage/rogue');
  });

  test('refuses an archive whose bytes do not match the verified manifest integrity', async () => {
    const alpha = entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old');
    const current = currentManifest([alpha]);
    const root = await fixtureRoot(current, { '@wornpage/alpha': 'tampered-after-pack' });
    const boundary = mockRun();
    await expect(prepareComponentRelease({
      root,
      config: config({ alpha: { version: '1.0.0', releaseTag: BASELINE_TAG } }),
      run: boundary.run,
      readPublishedManifest: async () => historicalBaseline([alpha]),
      createDraft: async () => 'must not run',
    })).rejects.toThrow('Release asset changed after verification');
  });

  test('trusts only the exact published immutable baseline release at the GitHub boundary', async () => {
    const baseline = historicalBaseline([entry('alpha', '1.0.0', BASELINE_TAG, 'alpha-old')]);
    const manifestUrl = 'https://api.github.test/assets/manifest';
    const validRelease = { tag_name: BASELINE_TAG, draft: false, immutable: true, assets: [{ name: 'component-manifest.json', url: manifestUrl }] };
    const read = (release: Record<string, unknown>) => readPublishedManifestFromGitHub(BASELINE_TAG, async (args) => {
      if (args[2] === `repos/wornpage/wornpage/releases/tags/${BASELINE_TAG}`) return JSON.stringify(release);
      if (args[2] === manifestUrl) return JSON.stringify(baseline);
      throw new Error(`Unexpected command: ${args.join(' ')}`);
    });

    expect(await read(validRelease)).toEqual(baseline);
    await expect(read({ ...validRelease, tag_name: 'components-2026.09.08' })).rejects.toThrow('instead of');
    await expect(read({ ...validRelease, draft: true })).rejects.toThrow('must not be a draft');
    await expect(read({ ...validRelease, immutable: false })).rejects.toThrow('must be immutable');
  });

  test('checks an exact candidate tag and distinguishes only a real GitHub 404', async () => {
    expect(await releaseTagExistsOnGitHub(NEXT_TAG, async () => '')).toBe(true);
    expect(await releaseTagExistsOnGitHub(NEXT_TAG, async () => { throw new Error('HTTP 404: Not Found'); })).toBe(false);
    await expect(releaseTagExistsOnGitHub(NEXT_TAG, async () => { throw new Error('HTTP 403: Forbidden'); })).rejects.toThrow('403');
  });
});
