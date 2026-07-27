import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface AuditConfig {
  root: string;
  budget?: { files?: Record<string, number>; total?: number };
  allowlist?: string[];
  retired?: string[];
  forbidden?: Array<{ name: string; pattern: string }>;
}

interface Finding {
  ok: boolean;
  name: string;
  detail: string;
}

export function audit(config: AuditConfig): Finding[] {
  const findings: Finding[] = [];
  const { root, budget, allowlist, retired, forbidden } = config;

  function walk(dir: string): string[] {
    const entries: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      if (statSync(full).isDirectory()) {
        entries.push(...walk(full));
      } else {
        entries.push(relative(root, full).replace(/\\/g, '/'));
      }
    }
    return entries;
  }

  const files = walk(root);

  // Budget checks
  if (budget) {
    let totalSize = 0;
    for (const file of files) {
      const size = statSync(join(root, file)).size;
      totalSize += size;
      if (budget.files?.[file] && size > budget.files[file]) {
        findings.push({ ok: false, name: `budget:${file}`, detail: `${file} is ${size}B (max ${budget.files[file]}B)` });
      }
    }
    if (budget.total && totalSize > budget.total) {
      findings.push({ ok: false, name: 'budget:total', detail: `Total ${totalSize}B (max ${budget.total}B)` });
    } else {
      findings.push({ ok: true, name: 'budget:total', detail: `Total ${totalSize}B` });
    }
  }

  // Forbidden patterns
  if (forbidden) {
    for (const { name, pattern } of forbidden) {
      const re = new RegExp(pattern, 'g');
      for (const file of files) {
        try {
          const content = readFileSync(join(root, file), 'utf-8');
          if (re.test(content)) {
            findings.push({ ok: false, name: `forbidden:${name}`, detail: `Found in ${file}` });
          }
        } catch { /* binary file — skip */ }
      }
    }
  }

  // Retired file check
  if (retired) {
    for (const r of retired) {
      const exists = files.includes(r);
      findings.push({
        ok: !exists,
        name: `retired:${r}`,
        detail: exists ? `${r} still present` : `${r} correctly removed`
      });
    }
  }

  return findings;
}

export function report(findings: Finding[]): boolean {
  for (const f of findings) {
    console.log(`${f.ok ? 'PASS' : 'FAIL'} ${f.name}: ${f.detail}`);
  }
  return findings.every(f => f.ok);
}
