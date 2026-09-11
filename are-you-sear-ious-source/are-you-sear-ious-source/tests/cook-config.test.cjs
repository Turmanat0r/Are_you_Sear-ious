const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { recipes: original, cookConfig: config } = require('./load-ts.cjs');
const {
  cuts,
  defaultCuts,
  buildRecipe,
  measured,
  validateWeight,
  fromLb,
  toLb,
  burnerMessage,
  cookingScience,
  burnerLevels,
  heatFraction,
  estimatedAmbient,
  cookTimeEstimate,
  parseMinutes,
  formatMinutes,
  substitutionsFor,
  substitutedItem,
  swapSets,
  saltWarning,
  measuredPart,
  spoonLabel,
} = config;

const CUTS_PER_PROTEIN = { Beef: 5, Pork: 3, Poultry: 6, Seafood: 5 };

test('four proteins, nineteen unique cuts, and matching defaults', () => {
  assert.equal(cuts.length, 19);
  assert.equal(new Set(cuts.map((c) => c.id)).size, 19);
  assert.equal(
    Object.values(CUTS_PER_PROTEIN).reduce((a, b) => a + b, 0),
    cuts.length,
  );
  for (const protein of ['Beef', 'Pork', 'Poultry', 'Seafood']) {
    assert.equal(
      cuts.filter((c) => c.protein === protein).length,
      CUTS_PER_PROTEIN[protein],
    );
    assert.equal(
      cuts.find((c) => c.id === defaultCuts[protein]).protein,
      protein,
    );
  }
});

for (const cut of cuts) {
  test(`${cut.id}: cut-specific recipe, assets, and supported weights`, () => {
    const base = buildRecipe(cut.id, cut.baseLb);
    assert.equal(base.cut.id, cut.id);
    assert.equal(base.protein, cut.protein);
    assert.equal(base.scale, 1);
    assert.deepEqual(base.grill, cut.grill);
    assert.deepEqual(base.internal, cut.internal);
    const allItems = base.ingredients.flatMap((g) => g.items);
    assert.ok(allItems.length >= 3, `${cut.id} needs a real ingredient list`);
    // The templated recipes all bind their seasoning with mustard. These
    // five deliberately have no binder at all: butter in foil, a lime-and-oil
    // paste, chimichurri, an achiote marinade, and a dry rub under sauce.
    if (
      ![
        'foil-boat',
        'jerk-turkey',
        'shrimp',
        'achiote',
        'bbq-chicken',
      ].includes(cut.family)
    )
      assert.ok(
        allItems.some((item) => item.includes('mustard')),
        `${cut.id} should carry its mustard binder`,
      );
    assert.ok(base.steps.length >= 4);
    assert.equal(base.photo, '/meals/' + cut.id + '.webp');
    assert.equal(base.photoCaption, cut.name);
    assert.ok(cookingScience(cut).body.length > 60);
    assert.ok(cookingScience(cut).takeaway.length > 20);
    assert.ok(
      fs.existsSync(
        path.resolve(__dirname, '..', 'public', base.photo.slice(1)),
      ),
    );
    for (const weight of [cut.minLb, cut.baseLb, cut.maxLb]) {
      const recipe = buildRecipe(cut.id, weight);
      assert.equal(recipe.scale, weight / cut.baseLb);
      assert.deepEqual(
        recipe.grill,
        base.grill,
        'weight must not change grill targets',
      );
      assert.deepEqual(
        recipe.internal,
        base.internal,
        'weight must not change safety targets',
      );
      assert.equal(
        recipe.time,
        base.time,
        'do not multiply cook time by total batch weight',
      );
      assert.equal(
        recipe.ingredients[0].items.filter((i) => i.includes('g kosher salt'))
          .length,
        1,
      );
      // The shopping line also carries spoon equivalents, which would make
      // the step prose unreadable. Both must still quote the same weight.
      const saltLine = recipe.ingredients[0].items[1];
      const weighed = saltLine.split(' (')[0];
      assert.ok(weighed.endsWith('g kosher salt'), weighed);
      assert.ok(recipe.steps[0].body.includes(weighed));
      // Naming one brand would be wrong by about 70% for the other box.
      assert.ok(saltLine.includes('Morton'), saltLine);
      assert.ok(saltLine.includes('Diamond Crystal'), saltLine);
      assert.ok(
        !/\d\.\d/.test(saltLine.split('about ')[1].split(')')[0]),
        'spoon equivalents must be fractions, not decimals: ' + saltLine,
      );
      const kg = fromLb(weight, 'kg');
      assert.ok(Math.abs(toLb(kg, 'kg') - weight) < 1e-10);
      assert.ok(validateWeight(cut, toLb(kg, 'kg')));
      assert.deepEqual(
        buildRecipe(cut.id, weight, 'kg').ingredients.slice(1),
        recipe.ingredients.slice(1),
      );
      assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(recipe)));
    }
    for (const bad of [
      0,
      -1,
      NaN,
      Infinity,
      -Infinity,
      cut.minLb - 0.01,
      cut.maxLb + 0.01,
    ]) {
      assert.equal(validateWeight(cut, bad), false);
      assert.throws(() => buildRecipe(cut.id, bad), /Weight outside/);
    }
    // Rounded display boundaries must themselves be accepted when entered in kg.
    for (const boundary of [cut.minLb, cut.maxLb]) {
      assert.ok(
        validateWeight(
          cut,
          toLb(Number(fromLb(boundary, 'kg').toFixed(4)), 'kg'),
        ),
      );
    }
  });
}

