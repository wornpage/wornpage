import { afterEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { audit } from "./index.ts";

const roots: string[] = [];

async function fixture(): Promise<string> {
	const root = await mkdtemp(join(tmpdir(), "public-audit-test-"));
	roots.push(root);
	return root;
}

afterEach(async () => {
	await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("public output audit", () => {
	it("requires an exact allowlist with no unexpected or missing files", async () => {
		const root = await fixture();
		await writeFile(join(root, "index.html"), "safe\n");
		await writeFile(join(root, "extra.js"), "safe\n");

		const findings = audit({ root, allowlist: ["index.html", "missing.css"] });
		expect(findings.some(({ name }) => name === "allowlist:unexpected:extra.js")).toBe(true);
		expect(findings.some(({ name }) => name === "allowlist:missing:missing.css")).toBe(true);
	});

	it("rejects dot-prefixed files even when explicitly allowlisted", async () => {
		const root = await fixture();
		await writeFile(join(root, ".env"), "SECRET=value\n");

		const findings = audit({ root, allowlist: [".env"] });
		expect(findings.some(({ name }) => name === "unsafe:dotfile:.env")).toBe(true);
	});

	it("rejects symbolic links without following them", async () => {
		const root = await fixture();
		const outside = await fixture();
		await writeFile(join(outside, "secret.txt"), "SECRET\n");
		await symlink(outside, join(root, "linked"), "junction");

		const findings = audit({ root, allowlist: [] });
		expect(findings.some(({ name }) => name === "unsafe:symlink:linked")).toBe(true);
	});

	it("checks the same forbidden expression independently in every file", async () => {
		const root = await fixture();
		await mkdir(join(root, "assets"));
		await writeFile(join(root, "a.txt"), "SECRET one\n");
		await writeFile(join(root, "assets", "b.txt"), "SECRET two\n");

		const findings = audit({
			root,
			allowlist: ["a.txt", "assets/b.txt"],
			forbidden: [{ name: "secret", pattern: "SECRET" }],
		});
		expect(findings.filter(({ name }) => name.startsWith("forbidden:secret:"))).toHaveLength(2);
	});

	it("rejects allowlist traversal instead of resolving it", async () => {
		const root = await fixture();
		const findings = audit({ root, allowlist: ["../outside.txt"] });
		expect(findings.some(({ name }) => name === "config:allowlist")).toBe(true);
	});
});
