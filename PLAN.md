# Wedding website — implementation plan

**Couple:** Pati & Cos · **Monogram:** P & C
**Date:** 21 August 2027 · **Place:** Cluj-Napoca — Wonderland, Sala Riviera
**Repo:** https://github.com/cosminlinca/pacos-wedding (public)
**Live URL:** https://cosminlinca.github.io/pacos-wedding/
**This iteration:** a *teaser* (save-the-date), first visual pass. Full site comes later.

---

## 1. Decisions locked

| Area | Decision |
|---|---|
| Framework | Astro (static output), TypeScript |
| Hosting | GitHub Pages, deploy via GitHub Actions |
| Languages | Romanian (default, at `/`) + English (at `/en/`) |
| RSVP | Google Form, linked out (not in the teaser) |
| Gifts section | None |
| Privacy | Public, search-indexable (one-line toggle to hide later) |
| Custom domain | None for now; site lives under the `/pacos-wedding/` base path |
| Design lane | **A — Warm editorial** |
| Assets | No photos yet; teaser is typography + texture led, photo slots ready |

### Defaults I picked for the unanswered questions (veto any of these)

| Choice | Default | Alternatives |
|---|---|---|
| Accent colour | **Forest green** (deep, muted) + brass hairlines on cream/ivory, ink text | oxblood, cocoa brown — one CSS variable to swap |
| Display typeface | **Fraunces** (variable optical serif) | Cormorant Garamond |
| Body typeface | **Inter** | — |
| Fonts delivery | Self-hosted via Fontsource (no Google Fonts CDN call) | — |
| Teaser motion | **Subtle / editorial** — staggered fade-up, gentle scroll parallax, slow Ken Burns on the placeholder, animated countdown, scroll cue. No smooth-scroll library, no pinned scroll-story yet | add GSAP/Lenis with the full photo site |
| Colour scheme | Light only for the teaser (tokens defined so a dark variant is cheap later) | add dark later |

---

## 2. Scope

### In scope — the teaser (this iteration)

Single page, two languages, one screen of content plus a short second block:

1. **Hero (full viewport)**
   - Eyebrow: `SAVE THE DATE` / `REZERVAȚI DATA`
   - Names: `Pati & Cos`
   - Date: `21 August 2027` / `21 august 2027`
   - Place: `Cluj-Napoca · Wonderland — Sala Riviera`
   - Live **countdown** (days / hours / minutes / seconds), localised labels
   - Primary action: **Add to calendar** (menu: Google + `.ics` download)
   - Scroll cue (bobbing chevron, disappears after first scroll)
   - Background: warm textured gradient + grain + faint P&C monogram watermark; a real photo can be dropped into this exact frame later with no layout change
2. **Save-the-date block**
   - Line: `Save the date. A formal invitation will follow.` / `Rezervați data. Invitația oficială urmează.`
   - One short intro sentence (text only)
3. **Footer**
   - Monogram `P & C` · `21.08.2027` · `Cluj-Napoca`
   - Language toggle (also pinned top-right in the header)

No RSVP, story, schedule, travel, FAQ, gallery, or registry yet.

### Out of scope now — the full site (later roadmap)

Our Story · The Day (schedule + dress code) · Venue & map · Travel & Stay (hotels, transport, parking) · RSVP (Google Form link, optionally styled embed) · FAQ (accordion) · Photo gallery (GSAP/ScrollTrigger + PhotoSwipe, shared Google Photos album for post-wedding) · optional Wedding party / nași · optional custom domain · optional privacy-friendly analytics (GoatCounter) · optional dark theme.

---

## 3. Design system

**Lane A — warm editorial:** grounded, timeless, a little magazine. Generous whitespace, big type, thin brass rules, asymmetric blocks.

### Tokens (`src/styles/tokens.css`)

