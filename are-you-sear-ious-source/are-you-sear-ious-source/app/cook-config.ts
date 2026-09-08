import {
  recipes,
  type Attribution,
  type Protein,
  type Recipe,
  type Step,
  type Temperatures,
} from './recipes';

export type WeightUnit = 'lb' | 'kg';
export type Cut = {
  id: string;
  protein: Protein;
  name: string;
  baseId: string;
  baseLb: number;
  minLb: number;
  maxLb: number;
  method: string;
  grill: Temperatures;
  internal: Temperatures;
  time: string;
  rest: string;
  timing: string;
  /**
   * Per-cut headline and blurb. These used to be chosen by protein, so all
   * three fish and both lean pork cuts read identically. They belong to the
   * cut, not the family.
   */
  headline: [string, string];
  description: string;
  /**
   * The name as it reads inside a sentence. Titles lowercase `name`, which
   * is right for "ribeye steak" and wrong for "New York strip". Set this
   * only where the plain lowercase is wrong.
   */
  midSentenceName?: string;
  family:
    | 'steak'
    | 'shoulder'
    | 'chop'
    | 'tenderloin'
    | 'thigh'
    | 'breast'
    | 'drumstick'
    | 'fish'
    | 'tri-tip';
  /** Set only on cuts adapted from a published recipe. */
  attribution?: Attribution;
};
export const cuts: Cut[] = [
  {
    id: 'pepper-ribeye',
    protein: 'Beef',
    name: 'Ribeye steak',
    baseId: 'pepper-ribeye',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Reverse sear',
    grill: [225, 250],
    internal: [145],
    time: '35–65 min + rest',
    rest: 'At least 3 minutes',
    timing:
      'For steaks about 1½–2 inches thick. Finish over high direct heat. Thinner steaks cook faster; check early.',
    headline: ['Hard sear.', 'Soft center.'],
    description:
      'A coarse pepper crust and garlic butter on the richest steak here. Warmed through gently first, then seared hard at the very end.',
    family: 'steak',
  },
  {
    id: 'strip-steak',
    protein: 'Beef',
    name: 'New York strip',
    midSentenceName: 'New York strip',
    baseId: 'pepper-ribeye',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Reverse sear',
    grill: [225, 250],
    internal: [145],
    time: '35–65 min + rest',
    rest: 'At least 3 minutes',
    timing:
      'For steaks about 1½–2 inches thick. Total batch weight changes seasoning, not minutes per steak.',
    headline: ['Even edge.', 'Clean bite.'],
    description:
      'Leaner and firmer than a ribeye, with its fat running along one edge. Same pepper and garlic butter, same slow warm-up before the sear.',
    family: 'steak',
  },
  {
    id: 'sirloin-steak',
    protein: 'Beef',
    name: 'Top sirloin steak',
    baseId: 'pepper-ribeye',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct, then indirect',
    grill: [400, 450],
    internal: [145],
    time: '12–25 min + rest',
    rest: '5 minutes',
    timing:
      'For steaks about 1 inch thick. Sirloin is lean; probe early and slice against the grain.',
    headline: ['Least fat.', 'Least forgiving.'],
    description:
      'The leanest of the three steaks, so it goes from right to overdone in about a minute. Probe it earlier than you think you need to.',
    family: 'steak',
  },
  {
    id: 'coffee-ancho-tri-tip',
    protein: 'Beef',
    name: 'Tri-tip roast',
    // Points at the ribeye entry only to satisfy the base lookup. Every
    // field of it is replaced below, so no ribeye copy reaches this recipe.
    baseId: 'pepper-ribeye',
    baseLb: 2.25,
    minLb: 1.5,
    maxLb: 12,
    method: 'Direct, then indirect',
    grill: [350, 400],
    internal: [145],
    time: '35–60 min + rest',
    rest: '10–15 minutes',
    timing:
      'For one 2–2½ lb roast: about 20 minutes of prep and 35–60 minutes on the grill, plus a 10–15 minute rest. Seasonings scale with weight, but thickness and the probe decide when it is done.',
    headline: ['Dark crust.', 'Bright finish.'],
    description:
      'Coffee, ancho and a thin mustard coat, with a cold chipotle-lime sauce alongside. Two grain directions in one roast, so read it before the rub hides them.',
    family: 'tri-tip',
    attribution: {
      label: 'Jamie Purviance’s tri-tip roast, published by Weber',
      url: 'https://www.weber.com/US/en/recipes/red-meat/tri-tip-roast/weber-2071757.html',
      note: 'Not affiliated with, endorsed by, or sponsored by Weber-Stephen Products LLC. Adapted rather than reproduced: the rub and sauce proportions are kept, and the method here is rewritten for a gas grill with a mustard binder, an optional dry-brine, and a USDA-guided 145°F finish in place of the original’s lower target. The illustration is AI-generated and is not Weber’s photograph.',
    },
  },
  {
    id: 'pork-shoulder',
    protein: 'Pork',
    name: 'Bone-in pork shoulder',
    baseId: 'pork-shoulder',
    baseLb: 8,
    minLb: 3,
    maxLb: 12,
    method: 'Indirect low heat',
    grill: [250, 275],
    internal: [195, 205],
    time: 'Allow a full day + rest',
    rest: '1–2 hours',
    timing:
      'One shoulder, 3–12 lb. A 7–9 lb shoulder may take 10–16 hours; smaller or larger cuts vary. Weight alone cannot predict the stall.',
    headline: ['Low & slow.', 'Big damn flavor.'],
    description:
      'Deep bark, a little heat, and fall-apart tender. Your all-day cook, built for a gas grill.',
    family: 'shoulder',
  },
  {
    id: 'pork-chop',
    protein: 'Pork',
    name: 'Bone-in pork chops',
    baseId: 'pork-shoulder',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct, then indirect',
    grill: [400, 450],
    internal: [145],
    time: '15–25 min + rest',
    rest: '5 minutes',
    timing:
      'For chops about 1–1½ inches thick. Probe beside the bone without touching it.',
    headline: ['Bone in.', 'Juice kept.'],
    description:
      'A mustard binder and smoked paprika on a thick bone-in chop. Browned over direct heat, then moved off it so the middle can catch up.',
    family: 'chop',
  },
  {
    id: 'pork-tenderloin',
    protein: 'Pork',
    name: 'Pork tenderloin',
    baseId: 'pork-shoulder',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct, then indirect',
    grill: [400, 450],
    internal: [145],
    time: '20–35 min + rest',
    rest: '5–10 minutes',
    timing:
      'For individual tenderloins around 1–1½ lb. This is tenderloin, not the much thicker pork loin roast.',
    headline: ['Quick cook.', 'Easy to miss.'],
    description:
      'The leanest thing on the list and the fastest to dry out. Trim the silverskin, tuck the thin tail under, and pull it the moment it hits temperature.',
    family: 'tenderloin',
  },
  {
    id: 'smoky-chicken',
    protein: 'Poultry',
    name: 'Bone-in chicken thighs',
    baseId: 'smoky-chicken',
    baseLb: 3,
    minLb: 0.5,
    maxLb: 12,
    method: 'Indirect, then crisp',
    grill: [375, 425],
    internal: [175, 185],
    time: '35–50 min + rest',
    rest: '5 minutes',
    timing:
      'For bone-in, skin-on thighs. Check each piece, especially the largest.',
    headline: ['Crisp edges.', 'All the juice.'],
    description:
      'Mustard, paprika and a little brown sugar. Thighs forgive a lot, which makes them the easiest bird on the grill.',
    family: 'thigh',
  },
  {
    id: 'chicken-breast',
    protein: 'Poultry',
    name: 'Boneless chicken breasts',
    baseId: 'smoky-chicken',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct, then indirect',
    grill: [375, 425],
    internal: [165],
    time: '15–25 min + rest',
    rest: '5 minutes',
    timing:
      'For boneless breasts pounded to an even ¾–1 inch. Thick unflattened breasts need longer.',
    headline: ['No margin.', 'Pull it early.'],
    description:
      'Boneless breast has no fat to hide a mistake in. Pound it to an even thickness, watch the probe, and take it off the moment it reaches 165°F.',
    family: 'breast',
  },
  {
    id: 'chicken-drumsticks',
    protein: 'Poultry',
    name: 'Chicken drumsticks',
    baseId: 'smoky-chicken',
    baseLb: 3,
    minLb: 0.5,
    maxLb: 12,
    method: 'Indirect, then crisp',
    grill: [375, 425],
    internal: [175, 185],
    time: '35–50 min + rest',
    rest: '5 minutes',
    timing:
      'For standard bone-in drumsticks. Rotate the pieces for even browning and check away from bone.',
    headline: ['Dark meat.', 'Hard to ruin.'],
    description:
      'Dark meat, plenty of fat, and a bone doing half the work. Drumsticks only improve once they are past the safe minimum.',
    family: 'drumstick',
  },
  {
    id: 'lemon-salmon',
    protein: 'Fish',
    name: 'Skin-on salmon fillets',
    baseId: 'lemon-salmon',
    baseLb: 1.5,
    minLb: 0.25,
    maxLb: 8,
    method: 'Direct medium heat',
    grill: [400, 450],
    internal: [145],
    time: '10–15 min',
    rest: 'About 3 minutes',
    timing:
      'For fillets about 1 inch thick. Cook skin-side down and start checking at 8 minutes.',
    headline: ['Skin down.', 'Leave it be.'],
    description:
      'A light Dijon coat, lemon and a little dill. Start it skin-side down and resist turning it — that skin is what holds the fillet together.',
    family: 'fish',
  },
  {
    id: 'cod-fillet',
    protein: 'Fish',
    name: 'Cod fillets',
    baseId: 'lemon-salmon',
    baseLb: 1.5,
    minLb: 0.25,
    maxLb: 8,
    method: 'Basket over medium heat',
    grill: [375, 425],
    internal: [145],
    time: '8–15 min',
    rest: 'About 3 minutes',
    timing:
      'For fillets about 1 inch thick. A lightly oiled fish basket supports cod’s delicate flakes.',
    headline: ['Delicate.', 'Use a basket.'],
    description:
      'Cod flakes apart if you look at it wrong. A lightly oiled basket is what gets the fillet from the grate to the plate in one piece.',
    family: 'fish',
  },
  {
    id: 'halibut-fillet',
    protein: 'Fish',
    name: 'Halibut fillets',
    baseId: 'lemon-salmon',
    baseLb: 1.5,
    minLb: 0.25,
    maxLb: 8,
    method: 'Direct medium heat',
    grill: [400, 450],
    internal: [145],
    time: '10–18 min',
    rest: 'About 3 minutes',
    timing:
      'For fillets about 1–1½ inches thick. Halibut is lean; check early and lift with a wide spatula.',
    headline: ['Meaty fillet.', 'Check it early.'],
    description:
      'Firm enough to handle the grates, lean enough to dry out fast. The same Dijon and lemon, lifted off the second it reaches temperature.',
    family: 'fish',
  },
];
export const defaultCuts: Record<Protein, string> = {
  Beef: 'pepper-ribeye',
  Pork: 'pork-shoulder',
  Poultry: 'smoky-chicken',
  Fish: 'lemon-salmon',
};
type Measure = { amount: number; unit: string; name: string };
type Group = { title: string; items: (Measure | string)[] };
const m = (amount: number, unit: string, name: string): Measure => ({
  amount,
  unit,
  name,
});
type SeasoningGroup =
  | 'shoulder'
  | 'steak'
  | 'leanPork'
  | 'chicken'
  | 'fish'
  | 'triTip';
