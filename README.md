# pacos-wedding

Teaser (save-the-date) site for **Pati & Cos** — 21 August 2027, Cluj-Napoca
(Wonderland, Sala Riviera).

- **Live:** https://cosminlinca.github.io/pacos-wedding/ (RO) · `/en/` (EN)
- **Stack:** [Astro](https://astro.build) static output, TypeScript, self-hosted
  fonts (Fontsource), plain modern CSS. No UI framework.
- **Status:** first visual pass — a teaser. The full site (story, schedule,
  travel, RSVP, gallery…) comes later. See [`PLAN.md`](./PLAN.md).

---

## Run it locally

Requires **Node ≥ 18.20.8** (or 20.3+ / 22+).

```bash
npm install
npm run dev      # http://localhost:4321/pacos-wedding/
```

Other scripts:

```bash
npm run build    # astro check + production build into dist/
npm run preview  # serve the built dist/ locally
npm run format   # Prettier
npm run lint     # ESLint
```

> The site is served under the `/pacos-wedding/` base path even in dev, because
> that is where GitHub Pages hosts it. Always open the URL **with** that prefix.

---

## Edit the wording

All copy lives in two flat JSON files — no code, safe to edit on GitHub directly:

- Romanian: [`src/i18n/ro.json`](./src/i18n/ro.json)
- English: [`src/i18n/en.json`](./src/i18n/en.json)

Keys are shared between the two files. If a key is missing from `en.json`, the
Romanian value is used as a fallback.

The wedding date/time has a single source of truth in
[`src/lib/datetime.ts`](./src/lib/datetime.ts) (`WEDDING`). Change it there and
the countdown, the accessible date sentence and the calendar links all follow.
After changing the date, regenerate the calendar file:

```bash
node scripts/make-ics.mjs
```

---

## The photo

The engagement photo lives at [`src/assets/couple-path.jpg`](./src/assets/couple-path.jpg)
(900 × 1600, portrait) and is used twice, on purpose:

- **Hero background** — heavily blurred, desaturated and veiled by the ivory
  scrim, so it reads as warm texture behind the names rather than as a picture.
  Encoded at `quality={45}` and max 720 px wide; the blur hides everything the
  low bitrate costs.
- **Portrait section** ([`src/components/Portrait.astro`](./src/components/Portrait.astro))
  — the same frame shown properly, in its native 9:16, with the offset brass
  outline and the `21.08.2027` stamp.

`astro:assets` emits WebP with a `srcset` for both.

### Swap it for another photo

Drop the new file in `src/assets/` and change the one `import` in each of
[`Hero.astro`](./src/components/Hero.astro) and
[`Portrait.astro`](./src/components/Portrait.astro). Nothing else moves.
A portrait (2:3 / 9:16) shot keeps the section layout as designed; for a
landscape shot, change `aspect-ratio` on `.portrait__frame` too.

Copy for the section — heading, body, caption and the alt text — is in
`portrait.*` in the two i18n files, same as everything else.

### Motion on this page

All of it is CSS, all of it behind `prefers-reduced-motion: no-preference`,
and none of it hides content when JavaScript is off:

| Effect                                         | Where                                 |
| ---------------------------------------------- | ------------------------------------- |
| Names rise out of a mask, staggered            | `.hero__rise`                         |
| Hero recedes as you scroll past                | `.hero__content`, `scroll()` timeline |
| Slow Ken Burns on the hero wash                | `.hero__media-inner`                  |
| Photo frame wipes open top-to-bottom           | `.portrait__frame`                    |
| Photo settles out of a slow zoom               | `.figure__img`                        |
| Photo drifts with the scroll                   | `.portrait__media`, `view()` timeline |
| Brass outline and date stamp fade in behind it | `.portrait__plate`                    |

The scroll-timeline effects are wrapped in `@supports` and simply do not happen
on browsers without them. Everything lives in
[`src/styles/motion.css`](./src/styles/motion.css); the `.is-visible` class that
triggers the reveals comes from the one IntersectionObserver in
[`Base.astro`](./src/layouts/Base.astro).

---

## Regenerate the shareable assets

- **Calendar file** — `node scripts/make-ics.mjs` → `public/wedding.ics`
  (all-day event; rerun once the ceremony time is known).
- **OG / social image** — `node scripts/make-og.mjs` → `public/og-image.png`
  (1200×630, hand-made card).

---

## Deploy

Automatic on every push to `main`:

1. `.github/workflows/deploy.yml` builds with `withastro/action` and publishes
   with `actions/deploy-pages`.
2. One-time repo setup: **Settings → Pages → Source: GitHub Actions**.
3. First green run → check both `/` (RO) and `/en/` load.

### Custom domain later

Buy the domain → add `public/CNAME` → set the repo Pages custom domain → in
[`astro.config.mjs`](./astro.config.mjs) set `base: '/'` and `site` to the new
origin. Nothing else changes because every internal URL already goes through the
`withBase()` helper in [`src/lib/paths.ts`](./src/lib/paths.ts).

### Hide from search engines

In [`src/components/HomePage.astro`](./src/components/HomePage.astro) set
`NOINDEX = true` (adds `<meta name="robots" content="noindex, nofollow">`), and
optionally tighten `public/robots.txt`.

---

## Project layout

```
public/            favicon.svg · og-image.png · wedding.ics · robots.txt
scripts/           make-ics.mjs · make-og.mjs  (asset generators)
src/
  layouts/Base.astro         <head>, meta, hreflang, fonts, skip-link, reveal observer
  assets/couple-path.jpg     the engagement photo
  components/                 Header · Hero · Portrait · Countdown ·
                              AddToCalendar · SaveTheDate · Figure · Footer ·
                              ScrollCue · LangToggle · HomePage
  i18n/{ro,en}.json           all copy (flat keys)
  lib/{i18n,datetime,paths}.ts
  styles/{tokens,global,motion}.css
  pages/index.astro           RO  ("/")
  pages/en/index.astro        EN  ("/en/")
astro.config.mjs
```