```
--bg:        #F6F1E7   /* warm ivory */
--bg-sink:   #EFE7D7   /* slightly deeper panel */
--ink:       #23231F   /* near-black text */
--ink-soft:  #5A564C   /* secondary text */
--accent:    #2F3D33   /* forest green (swap here for oxblood/cocoa) */
--accent-ink:#1E2721
--brass:     #9A7B4F   /* hairlines, small caps, dividers */
--focus:     #2F6FED   /* focus ring, not part of the palette */

--font-display: "Fraunces Variable", Georgia, serif;
--font-body:    "Inter", system-ui, sans-serif;

--step--1: clamp(.83rem, .8rem + .2vw, .95rem);
--step-0:  clamp(1rem, .95rem + .3vw, 1.15rem);
--step-1:  clamp(1.3rem, 1.1rem + 1vw, 1.75rem);
--step-2:  clamp(1.8rem, 1.3rem + 2.5vw, 3rem);
--step-3:  clamp(2.6rem, 1.6rem + 5vw, 5.5rem);
--step-4:  clamp(3.4rem, 1.8rem + 9vw, 9rem);   /* names */

--measure: 62ch;
--radius: 2px;
--rule: 1px solid var(--brass);
```

- **Type:** Fraunces for eyebrow (small caps, letter-spaced), names (`--step-4`, optical `SOFT`/`WONK` axes tuned), date. Inter for body, countdown digits, UI.
- **Contrast:** body text is `--ink` on `--bg` (AA+). Accent green is used for fills, rules, and large display text only — checked ≥ 3:1 where it carries meaning.
- **Grid:** single column, `min(92vw, 68rem)` container, 8px spacing scale.
- **Iconography:** one hairline chevron (scroll cue), one calendar glyph. No icon library.

### Motion principles (`src/styles/motion.css`)

- Everything guarded by `@media (prefers-reduced-motion: no-preference)`.
- Reveal: opacity 0→1 + `translateY(12px)` on enter, 500–700ms, custom ease, staggered 60ms.
- Hero parallax: background layer via CSS `animation-timeline: scroll()` behind `@supports`; JS-free. No effect where unsupported.
- Ken Burns: 20s `scale(1.0→1.06)` + slow pan, `alternate infinite`, paused on reduced motion.
- Countdown: digits cross-fade on change (`requestAnimationFrame`), no layout shift (tabular numerals, fixed-width cells).
- Total added JS for the teaser: countdown + add-to-calendar menu + "seen" IntersectionObserver ≈ **2–3 KB gzipped**.

---

## 4. Technical architecture

### Stack

