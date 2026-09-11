import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const html = await read('dist/index.html');
assert.deepEqual(html, await read('dist/beef-ribs-page-code.txt'));
const code = html.toString('utf8');
assert.match(code, /class="dark"/);
assert.match(code, /data:font\/woff2;base64/);
assert.match(code, /<style\b/);
assert.doesNotMatch(
  code,
  /<script\b[^>]*\bsrc=|<link\b[^>]*rel="stylesheet"|[A-Z]:[\\/]+Users[\\/]/i,
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
const historical = JSON.parse(await read('provenance/image-provenance.json'));
for (const entry of [historical.original, historical.prompt])
  assert.equal(hash(await read(entry.path)), entry.sha256);
for (const entry of historical.webAssets) {
  const image = await read(`dist/${entry.path}`);
  assert.equal(hash(image), entry.sha256);
  assert.equal(image.toString('ascii', 0, 4), 'RIFF');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP');
  assert.equal(image.length, entry.bytes);
  assert.ok(image.length < 250000);
}
const reference = JSON.parse(await read('provenance/layout-reference.json'));
for (const entry of reference.files)
  assert.equal(
    hash(await read(entry.path)),
    entry.sha256,
    `Changed supplied style/font: ${entry.path}`,
  );
await read('dist/provenance/image-details.json');
await read('dist/favicon.svg');
await read('dist/THIRD-PARTY-NOTICES.txt');
await read('dist/SOURCES.md');
console.log(
  'Verified HTML/TXT identity, inline code syntax/fonts, both WebP hashes, original PNG/prompt, unchanged reference CSS/fonts, and supporting files.',
);