const seasonings: Record<SeasoningGroup, Group[]> = {
  shoulder: [
    {
      title: 'Mustard & salt-free rub',
      items: [
        m(3.5, 'tbsp', 'yellow mustard, for a thin binder coat'),
        m(0.25, 'cup', 'packed brown sugar'),
        m(3, 'tbsp', 'smoked paprika'),
        m(2, 'tbsp', 'coarse black pepper'),
        m(1, 'tbsp', 'garlic powder'),
        m(1, 'tbsp', 'onion powder'),
        m(1, 'tsp', 'cayenne, then adjust to taste'),
      ],
    },
    {
      title: 'Spritz & wrap',
      items: [
        m(0.5, 'cup', 'apple cider vinegar, for optional spritz'),
        m(0.5, 'cup', 'apple juice, for optional spritz'),
        m(0.25, 'cup', 'apple juice, for the wrap'),
        'Apple or hickory chips, as your smoker box needs; do not scale with meat weight',
      ],
    },
    {
      title: 'Vinegar finishing sauce',
      items: [
        m(1, 'cup', 'apple cider vinegar'),
        m(2, 'tbsp', 'brown sugar'),
        m(1, 'tbsp', 'hot sauce'),
        m(0.5, 'tsp', 'black pepper'),
        'Cayenne and salt, to taste after mixing the sauce',
      ],
    },
  ],
  steak: [
    {
      title: 'Mustard & seasoning',
      items: [
        m(2, 'tsp', 'Dijon mustard, for a very thin binder coat'),
        m(2, 'tsp', 'coarse black pepper'),
        m(1, 'tsp', 'garlic powder'),
      ],
    },
    {
      title: 'Garlic butter',
      items: [
        m(2, 'tbsp', 'unsalted butter, softened'),
        m(1, 'tsp', 'finely grated fresh garlic'),
        m(1, 'tsp', 'chopped parsley'),
        m(1, 'tsp', 'lemon juice'),
      ],
    },
  ],
  leanPork: [
    {
      title: 'Mustard & seasoning',
      items: [
        m(1.5, 'tbsp', 'Dijon mustard'),
        m(2, 'tsp', 'smoked paprika'),
        m(1, 'tsp', 'garlic powder'),
        m(1, 'tsp', 'black pepper'),
        m(0.5, 'tsp', 'dried thyme'),
      ],
    },
    {
      title: 'Finish',
      items: [m(1, 'tbsp', 'unsalted butter'), m(2, 'tsp', 'lemon juice')],
    },
  ],
  chicken: [
    {
      title: 'Mustard & salt-free rub',
      items: [
        m(2, 'tbsp', 'yellow or Dijon mustard'),
        m(2, 'tsp', 'smoked paprika'),
        m(1, 'tsp', 'garlic powder'),
        m(1, 'tsp', 'black pepper'),
        m(2, 'tsp', 'brown sugar'),
        m(0.5, 'tsp', 'cayenne, optional'),
        m(0.25, 'cup', 'barbecue sauce, optional; brush on near the end'),
      ],
    },
  ],
  fish: [
    {
      title: 'Dijon & lemon',
      items: [
        m(1.5, 'tbsp', 'Dijon mustard'),
        m(0.5, 'tsp', 'black pepper'),
        m(0.5, 'tsp', 'garlic powder'),
        m(1, 'tsp', 'lemon zest'),
        m(1, 'tbsp', 'lemon juice'),
        m(1, 'tbsp', 'fresh dill, chopped'),
        'Neutral oil, just enough for the grates or fish basket; mustard remains the binder',
      ],
    },
  ],
  // The only bespoke set: this cut came from a published recipe rather than
  // the app's own template, so its rub and sauce are listed as given and
  // scale with weight like every other group.
  triTip: [
    {
      title: 'Mustard binder',
      items: [
        m(1, 'tbsp', 'yellow or Dijon mustard, just enough for a thin coat'),
      ],
    },
    {
      title: 'Coffee–ancho rub · salt already counted above',
      items: [
        m(1, 'tbsp', 'ground dark-roast coffee, finely ground; not brewed'),
        m(1, 'tbsp', 'packed light brown sugar'),
        m(1, 'tbsp', 'ancho chile powder'),
        m(2, 'tsp', 'ground cumin'),
        m(1, 'tsp', 'smoked paprika'),
      ],
    },
    {
      title: 'Chipotle-lime sauce · served cold, alongside',
      items: [
        m(1, 'cup', 'plain whole-milk yogurt or sour cream'),
        m(
          2,
          'tbsp',
          'adobo sauce from canned chipotles; the sauce, not the peppers',
        ),
        m(1, 'clove(s)', 'fresh garlic, finely minced or pressed'),
        m(1, 'tbsp', 'fresh lime juice'),
        m(0.5, 'tsp', 'ground cumin'),
        m(0.25, 'tsp', 'kosher salt for the sauce only; not the meat salt'),
        m(0.125, 'tsp', 'black pepper'),
      ],
    },
  ],
};
export function fromLb(lb: number, unit: WeightUnit) {
  return unit === 'lb' ? lb : lb * 0.45359237;
}
export function toLb(value: number, unit: WeightUnit) {
  return unit === 'lb' ? value : value / 0.45359237;
}
export function numberLabel(value: number) {
  return Number(value.toFixed(2)).toString();
}
/**
 * Whether amountLabel can render this as a fraction rather than falling back
 * to decimals. Kept next to it so the two cannot drift apart.
 */
