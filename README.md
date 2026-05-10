# Headless Date Picker

A vanilla TypeScript date picker engine wrapped by a thin Vue 3 component. The engine has zero framework dependencies and uses the Temporal API.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 57 engine tests
npm run typecheck
npm run build
```

## Architecture

```
DatePickerEngine  (vanilla TS, Temporal, subscribe/notify)
        ▲
        │ subscribe → shallowRef
        ▼
useDatePicker  (Vue composable)
        ▲
        ▼
DatePicker.vue  →  CalendarHeader + CalendarGrid
                   themed via --dp-* CSS custom properties
```

## State management

The engine exposes a classic observer pattern:

```ts
const engine = new DatePickerEngine({ initialDate: '2026-05-09' });
const unsubscribe = engine.subscribe((state) => { /* react */ });
engine.nextMonth();
```

Every mutating method routes through a private `setState` that does a value-equality check (`Temporal.PlainDate.equals` / `PlainYearMonth.equals`). No-op operations don't notify, so `engine.select(alreadySelectedDate)` doesn't trigger a render.

The Vue composable is the bridge:

```ts
const state = shallowRef(engine.getState());
const grid  = shallowRef(engine.getGrid());
const off   = engine.subscribe((next) => {
  state.value = next;
  grid.value  = engine.getGrid();
});
onScopeDispose(off);
```

State snapshots are immutable, so `shallowRef` + reference replacement is enough to trigger reactivity. The engine never imports Vue.

## Temporal API notes

- `PlainDate` / `PlainYearMonth` are immutable values with no time component — no timezone bugs, no DST jumps, no `setDate(0)` hacks.
- Arithmetic is explicit and safe: `viewYearMonth.add({ months: 1 })` rolls Dec → Jan automatically.
- Equality is a method (`a.equals(b)`), not a `.getTime()` comparison.
- `toString()` returns ISO 8601 — perfect for `v-model`, keys, and `data-` attrs.
- Locale formatting via `toLocaleString(locale, options)` works out of the box.

Trade-off: the polyfill ships at ~40KB gzipped. Acceptable for a workload where date logic matters; it drops out for free once Temporal lands natively.

## Accessibility

- `role="dialog"` popover, `role="grid"` calendar with `gridcell` per day, `columnheader` per weekday.
- `aria-selected`, `aria-current="date"`, `aria-disabled` on cells.
- `aria-live="polite"` announces the focused date.
- Focus is restored to the input on close. Tab is trapped within the popover.

| Key | Action |
|---|---|
| `Enter` / `↓` on input | Open |
| `Esc` | Close |
| `Enter` on day | Select + close |
| `← → ↑ ↓` | Move focus by day / week |
| `PageUp` / `PageDown` | Prev / next month |
| `Shift + PageUp/Down` | Prev / next year |
| `Home` / `End` | Start / end of week |

## Theming

Every visual property reads from a `--dp-*` custom property in `src/styles/tokens.css`. Override on `:root` (or any ancestor) to retheme:

```css
:root {
  --dp-color-accent: #d946ef;
  --dp-radius: 12px;
  --dp-cell-size: 40px;
}
```

A `prefers-color-scheme: dark` block is included.

## Layout

```
src/
├── engine/                  zero-dep TS engine + types
├── composables/
│   └── useDatePicker.ts     Vue ↔ engine bridge
├── components/              DatePicker, CalendarHeader, CalendarGrid
├── styles/tokens.css        all --dp-* tokens
└── App.vue                  demo (3 picker variants)
tests/engine/                Vitest suites
```
