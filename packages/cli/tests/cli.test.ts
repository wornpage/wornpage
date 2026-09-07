import { afterEach, describe, it, expect, setDefaultTimeout } from "bun:test";
import { $ } from "bun";
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const CLI = join(import.meta.dir, "..", "src", "index.ts");
const TMP = join(import.meta.dir, "..", ".test-tmp");
setDefaultTimeout(30_000);

function makeWorkspace() {
  mkdirSync(join(TMP, 'packages'), { recursive: true });
  writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: 'wornpage', private: true, workspaces: ['packages/*'] }));
}

afterEach(() => {
  const target = resolve(TMP);
  if (!target.startsWith(resolve(import.meta.dir, '..') + sep)) throw new Error('Test cleanup escapes CLI package');
  rmSync(target, { recursive: true, force: true });
});

describe("@wornpage/cli", () => {
  it("shows help text", async () => {
    const result = await $`bun run ${CLI} --help`.quiet();
    expect(result.stdout.toString()).toContain("wornpage");
    expect(result.stdout.toString()).toContain("new");
    expect(result.stdout.toString()).toContain("verify");
    expect(result.stdout.toString()).not.toContain("ship");
  });

  it("shows version", async () => {
    const result = await $`bun run ${CLI} --version`.quiet();
    expect(result.stdout.toString()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("scaffolds a new package with new command", async () => {
    const targetDir = join(TMP, "packages", "testbox");
    if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });
    makeWorkspace();

    const result = await $`bun run ${CLI} new testbox`.cwd(TMP).quiet();
    expect(result.exitCode).toBe(0);
    expect(existsSync(targetDir)).toBe(true);
    expect(existsSync(join(targetDir, "package.json"))).toBe(true);
    expect(existsSync(join(targetDir, "README.md"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "WornTestbox.svelte"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "index.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "tests", "component.test.ts"))).toBe(true);
    expect(existsSync(join(targetDir, ".github"))).toBe(false);
    expect(readFileSync(join(targetDir, ".gitattributes"), "utf-8")).toBe("* text=auto eol=lf\n");
    expect(existsSync(join(TMP, "bun.lock"))).toBe(true);

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("@wornpage/testbox");
    expect(pkg.version).toBe("0.1.0");
    expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: "source" });
    expect(pkg.peerDependencies.svelte).toBeDefined();
    expect(pkg.devDependencies.svelte).toBe(pkg.peerDependencies.svelte);
    expect(pkg.main).toBe("./src/index.ts");
    expect(pkg.exports["."].default).toBe("./src/index.ts");
    expect(pkg.files).toEqual(["src"]);

    const readme = readFileSync(join(targetDir, "README.md"), "utf-8");
    expect(readme).toContain("<!-- wornpage-delivery:v2 source -->");
    expect(readme).toContain("This package is source-only");
    expect(readme).toContain("Register this package in components-release.json");
    expect(readme).not.toContain("bun add @wornpage/testbox");

    const verification = await $`bun run ${CLI} verify ${targetDir} --frozen-dist`.quiet();
    expect(verification.exitCode).toBe(0);
    expect(verification.stdout.toString()).toContain("Verified @wornpage/testbox");

    rmSync(targetDir, { recursive: true });
  });

  it("rejects unsafe package names before creating a target", async () => {
    mkdirSync(TMP, { recursive: true });
    const targetDir = join(TMP, "packages", "Bad_Name");
    if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });

    const result = await $`bun run ${CLI} new Bad_Name`.cwd(TMP).quiet().nothrow();
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.toString()).toContain("Package name must be a lowercase slug");
    expect(existsSync(targetDir)).toBe(false);
  });

  it("preserves an existing target without writing scaffold files", async () => {
    makeWorkspace();
    const targetDir = join(TMP, "packages", "existing");
    if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });
    mkdirSync(targetDir, { recursive: true });
    const marker = join(targetDir, "keep.txt");
    writeFileSync(marker, "keep");

    const result = await $`bun run ${CLI} new existing`.cwd(TMP).quiet().nothrow();
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.toString()).toContain("Target already exists");
    expect(readFileSync(marker, "utf-8")).toBe("keep");
    expect(existsSync(join(targetDir, "package.json"))).toBe(false);

    rmSync(targetDir, { recursive: true });
  });

  it("package.json is valid", () => {
    const pkg = require("../package.json");
    expect(pkg.name).toBe("@wornpage/cli");
    expect(pkg.bin.wornpage).toBeDefined();
    expect(pkg.license).toBe("MIT");
  });

  it("refuses to create a new standalone project outside the canonical workspace", async () => {
    mkdirSync(TMP, { recursive: true });
    writeFileSync(join(TMP, 'package.json'), JSON.stringify({ name: 'unrelated-app' }));
    const result = await $`bun run ${CLI} new detached`.cwd(TMP).quiet().nothrow();
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.toString()).toContain('canonical wornpage workspace root');
    expect(existsSync(join(TMP, 'packages'))).toBe(false);
  });
});
