import assert from 'node:assert/strict';
import { copyFile, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

// Export generated artifacts only; the editable source entry stays untouched.
const root = new URL('../', import.meta.url);
await copyFile(new URL('dist/index.html', root), new URL('dist/beef-ribs-page-code.txt', root));
for (const name of ['SOURCES.md', 'RECIPE.md', 'IMAGE-SOURCES.txt']) {
  await copyFile(new URL(name, root), new URL(`dist/${name}`, root));
}
await mkdir(new URL('dist/licenses/', root), { recursive: true });
await cp(new URL('licenses/', root), new URL('dist/licenses/', root), { recursive: true });
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const notices = [
  'THIRD-PARTY SOFTWARE AND FONT NOTICES',
  '',
  'Bundled dependencies retain their licenses. Exact versions are in package-lock.json.',
  'Geist: SIL Open Font License 1.1, licenses/geist-OFL.txt.',
  'shadcn source and CSS: MIT, licenses/shadcn-MIT.txt.',
  'No new license is assigned to user-owned code or supplied images.',
  'Image provenance and rights are separate: IMAGE-SOURCES.txt.',
  '',
];
for (const [path, metadata] of Object.entries(lock.packages)) {
  if (
    !path ||
    (metadata.dev && !['node_modules/tailwindcss', 'node_modules/@tailwindcss/vite'].includes(path))
  )
    continue;
  const directory = new URL(`${path}/`, root);
  const pkg = JSON.parse(await readFile(new URL('package.json', directory), 'utf8'));
  const files = (await readdir(directory)).filter((name) =>
    /^(licen[cs]e|copying|notice)([.-]|$)/i.test(name),
  );
  assert.ok(files.length, `Missing license for ${pkg.name}`);
  for (const file of files) {
    const target = `${pkg.name.replace(/[@/]/g, '_')}-${pkg.version}-${file}`;
    await cp(new URL(file, directory), new URL(`dist/licenses/${target}`, root), {
      recursive: true,
    });
    notices.push(
      `${pkg.name}@${pkg.version} | ${pkg.license ?? metadata.license ?? 'See license text'} | licenses/${target}`,
    );
  }
}
await writeFile(new URL('dist/THIRD-PARTY-NOTICES.txt', root), notices.join('\n') + '\n');
console.log('Exported identical complete page-code TXT and recipe/source notes.');
