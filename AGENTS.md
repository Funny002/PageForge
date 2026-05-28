# PageForge — Agent Instructions

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port `9130`) |
| Typecheck | `npx vue-tsc --noEmit` |
| Build | `npm run build` (runs `vue-tsc -b && vite build` — type errors block build) |

No test infrastructure yet.

## Architecture

- **Library mode**: entry = `lib/index.ts`, builds to ES + CJS (`dist/index.es.js`, `dist/index.cjs.js`)
- **Demo app**: `src/` is a thin dev harness; `lib/` is the real deliverable
- **Externals** (not bundled): `vue`, `naive-ui`, `pinia`, `common-store`
- `common-store` is a local file dep (`file:../CommonStore`) — must exist at `../CommonStore` alongside this repo
- Store per component tree: `createPageStore(app)` + `provide(PAGE_STORE_KEY, store)` — not global Pinia

## Magic imports

- Vue APIs (`ref`, `computed`, `watch`, `onMounted`, etc.) are **auto-imported** — never import from `vue` manually
- NaiveUI components are **auto-resolved** in templates — no manual imports needed
- **Exception**: `NIcon` must be imported manually: `import { NIcon } from 'naive-ui'`
- Icons: `import { FooOutline } from '@vicons/ionicons5'`

## TypeScript

Strict lint rules in `tsconfig.json`:
- `noUnusedLocals: true` — unused variables are errors
- `noUnusedParameters: true` — prefix unused params with `_`
- `erasableSyntaxOnly: true` — no enums, no namespaces, no `private`/`protected`

## Component conventions

- Every component: `defineOptions({ name: 'PageForge*' })`
- Styles: `<style lang="scss" scoped src="./style.scss">` — styles live in sibling `.scss` files, not inline
- All CSS custom properties are prefixed `--pf-` (e.g. `--pf-bg-secondary`, `--pf-border`, `--pf-accent`)
- Themes: `githubLight` / `githubDark` are plain objects mapping `--pf-*` keys to hex colors; `applyTheme(el, theme)` sets them as inline styles

## Prettier

`printWidth: 200`, `singleQuote: true`, `semi: true`, `trailingComma: 'all'`, `lf` line endings
