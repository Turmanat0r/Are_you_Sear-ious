/**
 * Builds the site and app icons from the two logo masters in branding/.
 *
 * Run it by hand after changing a master: `node scripts/make-icons.mjs`. The
 * output is committed under public/icons/, so the normal build never needs to
 * run it, and a test checks every declared icon exists at its stated size.
 *
 * PNG throughout rather than the masters' WebP: iOS wants a PNG
 * apple-touch-icon, and PNG is the one manifest icon format every browser
 * that can install a web app accepts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const masters = path.join(source, 'branding');
const out = path.join(source, 'public', 'icons');
fs.mkdirSync(out, { recursive: true });

const large = path.join(masters, 'are-you-sear-ious-512x512.webp');
const small = path.join(masters, 'are-you-sear-ious-192x192.webp');
const png = (image) => image.png({ compressionLevel: 9 });

// Android may crop an app icon to a circle, and the logo runs right out to
// the corners. The maskable copy shrinks it to 72% so the ring and lettering
// sit inside the 80% safe zone, on the master's own tile colour (#0a0a0a).
const inset = await sharp(large).resize(368, 368).toBuffer();
const maskable = sharp({
  create: { width: 512, height: 512, channels: 3, background: '#0a0a0a' },
}).composite([{ input: inset, gravity: 'centre' }]);

const icons = {
  'favicon-32.png': png(sharp(large).resize(32, 32)),
  'apple-touch-icon.png': png(sharp(large).resize(180, 180)),
  'icon-192.png': png(sharp(small)),
  'icon-512.png': png(sharp(large)),
  'icon-maskable-512.png': png(maskable),
};

for (const [name, image] of Object.entries(icons)) {
  const info = await image.toFile(path.join(out, name));
  console.log(`${name} ${info.width}x${info.height} ${info.size} bytes`);
}
