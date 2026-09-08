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
} = config;

test('four proteins, twelve unique cuts, and matching defaults', () => {
  assert.equal(cuts.length, 12);
  assert.equal(new Set(cuts.map((c) => c.id)).size, 12);
  for (const protein of ['Beef', 'Pork', 'Poultry', 'Fish']) {
    assert.equal(cuts.filter((c) => c.protein === protein).length, 3);
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
    assert.ok(
      base.ingredients
        .flatMap((g) => g.items)
        .some((item) => item.includes('mustard')),
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
      assert.ok(
        recipe.steps[0].body.includes(
          recipe.ingredients[0].items[1].split(' total')[0],
        ),
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
  const small = buildRecipe('pork-shoulder', 4);
  const regular = buildRecipe('pork-shoulder', 8);
  assert.equal(
    small.ingredients[0].items[1],
    '9.07 g kosher salt total for the meat — use once, not again in the rub',
  );
  assert.equal(
    regular.ingredients[0].items[1],
    '18.14 g kosher salt total for the meat — use once, not again in the rub',
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
  for (const cut of cuts.filter((c) => c.protein === 'Fish')) {
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
