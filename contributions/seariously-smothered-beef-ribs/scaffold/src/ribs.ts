import type { ConfiguredRecipe, Cut, Science, WeightUnit } from './cook-config';
import { amountLabel, numberLabel } from './amounts';

export type RibIngredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  metricAmount: number;
  metricUnit: string;
};
const commonCut = {
  protein: 'Beef' as const,
  baseId: 'seariously-smothered-beef-ribs',
  baseLb: 4,
  minLb: 2,
  maxLb: 12,
  method: 'Indirect low heat',
  grill: [275, 300],
  internal: [200, 205],
  rest: '15–20 minutes',
  family: 'beef-ribs' as const,
};
export const ribCuts: Cut[] = [
  {
    ...commonCut,
    id: 'seariously-smothered-beef-ribs',
    name: 'Short ribs · 2–3 in thick',
    thick: false,
    time: '4–6 hours + rest',
    timing:
      'For individual English-cut short ribs with 2–3 in / 5–7.5 cm of meat above the bone: plan 25 minutes prep, 4–6 hours cooking, and a 15–20 minute rest. Thickness, grill recovery, and probe resistance decide the finish, not total batch weight.',
  },
  {
    ...commonCut,
    id: 'seariously-smothered-beef-ribs-thick',
    name: 'Short ribs · 3–4 in thick',
    thick: true,
    time: '5–8 hours + rest',
    timing:
      'For extra-thick individual English-cut ribs with 3–4 in / 7.5–10 cm of meat above the bone: plan 25 minutes prep, 5–8 hours cooking, and a 15–20 minute rest. Keep the ribs spaced apart. Do not multiply cooking time by ingredient scale.',
  },
];
export const ingredientGroups: { title: string; items: RibIngredient[] }[] = [
  {
    title: 'Ribs & peppery rub',
    items: [
      {
        id: 'ribs',
        name: 'thick English-cut bone-in beef short ribs',
        amount: 4,
        unit: 'lb',
        metricAmount: 1.81436948,
        metricUnit: 'kg',
      },
      {
        id: 'mustard',
        name: 'yellow mustard, for the binder',
        amount: 2,
        unit: 'tbsp',
        metricAmount: 30,
        metricUnit: 'ml',
      },
      {
        id: 'salt',
        name: 'kosher salt, weighed',
        amount: 12,
        unit: 'g',
        metricAmount: 12,
        metricUnit: 'g',
      },
      {
        id: 'rub-pepper',
        name: 'coarse black pepper',
        amount: 1,
        unit: 'tbsp',
        metricAmount: 7,
        metricUnit: 'g',
      },
      {
        id: 'rub-garlic',
        name: 'garlic powder',
        amount: 2,
        unit: 'tsp',
        metricAmount: 6,
        metricUnit: 'g',
      },
      {
        id: 'rub-onion',
        name: 'onion powder',
        amount: 1,
        unit: 'tsp',
        metricAmount: 2.5,
        metricUnit: 'g',
      },
      {
        id: 'rub-paprika',
        name: 'smoked paprika',
        amount: 2,
        unit: 'tsp',
        metricAmount: 4.6,
        metricUnit: 'g',
      },
    ],
  },
  {
    title: 'Shallow braising liquid',
    items: [
      {
        id: 'stock',
        name: 'unsalted beef stock; adjust depth to the pan',
        amount: 0.75,
        unit: 'cup',
        metricAmount: 180,
        metricUnit: 'ml',
      },
      {
        id: 'braise-vinegar',
        name: 'apple cider vinegar, for the pan',
        amount: 1,
        unit: 'tbsp',
        metricAmount: 15,
        metricUnit: 'ml',
      },
    ],
  },
  {
    title: 'Brown sugar–Worcestershire sauce',
    items: [
      {
        id: 'ketchup',
        name: 'ketchup',
        amount: 1.5,
        unit: 'cup',
        metricAmount: 360,
        metricUnit: 'ml',
      },
      {
        id: 'sugar',
        name: 'dark brown sugar, packed',
        amount: 0.25,
        unit: 'cup',
        metricAmount: 55,
        metricUnit: 'g',
      },
      {
        id: 'molasses',
        name: 'unsulphured molasses',
        amount: 2,
        unit: 'tbsp',
        metricAmount: 30,
        metricUnit: 'ml',
      },
      {
        id: 'worcestershire',
        name: 'Worcestershire sauce',
        amount: 3,
        unit: 'tbsp',
        metricAmount: 45,
        metricUnit: 'ml',
      },
      {
        id: 'sauce-vinegar',
        name: 'apple cider vinegar, for the sauce',
        amount: 3,
        unit: 'tbsp',
        metricAmount: 45,
        metricUnit: 'ml',
      },
      {
        id: 'water',
        name: 'water, plus a splash to loosen if needed',
        amount: 0.25,
        unit: 'cup',
        metricAmount: 60,
        metricUnit: 'ml',
      },
      {
        id: 'sauce-garlic',
        name: 'garlic powder',
        amount: 1,
        unit: 'tsp',
        metricAmount: 3,
        metricUnit: 'g',
      },
      {
        id: 'sauce-paprika',
        name: 'smoked paprika',
        amount: 1,
        unit: 'tsp',
        metricAmount: 2.3,
        metricUnit: 'g',
      },
      {
        id: 'sauce-pepper',
        name: 'black pepper',
        amount: 1,
        unit: 'tsp',
        metricAmount: 2.3,
        metricUnit: 'g',
      },
      {
        id: 'cayenne',
        name: 'cayenne pepper, optional',
        amount: 0.125,
        unit: 'tsp',
        metricAmount: 0.25,
        metricUnit: 'g',
      },
      {
        id: 'butter',
        name: 'unsalted butter, whisked in off heat',
        amount: 2,
        unit: 'tbsp',
        metricAmount: 28,
        metricUnit: 'g',
      },
    ],
  },
];
export function scaledIngredient(item: RibIngredient, scale: number, weightUnit: WeightUnit) {
  return {
    amount: (weightUnit === 'kg' ? item.metricAmount : item.amount) * scale,
    unit: weightUnit === 'kg' ? item.metricUnit : item.unit,
  };
}
function ingredientText(item: RibIngredient, scale: number, weightUnit: WeightUnit) {
  const value = scaledIngredient(item, scale, weightUnit);
  const label = ['cup', 'tbsp', 'tsp'].includes(value.unit)
    ? amountLabel(value.amount)
    : numberLabel(value.amount);
  const unit = value.unit === 'cup' && value.amount > 1 ? 'cups' : value.unit;
  return label + ' ' + unit + ' ' + item.name;
}
export const collagenScience: Science = {
  title: 'Safe beef and tender ribs are different targets.',
  body: 'Whole-cut beef reaches its safe minimum at 145°F followed by a 3-minute rest, but short ribs need sustained cooking to soften connective tissue. Moist, covered heat limits evaporative cooling and drying while collagen softens into gelatin.',
  takeaway:
    'A probe should slide into several spots with very little resistance, often near 200–205°F. If a rib still feels tight, keep cooking; the number alone is not a tenderness test.',
};
const glazeScience: Science = {
  title: 'Build the glaze one thin layer at a time.',
  body: 'Thin sauce coats lose water and thicken more evenly than a heavy coat. Brown sugar and molasses add depth, but their sugars scorch quickly over direct flame. The ribs are already tender before glazing.',
  takeaway:
    'Use indirect heat, let each coat get tacky, and add the generous clean serving sauce after resting.',
};
type Context = {
  cut: Cut;
  weightLb: number;
  weightUnit: WeightUnit;
  scale: number;
  sizeLabel: string;
};
export function buildRibsRecipe({
  cut,
  weightLb,
  weightUnit,
  scale,
  sizeLabel,
}: Context): ConfiguredRecipe {
  const sauceYield =
    weightUnit === 'kg' ? numberLabel(600 * scale) + ' ml' : amountLabel(2.5 * scale) + ' cups';
  return {
    id: cut.id,
    protein: 'Beef',
    title: 'Sear-iously smothered beef ribs',
    headline: ['Big beef.', 'More BBQ.'],
    description:
      'Peppery short ribs with sticky brown sugar–Worcestershire sauce. Fork-tender beef, glossy edges, and extra sauce at the table.',
    cut,
    weightLb,
    scale,
    sizeLabel,
    timingNote: cut.timing,
    time: cut.time,
    rest: cut.rest,
    serves: Math.max(1, Math.round(weightLb)) + ' hearty servings (rough estimate)',
    method: cut.method,
    grill: cut.grill,
    internal: cut.internal,
    finish:
      'Tenderness range: 200–205°F. Probe several meaty spots away from bone; finish when it slides in with very little resistance.',
    safety:
      'Whole-cut beef minimum: 145°F before removal, followed by at least a 3-minute rest. Short ribs need the longer cook for tenderness. Reheat leftovers to 165°F.',
    wood: 'Pepper + paprika · no wood needed',
    tip:
      'Keep half the sauce clean for serving. Approximate sauce yield for this batch: ' +
      sauceYield +
      ', depending on reduction. Rest the ribs, spoon over warm sauce, and bring extra napkins. Worcestershire may contain fish or wheat; check mustard and butter allergens too.',
    photo: './images/seariously-smothered-beef-ribs.webp',
    photoCaption: 'Beef short ribs',
    photoAlt:
      'AI illustration of thick individual beef short ribs smothered in glossy brown sugar–Worcestershire BBQ sauce',
    scalingNote:
      'English-cut bone-in short ribs only—not thin flanken, back ribs, or boneless pieces. Choose actual meat thickness, not bone length. Salt stays in grams; weigh it once. Metric spice weights are approximate. The scaled stock is a starting amount: pan shape determines liquid depth, so adjust with hot water and keep ribs in one uncrowded layer.',
    attribution: {
      label: 'Adapted from your supplied recipe · notes & references',
      url: '#sources',
      note: 'Your mustard-bound rub and sauce formula, with indirect gas-grill technique and government safety guidance. Not kitchen-tested. Supplied image is reported AI-generated.',
    },
    equipment: [
      'Gas grill with an unlit zone and enough fuel for a long cook',
      'Grate-level thermometer and instant-read meat probe',
      'Snug metal roasting pan(s), heavy foil, heatproof gloves',
      'Saucepan, brush, tongs, clean sauce bowl, and serving platter',
      'Salt assumes unseasoned ribs and unsalted stock; use regular unsulphured molasses',
    ],
    extraScience: [{ afterStep: 4, note: glazeScience }],
    ingredients: ingredientGroups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ingredientText(item, scale, weightUnit)),
    })),
    steps: [
      {
        title: 'Mustard, pepper, and a little patience',
        cue: '15 min prep · optional 4–24 hours refrigerated',
        body: 'Thaw ribs in the refrigerator. Pat dry and trim hard surface fat and accessible silverskin, keeping meat attached to each bone. Apply a thin film of the measured mustard. Mix the rib salt, pepper, garlic powder, onion powder, and smoked paprika; season every meaty side. Cook now or refrigerate for 4–24 hours. If seasoned ahead, do not add salt again.',
      },
      {
        title: 'Build the peppery crust',
        cue: '275–300°F ambient · ' + (cut.thick ? 'about 2–3 hours' : 'about 1½–2 hours'),
        body: "Follow your grill's lighting instructions and selected burner plan. Preheat to 275–300°F measured at grate level beside the food. Set ribs bone-side down over unlit burners with space between them, then close the lid. Rotate positions if one side colors faster. Cook until deep brown and the rub no longer wipes off easily. Internal temperature may be 160–175°F, but a set crust is the cue to cover. Keep the sugary sauce off for now.",
      },
      {
        title: 'Cover and cook until the probe glides',
        cue: 'About 300°F ambient · ' + (cut.thick ? '2½–4 hours covered' : '2–3 hours covered'),
        body:
          'Arrange ribs bone-side down in a snug metal pan in one layer. Add the measured stock and braising vinegar around them, keeping the tops exposed. Aim for about ¼ in / 6 mm of liquid underneath; pan shape determines depth, so adjust with hot water. Seal tightly with foil and return over unlit burners at about 300°F. Start checking after ' +
          (cut.thick ? '2 hours' : '90 minutes') +
          ' covered, then every 20–30 minutes. Open away from your face. Add hot water if drying out and reseal. Probe several thick meaty spots away from bone. Finish when the probe glides in with very little resistance, often near 200–205°F. Keep cooking any rib that still feels tight.',
      },
      {
        title: 'Make the sauce worth smothering',
        cue: 'During the last 30–45 min of braising',
        body: 'Whisk all sauce ingredients except butter together in a saucepan: ketchup, dark brown sugar, molasses, Worcestershire, cider vinegar, water, garlic powder, smoked paprika, black pepper, and cayenne. Simmer gently 8–12 minutes, stirring, until it coats a spoon but still pours. Use a larger pan for larger batches; consistency decides, not a multiplied timer. Remove from heat, whisk in butter, and loosen with water if needed. Split equally into brushing sauce and a clean serving portion. Keep serving sauce covered and away from the brush. Refrigerate if made ahead and reheat for serving.',
      },
      {
        title: 'Paint on the sticky layers',
        cue: '275–300°F indirect · about 15–25 min',
        body: 'Carefully lift tender ribs onto a clean, lightly oiled metal rack over a shallow tray, or clean grates if they hold together. Keep everything over unlit burners at 275–300°F. Leave the braising liquid behind. Brush tops and sides with a thin coat of brushing sauce, close the lid for 5–8 minutes until tacky, and repeat for about three coats. Stop sooner if edges darken quickly. Avoid direct flames; this stage is only setting the glaze.',
      },
      {
        title: 'Rest, smother, and bring napkins',
        cue: 'Rest 15–20 min · finish with clean warm sauce',
        body: 'Rest loosely tented for 15–20 minutes. Warm the clean reserved sauce gently, spoon generously over each rib, and pass the rest at the table. Use clean utensils; do not return brushing sauce to the serving bowl. Refrigerate leftovers in shallow containers within 2 hours, or within 1 hour when air is above 90°F. Reheat leftovers to 165°F.',
      },
    ],
  };
}