test('measurement formatting and smaller units scale correctly', () => {
  const mustard = { amount: 2, unit: 'tsp', name: 'Dijon mustard' };
  assert.equal(measured(mustard, 0.5), '1 tsp Dijon mustard');
  assert.equal(measured(mustard, 2), '4 tsp Dijon mustard');
  assert.equal(
    measured({ amount: 0.25, unit: 'cup', name: 'juice' }, 0.5),
    '2 tbsp juice',
  );
  assert.equal(
    measured({ amount: 1, unit: 'tbsp', name: 'pepper' }, 0.25),
    '¾ tsp pepper',
  );
  // Scaling up has to climb into larger units too, but only where the
  // result still prints as a fraction. The second case is the guard: 4 tsp
  // must not become the "1.33 tbsp" that a naive conversion produces.
  assert.equal(measured(mustard, 3), '2 tbsp Dijon mustard');
  assert.equal(measured(mustard, 2), '4 tsp Dijon mustard');
  assert.equal(
    measured({ amount: 12, unit: 'tbsp', name: 'butter' }, 1),
    '¾ cup butter',
  );
  assert.equal(
    measured({ amount: 4, unit: 'tbsp', name: 'paprika' }, 3),
    '¾ cup paprika',
  );
  // Spoon equivalents round to what a measuring set can hit, and bottom out
  // rather than printing a meaningless "0 tsp".
  assert.equal(spoonLabel(0.02), 'a pinch');
  assert.equal(spoonLabel(0.94), '1 tsp');
  assert.equal(spoonLabel(5.67), '2 tbsp');
  assert.equal(spoonLabel(36), '¾ cup');
  const small = buildRecipe('pork-shoulder', 4);
  const regular = buildRecipe('pork-shoulder', 8);
  assert.equal(
    small.ingredients[0].items[1],
    '9.07 g kosher salt (no scale? about 2 tsp Morton or 1 tbsp Diamond ' +
      'Crystal) total for the meat — use once, not again in the rub',
  );
  assert.equal(
    regular.ingredients[0].items[1],
    '18.14 g kosher salt (no scale? about 1 ¼ tbsp Morton or 2 ¼ tbsp ' +
      'Diamond Crystal) total for the meat — use once, not again in the rub',
  );
  assert.ok(
    small.steps
      .find((s) => s.title === 'Wrap the set bark')
      .body.includes('2 tbsp apple juice'),
  );
  assert.ok(
    small.ingredients
      .flatMap((g) => g.items)
      .includes('2 tbsp apple juice, for the wrap'),
  );
  assert.ok(
    regular.steps
      .find((s) => s.title === 'Wrap the set bark')
      .body.includes('¼ cup apple juice'),
  );
});

