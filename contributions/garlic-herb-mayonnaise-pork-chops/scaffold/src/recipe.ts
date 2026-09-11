export type MeasureUnit = 'us' | 'metric';
export type TempUnit = 'F' | 'C';
export type VariantId = 'bone-in' | 'boneless';
export type VesselId = 'two-chops' | 'four-chops';

export type Settings = { variant: VariantId; vessel: VesselId; servings: number; measureUnit: MeasureUnit; tempUnit: TempUnit };
type IngredientUnit = 'each' | 'tsp' | 'tbsp' | 'cup' | 'oz' | 'lb';
export type Ingredient = { id: string; name: string; amount: number; unit: IngredientUnit; group: 'Pork chops' | 'Mayonnaise binder' | 'Finish' };

export const recipe = {
  id: 'garlic-herb-mayonnaise-pork-chops', category: 'PORK · GAS GRILL', title: 'Garlic-herb mayonnaise pork chops',
  heroLine1: 'Savory crust.', heroLine2: 'Juicy pork chops.',
  description: 'A thin garlic-herb mayonnaise binder builds a browned, savory crust before a two-zone gas-grill finish.',
  baseServings: 4, minServings: 2, maxServings: 12, prep: '20 min + optional dry-brine', rest: '3 min',
  grillAmbientF: [350, 400], searAmbientF: [450, 500], finishF: 145,
  image: './images/garlic-herb-mayonnaise-pork-chops.webp',
  imageAlt: 'Garlic-herb pork chops with browned grill marks on a gas grill',
  photoCaption: 'Garlic-herb mayonnaise pork chops · AI-generated image',
  equipmentNote: 'Use clean gas-grill grates, long tongs and an instant-read thermometer. Keep a clean platter separate from the raw-pork plate.',
  ingredientNotes: ['Use chops about 1¼–1½ inches thick for the juiciest result. Thin chops need shorter searing and may skip the indirect finish.', 'Mayonnaise is an egg allergen. Lemon is optional only as a finishing accent, never a simmering ingredient.'],
} as const;

export const vessels = [
  { id: 'two-chops', name: '2 thick chops', time: '8–16 min after sear', timing: 'Start checking the center 5 minutes after moving indirect.', note: 'Best for two 1¼–1½-inch chops with plenty of grate space.' },
  { id: 'four-chops', name: '4 thick chops', time: '10–20 min after sear', timing: 'Start checking the center 6 minutes after moving indirect.', note: 'Leave space between chops; cook in batches if the indirect zone is crowded.' },
] as const;

export const variants = [
  { id: 'bone-in', name: 'Bone-in pork chops', shortName: 'Bone-in', prepF: 145, prepLabel: 'Pork safety target', targetNote: 'Cook the thickest part to 145°F, then rest at least 3 minutes. Avoid touching the bone with the probe.' },
  { id: 'boneless', name: 'Boneless pork chops', shortName: 'Boneless', prepF: 145, prepLabel: 'Pork safety target', targetNote: 'Cook the thickest center to 145°F, then rest at least 3 minutes. Boneless chops can finish faster.' },
] as const;

export const defaultSettings: Settings = { variant: 'bone-in', vessel: 'four-chops', servings: 4, measureUnit: 'us', tempUnit: 'F' };
export function normalizeSettings(settings: Settings) { return settings; }
export function variantFor(settings: Settings) { return variants.find((entry) => entry.id === settings.variant)!; }
export function vesselFor(settings: Settings) { return vessels.find((entry) => entry.id === settings.vessel)!; }
export function parseServings(input: string): number | null { const value = Number(input); return Number.isInteger(value) && value >= recipe.minServings && value <= recipe.maxServings ? value : null; }
export function numberLabel(value: number, digits = 2) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value); }
export function temp(values: number | readonly number[], unit: TempUnit) { return (Array.isArray(values) ? values : [values]).map((value) => unit === 'F' ? value : Math.round(((value - 32) * 5) / 9)).join('–') + `°${unit}`; }
export function unitText(value: string, unit: TempUnit) { return value.replace(/(\d+)(?:–(\d+))?°F/g, (_, a: string, b?: string) => temp(b ? [+a, +b] : +a, unit)); }
export function sizeLabel(settings: Settings) { return `${settings.servings} servings · ${vesselFor(settings).name}`; }

