#!/usr/bin/env bun
//
// Mirror reviewed standalone repository commits into packages/.
//
// Usage:
//   bun run sync          replace drifted mirrors from the pinned manifest
//   bun run sync --check  report drift and exit non-zero; change nothing
//
// This command only fetches and copies reviewed source. It deliberately does
// not install dependencies, build packages, or execute newly mirrored code.

import { $ } from "bun";
import {
	cpSync,
	existsSync,
	lstatSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { STANDALONE_SOURCES, type StandaloneSource } from "./component-repositories.ts";

const CRUFT = new Set(["node_modules", "dist", ".wrangler", ".git", ".DS_Store"]);
const DEFAULT_MONOREPO = resolve(import.meta.dir, "..");

export function assertPathWithin(root: string, candidate: string): string {
	const resolvedRoot = resolve(root);
	const resolvedCandidate = resolve(candidate);
	const fromRoot = relative(resolvedRoot, resolvedCandidate);
	if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) {
		throw new Error(`Path escapes owned root ${resolvedRoot}: ${resolvedCandidate}`);
	}
	return resolvedCandidate;
}

function assertDirectory(path: string, label: string): void {
	const stat = lstatSync(path);
	if (stat.isSymbolicLink()) throw new Error(`${label} must not be a symbolic link: ${path}`);
	if (!stat.isDirectory()) throw new Error(`${label} must be a directory: ${path}`);
}

function removeOwned(root: string, target: string): void {
	const safeTarget = assertPathWithin(root, target);
	if (safeTarget === resolve(root)) throw new Error(`Refusing to remove owned root: ${safeTarget}`);
	if (!existsSync(safeTarget)) return;
	const stat = lstatSync(safeTarget);
	if (stat.isSymbolicLink()) throw new Error(`Refusing to remove symbolic link: ${safeTarget}`);
	rmSync(safeTarget, { recursive: stat.isDirectory(), force: true });
}

/** Every safe file path under dir, relative to it, with local cruft pruned. */
export function filesUnder(dir: string, base = dir): string[] {
	if (!existsSync(dir)) return [];
	const root = resolve(dir);
	assertDirectory(root, "Mirror tree");
	const out: string[] = [];

	function visit(current: string): void {
		for (const entry of readdirSync(current)) {
			const full = assertPathWithin(root, join(current, entry));
			const stat = lstatSync(full);
			if (stat.isSymbolicLink()) throw new Error(`Symbolic links are forbidden in mirrored source: ${full}`);
			if (CRUFT.has(entry)) continue;
			if (stat.isDirectory()) visit(full);
			else if (stat.isFile()) out.push(relative(base, full).replace(/\\/g, "/"));
			else throw new Error(`Unsupported filesystem entry in mirrored source: ${full}`);
		}
	}

	visit(root);
	return out.sort();
}

/** Compare two safe trees by content. Returns human-readable differences. */
export function diffTrees(canonical: string, mirrored: string): string[] {
	const a = new Set(filesUnder(canonical));
	const b = new Set(filesUnder(mirrored));
	const diffs: string[] = [];
	for (const file of a) if (!b.has(file)) diffs.push(`missing from mirror: ${file}`);
	for (const file of b) if (!a.has(file)) diffs.push(`only in mirror: ${file}`);
	for (const file of a) {
		if (!b.has(file)) continue;
		const canonicalPath = assertPathWithin(canonical, join(canonical, file));
		const mirroredPath = assertPathWithin(mirrored, join(mirrored, file));
		if (!readFileSync(canonicalPath).equals(readFileSync(mirroredPath))) {
			diffs.push(`differs: ${file}`);
		}
	}
	return diffs;
}

export function parseSyncArgs(args: string[]): { checkOnly: boolean; help: boolean } {
	const known = new Set(["--check", "--help", "-h"]);
	const unknown = args.filter((arg) => !known.has(arg));
	if (unknown.length > 0) throw new Error(`Unknown sync option(s): ${unknown.join(", ")}`);
	return { checkOnly: args.includes("--check"), help: args.includes("--help") || args.includes("-h") };
}

async function git(args: string[], cwd: string): Promise<string> {
	const result = await $`git ${args}`.cwd(cwd).quiet().nothrow();
	if (result.exitCode !== 0) {
		const detail = [result.stdout.toString().trim(), result.stderr.toString().trim()].filter(Boolean).join("\n");
		throw new Error(`git ${args.join(" ")} failed${detail ? `:\n${detail}` : "."}`);
	}
	return result.stdout.toString().trim();
}

