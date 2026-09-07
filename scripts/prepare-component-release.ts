import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { COMPONENT_NAMES, COMPONENT_RELEASE_TAG, COMPONENT_VERSIONS } from './components.ts';

const root = resolve(import.meta.dir, '..');
const repository = 'wornpage/wornpage';
async function run(args: string[]) {
  const child = Bun.spawn(args, { cwd: root, stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  if (code !== 0) throw new Error(`${args.join(' ')} failed:\n${stdout}\n${stderr}`);
  return stdout.trim();
}

if (await run(['git', 'status', '--porcelain', '--untracked-files=normal'])) throw new Error('Release source tree must be clean.');
const head = await run(['git', 'rev-parse', 'HEAD']);
const remoteHead = await run(['gh', 'api', `repos/${repository}/git/ref/heads/main`, '--jq', '.object.sha']);
if (head !== remoteHead) throw new Error('Release only the current reviewed default-branch commit.');
const immutable = JSON.parse(await run(['gh', 'api', `repos/${repository}/immutable-releases`]));
if (!immutable.enabled) throw new Error('Enable immutable releases before preparing component delivery.');

const output = join(root, 'output', 'components', COMPONENT_RELEASE_TAG);
const manifestPath = join(output, 'component-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1 || manifest.tag !== COMPONENT_RELEASE_TAG || manifest.sourceCommit !== head || manifest.sourceTreeClean !== true) {
  throw new Error('Build a clean release with bun run verify:catalog at the current source commit.');
}
if (JSON.stringify(manifest.packages.map((entry: { name: string }) => entry.name).sort()) !== JSON.stringify(COMPONENT_NAMES.map(name => `@wornpage/${name}`))) {
  throw new Error('Release package inventory differs from the canonical manifest.');
}
const assets = [manifestPath];
for (const entry of manifest.packages) {
  const name = entry.name.slice('@wornpage/'.length);
  const expected = `wornpage-${name}-${COMPONENT_VERSIONS[name]}.tgz`;
  if (entry.filename !== expected || entry.version !== COMPONENT_VERSIONS[name]) throw new Error(`Unexpected release identity: ${entry.name}`);
  const file = join(output, expected);
  const integrity = `sha512-${createHash('sha512').update(await readFile(file)).digest('base64')}`;
  if (integrity !== entry.integrity) throw new Error(`Release asset changed after verification: ${entry.name}`);
  assets.push(file);
}
const notes = join(output, 'release-notes.md');
await writeFile(notes, `Wornpage Components from reviewed source commit \`${head}\`.\n\nIncludes ${COMPONENT_NAMES.length} component and supporting packages. Install the versioned archives linked by the catalog. SHA-512 digests and source identity are recorded in component-manifest.json.\n`);
console.log(await run(['gh', 'release', 'create', COMPONENT_RELEASE_TAG, ...assets, '--repo', repository, '--target', head, '--draft', '--title', `Wornpage Components ${COMPONENT_RELEASE_TAG.slice('components-'.length)}`, '--notes-file', notes]));
console.log('Draft release prepared. Publish it only after every intended asset is attached; publication locks the tag and assets.');
