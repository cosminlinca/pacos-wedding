/**
 * Regenerate `public/wedding.ics`.
 *
 * Run with: `node scripts/make-ics.mjs`
 * Rerun whenever the ceremony time / schedule is confirmed (currently all-day).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'wedding.ics');

const DETAILS_URL = 'https://cosminlinca.github.io/pacos-wedding/';

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//pacos-wedding//save-the-date teaser//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'BEGIN:VEVENT',
  'UID:patricia-cosmin-2027-08-21@cosminlinca.github.io',
  'DTSTAMP:20260901T000000Z',
  'DTSTART;VALUE=DATE:20270821',
  'DTEND;VALUE=DATE:20270822',
  'SUMMARY:Pati & Cos’s wedding',
  'DESCRIPTION:Save the date. A formal invitation will follow.\\n' +
    `Details: ${DETAILS_URL}`,
  'LOCATION:Wonderland - Sala Riviera\\, Cluj-Napoca',
  'STATUS:CONFIRMED',
  'TRANSP:TRANSPARENT',
  'END:VEVENT',
  'END:VCALENDAR',
];

/** RFC 5545 §3.1 content-line folding: 75 octets, continuation lines start with a space. */
function fold(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--; // keep UTF-8 chars intact
    parts.push(bytes.subarray(start, end).toString('utf8'));
    start = end;
    limit = 74;
  }
  return parts.join('\r\n ');
}

const body = lines.map(fold).join('\r\n') + '\r\n';
writeFileSync(out, body, 'utf8');
process.stdout.write(`wrote ${out} (${Buffer.byteLength(body)} bytes)\n`);
