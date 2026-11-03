import type { ImageMetadata } from 'astro';
import venuePhoto from '../assets/venue-riviera.jpg';

// Set the published Google Form URL when responses are ready to open.
export const RSVP_FORM_URL: string | undefined = undefined;

export const VENUE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Wonderland%20Sala%20Riviera%20Cluj-Napoca';

// Source: https://wonderland.ro/wp-content/uploads/2020/09/Evenimente-O-sala-pentru-un-public-Riviera.jpg
export const VENUE_PHOTO: ImageMetadata | undefined = venuePhoto;

// Chapters in chronological order. Photos live in src/assets/story/<id>/ and
// are shown in filename order; titles are the story.<id>.title i18n keys.
export const STORY_CHAPTERS = ['1', '2', '3', '4'];

// FAQ entries, in display order; copy lives in faq.<id>.q / faq.<id>.a.
export const FAQ_ITEMS = ['rsvp', 'parking', 'dress', 'kids', 'travel', 'stay'];

// After the wedding, set this to the shared photo album. The countdown turns
// into a thank-you note the day after the wedding and links here if set.
export const GALLERY_URL: string | undefined = undefined;
