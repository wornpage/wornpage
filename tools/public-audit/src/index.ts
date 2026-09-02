import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { isAbsolute, join, posix, relative, resolve } from "node:path";

export interface AuditConfig {
	root: string;
	allowlist: string[];
	budget?: { files?: Record<string, number>; total?: number };
	retired?: string[];
	forbidden?: Array<{ name: string; pattern: string }>;
}

export interface Finding {
	ok: boolean;
	name: string;
	detail: string;
}

function auditPath(path: string): string {
	if (!path || path.includes("\\") || isAbsolute(path)) {
		throw new Error(`Expected a non-empty relative POSIX path, received ${JSON.stringify(path)}.`);
	}
	const normalized = posix.normalize(path);
	if (normalized !== path || normalized === ".." || normalized.startsWith("../")) {
		throw new Error(`Path must be normalized and remain inside the public root: ${path}`);
	}
	return normalized;
}

function pathInside(root: string, path: string): string {
	const candidate = resolve(root, path);
	const fromRoot = relative(root, candidate);
	if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) {
		throw new Error(`Path escapes public root: ${path}`);
	}
	return candidate;
}

function containsDotSegment(path: string): boolean {
	return path.split("/").some((segment) => segment.startsWith("."));
}

export function audit(config: AuditConfig): Finding[] {
	const findings: Finding[] = [];
	const root = resolve(config.root);

	try {
		const rootStat = lstatSync(root);
		if (rootStat.isSymbolicLink()) {
			return [{ ok: false, name: "unsafe:root-symlink", detail: `Public root must not be a symbolic link: ${root}` }];
		}
		if (!rootStat.isDirectory()) {
			return [{ ok: false, name: "config:root", detail: `Public root must be a directory: ${root}` }];
		}
	} catch (error) {
		return [{ ok: false, name: "config:root", detail: `Cannot inspect public root ${root}: ${error instanceof Error ? error.message : String(error)}` }];
	}

	const allowlist = new Set<string>();
	if (!Array.isArray(config.allowlist)) {
		findings.push({ ok: false, name: "config:allowlist", detail: "allowlist is required and must be an array of exact file paths." });
	} else {
		for (const configured of config.allowlist) {
			try {
				const file = auditPath(configured);
				if (allowlist.has(file)) {
					findings.push({ ok: false, name: `config:allowlist:${file}`, detail: `${file} is listed more than once.` });
				}
				allowlist.add(file);
			} catch (error) {
				findings.push({ ok: false, name: "config:allowlist", detail: error instanceof Error ? error.message : String(error) });
			}
		}
	}

	const files: string[] = [];
	function walk(directory: string): void {
		for (const entry of readdirSync(directory).sort()) {
			const full = pathInside(root, join(directory, entry));
			const file = relative(root, full).replace(/\\/g, "/");
			const stat = lstatSync(full);

			if (stat.isSymbolicLink()) {
				findings.push({ ok: false, name: `unsafe:symlink:${file}`, detail: `Symbolic links are forbidden in public output: ${file}` });
				continue;
			}
			if (containsDotSegment(file)) {
				findings.push({ ok: false, name: `unsafe:dotfile:${file}`, detail: `Dot-prefixed public paths are forbidden: ${file}` });
			}
			if (stat.isDirectory()) {
				walk(full);
			} else if (stat.isFile()) {
				files.push(file);
			} else {
				findings.push({ ok: false, name: `unsafe:type:${file}`, detail: `Unsupported filesystem entry in public output: ${file}` });
			}
		}
	}

	try {
		walk(root);
	} catch (error) {
		findings.push({ ok: false, name: "unsafe:walk", detail: error instanceof Error ? error.message : String(error) });
		return findings;
	}

	for (const file of files) {
		if (!allowlist.has(file)) {
			findings.push({ ok: false, name: `allowlist:unexpected:${file}`, detail: `${file} is not explicitly approved for public deployment.` });
		}
	}
	for (const file of allowlist) {
		if (!files.includes(file)) {
			findings.push({ ok: false, name: `allowlist:missing:${file}`, detail: `${file} is approved but missing from public output.` });
		}
	}
	if (!findings.some(({ name }) => name.startsWith("config:allowlist") || name.startsWith("allowlist:"))) {
		findings.push({ ok: true, name: "allowlist", detail: `${files.length} public file(s) exactly match the allowlist.` });
	}

	if (config.budget) {
		let totalSize = 0;
		for (const file of files) {
			const size = lstatSync(pathInside(root, file)).size;
			totalSize += size;
			const maximum = config.budget.files?.[file];
			if (maximum !== undefined) {
				if (!Number.isSafeInteger(maximum) || maximum < 0) {
					findings.push({ ok: false, name: `config:budget:${file}`, detail: `Budget for ${file} must be a non-negative integer.` });
				} else if (size > maximum) {
					findings.push({ ok: false, name: `budget:${file}`, detail: `${file} is ${size}B (max ${maximum}B).` });
				}
			}
		}
		if (config.budget.total !== undefined) {
			const maximum = config.budget.total;
			if (!Number.isSafeInteger(maximum) || maximum < 0) {
				findings.push({ ok: false, name: "config:budget:total", detail: "Total budget must be a non-negative integer." });
			} else {
				findings.push({
					ok: totalSize <= maximum,
					name: "budget:total",
					detail: `Total ${totalSize}B (max ${maximum}B).`,
				});
			}
		}
	}

	for (const forbidden of config.forbidden ?? []) {
		let expression: RegExp;
		try {
			expression = new RegExp(forbidden.pattern);
		} catch (error) {
			findings.push({ ok: false, name: `config:forbidden:${forbidden.name}`, detail: error instanceof Error ? error.message : String(error) });
			continue;
		}
		for (const file of files) {
			try {
				const content = readFileSync(pathInside(root, file), "utf8");
				if (expression.test(content)) {
					findings.push({ ok: false, name: `forbidden:${forbidden.name}:${file}`, detail: `Found ${forbidden.name} in ${file}.` });
				}
			} catch (error) {
				findings.push({ ok: false, name: `read:${file}`, detail: `Could not inspect ${file}: ${error instanceof Error ? error.message : String(error)}` });
			}
		}
	}

	for (const configured of config.retired ?? []) {
		try {
			const file = auditPath(configured);
			const exists = files.includes(file);
			findings.push({
				ok: !exists,
				name: `retired:${file}`,
				detail: exists ? `${file} still exists.` : `${file} is absent.`,
			});
		} catch (error) {
			findings.push({ ok: false, name: "config:retired", detail: error instanceof Error ? error.message : String(error) });
		}
	}

	return findings;
}

export function report(findings: Finding[]): boolean {
	for (const finding of findings) {
		console.log(`${finding.ok ? "PASS" : "FAIL"} ${finding.name}: ${finding.detail}`);
	}
	return findings.every(({ ok }) => ok);
}
