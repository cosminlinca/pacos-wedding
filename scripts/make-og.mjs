/**
 * Regenerate `public/og-image.png` (1200×630) — the social sharing card.
 *
 * Run with: `node scripts/make-og.mjs`
 * Static, hand-made card for the teaser: names + date + place + monogram on
 * ivory. Can move to on-the-fly generation with the full site later.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;
const serif = "Georgia, 'Times New Roman', 'Fraunces', serif";
const sans = "'Segoe UI', 'Inter', Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8F3EA"/>
      <stop offset="0.55" stop-color="#F3ECDD"/>
      <stop offset="1" stop-color="#E9DEC9"/>
    </linearGradient>
    <radialGradient id="glowA" cx="18%" cy="12%" r="60%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="86%" cy="92%" r="65%">
      <stop offset="0" stop-color="#2F3D33" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#2F3D33" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#9A7B4F" stroke-width="1.5"/>

  <text x="${W / 2}" y="150" fill="#1E2721" font-family="${serif}" font-size="30"
        letter-spacing="10" text-anchor="middle" font-weight="600">SAVE THE DATE</text>
  <line x1="${W / 2 - 40}" y1="180" x2="${W / 2 + 40}" y2="180" stroke="#9A7B4F" stroke-width="1.5"/>

  <text x="${W / 2}" y="330" fill="#23231F" font-family="${serif}" font-size="160"
        text-anchor="middle">Pati <tspan fill="#2F3D33" font-style="italic">&amp;</tspan> Cos</text>

  <text x="${W / 2}" y="430" fill="#2F3D33" font-family="${serif}" font-size="46"
        letter-spacing="2" text-anchor="middle">21 August 2027</text>

  <text x="${W / 2}" y="486" fill="#5A564C" font-family="${sans}" font-size="26"
        letter-spacing="3" text-anchor="middle">CLUJ-NAPOCA &#183; WONDERLAND &#8212; SALA RIVIERA</text>

  <text x="${W / 2}" y="565" fill="#9A7B4F" font-family="${serif}" font-size="26"
        letter-spacing="8" text-anchor="middle">P &amp; C</text>
</svg>`;

const png = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(out, png);
process.stdout.write(`wrote ${out} (${png.length} bytes)\n`);
