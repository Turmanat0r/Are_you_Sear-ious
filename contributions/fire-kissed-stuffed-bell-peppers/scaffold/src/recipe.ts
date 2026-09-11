export type MeasureUnit = 'us' | 'metric';
export type TempUnit = 'F' | 'C';
export type CutId = 'halves' | 'cups';
export type FillingId = 'vegetarian' | 'beef' | 'chicken' | 'split';
export type Texture = 'minimum';

export type Settings = {
  cut: CutId;
  filling: FillingId;
  pepperCount: number;
  measureUnit: MeasureUnit;
  tempUnit: TempUnit;
  texture: Texture;
};

type IngredientUnit = 'each' | 'tsp' | 'tbsp' | 'cup' | 'oz' | 'lb' | 'can';
export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: IngredientUnit;
  group: 'Peppers & shared filling' | 'Selected filling';
};

export const recipe = {
  id: 'fire-kissed-stuffed-bell-peppers',
  title: 'Fire-kissed stuffed bell peppers',
  basePepperCount: 4,
  minPepperCount: 2,
  maxPepperCount: 12,
  grillAmbientF: [375, 400],
  indirectAmbientF: [375, 400],
  restMinutes: [5, 8],
  image: './images/fire-kissed-stuffed-bell-peppers.webp',
  imageAlt: 'Grilled red, yellow and orange bell peppers filled with vegetarian and meat fillings',
} as const;

export const cuts = [
  {
    id: 'halves',
    name: 'Pepper halves',
    portionsPerPepper: 2,
    time: '25–35 min indirect',
    timing: 'Begin probing the filling around 25 minutes.',
    note: 'Halves cook faster and expose more filling to smoke and browning.',
  },
  {
    id: 'cups',
    name: 'Upright pepper cups',
    portionsPerPepper: 1,
    time: '35–50 min indirect',
    timing: 'Begin probing the filling around 35 minutes.',
    note: 'Cups hold more filling and need a rack or snug pan to stay upright.',
  },
] as const;

export const fillings = [
  {
    id: 'vegetarian',
    name: 'Black bean & corn · vegetarian',
    shortName: 'Vegetarian',
    internalF: 165,
    targetName: 'Hot-through vegetarian filling',
    targetNote:
      '165°F is a conservative hot-through target for this cooked-rice filling, not a raw-meat doneness claim.',
  },
  {
    id: 'beef',
    name: 'Seasoned ground beef',
    shortName: 'Ground beef',
    internalF: 160,
    targetName: 'Ground-beef safety minimum',
    targetNote: 'Every beef-filled pepper must reach 160°F in the center of the filling.',
  },
  {
    id: 'chicken',
    name: 'Seasoned ground chicken',
    shortName: 'Ground chicken',
    internalF: 165,
    targetName: 'Ground-chicken safety minimum',
    targetNote: 'Every chicken-filled pepper must reach 165°F in the center of the filling.',
  },
  {
    id: 'split',
    name: 'Half vegetarian · half beef',
    shortName: 'Split veggie & beef',
    internalF: 165,
    targetName: 'Split-batch targets',
    targetNote:
      'Check each filling: beef peppers must reach 160°F; vegetarian peppers should be hot through at 165°F.',
  },
] as const;

export const defaultSettings: Settings = {
  cut: 'halves',
  filling: 'vegetarian',
  pepperCount: 4,
  measureUnit: 'us',
  tempUnit: 'F',
  texture: 'minimum',
};

export function normalizeSettings(settings: Settings): Settings {
  return { ...settings, texture: 'minimum' };
}

export function targetFor(settings: Settings) {
  return fillings.find((entry) => entry.id === settings.filling)!;
}

const sharedIngredients: Ingredient[] = [
  {
    id: 'peppers',
    name: 'Large bell peppers, mixed colors',
    amount: 4,
    unit: 'each',
    group: 'Peppers & shared filling',
  },
  {
    id: 'oil',
    name: 'Olive oil, divided',
    amount: 2,
    unit: 'tbsp',
    group: 'Peppers & shared filling',
  },
  {
    id: 'rice',
    name: 'Cooked long-grain rice, cooled',
    amount: 2,
    unit: 'cup',
    group: 'Peppers & shared filling',
  },
  {
    id: 'tomatoes',
    name: '14.5 oz / 411 g can fire-roasted diced tomatoes, well drained',
    amount: 1,
    unit: 'can',
    group: 'Peppers & shared filling',
  },
  {
    id: 'onion',
    name: 'Yellow onion, finely diced',
    amount: 0.5,
    unit: 'cup',
    group: 'Peppers & shared filling',
  },
  {
    id: 'garlic',
    name: 'Garlic, finely grated',
    amount: 2,
    unit: 'each',
    group: 'Peppers & shared filling',
  },
  { id: 'cumin', name: 'Ground cumin', amount: 2, unit: 'tsp', group: 'Peppers & shared filling' },
  {
    id: 'paprika',
    name: 'Smoked paprika',
    amount: 1,
    unit: 'tsp',
    group: 'Peppers & shared filling',
  },
  {
    id: 'salt',
    name: 'Kosher salt, divided',
    amount: 1.5,
    unit: 'tsp',
    group: 'Peppers & shared filling',
  },
  {
    id: 'pepper',
    name: 'Freshly ground black pepper',
    amount: 0.5,
    unit: 'tsp',
    group: 'Peppers & shared filling',
  },
  {
    id: 'cheese',
    name: 'Monterey Jack or pepper Jack, shredded',
    amount: 6,
    unit: 'oz',
    group: 'Peppers & shared filling',
  },
  {
    id: 'cilantro',
    name: 'Fresh cilantro, chopped',
    amount: 2,
    unit: 'tbsp',
    group: 'Peppers & shared filling',
  },
  {
    id: 'lime',
    name: 'Lime, cut into wedges',
    amount: 1,
    unit: 'each',
    group: 'Peppers & shared filling',
  },
];