function printsAsFraction(value: number) {
  return value >= 0.125 && Math.abs(value - Math.round(value * 8) / 8) < 0.025;
}
function amountLabel(value: number) {
  const eighths = Math.round(value * 8);
  if (value >= 0.125 && Math.abs(value - eighths / 8) < 0.025) {
    const whole = Math.floor(eighths / 8),
      fraction = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'][eighths % 8];
    return (
      (whole ? String(whole) : '') + (whole && fraction ? ' ' : '') + fraction
    );
  }
  return numberLabel(value);
}
export function measured(item: Measure, scale: number) {
  let v = item.amount * scale,
    u = item.unit;
  if (u === 'cup' && v < 0.25) {
    v *= 16;
    u = 'tbsp';
  }
  if (u === 'tbsp' && v < 1) {
    v *= 3;
    u = 'tsp';
  }
  // Scaling up used to stop here, so a large batch read "12 tbsp butter".
  // Climb back the other way for the same reason we climb down, but only
  // when the larger unit lands on a fraction that prints: 12 tbsp is better
  // read as a clean cup measure, while 4 tsp would turn into "1.33 tbsp",
  // which is worse than what it replaced. The order is safe because the
  // rules above only fire below these thresholds, so a value cannot
  // oscillate between two units.
  if (u === 'tsp' && v >= 3 && printsAsFraction(v / 3)) {
    v /= 3;
    u = 'tbsp';
  }
  if (u === 'tbsp' && v >= 8 && printsAsFraction(v / 16)) {
    v /= 16;
    u = 'cup';
  }
  return amountLabel(v) + ' ' + u + ' ' + item.name;
}
/**
 * Grams per teaspoon for the two common US kosher salts. They differ by
 * nearly a factor of two because of crystal shape, which is exactly why the
 * app weighs salt instead of spooning it.
 */
const KOSHER_SALT_G_PER_TSP = { Morton: 4.8, 'Diamond Crystal': 2.84 };
/**
 * Walks a teaspoon count up into tablespoons and cups where that helps, and
 * snaps to what a measuring set can actually hit. An unrounded "0.94 tsp" is
 * no use to somebody who reached for spoons because they have no scale.
 */
export function spoonLabel(tsp: number) {
  const quarters = Math.round(tsp * 4);
  if (quarters < 1) return 'a pinch';
  if (quarters < 12) return amountLabel(quarters / 4) + ' tsp';
  const tbsp = quarters / 12;
  if (tbsp < 8) return amountLabel(Math.round(tbsp * 4) / 4) + ' tbsp';
  // An eighth of a cup is 2 tbsp, which is still a real measure.
  return amountLabel(Math.round((tbsp / 16) * 8) / 8) + ' cup';
}
/**
 * A volume equivalent for a weighed salt amount, for when there is no scale
 * at the grill. Both brands are given because quoting one number would be
 * wrong by about 70% for whoever owns the other box. The grams stay the
 * authoritative figure; this is the fallback, and it says so.
 */
