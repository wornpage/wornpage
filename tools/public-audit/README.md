# public-audit

Fail-closed checks for a directory that will be deployed publicly. The audit
requires an exact file allowlist, rejects dot-prefixed paths and symbolic links,
then applies optional byte budgets, retired-path checks, and forbidden content
patterns to every regular file.

Create a JSON configuration next to the project that owns the public output:

```json
{
  "root": "./dist",
  "allowlist": ["index.html", "assets/app.js", "assets/app.css"],
  "budget": {
    "total": 250000,
    "files": { "assets/app.js": 200000 }
  },
  "retired": ["legacy.js"],
  "forbidden": [
    { "name": "private-key", "pattern": "BEGIN [A-Z ]*PRIVATE KEY" }
  ]
}
```

Paths are relative POSIX paths and must not traverse outside `root`. Run the
tool from this workspace with the required config path:

```sh
bun run tools/public-audit/src/cli.ts path/to/public-audit.json
```

Any invalid configuration, unreadable entry, unexpected or missing file,
dot-prefixed path, symbolic link, budget violation, retired file, or forbidden
match makes the command exit non-zero.
