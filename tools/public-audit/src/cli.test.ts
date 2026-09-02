import { afterEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CLI = join(import.meta.dir, "cli.ts");
const roots: string[] = [];

afterEach(async () => {
	await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("public-audit CLI", () => {
	it("loads a required config file and returns the audit result", async () => {
		const root = await mkdtemp(join(tmpdir(), "public-audit-cli-test-"));
		roots.push(root);
		await mkdir(join(root, "public"));
		await writeFile(join(root, "public", "index.html"), "safe\n");
		await writeFile(join(root, "audit.json"), JSON.stringify({ root: "./public", allowlist: ["index.html"] }));

		const passed = Bun.spawn(["bun", "run", CLI, join(root, "audit.json")], { stdout: "pipe", stderr: "pipe" });
		expect(await passed.exited).toBe(0);
		expect(await new Response(passed.stdout).text()).toContain("PASS allowlist");

		await writeFile(join(root, "public", "unexpected.txt"), "not approved\n");
		const failed = Bun.spawn(["bun", "run", CLI, join(root, "audit.json")], { stdout: "pipe", stderr: "pipe" });
		expect(await failed.exited).toBe(1);
		expect(await new Response(failed.stdout).text()).toContain("FAIL allowlist:unexpected:unexpected.txt");
	});

	it("fails loudly when no config is supplied", async () => {
		const result = Bun.spawn(["bun", "run", CLI], { stdout: "pipe", stderr: "pipe" });
		expect(await result.exited).toBe(1);
		expect(await new Response(result.stderr).text()).toContain("Usage: public-audit <config.json>");
	});
});
