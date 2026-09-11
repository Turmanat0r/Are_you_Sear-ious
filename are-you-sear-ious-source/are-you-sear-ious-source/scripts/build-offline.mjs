/**
 * Builds the single-file offline edition at the repository root.
 *
 * `index.html` there is meant to open from a file:// URL with no server, so
 * everything it needs has to be inside it: the stylesheet (which already
 * carries its fonts as base64), the script, and the favicon. Only the meal
 * photos stay external, because 21 of them would push the file past 5 MB.
 *
 * This step did not exist for the first several sessions, so the committed
 * index.html silently fell nine recipes behind the source. `npm run build` now
 * runs it, and a test asserts the result names every cut.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, '..');
const dist = path.join(source, 'dist-static');
const repo = path.resolve(source, '..', '..');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const html = read(path.join(dist, 'index.html'));

// Vite emits hashed asset names, so find them rather than hard-coding.
const scriptRef = html.match(/src="\/assets\/([^"]+\.js)"/);
const styleRef = html.match(/href="\/assets\/([^"]+\.css)"/);
if (!scriptRef || !styleRef)
  throw new Error('dist-static/index.html has no hashed asset references');

const js = read(path.join(dist, 'assets', scriptRef[1]));
const css = read(path.join(dist, 'assets', styleRef[1]));

// A closing tag inside the inlined script would end the <script> element
// early. Escaping the slash is inert to the parser and safe in JS source.
const inlineJs = js.replace(/<\/script>/gi, '<\\/script>');

// Every injection below passes a replacer *function* rather than a string.
// String replacements treat $&, $` and $' as substitution patterns, and
// minified assets are full of them — passing the CSS as a plain string
// spliced 23 copies of the surrounding document into the output.
const offline = html
  .replace(
    /\s*<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/,
    () => '',
  )
  .replace(
    /\s*<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/,
    () => `\n    <style>${css}</style>`,
  )
  // A classic script, not type="module". The bundle imports and exports
  // nothing, so it needs no module semantics, and browsers treat modules
  // over file:// far more strictly than classic scripts — which is the one
  // environment this file exists for. The IIFE keeps the strict mode and the
  // private scope that module semantics would otherwise have provided.
  .replace(
    '</body>',
    () => `  <script>(function(){"use strict";\n${inlineJs}\n})();</script>\n  </body>`,
  )
  // The offline copy is opened directly, so absolute paths cannot resolve.
  .replace(/\/meals\//g, './images/')
  // A canonical link pointing at the live site is wrong for a local file.
  .replace(/\s*<link rel="canonical"[^>]*>/, '');

fs.writeFileSync(path.join(repo, 'index.html'), offline);

// Keep the photo folder the offline file reads from in step with the source.
const mealsDir = path.join(source, 'public', 'meals');
const imagesDir = path.join(repo, 'images');
fs.mkdirSync(imagesDir, { recursive: true });
const sha = (file) =>
  createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let copied = 0;
for (const name of fs
  .readdirSync(mealsDir)
  .filter((f) => f.endsWith('.webp'))) {
  const from = path.join(mealsDir, name);
  const to = path.join(imagesDir, name);
  if (!fs.existsSync(to) || sha(from) !== sha(to)) {
    fs.copyFileSync(from, to);
    copied += 1;
  }
}
// Anything left here that the app no longer ships is a stale photo.
const live = new Set(fs.readdirSync(mealsDir));
const stale = fs
  .readdirSync(imagesDir)
  .filter((f) => f.endsWith('.webp') && !live.has(f));

const kb = (n) => (n / 1024).toFixed(0);
console.log(
  `offline build: index.html ${kb(offline.length)} KB · ${copied} photo(s) copied` +
    (stale.length ? ` · STALE: ${stale.join(', ')}` : ''),
);