export function saltVolumes(grams: number) {
  return Object.entries(KOSHER_SALT_G_PER_TSP)
    .map(([brand, perTsp]) => spoonLabel(grams / perTsp) + ' ' + brand)
    .join(' or ');
}
export function validateWeight(cut: Cut, value: number) {
  return (
    Number.isFinite(value) &&
    value >= cut.minLb - 1e-6 &&
    value <= cut.maxLb + 1e-6
  );
}
export type ConfiguredRecipe = Recipe & {
  cut: Cut;
  weightLb: number;
  sizeLabel: string;
  scale: number;
  timingNote: string;
  photo: string;
  photoAlt: string;
  photoCaption: string;
  ingredients: Recipe['ingredients'];
};
export function buildRecipe(
  cutId: string,
  weightLb: number,
  weightUnit: WeightUnit = 'lb',
): ConfiguredRecipe {
  const cut = cuts.find((c) => c.id === cutId);
  if (!cut) throw new Error('Unknown cut');
  if (!validateWeight(cut, weightLb))
    throw new Error('Weight outside supported range');
  const base = recipes.find((r) => r.id === cut.baseId)!;
  const f = cut.family;
  const midName = cut.midSentenceName ?? cut.name.toLowerCase();
  const scale = weightLb / cut.baseLb;
  const sizeLabel =
    numberLabel(fromLb(weightLb, weightUnit)) + ' ' + weightUnit;
  const saltGrams = weightLb * 453.59237 * 0.005;
  const salt = numberLabel(saltGrams) + ' g kosher salt';
  // Only the shopping line carries the spoon equivalents; the step bodies
  // interpolate `salt` and would turn unreadable with them inlined.
  const saltLine =
    salt +
    ' (no scale? about ' +
    saltVolumes(saltGrams) +
    ') total for the meat — use once, not again in the rub';
  const group: SeasoningGroup =
    f === 'tri-tip'
      ? 'triTip'
      : f === 'shoulder'
        ? 'shoulder'
        : f === 'steak'
          ? 'steak'
          : f === 'chop' || f === 'tenderloin'
            ? 'leanPork'
            : f === 'fish'
              ? 'fish'
              : 'chicken';
  const ingredients = [
    {
      title: 'Your meat & salt',
      items: [sizeLabel + ' ' + midName, saltLine],
    },
    ...seasonings[group].map((g) => ({
      title: g.title,
      items: g.items.map((i) =>
        typeof i === 'string' ? i : measured(i, scale),
      ),
    })),
  ];
  const safety =
    cut.protein === 'Poultry'
      ? 'Chicken must reach 165°F in every piece. Thighs and drumsticks can go higher for tenderness.'
      : cut.protein === 'Fish'
        ? 'Fish must reach 145°F in its thickest part before it leaves the grill.'
        : cut.protein === 'Beef'
          ? 'Whole beef cuts — steaks, roasts and chops alike: at least 145°F before removal, followed by a 3-minute rest.'
          : 'Whole pork: at least 145°F before removal, followed by a 3-minute rest.';
  const finish =
    f === 'tri-tip'
      ? 'Reach at least 145°F in the thickest part before it leaves the grill, then rest 10–15 minutes. Three minutes is the safety minimum; the rest of it is for the slicing.'
      : f === 'shoulder'
        ? 'Pull-apart target: 195–205°F. Probe several thick spots; finish when it slides in with almost no resistance.'
        : f === 'thigh' || f === 'drumstick'
          ? 'For tender dark meat, aim for 175–185°F. The poultry safety minimum is 165°F.'
          : cut.protein === 'Poultry'
            ? 'Reach 165°F in the thickest part of every breast.'
            : cut.protein === 'Fish'
              ? 'Reach 145°F at the center of the thickest part.'
              : 'Reach 145°F before removing from heat, then rest at least 3 minutes.';
  const prepTime =
    f === 'tri-tip'
      ? '4–24 hr ahead, optional'
      : f === 'shoulder'
        ? '12–24 hr ahead, optional'
        : cut.protein === 'Poultry'
          ? '2–12 hr ahead, optional'
          : f === 'fish'
            ? 'Just before cooking'
            : '2–4 hr ahead, optional';
  const steps: [Step, ...Step[]] = [
    {
      title:
        f === 'fish'
          ? 'Season lightly'
          : f === 'tri-tip'
            ? 'Map the grain. Salt once.'
            : 'Salt ahead. Mustard later.',
      cue: prepTime,
      body:
        f === 'fish'
          ? `Pat the fish dry and remove pin bones. Use the listed ${salt} across the batch, then brush the flesh with Dijon and add the pepper, garlic, and zest. Keep it refrigerated until the grill is ready.`
          : f === 'tri-tip'
            ? `Before anything goes on the meat, find where the grain changes direction and note it — the rub will hide it, and you need it again at the end. Trim silverskin and hard fat without cutting away good meat. Spread the listed ${salt} over the whole roast and refrigerate it uncovered on a rack for 4–24 hours if you have the time. That is the entire salt allowance for the meat, not an extra brine on top of the rub. Cooking now instead? Apply the same salt just before the mustard. For enhanced, injected, koshered, or already-salted beef, skip this added salt.`
            : `Use the listed ${salt} once across the meat. Refrigerate on a rack ${f === 'shoulder' ? '12–24 hours' : cut.protein === 'Poultry' ? '2–12 hours' : '2–4 hours'} if time allows. Just before grilling, pat any wet patches dry, add a thin mustard coat, and apply the salt-free rub. If cooking immediately, apply the same measured salt just before the mustard and rub. For injected, enhanced, koshered, or already salted meat, skip the added dry-brine salt.`,
    },
  ];
  if (f === 'shoulder')
    steps.push(
      {
        title: 'Set up the unlit zone',
        cue: 'Grill ambient: 250–275°F',
        body: 'Use your chosen burner layout to leave enough unlit space for the whole shoulder. Stabilize the air temperature near the meat at grate level. Place a drip pan below it without obstructing airflow. Put dry wood chips in a smoker box positioned only where your grill manufacturer permits; never on a burner tube.',
      },
      {
        title: 'Build the bark',
        cue: 'Light smoke early · watch the surface',
        body: 'Place the shoulder over unlit burners with the fat cap toward the strongest heat. Keep the lid closed and replenish the smoke box as needed for the first 3–4 hours. After that, spritz dry-looking patches only if needed, at most hourly. Expect a stall around 150–170°F; a steady grill and patience matter more than a clock.',
      },
      {
        title: 'Wrap the set bark',
        cue: 'Usually 160–175°F internally',
        body: `Once the bark is dark and firmly attached, wrap tightly in two layers of heavy foil with ${measured(m(0.25, 'cup', 'apple juice'), scale)} from the wrap ingredients. Return to 250–275°F indirect heat. Once wrapped, a 275°F oven can finish the job too.`,
      },
      {
        title: 'Probe for tenderness',
        cue: 'Usually 195–205°F',
        body: 'Start checking at 195°F in several thick spots away from bone. Keep cooking if the probe still meets resistance; even 203°F is not a guarantee. A 7–9 lb shoulder often takes 10–16 hours total. Build in extra time for the stall and rest; do not multiply that time by the ingredient scale.',
      },
      {
        title: 'Rest, pull, and season',
        cue: 'Rest 1–2 hr · hot hold at 140°F or above',
        body: 'Vent the wrap for about 10 minutes, then rewrap and rest in an insulated cooler or low oven. Check the meat stays at least 140°F while hot holding. Pull the pork, discard large fat pockets, and fold in defatted juices. Mix the listed sauce ingredients, then add to the meat a little at a time. Refrigerate leftovers within 2 hours after hot holding ends, or 1 hour if the air is above 90°F.',
      },
    );
  else if (f === 'tri-tip')
    steps.push(
      {
        title: 'Mustard, then the coffee rub',
        cue: 'About 5 min · a thin coat is plenty',
        body: 'Mix the coffee, brown sugar, ancho, cumin, and paprika in a clean bowl. Pat any wet patches on the roast dry, brush on the measured mustard, and press the rub over every surface. No further salt goes on the meat if you already used it. Use enough rub to cover without building a paste, and throw away whatever touched raw beef. Keep the roast in the refrigerator while the grill comes up to heat.',
      },
      {
        title: 'Stir the sauce, then chill it',
        cue: 'About 5 min · keep it cold until serving',
        body: 'Whisk the yogurt or sour cream with the measured adobo sauce, garlic, lime juice, cumin, sauce salt, and pepper. Taste it with a clean spoon and adjust. If your scaled amount asks for part of a garlic clove, mince a whole one and use what looks right. Keep this well away from the raw beef and refrigerated until the roast is sliced.',
      },
      {
        title: 'Set a hot zone and an unlit one',
        cue: 'Grill ambient: 350–400°F · lid closed',
        body: 'Follow your grill’s lighting sequence, preheat, and clean the grates. You choose which burners stay lit, but leave an unlit area big enough for the whole roast. Read the air beside the food with a grate-level thermometer and settle it at 350–400°F; burner knob positions are not temperatures. Plan to keep the thin tip of the roast over the gentler side.',
      },
      {
        title: 'Set the crust over direct heat',
        cue: 'About 8–10 min total · turn and watch it',
        body: 'Brown the roast over the lit burners, turning about halfway through and more often if the rub darkens fast. Keep the lid closed between checks. Coffee and ancho are already dark and brown sugar scorches, so this rub looks done long before the meat is — you are after a set, aromatic crust, not a black one. Move it to the unlit side straight away if flames flare or the surface gets ahead of the center.',
      },
      {
        title: 'Finish over the unlit burners',
        cue: 'Ambient 350–400°F · internal at least 145°F',
        body: 'Move the roast fully off the lit burners and close the lid, holding 350–400°F near the meat. Start probing after about 15 minutes of indirect cooking, then every few minutes as it closes in. Go in from the side, into the thickest part, and check more than one spot. Take it off only once it reads at least 145°F; resting is not a way to make up the difference. A 2–2½ lb roast usually takes 35–60 minutes in total, longer if it is thick. Never multiply that by the ingredient scale.',
      },
      {
        title: 'Rest, rotate, and slice both grains',
        cue: 'Rest 10–15 min · 3 minutes is the safety minimum',
        body: 'Rest the roast on a clean board for 10–15 minutes, tented loosely if you like. Now use the note you made at the start: a tri-tip’s fibres run two different ways, so cut the roast apart where the grain turns, rotate each piece, and slice each one thinly across its own fibres. Slicing the whole triangle one way leaves half of it chewy. Serve the cold sauce beside the beef, not over it. Refrigerate leftovers within 2 hours, or within 1 hour if it is above 90°F outside.',
      },
    );
  else if (f === 'steak') {
    const reverse = cut.method === 'Reverse sear';
    steps.push(
      {
        title: reverse ? 'Warm the center gently' : 'Set up two zones',
        cue: reverse
          ? 'Indirect ambient: 225–250°F'
          : 'Grill ambient: 400–450°F',
        body: reverse
          ? 'Choose which burners stay lit and place the steaks over unlit burners. Keep the grill near 225–250°F and turn the steaks occasionally. Begin probing after 20 minutes. When the center is around 120–125°F, move the steaks to a clean plate while you heat the searing zone. This is an intermediate temperature, not the serving target.'
          : 'Preheat and clean the grill. Leave a cool area using the burners you choose. Sear the steaks on the hot side for about 2–4 minutes per side, checking early if thinner than 1 inch.',
      },
      {
        title: reverse ? 'Finish with a hard sear' : 'Finish gently',
        cue: reverse
          ? 'Direct sear: about 450–550°F'
          : 'Move to indirect heat as needed',
        body: reverse
          ? 'Turn up your selected searing burners and let the grates heat. Pat the steaks dry if needed, then sear, turning every 30–60 seconds. Stop when the crust is brown and the center has reached at least 145°F. If the crust finishes first, move to indirect heat until the center reaches that target.'
          : 'Once a crust develops, move the steaks over unlit burners. Check the center from the side and finish to at least 145°F before removing. Avoid probing fat or bone.',
      },
      {
        title: 'Add the garlic butter',
        cue: 'Rest at least 3 min',
        body: 'Combine the listed softened butter, grated garlic, parsley, and lemon juice. Add it after searing so the garlic does not scorch. Rest at least 3 minutes, then slice across the grain.',
      },
    );
  } else if (f === 'chop' || f === 'tenderloin')
    steps.push(
      {
        title: 'Prep your cut and zones',
        cue: 'Grill ambient: 400–450°F',
        body:
          f === 'tenderloin'
            ? 'Remove silverskin and tuck the thin tail under for a more even shape. Preheat and clean the grates. Use your chosen burners to create direct heat and an unlit finishing area.'
            : 'Trim hanging fat and preheat the grill. Clean the grates and reserve an unlit finishing area with your chosen burner layout.',
      },
      {
        title: 'Brown, then finish',
        cue: cut.time,
        body:
          f === 'tenderloin'
            ? 'Brown each side over direct heat, turning every few minutes, then move to indirect heat. Start checking around 15 minutes. Finish when the thickest part reaches 145°F; check each tenderloin separately.'
            : 'Brown over direct heat for roughly 3–4 minutes per side, then move to the unlit zone as needed. Start checking at 10 minutes. Cook the thickest part to 145°F, keeping the probe clear of the bone.',
      },
      {
        title: 'Rest and slice',
        cue: 'At least 3 min · 5 min is useful',
        body: 'Remove only after reaching 145°F. Rest at least 3 minutes, then finish with the listed butter and lemon juice. Slice tenderloin into medallions; serve chops whole or cut off the bone.',
      },
    );
  else if (f === 'thigh' || f === 'breast' || f === 'drumstick')
    steps.push(
      {
        title: 'Prep for even cooking',
        cue: 'Grill ambient: 375–425°F',
        body:
          f === 'breast'
            ? 'Pound the thick ends of boneless breasts to an even ¾–1 inch. Preheat and clean the grill; leave an unlit area using your chosen burners.'
            : 'Trim loose skin and fat. Preheat and clean the grill. Leave enough room over unlit burners for the chicken without crowding it. Do not rinse raw chicken.',
      },
      {
        title:
          f === 'breast'
            ? 'Brown, then move off the flame'
            : 'Roast on the cool side',
        cue: cut.time,
        body:
          f === 'breast'
            ? 'Brown over direct heat for about 3–5 minutes per side. Transfer to the unlit zone whenever the outside is sufficiently browned. Begin checking the thickest part at about 12 minutes; stop only after every breast reaches 165°F.'
            : `Cook over unlit burners, ${f === 'thigh' ? 'skin-side up' : 'rotating the drumsticks occasionally'}, with the lid closed. Begin probing after 25 minutes. Each piece must pass 165°F; continue toward 175–185°F for tender dark meat.`,
      },
      {
        title: f === 'breast' ? 'Glaze lightly' : 'Crisp the skin',
        cue:
          f === 'breast'
            ? 'Internal finish: 165°F'
            : 'Internal finish: 175–185°F',
        body:
          f === 'breast'
            ? 'If using barbecue sauce, brush it on during the last few minutes over indirect heat. Check every piece rather than assuming they finish together.'
            : 'Once nearly done, briefly brown the skin over moderate direct heat, turning and watching closely for flare-ups. Move back to the cool zone as needed. Sweet sauce goes on only during the last few minutes.',
      },
      {
        title: 'Rest on a clean platter',
        cue: 'Rest 5 min',
        body: 'Use clean utensils to transfer the cooked chicken. Rest 5 minutes and serve. This timing assumes individual pieces, not a whole bird.',
      },
    );
  else
    steps.push(
      {
        title: 'Support the fish',
        cue: `Grill ambient: ${cut.grill.join('–')}°F`,
        body:
          cut.id === 'cod-fillet'
            ? 'Preheat a clean grill and lightly oil a fish basket. Cod breaks easily, so keep it supported throughout cooking. Leave an unlit area available.'
            : 'Preheat and clean the grates, then lightly oil the cooking surface or a fish basket. Leave an unlit area available so you can move the fish if it browns too quickly.',
      },
      {
        title: 'Cook with a light touch',
        cue: cut.time,
        body:
          cut.id === 'lemon-salmon'
            ? 'Cook skin-side down with the lid closed; flipping is usually unnecessary. Begin checking the thickest part at 8 minutes. Move to the unlit zone if the skin is getting too dark.'
            : `Cook the ${cut.id === 'cod-fillet' ? 'basket over moderate direct heat, turning the basket carefully once' : 'fillets over medium direct heat, turning once only when they release easily'}. Start checking at about 8 minutes. Finish over the unlit zone if the exterior is browning too quickly.`,
      },
      {
        title: 'Probe and brighten',
        cue: 'Internal finish: 145°F',
        body:
          'Probe the center of the thickest part from the side. Reach 145°F before removal. Lift with a wide spatula, rest briefly, and finish with the measured lemon juice and dill.' +
          (cut.id === 'lemon-salmon'
            ? ' A little white albumin on salmon is edible protein, not a doneness test.'
            : ''),
      },
    );
  const title =
    f === 'tri-tip'
      ? 'Coffee–ancho tri-tip with chipotle-lime sauce'
      : f === 'shoulder'
        ? base.title
        : f === 'steak'
          ? 'Pepper & garlic ' + midName
          : f === 'chop' || f === 'tenderloin'
            ? 'Smoky Dijon ' + midName
            : cut.protein === 'Poultry'
              ? 'Smoky mustard ' + midName
              : 'Dijon & lemon ' + midName;
  const portionLb =
    f === 'tri-tip'
      ? 0.45
      : f === 'shoulder'
        ? 0.6
        : cut.protein === 'Poultry' && f !== 'breast'
          ? 0.75
          : cut.protein === 'Fish'
            ? 0.375
            : 0.5;
  const photo = '/meals/' + cut.id + '.webp';
  const photoCaption = cut.name;
  return {
    ...base,
    id: cut.id,
    protein: cut.protein,
    title,
    description: cut.description,
    headline: cut.headline,
    cut,
    weightLb,
    sizeLabel,
    scale,
    timingNote: cut.timing,
    photo,
    photoAlt: photoCaption + ' with a browned exterior on a dark serving board',
    photoCaption,
    ingredients,
    steps,
    grill: cut.grill,
    internal: cut.internal,
    method: cut.method,
    time: cut.time,
    rest: cut.rest,
    finish,
    safety,
    serves: String(Math.max(1, Math.round(weightLb / portionLb))),
    wood:
      f === 'tri-tip'
        ? 'Coffee & ancho carry it · no wood needed'
        : f === 'shoulder'
          ? 'Apple + hickory'
          : cut.protein === 'Poultry'
            ? 'Apple, optional'
            : 'No smoke needed',
    tip:
      f === 'tri-tip'
        ? 'Find the grain before the rub hides it, keep the thin end away from the hottest burner, and serve the sauce cold and beside the meat.'
        : f === 'shoulder'
          ? base.tip
          : 'Ingredient amounts scale with total raw weight. Cooking time depends on individual thickness, airflow, and the actual heat near the food.',
    attribution: cut.attribution,
  };
}