test('safety and tenderness targets stay separate for lean and slow-cooked cuts', () => {
  assert.deepEqual(buildRecipe('pork-shoulder', 8).internal, [195, 205]);
  for (const id of [
    'pork-chop',
    'pork-tenderloin',
    'pepper-ribeye',
    'strip-steak',
    'sirloin-steak',
  ]) {
    const recipe = buildRecipe(id, 2);
    assert.deepEqual(recipe.internal, [145]);
    assert.match(recipe.safety, /3-minute rest/);
    assert.ok(!recipe.steps.some((s) => /Wrap the set bark/.test(s.title)));
  }
  assert.deepEqual(buildRecipe('chicken-breast', 2).internal, [165]);
  for (const id of ['smoky-chicken', 'chicken-drumsticks']) {
    const recipe = buildRecipe(id, 3);
    assert.deepEqual(recipe.internal, [175, 185]);
    assert.match(recipe.safety, /165°F/);
  }
  for (const cut of cuts.filter((c) => c.protein === 'Seafood')) {
    assert.deepEqual(buildRecipe(cut.id, 1.5).internal, [145]);
  }
  assert.throws(() => buildRecipe('not-a-cut', 2), /Unknown cut/);
});

test('burner feedback covers every arrangement without mutating user choices', () => {
  for (let count = 2; count <= 6; count++) {
    // Every combination of the four settings across every burner count.
    for (let code = 0; code < burnerLevels.length ** count; code++) {
      let rest = code;
      const levels = Array.from({ length: count }, () => {
        const level = burnerLevels[rest % burnerLevels.length];
        rest = Math.floor(rest / burnerLevels.length);
        return level;
      });
      const before = [...levels];
      const indirect = burnerMessage(levels, 'indirect');
      const direct = burnerMessage(levels, 'direct');
      assert.deepEqual(levels, before, 'burnerMessage must not mutate input');

      const lit = levels.filter((l) => l !== 'off').length;
      if (lit === 0) assert.match(indirect, /No burners selected/);
      else if (lit === count) {
        assert.match(indirect, /at least one OFF/);
        assert.match(direct, /no unlit finishing area/);
      } else {
        assert.match(indirect, /OFF zones/);
        assert.match(direct, /chosen lit zones/);
      }
    }
  }
});

test('heat input rises monotonically with burner settings', () => {
  assert.equal(heatFraction([]), 0);
  assert.equal(heatFraction(['off', 'off']), 0);
  assert.equal(heatFraction(['hi', 'hi', 'hi']), 1);
  assert.equal(estimatedAmbient(['off', 'off', 'off']), null);

  // Turning any single burner up must never lower the estimate.
  for (let count = 2; count <= 6; count++) {
    let previous = 0;
    for (const level of burnerLevels) {
      const fraction = heatFraction(Array(count).fill(level));
      assert.ok(fraction >= previous, `${level} must not reduce heat input`);
      previous = fraction;
    }
  }

  // Anchors the model against settings a cook would actually use.
  const lowAndSlow = estimatedAmbient(['med', 'off', 'off']);
  assert.ok(
    lowAndSlow >= 240 && lowAndSlow <= 290,
    `one of three on MED should land near the 250-275F window, got ${lowAndSlow}`,
  );
  const searing = estimatedAmbient(['hi', 'hi', 'hi']);
  assert.ok(
    searing >= 540 && searing <= 600,
    `everything on HI should reach searing heat, got ${searing}`,
  );
});

test('cook time estimate responds to heat and never promises doneness', () => {
  const cut = cuts.find((c) => c.id === 'chicken-breast');

  assert.equal(cookTimeEstimate(cut, ['off', 'off', 'off']).kind, 'unlit');

  // Barely lit still reaches a 165F target, just very slowly.
  const barely = cookTimeEstimate(cut, ['lo', 'off', 'off']);
  assert.equal(barely.kind, 'scaled');
  assert.ok(barely.factor > 2, 'a nearly-cold grill must read as much slower');

  // A shoulder wants 195F, which one low burner across six cannot reach.
  const shoulder = cuts.find((c) => c.id === 'pork-shoulder');
  const tooCool = cookTimeEstimate(shoulder, [
    'lo',
    'off',
    'off',
    'off',
    'off',
    'off',
  ]);
  assert.equal(tooCool.kind, 'tooCool');
  assert.equal(tooCool.target, shoulder.internal[0]);
  // Not below the target outright, but inside the driving-force floor where
  // the remaining approach would take effectively forever.
  assert.ok(tooCool.ambient < shoulder.internal[0] + 15);

  const hot = cookTimeEstimate(cut, ['hi', 'hi', 'hi']);
  const mild = cookTimeEstimate(cut, ['med', 'med', 'off']);
  assert.equal(hot.kind, 'scaled');
  assert.equal(mild.kind, 'scaled');
  assert.ok(hot.ambient > mild.ambient);
  assert.ok(hot.factor < mild.factor, 'more heat must mean less time');

  // More heat must never increase the estimated window.
  assert.ok(hot.window[0] < mild.window[0]);
  assert.ok(hot.window[1] < mild.window[1]);

  for (const cut of cuts) {
    for (const levels of [
      ['hi', 'hi', 'hi'],
      ['med', 'med', 'med'],
      ['hi', 'med', 'off'],
      ['med', 'off', 'off'],
    ]) {
      const estimate = cookTimeEstimate(cut, levels);
      if (estimate.kind !== 'scaled') continue;
      assert.ok(estimate.factor >= 0.4 && estimate.factor <= 6, cut.id);
      assert.ok(Number.isFinite(estimate.factor), cut.id);
      if (estimate.window) {
        assert.ok(
          estimate.window[0] > 0 && estimate.window[0] <= estimate.window[1],
        );
      }
      // The estimate must never restate the safety target as a time promise.
      assert.deepEqual(
        buildRecipe(cut.id, cut.baseLb).internal,
        cut.internal,
        'heat settings must not move the internal target',
      );
    }
  }
});

