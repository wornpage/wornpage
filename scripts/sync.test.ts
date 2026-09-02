import { afterEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assertPathWithin, filesUnder, parseSyncArgs } from "./sync.ts";

const roots: string[] = [];

async function temporaryRoot(): Promise<string> {
	const root = await mkdtemp(join(tmpdir(), "wornpage-sync-test-"));
	roots.push(root);
	return root;
}

afterEach(async () => {
	await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("mirror safety boundary", () => {
	it("accepts owned paths and rejects traversal outside the owned root", async () => {
		const root = await temporaryRoot();
		expect(assertPathWithin(root, join(root, "packages", "button"))).toBe(resolve(root, "packages", "button"));
		expect(() => assertPathWithin(root, resolve(root, "..", "outside"))).toThrow("Path escapes owned root");
	});

	it("rejects symbolic links instead of following them", async () => {
		const root = await temporaryRoot();
		const outside = await temporaryRoot();
		await writeFile(join(outside, "secret.txt"), "outside\n");
		await symlink(outside, join(root, "linked"), "junction");

		expect(() => filesUnder(root)).toThrow("Symbolic links are forbidden");
	});

	it("prunes local cruft but inventories ordinary and dot files", async () => {
		const root = await temporaryRoot();
		await mkdir(join(root, "node_modules"));
		await writeFile(join(root, "node_modules", "ignored.js"), "ignored\n");
		await writeFile(join(root, ".env"), "inspected\n");
		await writeFile(join(root, "index.ts"), "export {};\n");

		expect(filesUnder(root)).toEqual([".env", "index.ts"]);
	});

	it("rejects the removed execution shortcut and every unknown option", () => {
		expect(parseSyncArgs(["--check"])).toEqual({ checkOnly: true, help: false });
		expect(() => parseSyncArgs(["--skip-tests"])).toThrow("Unknown sync option");
	});
});