- **Astro** static build (`output: 'static'`), **TypeScript** strict.
- **No UI framework** (no React/Svelte islands needed). Interactivity = tiny vanilla TS modules loaded with `<script>` in `.astro` components.
- **Fontsource** packages: `@fontsource-variable/fraunces`, `@fontsource/inter` (self-hosted `woff2`, `font-display: swap`, preloaded).
- Plain modern CSS (custom properties, `clamp()`, container-safe units). No Tailwind, no CSS framework.
- Lint/format: ESLint (astro plugin) + Prettier (astro plugin). `astro check` in CI.

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cosminlinca.github.io',
  base: '/pacos-wedding',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: { prefixDefaultLocale: false }, // ro at "/", en at "/en/"
  },
});
```

**Base-path discipline** (the one real footgun with project Pages):
- Never hard-code `/` links. Use a `withBase(path)` helper (`import.meta.env.BASE_URL`) for every internal link, asset `src`, favicon, OG URL, and the `.ics` link.
- `public/` assets are served at `/pacos-wedding/<file>` — always route them through `withBase`.
- Canonical + `og:url` built from `Astro.site` + `Astro.url.pathname`.

### i18n approach

- Copy lives in `src/i18n/ro.json` and `src/i18n/en.json` — flat keys, no logic. Cos/Pati edit these directly on GitHub.
- `src/lib/i18n.ts`: `getStrings(locale)`, `getLocaleFromUrl(url)`, `switchLocalePath(url, target)`.
- Two routes only: `src/pages/index.astro` (ro), `src/pages/en/index.astro` (en). Both render the same components with a `locale` + `t` prop.
- `<html lang>` set per route. `hreflang` alternates (`ro`, `en`, `x-default` → ro) in `<head>`.
- Language toggle is a real `<a>` to the counterpart URL (works without JS), styled as `RO / EN`.

### Dates & countdown

- `src/lib/datetime.ts`: single source of truth `WEDDING = new Date('2027-08-21T00:00:00+03:00')` (Europe/Bucharest is UTC+3 in August).
- Countdown component renders server-side placeholders, then a `<script>` updates every second using the client clock; `Intl.NumberFormat` for digits, localised unit labels from the i18n strings.
- Degrades to a static "August 2027" if JS is off (noscript-friendly text already present).

### Add to calendar

- `public/wedding.ics` — all-day `VEVENT` on `20270821` (ceremony time unknown; regenerate when known).
- Google link: `calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=20270821/20270822&location=...`.
- Small menu component (button → two links). No third-party script.

### Images / placeholder strategy

- `<Figure>` component with `src?`, `alt`, `ratio` props.
  - No `src` → renders the CSS placeholder (gradient + SVG grain + monogram), correct aspect ratio reserved.
  - With `src` → `astro:assets` `<Image>` (AVIF/WebP, `srcset`, `loading`, `decoding`, LQIP blur-up).
- Dropping in the real hero photo later = add the file + set one prop. No layout or motion change.
- Full-site gallery images will live in `src/assets/` (optimised at build) or a linked Google Photos album for the post-wedding dump.

### SEO / meta / sharing

- `<title>`: `Pati & Cos — 21 August 2027, Cluj-Napoca` (localised).
- Meta description, `og:title/description/type/url/locale` (+ `og:locale:alternate`), Twitter card.
- **OG image:** hand-made 1200×630 PNG (names + date + monogram on ivory) in `public/`. Static for the teaser; can move to generated later.
- `favicon.svg` — P&C monogram, ivory/green.
- `sitemap` via `@astrojs/sitemap`. `robots.txt` allows all (flip `<meta name="robots" content="noindex">` in `Base.astro` to hide).
- JSON-LD `Event` (optional, harmless): name, startDate, location.

### Accessibility

- Semantic landmarks (`header`/`main`/`footer`), one `h1` (the names), logical heading order.
- Visible `:focus-visible` ring on toggle, calendar button, links.
- Colour contrast AA for all text; motion fully removable via `prefers-reduced-motion`.
- Countdown uses `aria-live="off"` (decorative) with a static accessible date sentence nearby.
- Keyboard: language toggle and calendar menu fully operable; menu closes on `Esc`/outside click.
- Target Lighthouse ≥ 98 across the board on mobile.

---

## 5. Repository layout

```
pacos-wedding/
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ favicon.svg
│  ├─ og-image.png
│  ├─ wedding.ics
│  └─ robots.txt
├─ src/
│  ├─ layouts/Base.astro            # <head>, meta, hreflang, fonts, skip-link
│  ├─ components/
│  │  ├─ Header.astro               # monogram + language toggle
│  │  ├─ Hero.astro
│  │  ├─ Countdown.astro            # + inline <script> module
│  │  ├─ AddToCalendar.astro
│  │  ├─ SaveTheDate.astro
│  │  ├─ Figure.astro
│  │  ├─ Footer.astro
│  │  └─ ScrollCue.astro
│  ├─ i18n/{ro,en}.json
│  ├─ lib/{i18n.ts,datetime.ts,paths.ts}
│  ├─ styles/{tokens.css,global.css,motion.css}
│  └─ pages/
│     ├─ index.astro                # RO
│     └─ en/index.astro             # EN
├─ astro.config.mjs
├─ tsconfig.json
├─ package.json
├─ README.md                        # how to run, edit copy, deploy, add photos
└─ PLAN.md
```

---

## 6. Deployment

1. `npm create astro@latest` scaffold (empty template) → commit.
2. Add `.github/workflows/deploy.yml`:
   - `on: push: branches: [main]` + `workflow_dispatch`
   - permissions `pages: write`, `id-token: write`; `concurrency: pages`
   - `withastro/action@v3` (build) → `actions/deploy-pages@v4` (deploy)
3. GitHub repo → **Settings → Pages → Source: GitHub Actions**.
4. First green run → verify `https://cosminlinca.github.io/pacos-wedding/` loads (RO) and `/en/` loads (EN).
5. **Custom domain later:** buy domain → add `public/CNAME` + repo Pages setting → change `site`/`base` in `astro.config.mjs` (`base: '/'`) → done.

