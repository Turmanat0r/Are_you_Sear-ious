const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { cookConfig } = require('./load-ts.cjs');

const { cuts, buildRecipe } = cookConfig;
const root = path.resolve(__dirname, '..');

// The <img> in app/page.tsx declares these, so a mismatch would distort the
// photo and reintroduce layout shift.
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 800;

test('every meal has a distinct, small, decodable WebP image', async () => {
  const hashes = new Set();
  let bytes = 0;
  for (const cut of cuts) {
    const buffer = fs.readFileSync(
      path.join(root, 'public', 'meals', cut.id + '.webp'),
    );
    assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP');
    const metadata = await sharp(buffer).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, EXPECTED_WIDTH, `${cut.id} width`);
    assert.equal(metadata.height, EXPECTED_HEIGHT, `${cut.id} height`);
    assert.ok(buffer.length < 250_000, `${cut.id} should be below 250 KB`);
    await sharp(buffer).raw().toBuffer();
    hashes.add(createHash('sha256').update(buffer).digest('hex'));
    bytes += buffer.length;
  }
  assert.equal(hashes.size, cuts.length, 'no reused category photos');
  assert.ok(bytes < 2_500_000, 'every meal image together stays below 2.5 MB');
});

test('old large category PNGs are not shipped', () => {
  for (const filename of [
    'beef.png',
    'pork-shoulder.png',
    'poultry.png',
    'fish.png',
  ]) {
    assert.equal(fs.existsSync(path.join(root, 'public', filename)), false);
  }
});

test('photo changes are tied to the selected cut, not just its protein', () => {
  const seen = new Map();
  for (const cut of cuts) {
    const recipe = buildRecipe(cut.id, cut.baseLb);
    assert.equal(recipe.photo, '/meals/' + cut.id + '.webp');
    assert.equal(recipe.photoCaption, cut.name);
    assert.ok(
      recipe.photoAlt.includes(cut.name),
      `${cut.id} alt text should name the cut`,
    );
    assert.ok(
      fs.existsSync(path.join(root, 'public', recipe.photo.slice(1))),
      `${cut.id} photo file must exist`,
    );
    seen.set(recipe.photo, (seen.get(recipe.photo) ?? 0) + 1);
  }
  assert.equal(seen.size, cuts.length, 'each cut needs its own photo');

  // The regression this guards: cuts that share a protein once shared one
  // photo. Assert siblings differ rather than trusting the id-to-path shape.
  for (const protein of ['Beef', 'Pork', 'Poultry', 'Fish']) {
    const siblings = cuts
      .filter((c) => c.protein === protein)
      .map((c) => buildRecipe(c.id, c.baseLb).photo);
    assert.equal(
      new Set(siblings).size,
      siblings.length,
      `${protein} cuts must not reuse one photo`,
    );
  }
});

test('the photo element is keyed so a cut change cannot show a stale image', () => {
  const page = fs.readFileSync(path.join(root, 'app', 'page.tsx'), 'utf8');
  // Whitespace-tolerant so running the formatter does not fail the suite.
  assert.match(
    page,
    /<img\s+key=\{recipe\.id\}\s+src=\{recipe\.photo\}/,
    'the <img> must be keyed by recipe.id and read recipe.photo',
  );
});

test('science cards and print view have no external technique attribution blocks', () => {
  const config = fs.readFileSync(
    path.join(root, 'app', 'cook-config.ts'),
    'utf8',
  );
  const page = fs.readFileSync(path.join(root, 'app', 'page.tsx'), 'utf8');
  const controls = fs.readFileSync(
    path.join(root, 'app', 'grill-tools.tsx'),
    'utf8',
  );
  // Identifier and copy checks only — formatting cannot introduce or remove these.
  assert.ok(!config.includes('export const sources'));
  assert.ok(!page.includes('MethodReference'));
  assert.ok(!page.includes('recipe.reference'));
  assert.ok(!controls.includes('note.source'));
  assert.ok(controls.includes('A LITTLE GRILL SCIENCE'));
  assert.ok(page.includes('USDA FSIS'));
});

test('the standing disclaimer and its claims stay on the page', () => {
  const page = fs.readFileSync(path.join(root, 'app', 'page.tsx'), 'utf8');

  // Legal text is easy to delete by accident during a refactor and nobody
  // notices until it matters. Guard the substance, not the wording.
  assert.match(page, /legal-note/, 'the disclaimer section must exist');
  assert.match(page, /thermometer/i, 'cook-to-temperature notice');
  assert.match(page, /AI image model/i, 'AI-image disclosure');
  assert.match(page, /no warranty/i, 'no-warranty notice');
  assert.match(page, /makes no network requests/i, 'privacy claim');

  // These three carry the disclosure at the point of use, not just at the
  // foot of the page, and are the ones most likely to be lost in a redesign.
  assert.match(page, /photo-ai/, 'AI badge on the meal photo');
  assert.match(page, /AI illustration/, 'AI badge copy');
  assert.match(page, /safety-banner/, 'safety banner in the recipe section');
  assert.match(
    page,
    /Temperature decides doneness, not time/,
    'the safety banner must lead with temperature over time',
  );
  assert.match(page, /print-safety/, 'safety line on the printed sheet');
  // The printed sheet leaves the site, so it repeats both disclosures.
  const print = page.slice(
    page.indexOf('function RecipePrint'),
    page.indexOf('function CookMode'),
  );
  assert.match(print, /AI-generated illustrations/, 'print AI disclosure');
  assert.match(print, /no warranty/i, 'print warranty disclaimer');

  // The privacy claim above is only honest while it stays true.
  for (const file of [
    'page.tsx',
    'grill-tools.tsx',
    'cook-config.ts',
    'recipes.ts',
  ]) {
    const source = fs.readFileSync(path.join(root, 'app', file), 'utf8');
    for (const api of [
      'fetch(',
      'XMLHttpRequest',
      'navigator.sendBeacon',
      'new WebSocket',
      'EventSource',
    ]) {
      assert.ok(
        !source.includes(api),
        `${file} uses ${api}, which breaks the "no network requests" claim`,
      );
    }
  }
});