function selectedIngredients(filling: FillingId): Ingredient[] {
  if (filling === 'vegetarian')
    return [
      {
        id: 'beans',
        name: '15 oz / 425 g can black beans, rinsed and drained',
        amount: 1,
        unit: 'can',
        group: 'Selected filling',
      },
      {
        id: 'corn',
        name: 'Corn kernels, thawed if frozen',
        amount: 1,
        unit: 'cup',
        group: 'Selected filling',
      },
    ];
  if (filling === 'beef' || filling === 'chicken')
    return [
      {
        id: filling,
        name: filling === 'beef' ? 'Ground beef, 85–90% lean' : 'Ground chicken',
        amount: 1,
        unit: 'lb',
        group: 'Selected filling',
      },
      {
        id: 'corn',
        name: 'Corn kernels, thawed if frozen',
        amount: 0.5,
        unit: 'cup',
        group: 'Selected filling',
      },
    ];
  return [
    {
      id: 'beef',
      name: 'Ground beef, 85–90% lean',
      amount: 0.5,
      unit: 'lb',
      group: 'Selected filling',
    },
    {
      id: 'beans',
      name: '15 oz / 425 g can black beans, rinsed and drained',
      amount: 0.5,
      unit: 'can',
      group: 'Selected filling',
    },
    {
      id: 'corn',
      name: 'Corn kernels, thawed if frozen',
      amount: 0.75,
      unit: 'cup',
      group: 'Selected filling',
    },
  ];
}

export const groups = ['Peppers & shared filling', 'Selected filling'] as const;
export const equipment = [
  'Three-burner gas grill',
  'Instant-read thermometer and grate-level ambient probe',
  'Rimmed metal pan or pepper rack',
  'Large mixing bowl; two bowls for a split batch',
  'Separate utensils and platters for raw-meat and vegetarian fillings',
  'Grill-safe gloves and wide spatula',
];
export const sources = [
  {
    label: 'USDA FSIS: safe minimum internal temperatures',
    url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
  },
  {
    label: 'USDA FSIS: grilling food safely',
    url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/grilling-food-safely',
  },
  {
    label: 'USDA FSIS: food thermometers',
    url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers',
  },
  {
    label: 'Weber: indirect-medium stuffed-pepper technique reference',
    url: 'https://www.weber.com/JP/en/recipes/veggies/chiles-rellenos/weber-4092.html',
  },
];

export function parsePepperCount(input: string): number | null {
  const value = Number(input);
  return Number.isInteger(value) && value >= recipe.minPepperCount && value <= recipe.maxPepperCount
    ? value
    : null;
}
export function numberLabel(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}
export function temp(values: number | readonly number[], unit: TempUnit) {
  return (
    (Array.isArray(values) ? values : [values])
      .map((value) => (unit === 'F' ? value : Math.round(((value - 32) * 5) / 9)))
      .join('–') + `°${unit}`
  );
}
export function unitText(value: string, unit: TempUnit) {
  return value.replace(/(\d+)(?:–(\d+))?°F/g, (_, a: string, b?: string) =>
    temp(b ? [+a, +b] : +a, unit),
  );
}
export function sizeLabel(settings: Settings) {
  const cut = cuts.find((entry) => entry.id === settings.cut)!;
  const portions = settings.pepperCount * cut.portionsPerPepper;
  return `${settings.pepperCount} peppers · ${portions} ${settings.cut === 'halves' ? 'halves' : 'cups'}`;
}
export function servings(settings: Settings) {
  return settings.pepperCount;
}
export function scaledIngredients(settings: Settings): Ingredient[] {
  if (parsePepperCount(String(settings.pepperCount)) === null)
    throw new RangeError('Unsupported pepper count');
  const factor = settings.pepperCount / recipe.basePepperCount;
  return [...sharedIngredients, ...selectedIngredients(settings.filling)].map((item) => ({
    ...item,
    amount: item.amount * factor,
  }));
}
export function amountLabel(item: Ingredient, unit: MeasureUnit) {
  if (unit === 'metric') {
    if (item.unit === 'lb') return `${numberLabel(item.amount * 453.592, 0)} g`;
    if (item.unit === 'oz') return `${numberLabel(item.amount * 28.3495, 0)} g`;
    if (['tsp', 'tbsp', 'cup'].includes(item.unit)) {
      const milliliters: Record<string, number> = { tsp: 4.92892, tbsp: 14.7868, cup: 236.588 };
      return `${numberLabel(item.amount * milliliters[item.unit], 0)} mL`;
    }
  }
  return `${numberLabel(item.amount)} ${item.unit}`;
}