export type Science = { title: string; body: string; takeaway: string };
export const dryBrineScience: Science = {
  title: 'What dry-brining actually does',
  body: 'Salt dissolves in moisture on the surface, then its ions diffuse into the meat. It changes muscle proteins in ways that help them retain more water during cooking. Given time in the refrigerator, you get seasoning below the surface and a drier exterior that browns more readily.',
  takeaway:
    'Measure the salt once. Refrigerate while it works. A mustard binder and salt-free rub go on later.',
};
export const zoneScience: Science = {
  title: 'An OFF burner is still a cooking zone',
  body: 'Radiant heat from a lit burner browns the surface intensely. Away from that flame, hot air and surrounding surfaces heat the food more gently. An unlit section lets you control the outside and center separately; its actual temperature still needs a thermometer.',
  takeaway:
    'Choose the burners that fit your grill. Measure beside the food instead of treating knob position as a temperature.',
};
export function cookingScience(cut: Cut): Science {
  if (cut.family === 'tri-tip')
    return {
      title: 'This crust will lie to you about doneness',
      body: 'Ground coffee and ancho are close to black before they meet any heat, and the brown sugar beside them starts caramelising long before the middle of a roast is warm. So this rub reaches the colour you are looking for earlier than almost anything else here, while the center is still cool. On most cuts a dark exterior is at least weak evidence of progress. On this one it is none.',
      takeaway:
        'Judge the crust by smell and by whether it has set, not by how dark it looks. Then move it to the unlit side and let the probe say when it is done.',
    };
  if (cut.family === 'shoulder')
    return {
      title: 'The stall is evaporative cooling',
      body: 'As surface water evaporates, it carries heat away. For a while, that cooling can offset the heat entering a pork shoulder, and the probe barely moves. Collagen breakdown is happening too, but it is not the main cause of the stall.',
      takeaway:
        'Foil reduces evaporation and speeds the cook, but softens bark. Wrap after the bark is set.',
    };
  if (cut.id === 'lemon-salmon')
    return {
      title: 'That white stuff on salmon?',
      body: 'The pale material that can appear on cooked salmon is albumin, a protein. It is edible. Its appearance varies and does not reliably tell you whether the center has reached a safe temperature.',
      takeaway:
        'Use a probe in the thickest part; finish this recipe at 145°F.',
    };
  if (cut.protein === 'Fish')
    return {
      title: 'Brown the outside, check the center',
      body: 'Maillard reactions create browned flavor at the hot surface. The center can still be behind, especially in a thick fillet. A browned exterior is not evidence that the fish has reached its internal target.',
      takeaway:
        'Move to the unlit zone if the surface is ready first. Probe the center and finish at 145°F.',
    };
  if (cut.protein === 'Poultry')
    return {
      title: 'Skin needs a different finish',
      body: 'Chicken skin browns and renders better with more heat than a long, low smoking session usually provides. A brief finish over direct heat can crisp it after the interior is almost ready. Sweet sauces can scorch during that finish.',
      takeaway:
        cut.family === 'breast'
          ? 'Skinless breasts do not need a skin-crisping step. Finish at 165°F and keep the sauce away from hard flame.'
          : 'Brown the skin late and watch closely. Check each piece with a thermometer.',
    };
  return {
    title: 'A sear makes flavor, not a seal',
    body: 'Heat drives reactions between amino acids and reducing sugars at the meat’s surface. These Maillard reactions create the savory aromas and brown crust we love. A wet surface spends more energy evaporating water, which slows browning; a crust does not seal juices inside.',
    takeaway:
      'Pat the surface dry and use only a thin mustard coat. Add finishing butter after the sear.',
  };
}