async function fetchPinnedSource(source: StandaloneSource, temporaryRoot: string): Promise<string> {
	if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(source.name)) {
		throw new Error(`Invalid standalone repository name: ${source.name}`);
	}
	if (!/^[0-9a-f]{40}$/u.test(source.revision)) {
		throw new Error(`Invalid full commit for ${source.name}: ${source.revision}`);
	}
	const cloneDir = assertPathWithin(temporaryRoot, join(temporaryRoot, source.name));
	mkdirSync(cloneDir);
	await git(["init", "--quiet"], cloneDir);
	await git(["remote", "add", "origin", `https://github.com/wornpage/${source.name}.git`], cloneDir);
	await git(["fetch", "--depth", "1", "origin", source.revision], cloneDir);
	const fetched = await git(["rev-parse", "FETCH_HEAD"], cloneDir);
	if (fetched !== source.revision) {
		throw new Error(`${source.name} resolved to ${fetched}, expected ${source.revision}`);
	}
	await git(["checkout", "--quiet", "--detach", source.revision], cloneDir);

	// Validate the tracked tree before pruning metadata or ignored local output.
	filesUnder(cloneDir);
	for (const entry of CRUFT) removeOwned(cloneDir, join(cloneDir, entry));
	return cloneDir;
}

export async function syncRepositories(options: { checkOnly: boolean; monorepo?: string }): Promise<void> {
	const monorepo = resolve(options.monorepo ?? DEFAULT_MONOREPO);
	const packagesRoot = assertPathWithin(monorepo, join(monorepo, "packages"));
	const temporaryRoot = assertPathWithin(monorepo, join(monorepo, ".sync-tmp"));
	assertDirectory(monorepo, "Monorepo");
	assertDirectory(packagesRoot, "Packages root");
	removeOwned(monorepo, temporaryRoot);
	mkdirSync(temporaryRoot);

	const fetched = new Map<string, string>();
	const drifted = new Map<string, string[]>();
	try {
		// Fetch and validate every input before touching a mirror target. A failed
		// fetch therefore leaves the entire packages/ tree unchanged.
		for (const source of STANDALONE_SOURCES) {
			fetched.set(source.name, await fetchPinnedSource(source, temporaryRoot));
		}

		for (const source of STANDALONE_SOURCES) {
			const cloneDir = fetched.get(source.name)!;
			const targetDir = assertPathWithin(packagesRoot, join(packagesRoot, source.name));
			const differences = diffTrees(cloneDir, targetDir);
			if (differences.length > 0) drifted.set(source.name, differences);

			console.log(`${differences.length ? "DRIFT" : "ok   "}  @wornpage/${source.name} @ ${source.revision.slice(0, 12)}${differences.length ? ` (${differences.length})` : ""}`);
			for (const difference of differences.slice(0, 5)) console.log(`         ${difference}`);
			if (differences.length > 5) console.log(`         …and ${differences.length - 5} more`);
		}

		if (options.checkOnly) {
			if (drifted.size > 0) {
				throw new Error(`${drifted.size} package(s) drifted from the pinned manifest: ${[...drifted.keys()].join(", ")}`);
			}
			console.log("\nMirror matches every pinned standalone commit.");
			return;
		}

		for (const [name] of drifted) {
			const cloneDir = fetched.get(name)!;
			const targetDir = assertPathWithin(packagesRoot, join(packagesRoot, name));
			removeOwned(packagesRoot, targetDir);
			cpSync(cloneDir, targetDir, { recursive: true, errorOnExist: true });
			console.log(`updated  @wornpage/${name}`);
		}

		console.log("\nMirror update complete. No fetched package code was installed or executed.");
		console.log("Review the diff, then install and run checks as separate trusted steps.");
	} finally {
		removeOwned(monorepo, temporaryRoot);
	}
}

async function main(): Promise<void> {
	const options = parseSyncArgs(process.argv.slice(2));
	if (options.help) {
		console.log("Usage: bun run sync [--check]");
		console.log("Fetch pinned commits and compare or replace the packages/ mirror without executing fetched code.");
		return;
	}
	await syncRepositories({ checkOnly: options.checkOnly });
}

if (import.meta.main) {
	main().catch((error) => {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	});
}
