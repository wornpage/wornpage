# @wornpage/undo

Svelte 5 undo system — a generic snapshot stack plus a receipt component that
offers Undo/Redo on the last action. Zero dependencies.

## Install

```bash
bun add @wornpage/undo
```

## The stack

`createUndoStack` is deliberately small: you build a snapshot *before* mutating
and commit it only once the mutation succeeds, so a failed write never leaves a
bogus entry behind.

```ts
import { createUndoStack } from '@wornpage/undo';

const undo = createUndoStack<State>(50);

const snap = undo.snapshot(state);   // structuredClone, taken before the change
await save(next);                    // if this throws, nothing was committed
undo.commit(snap);

const previous = undo.pop();         // last committed snapshot, or null
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `snapshot` | `(state: T) => T` | Deep clone of the current state |
| `commit` | `(snapshot: T) => void` | Push a snapshot; drops the oldest past `maxLength` |
| `pop` | `() => T \| null` | Remove and return the newest snapshot |
| `length` | `number` | Snapshots currently held |
| `clear` | `() => void` | Empty the stack |

`createUndoStack(maxLength = 50)`. `MAX_UNDO` is exported as the default.

## The receipt

```svelte
<script>
  import { UndoReceipt } from '@wornpage/undo';
</script>

<UndoReceipt
  action={{ type: 'done', packId: 'ship-the-thing' }}
  canRedo={false}
  onundo={(action) => restore(action)}
  onredo={() => redo()}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `UndoAction` | required | The action being offered for undo |
| `canRedo` | `boolean` | `false` | Show the Redo button |
| `onundo` | `(action: UndoAction) => void` | — | Undo pressed |
| `onredo` | `() => void` | — | Redo pressed |

The label comes from `UNDO_LABELS[action.type]`, falling back to `action.label`,
then `'Action'`.

## Scope

This is a single-step stack: `pop()` removes the newest entry and there is no
cursor, so it does not model redo-after-undo or jumping to an arbitrary earlier
point. If you need a browsable history, keep an index into an array of
snapshots rather than popping.

## Note on non-browser imports

The built bundle registers a custom element and will not import in a bun or
node server process. `createUndoStack` itself is pure — import it from source
via the `svelte` export condition if you need it outside a browser.

## Tests

```bash
bun test
```

## License

MIT