test('stated cook windows parse, or degrade without inventing a number', () => {
  assert.deepEqual(parseMinutes('35–65 min + rest'), [35, 65]);
  assert.deepEqual(parseMinutes('10–16 hr + rest'), [600, 960]);
  assert.equal(parseMinutes('Allow a full day + rest'), null);

  assert.equal(formatMinutes(45), '45 min');
  assert.equal(formatMinutes(60), '1 hr');
  assert.equal(formatMinutes(95), '1 hr 35 min');

  // Every cut either parses to a sane window or opts out honestly.
  for (const cut of cuts) {
    const window = parseMinutes(cut.time);
    if (window === null) continue;
    assert.ok(window[0] > 0 && window[0] < window[1], cut.id);
  }
});

test('temperature unit conversion covers printed steps and safety text', () => {
  assert.equal(original.temp([250, 275], 'C'), '121–135°C');
  assert.equal(original.temp([145], 'C'), '63°C');
  assert.equal(original.temp([165], 'C'), '74°C');
  assert.equal(
    original.unitText('195–205°F; hold at 140°F.', 'C'),
    '91–96°C; hold at 60°C.',
  );
  for (const cut of cuts) {
    const r = buildRecipe(cut.id, cut.baseLb);
    for (const value of [
      r.finish,
      r.safety,
      ...r.steps.flatMap((s) => [s.cue, s.body]),
    ]) {
      assert.ok(!original.unitText(value, 'C').includes('°F'));
    }
  }
});

test('substitutions resolve to the most specific ingredient', () => {
  // The regression this guards: 'garlic powder' must not resolve as 'fresh
  // garlic', and 'onion powder' must not resolve as some shorter match.
  assert.equal(substitutionsFor('1 tbsp garlic powder').label, 'Garlic powder');
  assert.equal(
    substitutionsFor('1 tsp finely grated fresh garlic').label,
    'Fresh garlic',
  );
  assert.equal(substitutionsFor('1 tbsp onion powder').label, 'Onion powder');
  assert.equal(
    substitutionsFor('2 tsp Dijon mustard, for a very thin binder coat').label,
    'Dijon mustard',
  );
  assert.equal(
    substitutionsFor('3.5 tbsp yellow mustard, for a thin binder coat').label,
    'Yellow mustard',
  );
  assert.equal(substitutionsFor('2 lb ribeye steak'), null);
});

test('every substitution is complete and the salted ones say so', () => {
  const salted = [];
  for (const set of swapSets) {
    assert.ok(set.options.length >= 2, `${set.label} needs real alternatives`);
    assert.equal(set.match, set.match.toLowerCase(), 'matches are lowercased');
    for (const option of set.options) {
      assert.ok(option.use.length > 2, set.label);
      assert.ok(option.amount.length > 0, `${set.label}: ${option.use}`);
      if (option.addsSalt) salted.push(`${set.label} -> ${option.use}`);
    }
  }
  // Pre-salted swaps are the ones that can wreck a measured dry brine.
  assert.ok(
    salted.some((s) => s.includes('Onion salt')),
    'onion salt must be flagged as pre-salted',
  );
  assert.ok(
    salted.some((s) => s.includes('Garlic salt')),
    'garlic salt must be flagged as pre-salted',
  );
  assert.ok(saltWarning.includes('measured kosher salt'));
});

