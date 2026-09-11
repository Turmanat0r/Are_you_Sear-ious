import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const html = await read('dist/index.html');
assert.deepEqual(html, await read('dist/fire-kissed-stuffed-bell-peppers-page-code.txt'));
const code = html.toString('utf8');
assert.match(code, /class="dark"/);
assert.match(code, /#141514/i);
assert.match(code, /Geist/);
assert.match(code, /data:font\/woff2;base64/);
assert.doesNotMatch(
  code,
  /Georgia|<script\b[^>]*\bsrc=|<link\b[^>]*rel="stylesheet"|[A-Z]:[\\/]+Users[\\/]/i,
);
assert.doesNotMatch(code, /cloudflare|vinext|esbuild-wasm/i);
const scripts = [...code.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
assert.ok(scripts.length > 0);
for (const [, script] of scripts) {
  const result = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: script,
    encoding: 'utf8',
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr);
}
const manifest = JSON.parse(await read('provenance/image-provenance.json'));
assert.equal(hash(await read(`provenance/${manifest.original.path}`)), manifest.original.sha256);
const webp = await read('dist/images/fire-kissed-stuffed-bell-peppers.webp');
assert.equal(hash(webp), manifest.webAsset.sha256);
assert.equal(webp.toString('ascii', 0, 4), 'RIFF');
assert.equal(webp.toString('ascii', 8, 12), 'WEBP');
assert.ok(webp.length < 250000);
const audit = JSON.parse(await read('public/provenance/image-details.json'));
assert.equal(hash(await read('provenance/generation-prompt.txt')), audit.prompt.sha256);
const theme = JSON.parse(await read('provenance/theme-reference.json'));
for (const entry of theme.files)
  assert.equal(hash(await read(entry.path)), entry.sha256, `Theme/font changed: ${entry.path}`);
for (const file of [
  'dist/provenance/image-details.json',
  'dist/favicon.svg',
  'dist/THIRD-PARTY-NOTICES.txt',
  'dist/SOURCES.md',
  'dist/RECIPE.md',
  'dist/licenses/geist-OFL.txt',
])
  await read(file);
console.log(
  'Verified complete HTML/TXT identity, code syntax, charcoal theme, embedded Geist, exact reference files, photo and prompt hashes, and supporting files.',
);
