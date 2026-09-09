import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { COMPONENT_NAMES } from "./components.ts";

const workflow = readFileSync(new URL("../.github/workflows/workspace.yml", import.meta.url), "utf8");
const releaseWorkflow = readFileSync(new URL("../.github/workflows/component-release.yml", import.meta.url), "utf8");
const rootLicense = readFileSync(new URL("../LICENSE", import.meta.url), "utf8");
const publicInstructions = [
	readFileSync(new URL("../README.md", import.meta.url), "utf8"),
	readFileSync(new URL("../CONTRIBUTING.md", import.meta.url), "utf8"),
	readFileSync(new URL("../demo/src/ComponentExample.svelte", import.meta.url), "utf8"),
].join("\n");

const unsafeAptFlag = /trusted\s*=\s*yes|\[\s*trusted\s*\]|allow-unauthenticated|allow-insecure|AllowInsecureRepositories|no-check-certificate/;

function assertChromeSourceGuardBeforeInstall(source: string) {
	const guardIndex = source.indexOf("Disable unused Google Chrome APT sources");
	const installIndex = source.indexOf("bunx playwright install --with-deps chromium");
	expect(guardIndex).toBeGreaterThanOrEqual(0);
	expect(installIndex).toBeGreaterThan(guardIndex);
	const guard = source.slice(guardIndex, installIndex);
	expect(guard).toContain("for source in /etc/apt/sources.list.d/google-chrome.list /etc/apt/sources.list.d/google-chrome.sources");
	expect(guard).toContain('mv "$source" "$source.disabled"');
	expect(guard).toContain("grep -RIl --include='*.list' --include='*.sources'");
	expect(guard).toContain('if [[ -n "$active_chrome_sources" ]]; then');
	expect(guard).toContain("exit 1");
	expect(source).not.toMatch(unsafeAptFlag);
}

describe("repository security contract", () => {
	it("publishes the MIT license declared by the root package and README", () => {
		expect(rootLicense).toContain("MIT License");
		expect(rootLicense).toContain("Copyright (c) 2026 Wornpage");
		expect(rootLicense).toContain("Permission is hereby granted, free of charge");
	});

	it("pins every third-party action to a full commit", () => {
		const references = [...`${workflow}\n${releaseWorkflow}`.matchAll(/^\s*uses:\s*([^\s#]+)/gmu)].map((match) => match[1]);
		expect(references.length).toBeGreaterThan(0);
		expect(references.every((reference) => /@[0-9a-f]{40}$/u.test(reference))).toBe(true);
	});

	it("guards Chromium installation from only the unused Google Chrome APT source", () => {
		assertChromeSourceGuardBeforeInstall(workflow);
		assertChromeSourceGuardBeforeInstall(releaseWorkflow);
	});

	it("keeps hosted release verification read-only and retains failure evidence", () => {
		const parsed = Bun.YAML.parse(releaseWorkflow) as {
			permissions: Record<string, string>;
			jobs: Record<string, { permissions?: Record<string, string>; steps: Array<{ run?: string; uses?: string; if?: string; with?: { path?: string } }> }>;
		};
		expect(parsed.permissions).toEqual({ contents: "read" });
		for (const job of Object.values(parsed.jobs)) {
			expect(job.permissions ?? parsed.permissions).toEqual({ contents: "read" });
		}
		const steps = Object.values(parsed.jobs).flatMap((job) => job.steps);
		const commands = steps.map((step) => step.run ?? "").join("\n");
		expect(commands).toContain("bun run verify:catalog");
		expect(commands).not.toMatch(/prepare-component-release|gh\s+release/u);
		const uploads = steps.filter((step) => step.uses?.startsWith("actions/upload-artifact@"));
		expect(uploads).toHaveLength(1);
		expect(uploads[0].if).toBe("always()");
		expect(uploads[0].with?.path).toContain("output/components/");
		expect(uploads[0].with?.path).toContain("output/verify-catalog/");
	});

	it("does not advertise the unavailable registry as an installation path", () => {
		expect(publicInstructions).not.toMatch(/\b(?:bun add|npm (?:add|install)|bunx) @wornpage\//u);
	});

	it("routes all component source to the canonical workspace", () => {
        for (const name of COMPONENT_NAMES) {
            expect(publicInstructions).toContain(`packages/${name}`);
        }
        expect(publicInstructions).not.toContain('codeload.github.com/wornpage/');
        expect(publicInstructions).not.toContain('bun run sync');
    });
});
