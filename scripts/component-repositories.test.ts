import { describe, expect, it } from "bun:test";
import {
	COMPONENT_REPOSITORIES,
	STANDALONE_REPOSITORIES,
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
});
