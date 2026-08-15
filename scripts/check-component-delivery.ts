#!/usr/bin/env bun

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
	findComponentPackages,
	inspectPackage,
	type PackageContract,
} from "../packages/cli/src/commands/verify.ts";
import { COMPONENT_REPOSITORIES } from "./component-repositories.ts";

const ROOT = join(import.meta.dir, "..");
const PACKAGES_ROOT = join(ROOT, "packages");

function deliveryName(contract: PackageContract): "source" | "browser-bundle" {
	return contract.mode === "bundle" ? "browser-bundle" : "source";
}

function documentedDeliveries(readme: string): Map<string, string> {
	const deliveries = new Map<string, string>();
	for (const line of readme.split(/\r?\n/u)) {
		if (!line.startsWith("| `@wornpage/")) continue;
		const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
		const name = cells[0]?.match(/^`(@wornpage\/[^`]+)`$/u)?.[1];
		const delivery = cells[2]?.match(/^`([^`]+)`$/u)?.[1];
		if (!name || !delivery) continue;
		if (deliveries.has(name)) throw new Error(`README.md documents ${name} more than once.`);
		deliveries.set(name, delivery);
	}
	return deliveries;
}

const roots = await findComponentPackages(PACKAGES_ROOT);
const contracts: PackageContract[] = [];
const issues: string[] = [];

for (const root of roots) {
	try {
		contracts.push(await inspectPackage(root));
	} catch (error) {
		issues.push(error instanceof Error ? error.message : String(error));
	}
}

const documented = documentedDeliveries(await readFile(join(ROOT, "README.md"), "utf8"));
const contractNames = new Set(contracts.map((contract) => contract.name));
const expectedNames = new Set(COMPONENT_REPOSITORIES.map((name) => `@wornpage/${name}`));

for (const name of expectedNames) {
	if (!contractNames.has(name)) issues.push(`packages/ must mirror ${name} from its standalone repository.`);
}

for (const name of contractNames) {
	if (!expectedNames.has(name)) issues.push(`packages/ contains unlisted component ${name}.`);
}

for (const contract of contracts) {
	const expected = deliveryName(contract);
	const actual = documented.get(contract.name);
	if (actual !== expected) {
		issues.push(`README.md must document ${contract.name} delivery as ${expected}, not ${actual ?? "(missing)"}.`);
	}
}

for (const [name, delivery] of documented) {
	if (delivery !== "tooling" && !contractNames.has(name)) {
		issues.push(`README.md documents ${name} as a component, but packages/ has no matching delivery contract.`);
	}
}

if (issues.length > 0) {
	console.error(`Component delivery contract failed:\n- ${issues.join("\n- ")}`);
	process.exit(1);
}

console.log(`Component delivery contract passed for ${contracts.length} packages.`);
for (const contract of contracts.sort((a, b) => a.name.localeCompare(b.name))) {
	console.log(`  ${contract.name}: ${deliveryName(contract)} (${contract.sourceEntry} -> ${contract.runtimeEntry})`);
}
