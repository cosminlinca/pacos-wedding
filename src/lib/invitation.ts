import type { ImageMetadata } from 'astro';
import venuePhoto from '../assets/venue-riviera.jpg';

// Set the published Google Form URL when responses are ready to open.
export const RSVP_FORM_URL: string | undefined = undefined;

export const VENUE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Wonderland%20Sala%20Riviera%20Cluj-Napoca';

// Source: https://wonderland.ro/wp-content/uploads/2020/09/Evenimente-O-sala-pentru-un-public-Riviera.jpg
export const VENUE_PHOTO: ImageMetadata | undefined = venuePhoto;

interface StoryEntry {
  id: string;
  photo?: ImageMetadata;
}

// Add imported photos here; entries without a photo stay hidden.
// Each id has matching story.<id>.year/caption/alt keys in both locales.
export const STORY_ENTRIES: StoryEntry[] = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
];