const shared: Ingredient[] = [
  { id: 'chops', name: 'Pork chops, 1¼–1½ inches thick', amount: 4, unit: 'each', group: 'Pork chops' },
  { id: 'salt', name: 'Kosher salt, for dry-brining', amount: 1.5, unit: 'tsp', group: 'Pork chops' },
  { id: 'mayo', name: 'Mayonnaise', amount: 0.5, unit: 'cup', group: 'Mayonnaise binder' },
  { id: 'worcestershire', name: 'Worcestershire sauce', amount: 1, unit: 'tbsp', group: 'Mayonnaise binder' },
  { id: 'garlic', name: 'Garlic cloves, finely grated', amount: 2, unit: 'each', group: 'Mayonnaise binder' },
  { id: 'rosemary', name: 'Fresh rosemary, finely chopped', amount: 1, unit: 'tbsp', group: 'Mayonnaise binder' },
  { id: 'thyme', name: 'Fresh thyme leaves', amount: 1, unit: 'tbsp', group: 'Mayonnaise binder' },
  { id: 'paprika', name: 'Smoked paprika', amount: 1, unit: 'tsp', group: 'Mayonnaise binder' },
  { id: 'pepper', name: 'Freshly ground black pepper', amount: 1, unit: 'tsp', group: 'Mayonnaise binder' },
  { id: 'lemon', name: 'Lemon wedges, optional for finishing', amount: 1, unit: 'each', group: 'Finish' },
  { id: 'parsley', name: 'Flat-leaf parsley, chopped', amount: 2, unit: 'tbsp', group: 'Finish' },
];
export const groups = ['Pork chops', 'Mayonnaise binder', 'Finish'] as const;
export const equipment = ['Three-burner gas grill', 'Instant-read thermometer and grate-level ambient probe', 'Long tongs', 'Two clean plates or a rimmed sheet pan', 'Grill brush and heatproof gloves'];
export const sources = [
  { label: 'USDA FSIS: safe minimum internal temperatures', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart' },
  { label: 'USDA FSIS: doneness versus safety', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/doneness-versus-safety' },
  { label: 'USDA FSIS: food thermometers', url: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers' },
];
export function scaledIngredients(settings: Settings): Ingredient[] { if (parseServings(String(settings.servings)) === null) throw new RangeError('Unsupported serving count'); const factor = settings.servings / recipe.baseServings; return shared.map((item) => ({ ...item, amount: item.amount * factor })); }
export function amountLabel(item: Ingredient, unit: MeasureUnit) {
  if (unit === 'metric') { if (item.unit === 'lb') return `${numberLabel(item.amount * 453.592, 0)} g`; if (item.unit === 'oz') return `${numberLabel(item.amount * 28.3495, 0)} g`; if (['tsp', 'tbsp', 'cup'].includes(item.unit)) { const ml: Record<string, number> = { tsp: 4.92892, tbsp: 14.7868, cup: 236.588 }; return `${numberLabel(item.amount * ml[item.unit], 0)} mL`; } }
  return `${numberLabel(item.amount)} ${item.unit}`;
}
export type Step = { title: string; cue: string; body: string; science: string };
export function safetySentence(settings: Settings, unit?: TempUnit) { const resolvedUnit = unit ?? settings.tempUnit; return `Cook the thickest part of the pork to ${temp(recipe.finishF, resolvedUnit)}, then rest for at least 3 minutes.`; }
export function temperatureRows(settings: Settings) { const cut = variantFor(settings); return [
  { stage: 'Direct sear zone', value: recipe.searAmbientF, meaning: 'High heat at grate level for browning' },
  { stage: 'Indirect finish zone', value: recipe.grillAmbientF, meaning: 'Covered grill ambient beside the chops over OFF burners' },
  { stage: `Pork safety target · ${cut.shortName}`, value: recipe.finishF, meaning: 'Thickest part of the chop, avoiding bone' },
  { stage: 'Leftover reheating', value: 165, meaning: 'Reheat refrigerated leftovers to this temperature' },
]; }
export function methodSteps(settings: Settings): Step[] {
  const batch = vesselFor(settings);
  return [
    { title: 'Dry-brine the chops', cue: '30 min minimum · overnight is better', body: 'Pat the pork dry. Sprinkle the measured kosher salt evenly over every surface and place the chops uncovered on a rack or clean tray in the refrigerator. If you only have 30 minutes, leave them at room temperature for the final 20 minutes before grilling.', science: 'Salt first draws out a little moisture, then diffuses inward. The result is better seasoning throughout and a drier surface that browns more efficiently.' },
    { title: 'Mix the mayonnaise binder', cue: '5 min', body: 'Stir mayonnaise, Worcestershire, garlic, rosemary, thyme, smoked paprika and black pepper. Pat the chops dry again, then spread a thin, even coat over every surface—about 1–2 teaspoons per side. Let the coating sit while the grill preheats.', science: 'Mayonnaise is an emulsion of fat, water and egg. A thin layer helps herbs adhere, carries fat-soluble aromas and browns at the surface without needing a separate oil coat.' },
    { title: 'Choose your two-zone burner setup', cue: '450–500°F direct · 350–400°F indirect', body: 'Follow your grill manual’s lighting sequence. Choose which burners you want ON in the planner. Preheat a direct zone to 450–500°F and stabilize an OFF-burner zone at 350–400°F. Leave enough room to move every chop away from flare-ups. Nothing is preselected.', science: 'Two-zone grilling separates browning from doneness. You can build a crust over direct heat, then finish gently so the exterior does not burn while the center catches up.' },
    { title: 'Sear without chasing flames', cue: '2–3 min per side', body: `Clean and oil the grates if needed. Place the chops over the direct zone and sear 2–3 minutes per side, rotating once if you want crosshatch marks. If mayonnaise or rendered fat causes a flare-up, move the chop briefly to the OFF zone and close the lid. Do not press the meat.`, science: 'The browning reactions that create savory crust need dry surface heat. Pressing squeezes out juices, while uncontrolled flames char the binder before the pork is cooked.' },
    { title: 'Finish over the OFF zone', cue: `${batch.time} · probe at 140°F`, body: `Move every chop fully over the OFF burners, close the lid and hold 350–400°F. ${batch.timing} Begin checking in the thickest center, from the side, when the probe reads about 140°F. Remove the chop at 145°F; avoid touching the bone with the probe. Cooking time depends on thickness, not serving count.`, science: 'Carryover cooking can raise the center a few degrees during the short rest. The thermometer is the reliable endpoint; color, firmness and grill marks are not.' },
    { title: 'Rest and finish', cue: '145°F · rest at least 3 min', body: 'Move the chops to a clean platter and rest at least 3 minutes. Finish with parsley and, if you want brightness, a squeeze of lemon at the table. Refrigerate leftovers within 2 hours and reheat them to 165°F.', science: 'Resting lets heat equalize and juices redistribute. Acid is best added at the end here: it brightens the finished pork without exposing the grill or a pan to a long acidic cook.' },
  ];
}