export type Step = { title: string; cue: string; body: string; science: string };
function fillingDirections(settings: Settings) {
  if (settings.filling === 'vegetarian')
    return 'Fold in the black beans and corn. This bowl never needs to contact raw meat.';
  if (settings.filling === 'beef')
    return 'Add the raw ground beef and corn. Mix gently just until evenly combined; keep cold until the peppers are filled.';
  if (settings.filling === 'chicken')
    return 'Add the raw ground chicken and corn. Mix gently just until evenly combined; keep cold until the peppers are filled.';
  return 'Divide the shared mixture evenly between two marked bowls. Fold beef into one bowl and beans plus corn into the other. Use separate utensils and never return a raw-meat utensil to the vegetarian bowl.';
}
export function safetySentence(settings: Settings, unit = settings.tempUnit) {
  if (settings.filling === 'beef') return `Probe every beef filling to ${temp(160, unit)}.`;
  if (settings.filling === 'chicken') return `Probe every chicken filling to ${temp(165, unit)}.`;
  if (settings.filling === 'split')
    return `Probe beef peppers to ${temp(160, unit)} and vegetarian peppers to a hot-through ${temp(165, unit)}.`;
  return `Heat the vegetarian filling evenly to ${temp(165, unit)}; this is a conservative hot-through target.`;
}
export function methodSteps(settings: Settings): Step[] {
  const cut = cuts.find((entry) => entry.id === settings.cut)!;
  const styleDirections =
    settings.cut === 'halves'
      ? 'Cut each pepper lengthwise through the stem; remove ribs and seeds while leaving the stem attached for structure.'
      : 'Slice off the tops, remove ribs and seeds, and trim only enough from the bottoms to stand them upright without cutting through.';
  return [
    {
      title: 'Prep the peppers and rice',
      cue: '15 min prep',
      body: `Wash and dry the peppers before cutting. ${styleDirections} Brush the pepper surfaces with half the olive oil and season lightly with some of the measured salt. Use fully cooked rice that has been cooled promptly.`,
      science:
        'Pepper cell walls soften as heat changes pectin. Leaving the walls intact gives the filling time to heat before the pepper collapses.',
    },
    {
      title: 'Choose your three-burner setup',
      cue: '375–400°F indirect ambient',
      body: 'Follow the grill manual’s lighting sequence. Choose which burners are ON and leave enough OFF space for the entire pan or pepper rack. Stabilize 375–400°F at grate level beside the peppers. Nothing is preselected.',
      science:
        'Indirect heat cooks the dense center without burning the pepper bottoms. A grate-level probe measures the environment the food actually experiences.',
    },
    {
      title: 'Build the selected filling',
      cue: 'Keep raw-meat mixtures cold',
      body: `Combine rice, drained tomatoes, onion, garlic, cumin, paprika, black pepper, most cilantro, the remaining salt and half the cheese. ${fillingDirections(settings)}`,
      science:
        'Draining tomatoes controls free water. Gentle mixing limits protein extraction in meat fillings, helping them stay tender rather than springy.',
    },
    {
      title: 'Fill and move over the OFF zone',
      cue: `${cut.time} · lid closed`,
      body: `Pack the filling loosely into the peppers without compressing it. Arrange every pepper entirely above OFF burners, close the lid and hold 375–400°F. ${cut.timing} Rotate the pan if one side cooks faster. Batch count changes pan space, not the time required by each pepper.`,
      science:
        'Loose filling leaves small channels for hot air and steam. Packing tightly slows heat movement toward the cold center.',
    },
    {
      title: 'Probe the center, then melt the cheese',
      cue: `${safetySentence(settings, 'F')} · cheese 5–8 min`,
      body: `${safetySentence(settings, 'F')} Insert the probe into the geometric center of the filling and check more than one pepper. When the filling is within about 5°F of its target, add the remaining cheese, close the lid and finish until melted and the target is reached. Color cannot verify ground-meat safety.`,
      science:
        'Ground meat can contain bacteria throughout, so the center temperature matters. Carryover is variable in a vegetable shell; reach the target on the grill.',
    },
    {
      title: 'Rest, brighten and chill leftovers',
      cue: 'Rest 5–8 min · reheat leftovers to 165°F',
      body: 'Rest the peppers 5–8 minutes so the filling firms slightly. Finish with lime and remaining cilantro. Refrigerate within 2 hours, or within 1 hour above 90°F. Use refrigerated leftovers within 3–4 days and reheat to 165°F.',
      science:
        'A short rest lets steam redistribute and molten cheese settle. Prompt cooling limits bacterial growth; shallow containers cool faster than a crowded deep dish.',
    },
  ];
}
