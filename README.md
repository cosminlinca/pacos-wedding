# pacos-wedding

Teaser (save-the-date) site for **Patricia & Cosmin** — 21 August 2027, Cluj-Napoca
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

## Add the real photos later

The hero background is a `<Figure>` with **no image** — it renders a CSS
placeholder (warm gradient + grain + P & C monogram) at the right aspect ratio.

To drop in the engagement photo with **no layout or motion change**:

1. Put the file in `src/assets/` (e.g. `src/assets/hero.jpg`). A wide **3:2 or
   16:9** shot, ≥ 2560 px on the long edge.
2. In [`src/components/Hero.astro`](./src/components/Hero.astro):

   ```astro
   ---
   import heroPhoto from '../assets/hero.jpg';
   ---

   <Figure src={heroPhoto} alt="" ratio="16 / 9" class="hero__figure" />
   ```

`astro:assets` then emits AVIF/WebP with `srcset` automatically.

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
  components/                 Header · Hero · Countdown · AddToCalendar ·
                              SaveTheDate · Figure · Footer · ScrollCue ·
                              LangToggle · HomePage
  i18n/{ro,en}.json           all copy (flat keys)
  lib/{i18n,datetime,paths}.ts
  styles/{tokens,global,motion}.css
  pages/index.astro           RO  ("/")
  pages/en/index.astro        EN  ("/en/")
astro.config.mjs
```
