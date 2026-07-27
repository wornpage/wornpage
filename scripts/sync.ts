#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";

const PACKAGES = [
  "sidebar", "cmdk", "toast", "theme", "undo",
  "workflow", "receipt", "sync", "cli"
];

const MONOREPO = import.meta.dir.replace(/\\scripts$/, "");
const TMP = join(MONOREPO, ".sync-tmp");

if (existsSync(TMP)) rmSync(TMP, { recursive: true });
mkdirSync(TMP, { recursive: true });

for (const name of PACKAGES) {
  console.log(`\nMirroring @wornpage/${name}...`);

  const repo = `https://github.com/wornpage/${name}.git`;
  const cloneDir = join(TMP, name);
  const targetDir = join(MONOREPO, "packages", name);

  await $`git clone --depth 1 ${repo} ${cloneDir}`.quiet();

  // Remove .git
  rmSync(join(cloneDir, ".git"), { recursive: true, force: true });

  // Replace target
  if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });

  // Copy all files recursively
  cpSync(cloneDir, targetDir, { recursive: true });

  // Remove cruft
  for (const dir of ["node_modules", "dist", ".wrangler"]) {
    const p = join(targetDir, dir);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }

  console.log(`  done`);
}

// Cleanup
rmSync(TMP, { recursive: true, force: true });
console.log("\nAll packages mirrored.");

// Verify tests still pass
console.log("\nRunning tests...");
const result = await #!/usr/bin/env bun
import { $ } from "bun";
import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";

const PACKAGES = [
  "sidebar", "cmdk", "toast", "theme", "undo",
  "workflow", "receipt", "sync", "cli"
];

const MONOREPO = import.meta.dir.replace(/\\scripts$/, "");
const TMP = join(MONOREPO, ".sync-tmp");

if (existsSync(TMP)) rmSync(TMP, { recursive: true });
mkdirSync(TMP, { recursive: true });

for (const name of PACKAGES) {
  console.log(`\nMirroring @wornpage/${name}...`);

  const repo = `https://github.com/wornpage/${name}.git`;
  const cloneDir = join(TMP, name);
  const targetDir = join(MONOREPO, "packages", name);

  await $`git clone --depth 1 ${repo} ${cloneDir}`.quiet();

  // Remove .git
  rmSync(join(cloneDir, ".git"), { recursive: true, force: true });

  // Replace target
  if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });

  // Copy all files recursively
  cpSync(cloneDir, targetDir, { recursive: true });

  // Remove cruft
  for (const dir of ["node_modules", "dist", ".wrangler"]) {
    const p = join(targetDir, dir);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }

  console.log(`  done`);
}

// Cleanup
rmSync(TMP, { recursive: true, force: true });
bun test`.quiet();
if (result.exitCode !== 0) {
  console.error("Tests failed after sync — check individual packages.");
  process.exit(1);
}
console.log("All tests pass.");