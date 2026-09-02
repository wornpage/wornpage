#!/usr/bin/env bun

import { lstatSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { audit, report, type AuditConfig } from "./index.ts";

function readConfig(path: string): AuditConfig {
	const configPath = resolve(path);
	const stat = lstatSync(configPath);
	if (stat.isSymbolicLink() || !stat.isFile()) {
		throw new Error(`Audit config must be a regular file, not a symbolic link: ${configPath}`);
	}
	const parsed = JSON.parse(readFileSync(configPath, "utf8")) as Partial<AuditConfig>;
	if (typeof parsed.root !== "string") throw new Error("Audit config must define root as a string.");
	if (!Array.isArray(parsed.allowlist) || !parsed.allowlist.every((entry) => typeof entry === "string")) {
		throw new Error("Audit config must define allowlist as an array of exact file paths.");
	}
	return { ...parsed, root: resolve(dirname(configPath), parsed.root) } as AuditConfig;
}

export function main(args = process.argv.slice(2)): number {
	if (args.length !== 1) throw new Error("Usage: public-audit <config.json>");
	return report(audit(readConfig(args[0]))) ? 0 : 1;
}

if (import.meta.main) {
	try {
		process.exitCode = main();
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