export type BurnerLevel = 'off' | 'lo' | 'med' | 'hi';
export const burnerLevels: BurnerLevel[] = ['off', 'lo', 'med', 'hi'];
export const burnerLevelLabels: Record<BurnerLevel, string> = {
  off: 'OFF',
  lo: 'LO',
  med: 'MED',
  hi: 'HI',
};

// Relative heat output per setting. A gas burner's usable turndown is roughly
// 3:1, so LO is about a third of HI rather than a tenth of it.
export const burnerOutput: Record<BurnerLevel, number> = {
  off: 0,
  lo: 0.33,
  med: 0.62,
  hi: 1,
};

/** Mean burner output across the whole grill, 0-1. */
export function heatFraction(levels: readonly BurnerLevel[]) {
  if (!levels.length) return 0;
  return (
    levels.reduce((sum, level) => sum + burnerOutput[level], 0) / levels.length
  );
}

// Lid-closed chamber temperature rises roughly linearly with total heat input
// over a gas grill's usable range. Anchored so one of three burners on MED
// lands in the 250-275F low-and-slow window and everything on HI reaches 570F.
const AMBIENT_FLOOR = 180;
const AMBIENT_SPAN = 390;
/** Refrigerated starting temperature, in Fahrenheit. */
const START_F = 40;
/** Below this margin above the target the estimate stops being meaningful. */
const MIN_DRIVING_F = 15;

/** Rough lid-closed ambient for a burner layout, or null if nothing is lit. */
export function estimatedAmbient(levels: readonly BurnerLevel[]) {
  const fraction = heatFraction(levels);
  if (fraction <= 0) return null;
  return Math.round(AMBIENT_FLOOR + AMBIENT_SPAN * fraction);
}

/** The stated cook window in minutes, or null when the copy has no range. */
export function parseMinutes(time: string): [number, number] | null {
  const match = time.match(/(\d+)\s*[\u2013-]\s*(\d+)\s*(min|hr)/);
  if (!match) return null;
  const scale = match[3] === 'hr' ? 60 : 1;
  return [Number(match[1]) * scale, Number(match[2]) * scale];
}

export function formatMinutes(total: number) {
  const minutes = Math.max(1, Math.round(total));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round((minutes % 60) / 5) * 5;
  if (rest === 0 || rest === 60) return `${hours + (rest === 60 ? 1 : 0)} hr`;
  return `${hours} hr ${rest} min`;
}

export type HeatEstimate =
  | { kind: 'unlit' }
  | { kind: 'tooCool'; ambient: number; target: number }
  | {
      kind: 'scaled';
      ambient: number;
      target: number;
      nominal: number;
      factor: number;
      clamped: boolean;
      window: [number, number] | null;
    };

// Heating a cold mass in a hot chamber follows Newton's law of cooling, so the
// time to reach a target internal temperature goes as
//   t = tau * ln((ambient - start) / (ambient - target))
// The thermal time constant tau depends on the cut's mass and shape, but it
// cancels when comparing two ambients -- which is all this estimate needs.
function heatingTime(ambient: number, target: number) {
  return Math.log((ambient - START_F) / (ambient - target));
}

const MIN_FACTOR = 0.4;
const MAX_FACTOR = 6;

/**
 * Estimates how a burner layout changes the stated cook time. This is a
 * planning aid only: it models chamber ambient, not the radiant heat of a
 * direct sear, and it does not model the evaporative stall on a shoulder.
 * Doneness is still decided by a probe.
 */
