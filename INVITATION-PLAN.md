# Invitation site — implementation plan

Next milestone after the teaser: the real invitation site, where guests RSVP and find logistics. See `PLAN.md` for the teaser decisions.

## Decisions

- **Structure:** one long scrolling page. Wide screens get an anchor nav; mobile header holds only the RO/EN toggle and an RSVP button.
- **Sections:** Our story, schedule, venue, RSVP.
- **RSVP:** link to a Google Form, shown as a button in the hero and header, next to a reply-by deadline.
- **Our story:** vertical timeline, 6–8 photos, RO/EN captions.
- **Schedule:** religious ceremony time and party start time.
- **Venue:** Google Maps link and a photo.
- **Parking:** available at the venue; included in the venue section, with no separate block or navigation link.
- **Unknown details:** show "to be confirmed" copy; hide a block only if it would look broken half-empty.
- **Calendar:** stays an all-day event.
- **Visibility:** `noindex`, shared by link only.
- **Analytics:** none.
- **Copy:** RO written by the couple, EN translated with help. Both JSON files must have identical keys before launch.
- **Domain:** custom domain later. A printed invitation locks in whatever URL it shows.
- **Out for now:** gifts, dress code, hotels and transport, info for guests from abroad, FAQ, wedding party, dark theme.

## Steps

1. **Header and RSVP button**
   - Sticky header with RO/EN toggle and RSVP button; anchor nav only on wide screens.
   - RSVP button in the hero next to "Add to calendar".
   - Google Form URL in one config constant.
   - Copy keys in both JSON files.
2. **RSVP section** — button plus reply-by line (placeholder key until the date is known).
3. **Venue section** — name, address, Google Maps link, photo via `Figure`.
4. **Schedule** — ceremony and party times; "to be confirmed" copy until final. Parking information is part of the venue section.
5. **Our story** — vertical timeline; photos in `src/assets/`, year and caption per entry in both languages, existing reveal motion.
6. **Visibility** — set `NOINDEX = true` in `HomePage.astro`; tighten `public/robots.txt`.
7. **Copy and checks**
   - RO copy from the couple, EN translated.
   - Script that checks `ro.json` and `en.json` have identical keys.
   - Run `npm run build` and `npm run lint`.

## Open items before launch

- Launch date (not decided yet).
- Google Form URL.
- Reply-by date.
- Ceremony and party times.
- Venue photo and story photos.
