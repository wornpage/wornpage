# @wornpage/async-states

Compact Svelte 5 loading, empty, and error states for application workflows.
The package is source-delivered so consuming SvelteKit applications compile it
with their own theme tokens and CSP policy.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```sh
bun add @wornpage/async-states
```

## Usage

```svelte
<script>
  import { Empty, ErrorState, Skeleton, Spinner } from '@wornpage/async-states';
</script>

{#if loading}
  <Skeleton lines={4} />
{:else if error}
  <ErrorState message="Could not load work" detail={error} onretry={reload} />
{:else if items.length === 0}
  <Empty title="No work yet" />
{:else}
  <!-- results -->
{/if}

<Spinner label="Loading more work" />
```

## Components

### Empty

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Empty-state heading |
| `description` | `string` | - | Supporting copy |
| `children` | snippet | - | Optional content or actions |

### ErrorState

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"Something went wrong"` | Error heading |
| `detail` | `string` | - | Supporting detail |
| `onretry` | `() => void \| Promise<void>` | - | Adds a serialized Retry action |
| `children` | snippet | - | Additional recovery content |

### Spinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"ring" \| "dots" \| "blob"` | `"ring"` | Visual style |
| `size` | `"sm" \| "md"` | `"md"` | Visual size |
| `label` | `string` | `"Loading…"` | Screen-reader status text |
| `variant` | `"default" \| "accent"` | `"default"` | Color treatment |
| `announce` | `boolean` | `true` | Set false for decorative or portfolio-only examples |

### Skeleton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of placeholder lines |
| `width` | `"full" \| "half" \| "third"` | `"full"` | Container width preset |
| `loading` | `boolean` | `true` | Show the placeholder instead of children |
| `children` | snippet | - | Content rendered after loading |

Empty and ErrorState contain hostile text within their parent and leave outer
spacing to the consuming layout. ErrorState exposes assertive error semantics
and serializes asynchronous retry work. Spinner announces one polite status by
default; `announce={false}` removes the visual example from the accessibility
tree. Skeleton exposes its busy state and stops shimmer under reduced motion.