export function cookTimeEstimate(
  cut: Cut,
  levels: readonly BurnerLevel[],
): HeatEstimate {
  const ambient = estimatedAmbient(levels);
  if (ambient === null) return { kind: 'unlit' };

  const target = cut.internal[0];
  const nominal = Math.round(
    cut.grill.reduce((sum, value) => sum + value, 0) / cut.grill.length,
  );
  if (ambient < target + MIN_DRIVING_F)
    return { kind: 'tooCool', ambient, target };

  const raw = heatingTime(ambient, target) / heatingTime(nominal, target);
  const factor = Math.min(MAX_FACTOR, Math.max(MIN_FACTOR, raw));
  const window = parseMinutes(cut.time);
  return {
    kind: 'scaled',
    ambient,
    target,
    nominal,
    factor,
    clamped: factor !== raw,
    window: window && [window[0] * factor, window[1] * factor],
  };
}

export function burnerMessage(levels: readonly BurnerLevel[], method: string) {
  const lit = levels.filter((level) => level !== 'off').length;
  if (!lit)
    return 'No burners selected. Choose the burners you plan to light; the diagram does not control a real grill.';
  if (lit === levels.length)
    return method === 'indirect'
      ? 'Every burner is lit. Turn at least one OFF to create an indirect area.'
      : 'Every burner is lit. You have direct heat everywhere, but no unlit finishing area.';
  return method === 'indirect'
    ? 'Use the OFF zones for meat and your chosen lit zones for heat. Verify the ambient temperature beside the food.'
    : 'Sear over your chosen lit zones. Use an OFF zone when the crust is ready or to move away from a flare-up.';
}

export type Swap = {
  /** What to reach for instead. */
  use: string;
  /** How much, relative to the amount already listed. */
  amount: string;
  note?: string;
  /**
   * True when the substitute carries its own salt. The dry brine is measured
   * once at 0.5% of raw weight, so these need the measured salt cut back.
   */
  addsSalt?: boolean;
};
export type SwapSet = { match: string; label: string; options: Swap[] };

export const saltWarning =
  'This is pre-salted. Cut the measured kosher salt by about a third, or the meat ends up over-salted.';

