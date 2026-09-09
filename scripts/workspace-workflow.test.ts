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

	it("publishes release material only from a successful main run and otherwise keeps diagnostics", () => {
		const parsed = Bun.YAML.parse(workflow) as { jobs: Record<string, { steps: Array<{ name?: string; if?: string; with?: Record<string, string> }> }> };
		const steps = Object.values(parsed.jobs).flatMap((job) => job.steps);
		const release = steps.find((step) => step.name === "Upload release packages and verification evidence");
		const diagnostic = steps.find((step) => step.name === "Upload diagnostic verification evidence");
		expect(release?.if).toBe("${{ success() && github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch') }}");
		expect(release?.with?.name).toBe("component-release-verification-${{ github.run_id }}-${{ github.run_attempt }}");
		expect(diagnostic?.if).toBe("${{ always() && !(job.status == 'success' && github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')) }}");
	});
});
