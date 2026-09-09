import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { COMPONENT_NAMES, COMPONENT_RELEASES } from './components.ts';
import { inspectPackage } from '../packages/cli/src/commands/verify.ts';

export const COMPONENT_PACK_OUTPUT = join('output', 'components', 'catalog');

async function run(args: string[], cwd: string): Promise<string> {
  const child = Bun.spawn(args, { cwd, stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ]);
  if (code !== 0) throw new Error(`${args.join(' ')} failed in ${cwd}:\n${stdout}\n${stderr}`);
  return stdout.trim();
}

export function validatePackedEntries(files: string[], required: string[]) {
  for (const entry of required) {
    const path = entry.replace(/^\.\//u, '');
    if (!files.includes(path)) throw new Error(`Packed archive is missing ${path}.`);
  }
  for (const file of files) {
    if (/^(?:node_modules|tests|\.github)\//u.test(file) || /(?:^|\/)\.env(?:\.|$)/u.test(file)) {
      throw new Error(`Unexpected development or environment file in package: ${file}`);
    }
  }
}

export async function packComponents(root = resolve(import.meta.dir, '..')) {
  const output = join(root, COMPONENT_PACK_OUTPUT);
  await mkdir(output, { recursive: true });
  const sourceCommit = await run(['git', 'rev-parse', 'HEAD'], root);
  const packages = [];
  for (const name of COMPONENT_NAMES) {
    const directory = join(root, 'packages', name);
    const contract = await inspectPackage(directory);
    const pkg = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
    const identity = COMPONENT_RELEASES[name];
    if (pkg.name !== `@wornpage/${name}` || pkg.version !== identity.version) {
      throw new Error(`Release metadata differs from the package manifest for ${name}.`);
    }
    if (contract.mode === 'bundle') await run([process.execPath, 'run', 'build'], directory);
    const packed = JSON.parse(await run(['npm', 'pack', '--json', '--ignore-scripts', '--pack-destination', output], directory));
    if (packed.length !== 1) throw new Error(`Expected one packed archive for ${name}.`);
    const archive = packed[0];
    const filename = `wornpage-${name}-${pkg.version}.tgz`;
    if (archive.filename !== filename || archive.name !== pkg.name || archive.version !== pkg.version) {
      throw new Error(`Unexpected npm pack identity for ${name}.`);
    }
    validatePackedEntries(archive.files.map((file: { path: string }) => file.path),
      ['package.json', 'README.md', contract.sourceEntry, contract.runtimeEntry, ...(contract.typesEntry ? [contract.typesEntry] : [])]);
    const bytes = await readFile(join(output, filename));
    const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
    if (integrity !== archive.integrity) throw new Error(`npm pack integrity differs for ${name}.`);
    packages.push({ name: pkg.name, version: pkg.version, releaseTag: identity.releaseTag, filename, integrity, source: `packages/${name}`, delivery: pkg.wornpage.delivery });
    console.log(`Packed ${pkg.name}@${pkg.version}`);
  }
  const sourceTreeClean = (await run(['git', 'status', '--porcelain', '--untracked-files=normal'], root)) === '';
  const manifest = { schemaVersion: 2, sourceCommit, sourceTreeClean, packages };
  await writeFile(join(output, 'component-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Packed ${packages.length} components in ${output}; source tree ${sourceTreeClean ? 'clean' : 'has unpublished changes'}.`);
  return manifest;
}

if (import.meta.main) await packComponents();