// Longest match wins, so 'garlic powder' is checked before 'fresh garlic'.
export const swapSets: SwapSet[] = [
  {
    match: 'garlic powder',
    label: 'Garlic powder',
    options: [
      { use: 'Granulated garlic', amount: 'Same amount' },
      {
        use: 'Garlic salt',
        amount: 'About 3× as much',
        addsSalt: true,
        note: 'Garlic salt is mostly salt, so you need more of it for the same garlic flavour.',
      },
      {
        use: 'Fresh garlic, finely grated',
        amount: 'About 1 clove per ⅛ tsp',
        note: 'Fresh garlic burns faster over direct heat. Keep it away from the hottest zone.',
      },
    ],
  },
  {
    match: 'onion powder',
    label: 'Onion powder',
    options: [
      {
        use: 'Dried minced onion, crushed',
        amount: 'About 3× as much',
        note: 'Crush it first or it will not stick to the binder.',
      },
      {
        use: 'Onion salt',
        amount: 'About 3× as much',
        addsSalt: true,
      },
      {
        use: 'Granulated onion',
        amount: 'Same amount',
      },
    ],
  },
  {
    match: 'smoked paprika',
    label: 'Smoked paprika',
    options: [
      {
        use: 'Sweet paprika',
        amount: 'Same amount',
        note: 'You lose the smoke. Add wood chips if your grill takes a smoker box.',
      },
      {
        use: 'Chipotle powder',
        amount: 'About half as much',
        note: 'Considerably hotter. Cut the cayenne to match.',
      },
      { use: 'Ancho chile powder', amount: 'Same amount' },
    ],
  },
  {
    match: 'kosher salt',
    label: 'Kosher salt',
    options: [
      {
        use: 'Fine sea salt or table salt',
        amount: 'Same weight, not the same volume',
        note: 'This recipe measures salt in grams, so weight is a straight swap. By the spoon, table salt is nearly twice as salty — weigh it if you can.',
      },
      {
        use: 'Coarse sea salt',
        amount: 'Same weight',
      },
    ],
  },
  {
    match: 'dijon mustard',
    label: 'Dijon mustard',
    options: [
      {
        use: 'Yellow mustard',
        amount: 'Same amount',
        note: 'Milder and a little sweeter. It binds just as well.',
      },
      { use: 'Stone-ground mustard', amount: 'Same amount' },
      {
        use: 'Mayonnaise',
        amount: 'Same amount',
        note: 'Works purely as a binder — it adds no tang, and it browns a little faster.',
      },
    ],
  },
  {
    match: 'yellow mustard',
    label: 'Yellow mustard',
    options: [
      {
        use: 'Dijon mustard',
        amount: 'Same amount',
        note: 'Sharper, but fine.',
      },
      { use: 'Stone-ground mustard', amount: 'Same amount' },
      {
        use: 'Mayonnaise or a thin film of oil',
        amount: 'Same amount',
        note: 'Binder only. The rub is what carries the flavour.',
      },
    ],
  },
  {
    match: 'brown sugar',
    label: 'Brown sugar',
    options: [
      {
        use: 'White sugar plus molasses',
        amount: '1 tbsp molasses per cup of sugar',
      },
      { use: 'Coconut sugar or turbinado', amount: 'Same amount' },
      {
        use: 'Honey or maple syrup',
        amount: 'About ¾ as much',
        note: 'Liquid sugars burn sooner. Keep them off direct heat until the last few minutes.',
      },
    ],
  },
  {
    match: 'apple cider vinegar',
    label: 'Apple cider vinegar',
    options: [
      { use: 'White wine vinegar', amount: 'Same amount' },
      {
        use: 'Distilled white vinegar',
        amount: 'About ¾ as much',
        note: 'Sharper and less fruity.',
      },
      { use: 'Lemon juice', amount: 'Same amount' },
    ],
  },
  {
    match: 'apple juice',
    label: 'Apple juice',
    options: [
      { use: 'Apple cider', amount: 'Same amount' },
      { use: 'White grape juice', amount: 'Same amount' },
      {
        use: 'Water',
        amount: 'Same amount',
        note: 'Fine for the wrap. You lose a little sweetness in the bark.',
      },
    ],
  },
  {
    match: 'unsalted butter',
    label: 'Unsalted butter',
    options: [
      {
        use: 'Salted butter',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Most salted butter runs about 1.5% salt. With a finishing butter this is minor, but taste before adding more.',
      },
      { use: 'Ghee or clarified butter', amount: 'Same amount' },
      {
        use: 'Olive oil',
        amount: 'About ¾ as much',
        note: 'It will not set on the meat the way butter does.',
      },
    ],
  },
  {
    match: 'fresh dill',
    label: 'Fresh dill',
    options: [
      { use: 'Dried dill', amount: 'About ⅓ as much' },
      { use: 'Fennel fronds', amount: 'Same amount' },
      { use: 'Tarragon or chervil', amount: 'About half as much' },
    ],
  },
  {
    match: 'dried thyme',
    label: 'Dried thyme',
    options: [
      { use: 'Fresh thyme, chopped', amount: 'About 3× as much' },
      { use: 'Dried oregano or marjoram', amount: 'Same amount' },
      { use: 'Italian seasoning', amount: 'Same amount' },
    ],
  },
  {
    match: 'chopped parsley',
    label: 'Parsley',
    options: [
      { use: 'Chives', amount: 'Same amount' },
      {
        use: 'Cilantro',
        amount: 'Same amount',
        note: 'A different direction, but it works.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'It is a garnish. Nothing breaks without it.',
      },
    ],
  },
  {
    match: 'lemon zest',
    label: 'Lemon zest',
    options: [
      { use: 'Lime or orange zest', amount: 'Same amount' },
      {
        use: 'Extra lemon juice',
        amount: 'About 2× as much',
        note: 'Less aromatic — the oils live in the peel.',
      },
      { use: 'Dried lemon peel', amount: 'About ⅓ as much' },
    ],
  },
  {
    match: 'lemon juice',
    label: 'Lemon juice',
    options: [
      { use: 'Lime juice', amount: 'Same amount' },
      { use: 'White wine vinegar', amount: 'About ¾ as much' },
      { use: 'Apple cider vinegar', amount: 'About ¾ as much' },
    ],
  },
  {
    match: 'hot sauce',
    label: 'Hot sauce',
    options: [
      {
        use: 'Cayenne plus a splash of vinegar',
        amount: '¼ tsp cayenne per tsp',
      },
      {
        use: 'Sriracha or sambal',
        amount: 'Same amount',
        note: 'Sweeter and thicker.',
      },
      { use: 'Red pepper flakes', amount: '½ tsp per tsp' },
    ],
  },
  {
    match: 'barbecue sauce',
    label: 'Barbecue sauce',
    options: [
      {
        use: 'Ketchup, vinegar and brown sugar',
        amount: '2 parts ketchup to 1 part each',
      },
      {
        use: 'Any sauce you already have',
        amount: 'Same amount',
        note: 'Sweet sauces still go on in the last few minutes.',
      },
      { use: 'Leave it out', amount: '—', note: 'It is listed as optional.' },
    ],
  },
  {
    match: 'cayenne',
    label: 'Cayenne',
    options: [
      { use: 'Red pepper flakes', amount: 'About 2× as much' },
      {
        use: 'Chipotle powder',
        amount: 'Same amount',
        note: 'Smokier, slightly milder.',
      },
      {
        use: 'Hot sauce',
        amount: 'About 1 tsp per ¼ tsp',
        note: 'Adds liquid — keep the rub from going pasty.',
      },
    ],
  },
  {
    match: 'black pepper',
    label: 'Black pepper',
    options: [
      {
        use: 'White pepper',
        amount: 'About ¾ as much',
        note: 'Sharper, and it disappears into the bark.',
      },
      { use: 'Mixed peppercorns, cracked', amount: 'Same amount' },
      {
        use: 'Pre-ground pepper',
        amount: 'Same amount',
        note: 'Coarse-cracked gives a better crust, but this works.',
      },
    ],
  },
  {
    match: 'fresh garlic',
    label: 'Fresh garlic',
    options: [
      { use: 'Garlic powder', amount: 'About ⅛ tsp per clove' },
      { use: 'Granulated garlic', amount: 'About ¼ tsp per clove' },
      {
        use: 'Jarred minced garlic',
        amount: 'Same amount',
        note: 'Milder. Pat it dry before it goes on.',
      },
    ],
  },
  {
    match: 'coffee',
    label: 'Ground coffee',
    options: [
      {
        use: 'Any finely ground dark roast',
        amount: 'Same amount',
        note: 'Grind it fine. Coarse grounds sit on top of the crust and feel gritty.',
      },
      {
        use: 'Instant espresso powder',
        amount: 'About half as much',
        note: 'Finer and far more concentrated, so matching the volume turns it bitter.',
      },
      {
        use: 'Unsweetened cocoa powder',
        amount: 'Same amount',
        note: 'A different flavour doing the same job: it darkens the crust and cuts the sugar.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'The rub still works. It will taste sweeter and look a shade lighter.',
      },
    ],
  },
  {
    match: 'ancho',
    label: 'Ancho chile powder',
    options: [
      {
        use: 'Pasilla or guajillo powder',
        amount: 'Same amount',
        note: 'The closest match. Both are mild and fruity in the same way ancho is.',
      },
      {
        use: 'Regular chili powder',
        amount: 'Same amount',
        note: 'US chili powder is a blend that already contains cumin, so halve the cumin listed below.',
      },
      {
        use: 'Sweet paprika, plus a pinch of cayenne',
        amount: 'Same amount of paprika',
        note: 'Ancho is mild. Go easy on the cayenne or you will overshoot the heat badly.',
      },
      {
        use: 'Chipotle powder',
        amount: 'About half as much',
        note: 'Much hotter and smokier, and the sauce already brings chipotle to the plate.',
      },
    ],
  },
  {
    match: 'cumin',
    label: 'Ground cumin',
    options: [
      {
        use: 'Whole cumin seed, toasted and ground',
        amount: 'Same amount',
        note: 'Better than pre-ground if you have a grinder or a mortar.',
      },
      {
        use: 'Ground coriander',
        amount: 'Same amount',
        note: 'Lighter and more citrusy rather than earthy. Not the same, but it fills the hole.',
      },
      {
        use: 'Taco or fajita seasoning',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Most blends are mostly salt and already contain cumin.',
      },
      { use: 'Leave it out', amount: '—' },
    ],
  },
  {
    match: 'adobo sauce',
    label: 'Adobo sauce',
    options: [
      {
        use: 'Minced chipotle pepper from the same tin',
        amount: 'About half as much',
        note: 'The peppers are a great deal hotter than the sauce around them. Start low and taste.',
      },
      {
        use: 'Chipotle hot sauce',
        amount: 'About half as much',
        note: 'Thinner and more vinegary, so the sauce will loosen. Add it last.',
      },
      {
        use: 'Smoked paprika with a splash of vinegar',
        amount: 'About 1 tsp per tbsp',
        note: 'Gets you the smoke and the colour without any of the heat.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'You lose the smoke and the heat, but a cold lime and garlic sauce still earns its place.',
      },
    ],
  },
  {
    match: 'yogurt or sour cream',
    label: 'Yogurt or sour cream',
    options: [
      { use: 'Mexican crema', amount: 'Same amount' },
      {
        use: 'Plain Greek yogurt, loosened with water',
        amount: 'Same amount',
        note: 'Thicker than this sauce wants. Thin it until it runs off a spoon.',
      },
      {
        use: 'Mayonnaise, thinned with lime juice',
        amount: 'Same amount',
        note: 'Richer and much less tangy, so add extra lime to bring the sharpness back.',
      },
      { use: 'Buttermilk and mayonnaise, half each', amount: 'Same amount' },
    ],
  },
  {
    match: 'lime juice',
    label: 'Lime juice',
    options: [
      {
        use: 'Lemon juice',
        amount: 'Same amount',
        note: 'Sharper and less floral, but it does the same job here.',
      },
      {
        use: 'Bottled lime juice',
        amount: 'Same amount',
        note: 'Flatter than fresh. Taste before you add the last of it.',
      },
      {
        use: 'White wine vinegar',
        amount: 'About ⅔ as much',
        note: 'More acidic than citrus. Hold some back and taste as you go.',
      },
    ],
  },
];

/**
 * Finds substitutions for a generated ingredient line. Matching is on the
 * ingredient name inside the string, longest match first so that
 * 'garlic powder' never resolves as 'fresh garlic'.
 */
export function substitutionsFor(item: string): SwapSet | null {
  const haystack = item.toLowerCase();
  let best: SwapSet | null = null;
  for (const set of swapSets)
    if (
      haystack.includes(set.match) &&
      (best === null || set.match.length > best.match.length)
    )
      best = set;
  return best;
}

/**
 * How a chosen substitution reads on the checklist and in the print view.
 * Only the measured half of the original line is quoted back: several items
 * carry an em-dash clause of advice that would otherwise run on.
 */
export function measuredPart(item: string) {
  return item.split(' — ')[0] ?? item;
}
export function substitutedItem(item: string, set: SwapSet, option: Swap) {
  if (option.amount === '—')
    return `Skip the ${set.label.toLowerCase()} (listed: ${measuredPart(item)})`;
  return `${option.use} — ${option.amount}, in place of ${measuredPart(item)}`;
}
