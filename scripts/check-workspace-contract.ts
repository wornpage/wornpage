#!/usr/bin/env bun

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

type Manifest = {
	name?: string;
	workspaces?: string[];
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
};

const ROOT = join(import.meta.dir, "..");

function readManifest(path: string): Manifest {
	return JSON.parse(readFileSync(path, "utf8")) as Manifest;
}

const root = readManifest(join(ROOT, "package.json"));
const demo = readManifest(join(ROOT, "demo", "package.json"));
const issues: string[] = [];

for (const required of ["packages/*", "demo"]) {
	if (!root.workspaces?.includes(required)) {
		issues.push(`Root workspaces must include ${required}.`);
	}
}

const mirroredNames = new Set(
	readdirSync(join(ROOT, "packages"), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.flatMap((entry) => {
			const manifestPath = join(ROOT, "packages", entry.name, "package.json");
			if (!existsSync(manifestPath)) return [];
			const name = readManifest(manifestPath).name;
			return name ? [name] : [];
		}),
);

const demoDependencies = { ...demo.dependencies, ...demo.devDependencies };
for (const [name, specifier] of Object.entries(demoDependencies)) {
	if (!name.startsWith("@wornpage/")) continue;
	if (!mirroredNames.has(name)) {
		issues.push(`Demo dependency ${name} has no mirrored workspace package.`);
	}
	if (specifier !== "workspace:*") {
		issues.push(`Demo dependency ${name} must use workspace:* instead of ${specifier}.`);
	}
}

const lockPath = join(ROOT, "bun.lock");
if (!existsSync(lockPath)) {
	issues.push("Commit bun.lock so CI can install the workspace with --frozen-lockfile.");
} else {
	const lock = readFileSync(lockPath, "utf8");
	if (/"@wornpage\/[^"]+":\s*"file:/u.test(lock) || /@wornpage\/[^"]+@file:/u.test(lock)) {
		issues.push("bun.lock must not resolve @wornpage packages through file: paths.");
	}
}

if (issues.length > 0) {
	console.error(`Workspace dependency contract failed:\n- ${issues.join("\n- ")}`);
	process.exit(1);
}

console.log(`Workspace dependency contract passed for ${mirroredNames.size} mirrored packages.`);
