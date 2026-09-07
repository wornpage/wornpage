# Wornpage workspace tooling

Internal scaffolding and package verification for the canonical
[`wornpage/wornpage`](https://github.com/wornpage/wornpage) workspace.

```sh
bun run new <name>
bun run packages/cli/src/index.ts verify packages/<name>
bun run packages/cli/src/index.ts verify packages --all
bun run verify:catalog
```

`new` must run from the workspace root and creates `packages/<name>`. Register
the component in the release manifest and catalog before opening a PR.

`verify` checks a package's source, delivery declaration, README, build, and
packed exports. `verify:catalog` is the complete repository gate. Browser bundle
output is generated and ignored; `--frozen-dist` is available when comparing an
existing generated bundle to a rebuild.

The former standalone `ship` command has been removed. The root release workflow
verifies and packs components; the repository owner publishes through the existing
root release helper. Read [component delivery](docs/component-delivery.md)
for the only supported publication path.
