import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(new URL("../.github/workflows/workspace.yml", import.meta.url), "utf8");

describe("workspace workflow triggers", () => {
	it("runs push checks only on main while retaining pull requests and manual dispatch", () => {
		const expectedTriggers = [
			"on:",
			"  push:",
			"    branches:",
			"      - main",
			"  pull_request:",
			"  workflow_dispatch:",
		].join("\n");
		expect(workflow).toContain(expectedTriggers);
		expect(workflow).not.toContain("  push:\n  pull_request:");
	});
});