---

## 7. Build milestones (teaser)

| # | Milestone | Output |
|---|---|---|
| M0 | Scaffold + CI + Pages | Blank Astro site live at the real URL, both routes resolve |
| M1 | Design system | tokens/global/motion CSS, fonts, favicon, `Base.astro` |
| M2 | Content + i18n | `ro.json`/`en.json`, routing, working `RO / EN` toggle, hreflang |
| M3 | Hero | names / date / place / eyebrow, responsive type scale, placeholder background |
| M4 | Countdown | localised live countdown, no layout shift, JS-off fallback |
| M5 | Calendar + Save-the-date + Footer + Scroll cue | `.ics` + Google link, second block, footer monogram |
| M6 | Motion pass | reveals, parallax, Ken Burns, reduced-motion verified |
| M7 | SEO / OG / a11y | meta, OG image, JSON-LD, Lighthouse + keyboard + contrast pass |
| M8 | Copy polish + ship | final RO/EN wording, README, tag `v0.1-teaser` |

Rough effort: ~1 focused day.

---

## 8. Draft copy (for review — edit freely)

**Romanian (`/`)**
- Eyebrow: `REZERVAȚI DATA`
- Names: `Pati & Cos`
- Date: `21 august 2027`
- Place: `Cluj-Napoca · Wonderland — Sala Riviera`
- Countdown labels: `zile · ore · minute · secunde`
- Save-the-date: `Rezervați data. Invitația oficială urmează.`
- Intro: `Ne pregătim să spunem „da” alături de oamenii dragi. Toate detaliile vor apărea aici în curând.`
- Button: `Adaugă în calendar`
- Scroll cue: `derulează`
- Footer: `P & C · 21.08.2027 · Cluj-Napoca`

**English (`/en/`)**
- Eyebrow: `SAVE THE DATE`
- Names: `Pati & Cos`
- Date: `21 August 2027`
- Place: `Cluj-Napoca · Wonderland — Sala Riviera`
- Countdown labels: `days · hours · minutes · seconds`
- Save-the-date: `Save the date. A formal invitation will follow.`
- Intro: `We're getting ready to say "I do" surrounded by the people we love. All the details will appear here soon.`
- Button: `Add to calendar`
- Scroll cue: `scroll`
- Footer: `P & C · 21.08.2027 · Cluj-Napoca`

---

## 9. Needed from Cos & Pati later (not blocking the teaser)

- Confirm exact venue label (`Wonderland` vs `Wonderland Resort`; hall name spelling).
- Engagement photos (I'll give aspect-ratio + resolution guidance; hero wants a wide 3:2 or 16:9).
- Google Form URL + the fields it asks (for the full-site RSVP link).
- Ceremony / civil ceremony times + day-of schedule (updates the `.ics` and the future "The Day" section).
- Dress code wording.
- 2–3 hotel recommendations (name, area, rough price, booking link).
- "Our Story" text (RO + EN).
- FAQ questions & answers.
- Whether to add a Wedding party / nași section.
- Decisions on: custom domain, analytics, dark theme.

---

## 10. Risks & notes

- **Base path:** every internal URL must go through `withBase()` or the deployed site 404s assets. Covered by a lint rule of thumb + review.
- **Google Form look:** it won't match the design. Teaser avoids it entirely; full site links out via a styled button (embedding is possible but clunky on mobile).
- **No photos yet:** teaser leans on type + texture by design; it should still look finished, and photos slot in without rework.
- **Date is ~2 years out:** countdown will show ~700+ days — expected, digits are width-stable.
- **Single OG image** is static; fine for a teaser.
