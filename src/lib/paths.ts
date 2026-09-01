/**
 * Base-path helper for GitHub project Pages.
 *
 * The site is deployed under `/pacos-wedding/`, so every internal link, asset
 * `src`, favicon, OG URL and the `.ics` link MUST be routed through `withBase()`
 * — a hard-coded `/foo` would 404 on the deployed site.
 *
 * `import.meta.env.BASE_URL` is `/pacos-wedding/` in this project (Astro appends
 * a trailing slash) and `/` when `base` is unset.
 */
const BASE = import.meta.env.BASE_URL;

/** Prefix an absolute-from-root path with the configured base path. */
export function withBase(path = '/'): string {
  const left = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const right = path.startsWith('/') ? path : `/${path}`;
  return `${left}${right}` || '/';
}

/**
 * Absolute canonical URL for a page, built from `Astro.site` + a pathname.
 * Pass `Astro.url.pathname` for the current page.
 */
export function canonicalUrl(site: URL | undefined, pathname: string): string {
  if (!site) return pathname;
  return new URL(pathname, site).href;
}
