import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(new URL("../.github/workflows/mirror-check.yml", import.meta.url), "utf8");
const publicInstructions = [
	readFileSync(new URL("../README.md", import.meta.url), "utf8"),
	readFileSync(new URL("../CONTRIBUTING.md", import.meta.url), "utf8"),
	readFileSync(new URL("../demo/src/ComponentExample.svelte", import.meta.url), "utf8"),
].join("\n");

describe("repository security contract", () => {
	it("pins every third-party action to a full commit", () => {
		const references = [...workflow.matchAll(/^\s*uses:\s*([^\s#]+)/gmu)].map((match) => match[1]);
		expect(references.length).toBeGreaterThan(0);
		expect(references.every((reference) => /@[0-9a-f]{40}$/u.test(reference))).toBe(true);
	});

	it("does not advertise the unavailable registry as an installation path", () => {
		expect(publicInstructions).not.toMatch(/\b(?:bun add|npm (?:add|install)|bunx) @wornpage\//u);
	});
});
