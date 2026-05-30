# PageForge — Agent Instructions

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `npm run dev` | Port 9130, host 0.0.0.0 |
| Typecheck | `npx vue-tsc --noEmit` | Fast standalone check |
| Build | `npm run build` | Runs `vue-tsc -b && vite build` — type errors block |

No test infrastructure.

## Architecture

- **Library mode**: entry `lib/index.ts` → ES + CJS (`dist/index.es.js`, `dist/index.cjs.js`)
- **Demo app**: `src/` is a thin harness; `lib/` is the deliverable
- **Externals** (not bundled): `vue`, `naive-ui`, `pinia`, `common-store`
- **`common-store`** is a local file dep (`file:../CommonStore`) — must exist alongside this repo
- Store scope: `createPageStore(app, opts?)` → `provide(PAGE_STORE_KEY, store)`. Not global Pinia.
- **`opts.plugins`**: inject external plugins at store creation. Builtin plugins are auto-registered on `lib/index.ts` import.

## Key files

| Path | Role |
|------|------|
| `lib/index.ts` | Library entry; auto-registers builtin plugins; exports `PageForge` component |
| `lib/core/types.ts` | `PageState`, `PageNode`, `GridConfig`, `ToolType` |
| `lib/core/actions.ts` | All 12 registered store actions |
| `lib/plugin/index.ts` | `PluginRegistry` (global singleton), `registerPlugin()`, `SidebarView`, `createNode()` |
| `lib/plugin/builtin/index.ts` | 5 builtin plugins (text, rectangle, image, explorer, components) |
| `lib/view/stage/useStageInteraction.ts` | Pointer event handling: select, move, resize, marquee, pan |
| `lib/view/left/index.vue` | Sidebar icons + dynamic panel via `getPluginRegistry().getSidebarViews()` |

## Magic imports

- **Vue APIs** (`ref`, `computed`, `watch`, `onMounted`, `shallowRef`) are auto-imported — never import from `vue` manually. Applies to `.ts` files too: `tsconfig.json` includes `auto-imports.d.ts`.
- **NaiveUI components** are auto-resolved in templates — no manual imports needed. No exceptions.
- **`NButton`** supports `<template #icon>` for icon-only buttons — no need to wrap with `NIcon`.
- Icons from `@vicons/carbon`: `import { Cursor1, Draggable, Add, Subtract, Rocket, TreeViewAlt } from '@vicons/carbon'`

## TypeScript

From `tsconfig.json`:
- `noUnusedLocals: true` — unused variables are errors
- `noUnusedParameters: true` — prefix unused params with `_`
- `erasableSyntaxOnly: true` — no enums, namespaces, or `private`/`protected` keywords
- `include: ["src", "lib", "auto-imports.d.ts", "components.d.ts"]` — **required** for auto-imports to typecheck

## Component conventions

- Every component: `defineOptions({ name: 'PageForge*' })`
- Styles: `<style lang="scss" scoped src="./style.scss">` (sibling `.scss`, not inline)
- CSS custom properties: `--pf-*` prefix (`--pf-bg-secondary`, `--pf-border`, `--pf-accent`, etc.)
- Builtin plugin renderer components use explicit scss names (`image.scss`, `text.scss`, `rect.scss`) instead of `style.scss` — keep when adding new builtins.
- Themes: `githubLight` / `githubDark` objects; `applyTheme(el, theme)` sets them as inline styles on root `.pf-layout`

## Plugin system

- Pluggable node types via `PageForgePlugin.nodeTypes`: `{ label, defaultProps, defaultSize, renderer }`
- Pluggable sidebar views via `PageForgePlugin.views.sidebar`: `{ id, title, icon, render }`
- Registry is a global singleton (`getPluginRegistry()`). `registerPlugin()` is idempotent (deduplicates by name).
- Builtin plugins auto-register at `lib/index.ts` module load time.
- External plugins inject via `createPageStore(app, { plugins: [...] })` or direct `registerPlugin()` call.

## Stage interaction gotchas

- **Direct store writes during drag**: `setNodePositionsByOffset` and `resizeNodeByOffset` write `store.data.set('nodes', ...)` every pointermove frame. Final commit uses dispatch on pointerup. This means **History middleware records every frame** — don't add expensive per-frame hooks.
- **Hand tool pan**: uses screen coordinate deltas, not surface-local. `stage.pan` action accumulates into `viewportX`/`viewportY`.
- **Resize handles**: 8 directions (nw, n, ne, w, e, sw, s, se). `resizeNodeByOffset` computes new bounds from drag direction.

## Known issues

- `lib/view/stage/stageCanvas/index.vue` — `<style>` missing `scoped`. Do **not** add it: child components (ruler corner, content) use global cascade from `.pf-stage-canvas`.
- `stage.toggleRuler` and `stage.setGrid` actions registered but never dispatched — waiting for UI wiring.
- `canvas.resize` uses `canvas.*` namespace while all other stage actions use `stage.*` — do not add to this inconsistency.
- `usePlugin` is a redundant alias of `registerPlugin` — prefer `registerPlugin`.

## Prettier

`printWidth: 200`, `singleQuote: true`, `semi: true`, `trailingComma: 'all'`, `lf` line endings
