import type { Locale } from './i18n';

/**
 * Single source of truth for the wedding moment.
 *
 * Europe/Bucharest observes EEST (UTC+3) in August, so `+03:00` is correct for
 * 21 August 2027. The ceremony time is not known yet — this is treated as the
 * start of the day; regenerate `public/wedding.ics` and this constant when the
 * schedule is confirmed.
 */
export const WEDDING = new Date('2027-08-21T00:00:00+03:00');

/** Calendar-facing timestamps (all-day event, 21→22 August). */
export const ICS_START = '20270821';
export const ICS_END = '20270822';

export interface Remaining {
  total: number; // milliseconds remaining (clamped at 0)
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

/** Break the gap between `from` and the wedding into d/h/m/s. */
export function remainingUntilWedding(from: Date = new Date()): Remaining {
  const total = Math.max(0, WEDDING.getTime() - from.getTime());
  const sec = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
    passed: total === 0,
  };
}

/** Localised, human date string for the accessible sentence / fallbacks. */
export function formatWeddingDate(locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ro' ? 'ro-RO' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Bucharest',
  }).format(WEDDING);
}