test('substitutions cover the seasonings but never the meat itself', () => {
  for (const cut of cuts) {
    const recipe = buildRecipe(cut.id, cut.baseLb);
    const [meatGroup, ...seasoningGroups] = recipe.ingredients;

    // The cut and its measured salt line lead the list; the cut must not be
    // offered as swappable, but the salt line is legitimately swappable.
    assert.equal(substitutionsFor(meatGroup.items[0]), null, cut.id);

    for (const group of seasoningGroups)
      for (const item of group.items) {
        const set = substitutionsFor(item);
        if (!set) continue;
        for (const option of set.options) {
          const swapped = substitutedItem(item, set, option);
          assert.ok(swapped.length > 0);
          assert.ok(!/undefined|NaN|\[object/.test(swapped), swapped);
          // A swap must never silently drop what it replaces.
          if (option.amount !== '—')
            assert.ok(swapped.includes(measuredPart(item)), swapped);
        }
      }
  }
});

test('a swap changes the shopping line but never the safety targets', () => {
  const recipe = buildRecipe('smoky-chicken', 3);
  const item = recipe.ingredients
    .flatMap((g) => g.items)
    .find((i) => i.includes('garlic powder'));
  const set = substitutionsFor(item);
  const saltySwap = set.options.find((o) => o.addsSalt);
  const swapped = substitutedItem(item, set, saltySwap);

  assert.ok(swapped.includes('Garlic salt'));
  assert.ok(
    swapped.includes(measuredPart(item)),
    'the original amount stays visible',
  );
  // Substituting is a display concern. It must not touch the cook itself.
  assert.deepEqual(buildRecipe('smoky-chicken', 3).internal, recipe.internal);
  assert.deepEqual(
    buildRecipe('smoky-chicken', 3).ingredients,
    recipe.ingredients,
  );
});

test('the tri-tip keeps its attribution and the USDA finish, not the original one', () => {
  const recipe = buildRecipe('coffee-ancho-tri-tip', 2.25);

  // This is the only recipe adapted from someone else's published work.
  // Ingredient proportions are not copyrightable, but the credit is the
  // thing most likely to be dropped in a refactor, so pin it here.
  const credit = recipe.attribution;
  assert.ok(credit, 'the tri-tip must carry its attribution');
  assert.match(credit.url, /^https:\/\/www\.weber\.com\//);
  assert.match(credit.label, /Weber/);
  assert.match(credit.note, /Adapted/);
  assert.match(credit.note, /AI-generated/, 'the photo is not the source’s');
  // Nominative fair use turns on not implying sponsorship, so the disclaimer
  // has to be in the credit a visitor reads, not only in NOTICE.md.
  assert.match(
    credit.note,
    /Not affiliated with, endorsed by, or sponsored by/,
    'the visible credit must disclaim affiliation',
  );
  assert.match(credit.note, /Weber-Stephen Products LLC/);

  // The source recipe finishes lower than USDA guidance. Raising it was a
  // deliberate decision and must not be quietly reverted.
  assert.deepEqual(recipe.internal, [145]);
  assert.match(recipe.finish, /at least 145/);
  assert.match(recipe.safety, /145/);
  assert.ok(!/13[0-9]\s*°?F/.test(recipe.finish + recipe.safety));

  // The dry brine is measured once. A second salt line for the sauce is
  // legitimate, but it has to say so, or someone salts the meat twice.
  const saltLines = recipe.ingredients
    .flatMap((g) => g.items)
    .filter((i) => i.toLowerCase().includes('kosher salt'));
  assert.equal(saltLines.length, 2, 'meat salt and sauce salt');
  assert.match(saltLines[0], /use once, not again in the rub/);
  assert.match(saltLines[1], /sauce only/);

  // It borrows the ribeye entry for its base lookup and then replaces every
  // field. Assert on what a cook actually reads, not on the internal id:
  // drop any arm of those ladders and the ribeye's copy reappears here.
  const rendered = JSON.stringify({
    title: recipe.title,
    description: recipe.description,
    headline: recipe.headline,
    tip: recipe.tip,
    wood: recipe.wood,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  });
  assert.ok(!/ribeye/i.test(rendered), 'ribeye copy leaked into the tri-tip');
  assert.ok(
    !/garlic butter|reverse sear/i.test(rendered),
    'the ribeye method leaked into the tri-tip',
  );
  assert.match(recipe.title, /tri-tip/i);

  // The grain-direction guidance is the whole reason this cut is different.
  const slicing = recipe.steps[recipe.steps.length - 1];
  assert.match(slicing.body, /grain/i);
  assert.match(recipe.steps[0].body, /grain/i, 'map the grain before the rub');
});

test('every tri-tip ingredient can be swapped when the cupboard is empty', () => {
  const recipe = buildRecipe('coffee-ancho-tri-tip', 2.25);
  const [meat, ...rest] = recipe.ingredients;
  assert.equal(substitutionsFor(meat.items[0]), null, 'never swap the roast');

  for (const group of rest)
    for (const item of group.items) {
      const set = substitutionsFor(item);
      assert.ok(set, `no substitution offered for: ${item}`);
      for (const option of set.options) {
        const swapped = substitutedItem(item, set, option);
        assert.ok(!/undefined|NaN|\[object/.test(swapped), swapped);
        if (option.amount !== '—') assert.ok(swapped.includes(item));
      }
    }

  // Longest-match resolution: these are the pairs that can shadow each other.
  assert.equal(
    substitutionsFor('2 tbsp adobo sauce from a tin').label,
    'Adobo sauce',
  );
  assert.equal(substitutionsFor('1 tbsp fresh lime juice').label, 'Lime juice');
  assert.equal(
    substitutionsFor('1 tbsp fresh lemon juice').label,
    'Lemon juice',
  );
});

test('scaling the tri-tip moves the shopping list but never the clock', () => {
  const base = buildRecipe('coffee-ancho-tri-tip', 2.25);
  const big = buildRecipe('coffee-ancho-tri-tip', 9);

  assert.equal(big.time, base.time, 'cook time is not multiplied by weight');
  assert.deepEqual(big.internal, base.internal);
  assert.notEqual(big.ingredients[3].items[0], base.ingredients[3].items[0]);
  // 4x the weight, so the sauce should have climbed out of cups-per-quarter.
  assert.match(big.ingredients[3].items[0], /cup/);
  assert.ok(Number(big.serves) > Number(base.serves));
  assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(big)));
});

test('every cut gets its own headline and blurb, not its protein’s', () => {
  const headlines = new Set();
  const descriptions = new Set();
  const titles = new Set();

  for (const cut of cuts) {
    const recipe = buildRecipe(cut.id, cut.baseLb);

    // The regression this guards: copy used to be chosen by protein, so all
    // three fish and both lean pork cuts shipped identical text.
    headlines.add(recipe.headline.join(' '));
    descriptions.add(recipe.description);
    titles.add(recipe.title);

    assert.equal(recipe.headline.length, 2, `${cut.id} headline is two parts`);
    for (const part of recipe.headline)
      assert.match(part, /\S/, `${cut.id} headline part must not be blank`);
    assert.ok(
      recipe.description.length > 40,
      `${cut.id} needs a real description`,
    );
    assert.ok(
      /[.!?]$/.test(recipe.description),
      `${cut.id} description should be a finished sentence`,
    );
  }

  assert.equal(headlines.size, cuts.length, 'every cut needs its own headline');
  assert.equal(descriptions.size, cuts.length, 'every cut needs its own blurb');
  assert.equal(titles.size, cuts.length, 'every cut needs its own title');
});

test('titles keep proper nouns capitalised', () => {
  // Titles lowercase the cut name, which is right for "ribeye steak" and
  // wrong for "New York strip". midSentenceName is the escape hatch.
  const strip = buildRecipe('strip-steak', 2);
  assert.match(strip.title, /New York strip/);
  assert.ok(!/new york/.test(strip.title), strip.title);
  assert.match(strip.ingredients[0].items[0], /New York strip/);

  for (const cut of cuts) {
    const recipe = buildRecipe(cut.id, cut.baseLb);
    const expected = cut.midSentenceName ?? cut.name.toLowerCase();

    // Every cut interpolates the name into its shopping line, so this half
    // covers all thirteen.
    assert.ok(
      recipe.ingredients[0].items[0].includes(expected),
      `${cut.id}: shopping line should carry "${expected}"`,
    );

    // Only the template families build a title from the cut name. These
    // three supply their own, so they are exempt by design.
    if (
      ['shoulder', 'tri-tip', 'prime-rib', 'achiote', 'bbq-chicken'].includes(
        cut.family,
      )
    )
      continue;
    assert.ok(
      recipe.title.includes(expected),
      `${cut.id}: title should carry "${expected}"`,
    );
  }
});

test('the walleye cooks in an open boat and never inherits the mustard recipe', () => {
  const recipe = buildRecipe('lemon-pepper-walleye', 1);
  const text = JSON.stringify(recipe);

  // It shares the Fish protein with three cuts built from a different
  // template. None of that template may leak in: no binder, no flipping.
  assert.ok(!/dijon/i.test(text), 'no mustard binder belongs in a foil boat');
  assert.ok(!/\bdill\b/i.test(text));
  assert.ok(!/fish basket/i.test(text));
  assert.match(recipe.title, /Butter & lemon-pepper/);
  assert.match(recipe.method, /[Ff]oil boat/);

  // Sealing the foil changes the cook, so the steps must say "open".
  const steps = recipe.steps.map((s) => s.body).join(' ');
  assert.match(steps, /open/i);
  assert.match(steps, /sealed packet|seal/i);

  // Thickness drives this one, not weight — the timings are per-fillet.
  assert.match(recipe.timingNote, /[Tt]hickness/);
  assert.deepEqual(recipe.internal, [145]);
  assert.match(recipe.finish, /145/);
  assert.match(recipe.finish, /[Ee]very fillet/);

  // Fish needs no rest at 145°F. Claiming one would be wrong, not just noisy.
  assert.ok(!/3-minute rest|rest at least 3/.test(recipe.finish));
});

test('the walleye warns about pre-salted lemon pepper', () => {
  const recipe = buildRecipe('lemon-pepper-walleye', 1);

  // The app measures a dry brine for every cut, but most supermarket
  // lemon-pepper is salt-first. Salting twice ruins a thin fillet, so the
  // first step has to say so before the cook reaches for the jar.
  const first = recipe.steps[0].body;
  assert.match(first, /label/i, 'must send the cook to the label');
  assert.match(first, /salt/i);
  assert.match(first, /salt-free/i, 'must name the case where salt is safe');

  // And the swap list has to flag the salted jars it offers.
  const line = recipe.ingredients
    .flatMap((g) => g.items)
    .find((i) => i.includes('lemon-pepper'));
  assert.ok(line, 'lemon pepper must appear in the shopping list');
  const set = substitutionsFor(line);
  assert.equal(set.label, 'Lemon-pepper seasoning');
  assert.ok(
    set.options.some((o) => o.addsSalt),
    'the salted blends must be flagged as pre-salted',
  );
  assert.ok(
    set.options.some((o) => !o.addsSalt),
    'a salt-free route must exist',
  );
});

test('shrimp is seafood, not fish, and the category says so', () => {
  const shrimp = cuts.find((c) => c.id === 'chimichurri-orange-grilled-shrimp');
  assert.equal(shrimp.protein, 'Seafood');

  // The USDA chart groups these as "Fish & Shellfish" at a shared 145F, so
  // one category is right — but calling a crustacean a fish is not.
  assert.ok(
    !cuts.some((c) => c.protein === 'Fish'),
    "the 'Fish' protein was renamed to 'Seafood'; nothing may still use it",
  );
  for (const cut of cuts.filter((c) => c.protein === 'Seafood'))
    assert.deepEqual(buildRecipe(cut.id, 1).internal, [145]);

  // The shopping list should not call a shrimp "meat" or "fish" either.
  const recipe = buildRecipe(shrimp.id, 1);
  assert.match(recipe.ingredients[0].title, /shrimp/i);
  assert.match(recipe.ingredients[0].items[1], /total for the shrimp/);
});

test('the shrimp keeps the served chimichurri away from the raw shrimp', () => {
  const recipe = buildRecipe('chimichurri-orange-grilled-shrimp', 1);
  const steps = recipe.steps.map((s) => s.body).join(' ');

  // Half the marinade is served as a sauce. If that half ever touches raw
  // shrimp it stops being a sauce and becomes a hazard, so the split has to
  // be stated at the start and re-stated when it is used.
  assert.match(recipe.steps[0].body, /half/i);
  assert.match(steps, /never touched raw shrimp|never reuse the marinade/i);
  assert.match(steps, /15 minutes|fifteen minutes/i, 'acid contact limit');

  assert.deepEqual(recipe.internal, [145]);
  assert.match(recipe.finish, /145/);
  assert.ok(!/rest at least 3|3-minute rest/.test(recipe.finish));
});

test('the turkey uses the poultry endpoint, never the 145F one', () => {
  const recipe = buildRecipe('jerk-spiced-grilled-turkey-tenderloin', 1.25);
  assert.equal(recipe.protein, 'Poultry');
  assert.deepEqual(recipe.internal, [165]);
  assert.match(recipe.finish, /165/);

  // Turkey next to pork and beef recipes is exactly where a 145F endpoint
  // could be copied in by mistake, so say so in the recipe and pin it here.
  assert.match(recipe.finish, /not the 145/i);
  const steps = recipe.steps.map((s) => s.body).join(' ');
  assert.match(steps, /165/);
  assert.ok(
    !/\b145\s*\u00b0?F\b/.test(steps.replace(/not the 145[^.]*\./g, '')),
    'no stray 145F target may appear in the turkey method',
  );
});

test('the prime rib reaches 145F before serving, sear notwithstanding', () => {
  const recipe = buildRecipe('holiday-rosemary-juniper-prime-rib', 4);
  assert.equal(recipe.protein, 'Beef');
  assert.deepEqual(recipe.internal, [145]);

  // Reverse sear pulls the roast early on purpose. That is a technique, not
  // a lower endpoint, and the difference is the whole safety story here.
  const steps = recipe.steps.map((s) => s.body).join(' ');
  assert.match(steps, /135|140/, 'it comes off indirect heat below target');
  assert.match(
    steps,
    /at least 145/,
    'and must still reach 145 before serving',
  );
  assert.match(recipe.finish, /does not count toward the endpoint/i);
  assert.match(recipe.rest, /20/);

  // Salt is the app's 0.5% of raw weight, not the source recipe's 4 tsp,
  // which lands anywhere from 0.63% to 1.06% depending on the brand.
  const grams = Number(recipe.ingredients[0].items[1].match(/^([\d.]+) g/)[1]);
  assert.ok(Math.abs(grams - 4 * 453.59237 * 0.005) < 0.01, String(grams));
});

test('the two boneless-thigh recipes stay tellable apart', () => {
  const achiote = buildRecipe('achiote-lime-grilled-boneless-chicken', 2);
  const bbq = buildRecipe('sauce-heavy-bbq-boneless-chicken', 2);

  // They are the same cut of meat, so the shopping line must name what you
  // actually buy — identically for both.
  const buys = 'boneless, skinless chicken thighs';
  assert.match(achiote.ingredients[0].items[0], new RegExp(buys));
  assert.match(bbq.ingredients[0].items[0], new RegExp(buys));

  // But the picker lists cut.name, so those must differ or the dropdown
  // shows the same entry twice with no way to choose between them.
  assert.notEqual(achiote.cut.name, bbq.cut.name);
  assert.notEqual(achiote.title, bbq.title);
  assert.notEqual(achiote.photo, bbq.photo);
  for (const r of [achiote, bbq]) {
    assert.equal(r.protein, 'Poultry');
    assert.deepEqual(r.internal, [165]);
    assert.match(r.finish, /165/);
  }
});

test('the achiote marinade is capped, and says why', () => {
  const recipe = buildRecipe('achiote-lime-grilled-boneless-chicken', 2);

  // Acid works on the surface only, so a longer soak buys texture damage
  // rather than flavour. The cap is the point of the recipe.
  assert.match(recipe.steps[0].cue, /20|30/);
  assert.match(recipe.steps[0].body, /no more|no longer/i);
  assert.match(recipe.steps[0].body, /overnight/i);
  assert.match(cookingScience(recipe.cut).title, /acid|surface/i);

  // Marinade that held raw chicken is not a sauce.
  const steps = recipe.steps.map((s) => s.body).join(' ');
  assert.match(steps, /not a sauce|excess run off|shake off/i);
});

test('the BBQ sauce is split before it meets raw chicken', () => {
  const recipe = buildRecipe('sauce-heavy-bbq-boneless-chicken', 2);
  const steps = recipe.steps.map((s) => s.body).join(' ');

  // Half is a table sauce and half is a brushing sauce. If those two ever
  // meet, the table half stops being safe, so the split is stated up front
  // and the clean half is named again when it finally goes on.
  assert.match(recipe.steps[0].body, /divide|split|half/i);
  assert.match(recipe.steps[0].body, /separate brush|two brush/i);
  assert.match(
    steps,
    /never met the raw-chicken brush|set aside at the start/i,
  );

  // Sauce goes on late because it is mostly sugar.
  assert.match(steps, /150|155/, 'it is sauced only near the end');
  assert.match(recipe.finish, /under the glaze/i);
  assert.match(cookingScience(recipe.cut).body, /sugar/i);
});
