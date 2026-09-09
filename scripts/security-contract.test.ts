import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
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
	expect(guard).toContain('sudo mv -- "$source" "$source.disabled"');
	expect(guard).toContain('if [[ -e "$source.disabled" ]]; then');
	expect(guard).toContain("exit 1");
	expect(guard).not.toContain("grep -R");
	expect(source).not.toMatch(unsafeAptFlag);
}

function chromeSourceGuard(source: string) {
	const parsed = Bun.YAML.parse(source) as { jobs: Record<string, { steps: Array<{ name?: string; run?: string }> }> };
	const guard = Object.values(parsed.jobs).flatMap((job) => job.steps).find((step) => step.name === "Disable unused Google Chrome APT sources")?.run;
	expect(guard).toBeDefined();
	return guard!.replaceAll("/etc/apt/sources.list.d", "$fixture_sources");
}

function runChromeSourceGuard(source: string, fixture: string, assertion = "") {
	const script = `
set -euo pipefail
sudo() { "$@"; }
fixture_root="/tmp/wornpage-chrome-apt-$$"
mkdir -p "$fixture_root"
trap 'rm -rf "$fixture_root"' EXIT
fixture_sources="$fixture_root/etc/apt/sources.list.d"
mkdir -p "$fixture_sources"
${fixture}
${chromeSourceGuard(source)}
${assertion}
`;
	return spawnSync("bash", ["-c", `echo ${Buffer.from(script).toString("base64")} | base64 -d | bash`], { encoding: "utf8" });
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
		expect(chromeSourceGuard(workflow)).toBe(chromeSourceGuard(releaseWorkflow));
	});

	it("moves only known Chrome sources and fails before overwriting a backup", () => {
		const moved = runChromeSourceGuard(workflow, `
printf 'active\\n' > "$fixture_sources/google-chrome.list"
printf 'active\\n' > "$fixture_sources/google-chrome.sources"
printf 'unrelated\\n' > "$fixture_sources/unrelated.sources"
`, `
test ! -e "$fixture_sources/google-chrome.list"
test -f "$fixture_sources/google-chrome.list.disabled"
test ! -e "$fixture_sources/google-chrome.sources"
test -f "$fixture_sources/google-chrome.sources.disabled"
test -f "$fixture_sources/unrelated.sources"
`);
		expect(moved.status).toBe(0);

		const absent = runChromeSourceGuard(workflow, "printf 'unrelated\\n' > \"$fixture_sources/unrelated.list\"", "test -f \"$fixture_sources/unrelated.list\"");
		expect(absent.status).toBe(0);

		const collision = runChromeSourceGuard(workflow, "printf 'active\\n' > \"$fixture_sources/google-chrome.list\"; printf 'backup\\n' > \"$fixture_sources/google-chrome.list.disabled\"");
		expect(collision.status).not.toBe(0);
		expect(collision.stdout).toContain("Refusing to overwrite disabled APT source");
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
