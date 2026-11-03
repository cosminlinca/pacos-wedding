# Copilot instructions

Static bilingual (RO default, EN) wedding invitation site. Astro 7 + TypeScript + plain CSS, no UI framework. Deployed to GitHub Pages. See `README.md` for editing guides and `PLAN.md` for design decisions.

## Commands

```bash
npm run dev       # http://localhost:4321/pacos-wedding/ (base prefix required even in dev)
npm run build     # i18n key check + `astro check` + `astro build` → dist/  (CI runs lint, then this)
npm run check     # type check only (astro check)
npm run lint      # ESLint (.js,.mjs,.ts,.astro)
npm run format    # Prettier (with prettier-plugin-astro)
node scripts/make-ics.mjs   # regenerate public/wedding.ics (rerun after changing the date)
node scripts/make-og.mjs    # regenerate public/og-image.png (needs `sharp`, not in package.json)
```

There is no test suite. Validate with `npm run build` and `npm run lint`. Node ≥ 18.20.8 (CI uses 22).

## Architecture

- `src/pages/index.astro` (RO, `/`) and `src/pages/en/index.astro` (EN, `/en/`) are thin wrappers that render `components/HomePage.astro` with a `locale` prop. All page composition (sections, `NOINDEX` toggle) lives in `HomePage.astro`; `layouts/Base.astro` owns `<head>`, hreflang, fonts, and the single IntersectionObserver that adds `.is-visible` for scroll reveals.
- **i18n is hand-rolled** (`src/lib/i18n.ts`) on top of two flat JSON files, `src/i18n/{ro,en}.json`. Keys are shared; a key missing from `en.json` falls back to RO, then to the key itself. Components get copy via `getStrings(locale)`; add new copy to both files.
- **Wedding date/time has one source of truth**: `WEDDING` in `src/lib/datetime.ts`. Countdown, accessible date text and calendar links derive from it; `public/wedding.ics` is generated from it and must be regenerated manually.
- Styling: `src/styles/tokens.css` (design tokens: colours, fluid type scale, spacing) → `global.css` → `motion.css` (all animation). Components use tokens (`var(--brass)` etc.) rather than raw values.

## Conventions

- **Always use `withBase()` from `src/lib/paths.ts`** for internal links, asset URLs, favicon, OG and `.ics` links. The site is served under `base: '/pacos-wedding'`; a hard-coded `/foo` 404s in production. Use `switchLocalePath()` for language toggling.
- Motion is CSS-only, gated by `prefers-reduced-motion: no-preference`, must not hide content without JS, and scroll-timeline effects sit inside `@supports`. Keep new animations in `motion.css` following this pattern.
- The engagement photo (`src/assets/couple-path.jpg`) is imported only in `Hero.astro`. Story photos are globbed from `src/assets/story/<id>/` in `OurStory.astro`.
- Prettier is configured in `.prettierrc.json`; run `npm run format` rather than hand-formatting.
- Deploys automatically on push to `main` via `.github/workflows/deploy.yml`.
