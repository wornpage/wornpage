import { describe, expect, it } from "bun:test";
import {
	COMPONENT_REPOSITORIES,
	COMPONENT_SOURCES,
	STANDALONE_REPOSITORIES,
	STANDALONE_SOURCES,
	TOOLING_REPOSITORIES,
} from "./component-repositories.ts";

describe("standalone repository manifest", () => {
	it("keeps one explicit, unique portfolio denominator", () => {
		expect(COMPONENT_REPOSITORIES).toHaveLength(26);
		expect(TOOLING_REPOSITORIES).toEqual(["cli"]);
		expect(STANDALONE_REPOSITORIES).toHaveLength(27);
		expect(new Set(STANDALONE_REPOSITORIES).size).toBe(STANDALONE_REPOSITORIES.length);
		expect(STANDALONE_REPOSITORIES).not.toContain("wornpage");
	});

	it("keeps component repositories in stable public order", () => {
		expect(COMPONENT_REPOSITORIES).toEqual([...COMPONENT_REPOSITORIES].sort());
	});

	it("pins every standalone source to one full Git commit", () => {
		expect(COMPONENT_SOURCES.map(({ name }) => name)).toEqual(COMPONENT_REPOSITORIES);
		expect(STANDALONE_SOURCES.map(({ name }) => name)).toEqual(STANDALONE_REPOSITORIES);
		expect(STANDALONE_SOURCES.every(({ name }) => /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(name))).toBe(true);
		expect(STANDALONE_SOURCES.every(({ revision }) => /^[0-9a-f]{40}$/u.test(revision))).toBe(true);
	});
});
