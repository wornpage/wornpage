import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { COMPONENT_NAMES } from "./components.ts";

const workflow = readFileSync(new URL("../.github/workflows/workspace.yml", import.meta.url), "utf8");
const rootLicense = readFileSync(new URL("../LICENSE", import.meta.url), "utf8");
const publicInstructions = [
	readFileSync(new URL("../README.md", import.meta.url), "utf8"),
	readFileSync(new URL("../CONTRIBUTING.md", import.meta.url), "utf8"),
	readFileSync(new URL("../demo/src/ComponentExample.svelte", import.meta.url), "utf8"),
].join("\n");

describe("repository security contract", () => {
	it("publishes the MIT license declared by the root package and README", () => {
		expect(rootLicense).toContain("MIT License");
		expect(rootLicense).toContain("Copyright (c) 2026 Wornpage");
		expect(rootLicense).toContain("Permission is hereby granted, free of charge");
	});

	it("pins every third-party action to a full commit", () => {
		const references = [...workflow.matchAll(/^\s*uses:\s*([^\s#]+)/gmu)].map((match) => match[1]);
		expect(references.length).toBeGreaterThan(0);
		expect(references.every((reference) => /@[0-9a-f]{40}$/u.test(reference))).toBe(true);
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
