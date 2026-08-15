#!/usr/bin/env bun
//
// Mirror the canonical standalone repos into packages/.
//
// The standalone repos are the source of truth (see CONTRIBUTING.md); this
// monorepo exists so packages can be browsed, tested and refactored together.
// That only holds if the mirror is GENERATED. Hand-editing packages/ produces
// changes that are invisible to consumers, because nothing installs from here.
//
// Usage:
//   bun run sync                mirror every package, then run the test suite
//   bun run sync --check        report drift and exit non-zero; changes nothing
//   bun run sync --skip-tests   mirror without running tests
//
// --check is the one to wire into CI. A mirror nobody verifies drifts silently:
// this script was previously concatenated onto itself (`const result = await `
// followed by a second copy of the whole file), which is a syntax error — so
// `bun run sync` failed instantly and every drift after that went unnoticed:
// a missing package, six stale READMEs, and a stale test count in the README.

import { $ } from "bun";
import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { STANDALONE_REPOSITORIES } from "./component-repositories.ts";

// Monorepo-native code lives in tools/ and is deliberately absent from the
// shared manifest because sync deletes and replaces every directory it mirrors.

// Build output and local runtime state never belong in the mirror: they are
// per-machine, and committing them makes every sync a noisy diff.
const CRUFT = ["node_modules", "dist", ".wrangler", ".git", ".DS_Store"];

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const skipTests = args.has("--skip-tests");

const MONOREPO = join(import.meta.dir, "..");
const TMP = join(MONOREPO, ".sync-tmp");

/** Every file path under dir, relative to it, with cruft pruned. */
function filesUnder(dir: string, base = dir): string[] {
	if (!existsSync(dir)) return [];
	const out: string[] = [];
	for (const entry of readdirSync(dir)) {
		if (CRUFT.includes(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...filesUnder(full, base));
		else out.push(relative(base, full).replace(/\\/g, "/"));
	}
	return out.sort();
}

/** Compare two trees by content. Returns human-readable differences. */
function diffTrees(canonical: string, mirrored: string): string[] {
	const a = new Set(filesUnder(canonical));
	const b = new Set(filesUnder(mirrored));
	const diffs: string[] = [];
	for (const f of a) if (!b.has(f)) diffs.push(`missing from mirror: ${f}`);
	for (const f of b) if (!a.has(f)) diffs.push(`only in mirror: ${f}`);
	for (const f of a) {
		if (!b.has(f)) continue;
		if (!readFileSync(join(canonical, f)).equals(readFileSync(join(mirrored, f)))) {
			diffs.push(`differs: ${f}`);
		}
	}
	return diffs;
}

if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const drifted: Record<string, string[]> = {};
const failed: string[] = [];

for (const name of STANDALONE_REPOSITORIES) {
	const repo = `https://github.com/wornpage/${name}.git`;
	const cloneDir = join(TMP, name);
	const targetDir = join(MONOREPO, "packages", name);

	try {
		await $`git clone --depth 1 ${repo} ${cloneDir}`.quiet();
	} catch {
		// One unreachable repo must not abort the whole mirror, or a transient
		// network failure leaves packages/ half-updated.
		failed.push(name);
		console.error(`  ${name}: clone failed — left untouched`);
		continue;
	}

	for (const dir of CRUFT) {
		const p = join(cloneDir, dir);
		if (existsSync(p)) rmSync(p, { recursive: true, force: true });
	}

	const differences = diffTrees(cloneDir, targetDir);
	if (differences.length) drifted[name] = differences;

	if (checkOnly) {
		console.log(`${differences.length ? "DRIFT" : "ok   "}  @wornpage/${name}${differences.length ? ` (${differences.length})` : ""}`);
		for (const d of differences.slice(0, 5)) console.log(`         ${d}`);
		if (differences.length > 5) console.log(`         …and ${differences.length - 5} more`);
		continue;
	}

	if (existsSync(targetDir)) rmSync(targetDir, { recursive: true, force: true });
	cpSync(cloneDir, targetDir, { recursive: true });
	console.log(`${differences.length ? "updated" : "ok     "}  @wornpage/${name}`);
}

rmSync(TMP, { recursive: true, force: true });

if (failed.length) {
	console.error(`\n${failed.length} package(s) could not be fetched: ${failed.join(", ")}`);
	process.exit(1);
}

if (checkOnly) {
	const names = Object.keys(drifted);
	if (names.length) {
		console.error(`\n${names.length} package(s) drifted from canonical: ${names.join(", ")}`);
		console.error("Run `bun run sync` to regenerate packages/ from the standalone repos.");
		process.exit(1);
	}
	console.log("\nMirror matches every canonical repo.");
	process.exit(0);
}

console.log("\nAll packages mirrored.");

if (skipTests) process.exit(0);

// Mirroring strips node_modules, so workspace dependencies must be reinstalled
// before the suite can run. Without this, `bun run sync` ends on a failure that
// looks like a broken package but is only a missing install — @wornpage/cli's
// test failed exactly that way, unable to resolve `commander`.
console.log("\nInstalling workspace dependencies...");
const install = await $`bun install`.nothrow();
if (install.exitCode !== 0) process.exit(install.exitCode);

console.log("\nRunning tests...");
const result = await $`bun test`.nothrow();
process.exit(result.exitCode);
