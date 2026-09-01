import roRaw from '../i18n/ro.json';
import enRaw from '../i18n/en.json';
import { withBase } from './paths';

export const LOCALES = ['ro', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ro';

type StringTable = Record<string, string>;

const STRINGS: Record<Locale, StringTable> = {
  ro: roRaw as StringTable,
  en: enRaw as StringTable,
};

/** All copy for a locale as a flat key→string map. Falls back to RO for any missing key. */
export function getStrings(locale: Locale): (key: string) => string {
  const table = STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
  const fallback = STRINGS[DEFAULT_LOCALE];
  return (key: string): string => table[key] ?? fallback[key] ?? key;
}

/** Raw string table (used where an object is more convenient than a getter). */
export function getTable(locale: Locale): Record<string, string> {
  return STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Detect the locale from a URL by looking for an `/en` segment after the base
 * path. Everything else (including `/`) is the default locale, RO.
 */
export function getLocaleFromUrl(url: URL): Locale {
  const path = stripBase(url.pathname);
  const first = path.split('/').filter(Boolean)[0];
  return first && isLocale(first) && first !== DEFAULT_LOCALE
    ? first
    : DEFAULT_LOCALE;
}

/**
 * Path (base-prefixed, ready for `href`) of the current page in `target` locale.
 * The teaser has only two routes, so this maps `/` ↔ `/en/`, but it also
 * preserves any deeper path if more pages are added later.
 */
export function switchLocalePath(url: URL, target: Locale): string {
  const path = stripBase(url.pathname);
  const segments = path.split('/').filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments.shift();
  const rest = segments.join('/');
  const prefix = target === DEFAULT_LOCALE ? '' : `${target}/`;
  return withBase(`/${prefix}${rest}`.replace(/\/+$/, '/') || '/');
}

export const OTHER_LOCALE: Record<Locale, Locale> = { ro: 'en', en: 'ro' };

function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (base && pathname.startsWith(base))
    return pathname.slice(base.length) || '/';
  return pathname;
}
