# pacos-wedding

Bilingual invitation site for **Pati & Cos** — 21 August 2027, Cluj-Napoca
(Wonderland, Sala Riviera).

- **Live:** https://cosminlinca.github.io/pacos-wedding/ (RO) · `/en/` (EN)
- **Stack:** [Astro](https://astro.build) static output, TypeScript, self-hosted
  fonts (Fontsource), plain modern CSS. No UI framework.
- **Status:** invitation structure implemented; final copy, photos and RSVP
  details are still pending. See [`INVITATION-PLAN.md`](./INVITATION-PLAN.md).

---

## Run it locally

Requires **Node ≥ 18.20.8** (or 20.3+ / 22+).

```bash
npm install
npm run dev      # http://localhost:4321/pacos-wedding/
```

Other scripts:

```bash
npm run build    # translation key check + astro check + production build
npm run check:i18n # verify RO and EN have identical keys
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
Romanian value is used as a fallback at runtime. The production build rejects
mismatched key sets so both languages must be updated together.

## Finish the invitation

- Set `RSVP_FORM_URL` in [`src/lib/invitation.ts`](./src/lib/invitation.ts) to
  the published Google Form URL. All three RSVP buttons use it. Until then,
  the header and hero link to the RSVP section, which explains that the form
  is not yet available.
- Update `rsvp.deadline` in both JSON files when the reply-by date is known.
- Replace `schedule.ceremony.*`, `schedule.party.*` and `venue.address` with
  confirmed details. These intentionally show pending copy rather than
  guessed times or addresses. Parking information is included in the venue
  section via `venue.parking`, with no separate section or navigation link.
- Import the venue photo from `src/assets/` into `src/lib/invitation.ts` and
  assign it to `VENUE_PHOTO`. Update `venue.photoAlt` in both languages.
  The photo block stays hidden until supplied. `VENUE_MAPS_URL` currently
  searches for the known venue; replace it with its exact listing if needed.
- Story chapters: drop photos in `src/assets/story/<id>/` (shown in filename
  order) and add the chapter title as `story.<id>.title` in both JSON files.
  To add a chapter, append its id to `STORY_CHAPTERS` in `src/lib/invitation.ts`.

New invitation copy is draft wording for the couple to approve before launch.
The site has no analytics, uses `noindex, nofollow`, and disallows crawling in
`robots.txt`. This is a public, link-shared site, **not access-controlled**.

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
- **Our story preview** ([`src/components/OurStory.astro`](./src/components/OurStory.astro))
  — the same frame shown in its native 9:16 until the timeline photos arrive.

`astro:assets` emits WebP with a `srcset` for both.

### Swap it for another photo

Drop the new file in `src/assets/` and change the one `import` in each of
[`Hero.astro`](./src/components/Hero.astro) and
[`OurStory.astro`](./src/components/OurStory.astro). A portrait (2:3 / 9:16)
shot keeps the preview layout as designed; for a landscape shot, change the
preview's `Figure` ratio too.

Preview copy remains in `portrait.*`; the section heading and timeline copy
live in `story.*` in the two i18n files.

### Motion on this page

All of it is CSS, all of it behind `prefers-reduced-motion: no-preference`,
and none of it hides content when JavaScript is off:

| Effect                                  | Where                                 |
| --------------------------------------- | ------------------------------------- |
| Names rise out of a mask, staggered     | `.hero__rise`                         |
| Hero recedes as you scroll past         | `.hero__content`, `scroll()` timeline |
| Slow Ken Burns on the hero wash         | `.hero__media-inner`                  |
| Invitation sections and timeline reveal | `[data-reveal]`                       |

The scroll-timeline effects are wrapped in `@supports` and simply do not happen
on browsers without them. Everything lives in
[`src/styles/motion.css`](./src/styles/motion.css); the `.is-visible` class that
triggers the reveals comes from the one IntersectionObserver in
[`Base.astro`](./src/layouts/Base.astro).

---

## Regenerate the shareable assets

- **Calendar file** — `node scripts/make-ics.mjs` → `public/wedding.ics`
  (all-day event; remains all-day when ceremony and party times are confirmed).
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

[`src/components/HomePage.astro`](./src/components/HomePage.astro) sets
`NOINDEX = true` (adds `<meta name="robots" content="noindex, nofollow">`), and
`public/robots.txt` disallows crawling. Crawlers blocked by robots.txt cannot
read the meta tag; neither mechanism guarantees removal of an already indexed
URL or prevents someone with the link from viewing the site.

---

## Project layout

```
public/            favicon.svg · og-image.png · wedding.ics · robots.txt
scripts/           check-i18n.mjs · make-ics.mjs · make-og.mjs
src/
  layouts/Base.astro         <head>, meta, hreflang, fonts, skip-link, reveal observer
  assets/couple-path.jpg     the engagement photo
  components/                 Header · Hero · OurStory · Schedule · Venue ·
                              Rsvp · RsvpButton · Countdown ·
                              AddToCalendar · Figure · Footer · ScrollCue ·
                              LangToggle · HomePage
  i18n/{ro,en}.json           all copy (flat keys)
  lib/{i18n,datetime,paths,invitation}.ts
  styles/{tokens,global,motion}.css
  pages/index.astro           RO  ("/")
  pages/en/index.astro        EN  ("/en/")
astro.config.mjs
```
