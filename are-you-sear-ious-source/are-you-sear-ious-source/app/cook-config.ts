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
    | 'tri-tip'
    | 'foil-boat'
    | 'prime-rib'
    | 'jerk-turkey'
    | 'shrimp'
    | 'achiote'
    | 'bbq-chicken'
    | 'burger'
    | 'lobster'
    | 'mayo-chop'
    | 'beef-ribs';
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
    id: 'holiday-rosemary-juniper-prime-rib',
    protein: 'Beef',
    name: 'Bone-in rib roast',
    baseId: 'pepper-ribeye',
    baseLb: 4,
    minLb: 3,
    maxLb: 12,
    method: 'Reverse sear, indirect first',
    grill: [250, 275],
    internal: [145],
    time: '2–5 hr + rest',
    rest: '20–30 minutes',
    timing:
      'Roughly 40 minutes a pound at this ambient, so a 4 lb roast is about two and a half hours and a 12 lb one is an all-afternoon cook. Shape and thickness move that more than weight does. First check at 60 minutes, then let the probe decide.',
    headline: ['Slow first.', 'Sear last.'],
    description:
      'A rosemary, juniper and orange crust over a long gentle cook, then a hard sear at the end to rebuild it. Cold horseradish cream alongside, and a rest longer than most people are willing to give it.',
    family: 'prime-rib',
  },
  {
    id: 'steakhouse-beef-bison-burgers',
    protein: 'Beef',
    name: 'Burgers, beef or bison',
    midSentenceName: 'ground beef or bison',
    baseId: 'pepper-ribeye',
    baseLb: 1.5,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct sear, two zones',
    grill: [450, 500],
    // Ground, not whole muscle. This is the only 160°F cut in the app.
    internal: [160],
    time: '8–14 min + rest',
    rest: '3 minutes',
    timing:
      'For patties ¾–1 inch thick, about three to five minutes a side. Thickness decides it, not how many you are cooking — a crowded grate just means working in batches.',
    headline: ['Ground meat.', 'Different rules.'],
    description:
      'A hard-seared, pepper-forward patty with grated onion worked through it, smoked cheddar and charred onion rounds. Beef or bison, and bison gets oil because it has almost no fat of its own.',
    family: 'burger',
  },
  {
    id: 'seariously-smothered-beef-ribs',
    protein: 'Beef',
    name: 'Bone-in beef short ribs',
    midSentenceName: 'English-cut bone-in beef short ribs',
    baseId: 'pepper-ribeye',
    baseLb: 4,
    minLb: 2,
    maxLb: 12,
    method: 'Indirect low heat',
    grill: [275, 300],
    internal: [200, 205],
    time: '4\u20138 hr + rest',
    rest: '15\u201320 minutes',
    timing:
      'Thickness decides this, not batch weight. Ribs carrying 2\u20133 inches of meat above the bone usually run 4\u20136 hours; 3\u20134 inch ribs take 5\u20138. Reckon on 1\u00bd\u20133 hours building the crust, then 2\u20134 hours covered, with the first probe 90 minutes after the foil goes on. English-cut only, not flanken or back ribs.',
    headline: ['Low and covered.', 'Sauce at the table.'],
    description:
      'A peppery mustard-bound rub, a shallow covered braise over the unlit side, then thin coats of brown sugar and Worcestershire brushed on once the meat is already tender. Half the sauce never meets the brush.',
    family: 'beef-ribs',
    attribution: {
      label:
        'Weber\u2019s braised and smoked short-rib methods, by Jamie Purviance and the Weber Grill Academy',
      url: 'https://www.weber.com/US/en/recipes/red-meat/beer-braised-and-mesquite-smoked-short-ribs/weber-7841.html',
      note: 'Not affiliated with, endorsed by, or sponsored by Weber-Stephen Products LLC. Consulted rather than adapted: those two published methods informed the shape of this one \u2014 a long indirect cook, a covered stage, then a glaze at the end \u2014 while the rub, the brown sugar and Worcestershire sauce and the shallow gas-grill pan are this project\u2019s own. No beer braise, bourbon glaze or charcoal setup is carried across. The illustration is AI-generated and is not Weber\u2019s photograph.',
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
    id: 'garlic-herb-mayonnaise-pork-chops',
    protein: 'Pork',
    name: 'Thick-cut pork chops',
    midSentenceName: 'pork chops, 1¼–1½ inches thick, bone-in or boneless',
    baseId: 'pork-shoulder',
    baseLb: 2.5,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct sear, then indirect',
    grill: [450, 500],
    internal: [145],
    time: '12–26 min + rest',
    rest: '3–5 minutes',
    timing:
      'Thickness decides this, not batch weight. Reckon 2–3 minutes a side to sear, then 8–16 minutes over the unlit zone for two chops and 10–20 for four, checking the centre 5–6 minutes after they move across. Boneless chops finish sooner than bone-in.',
    headline: ['Mayo goes on.', 'Crust comes off.'],
    description:
      'A thin garlic-herb mayonnaise coat that browns into a savoury crust, seared hot and then finished over the unlit side. The mayonnaise is a binder and a browning aid here, not a sauce.',
    family: 'mayo-chop',
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
    id: 'jerk-spiced-grilled-turkey-tenderloin',
    protein: 'Poultry',
    name: 'Turkey tenderloin',
    baseId: 'smoky-chicken',
    baseLb: 1.25,
    minLb: 0.5,
    maxLb: 12,
    method: 'Indirect, then a short sear',
    grill: [400, 425],
    internal: [165],
    time: '24–32 min + rest',
    rest: '5 minutes',
    timing:
      'For tenderloins of about 1–1½ lb each, turned once around the 12–15 minute mark. First check at 20 minutes. Once the centre reads 155–160°F it moves over direct heat to brown, and finishes there.',
    headline: ['Island heat.', 'Lean meat.'],
    description:
      'Allspice, thyme and cinnamon worked into a thin paste on lean turkey, cooked indirect so the spices never scorch, then half a minute a side to brown. Charred pineapple folded through at the end.',
    family: 'jerk-turkey',
  },
  {
    id: 'achiote-lime-grilled-boneless-chicken',
    protein: 'Poultry',
    name: 'Achiote-lime boneless thighs',
    midSentenceName: 'boneless, skinless chicken thighs',
    baseId: 'smoky-chicken',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct heat, turn once',
    grill: [425, 450],
    internal: [165],
    time: '10–16 min + rest',
    rest: '5 minutes',
    timing:
      'For boneless, skinless thighs of roughly even thickness. Five to eight minutes on the first side, then turn once and let the probe finish it. The marinade is 20–30 minutes and no longer.',
    headline: ['Red paste.', 'Sharp lime.'],
    description:
      'Achiote paste, lime and a little honey on boneless thighs over straight direct heat. A short marinade only: leave it in overnight and the lime goes to work on the surface without you.',
    family: 'achiote',
  },
  {
    id: 'sauce-heavy-bbq-boneless-chicken',
    protein: 'Poultry',
    name: 'BBQ boneless thighs',
    midSentenceName: 'boneless, skinless chicken thighs',
    baseId: 'smoky-chicken',
    baseLb: 2,
    minLb: 0.5,
    maxLb: 12,
    method: 'Direct, then sauced indirect',
    grill: [400, 425],
    internal: [165],
    time: '14–22 min + rest',
    rest: '5 minutes',
    timing:
      'Sear three to four minutes a side, move to the unlit zone until the thickest piece is around 150–155°F, then four to six minutes of saucing. The sauce only goes on at the end, because sugar burns.',
    headline: ['Thin coats.', 'Real lacquer.'],
    description:
      'Boneless thighs grilled clean first, then painted with a sticky sauce in thin coats right at the end. Half the sauce never touches raw chicken and goes on at the table.',
    family: 'bbq-chicken',
  },
  {
    id: 'lemon-salmon',
    protein: 'Seafood',
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
    protein: 'Seafood',
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
    protein: 'Seafood',
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
  {
    id: 'lemon-pepper-walleye',
    protein: 'Seafood',
    name: 'Walleye fillets',
    baseId: 'lemon-salmon',
    baseLb: 1,
    minLb: 0.25,
    maxLb: 8,
    method: 'Foil boat over indirect heat',
    grill: [375, 400],
    internal: [145],
    time: '8–25 min',
    // Fish needs no rest at this target; the 3-minute rule is for whole
    // cuts of beef and pork, not fillets.
    rest: 'None needed · serve hot',
    timing:
      'Thickness decides this one, not weight. About 8–14 minutes for a ¼–½ inch fillet, 12–20 for ½–¾ inch, and 16–25 for ¾–1 inch. Start checking well before the low end.',
    headline: ['Foil boat.', 'Nothing to flip.'],
    description:
      'Butter and lemon pepper in a shallow open foil boat, sat over an unlit burner with the lid down. The boat holds a delicate fillet together and keeps the butter where it belongs.',
    family: 'foil-boat',
    attribution: {
      label: 'Fishing Addiction Gear’s foil-grilled walleye',
      url: 'https://fishingaddictiongear.com/blogs/fishin-talk/walleye-recipe-grilled-in-foil',
      note: 'Not affiliated with, endorsed by, or sponsored by any publisher named here. Written independently rather than adapted: the closest published method seals its foil into a packet and seasons it differently, while this keeps the boat open over an unlit zone and uses lemon pepper. Lake of the Woods’ “Walleye Delight” was the nearest flavour reference. The illustration is AI-generated, and the finish follows USDA guidance rather than the lower figure in the older texture research.',
    },
  },
  {
    id: 'chimichurri-orange-grilled-shrimp',
    protein: 'Seafood',
    name: 'Jumbo shrimp',
    baseId: 'lemon-salmon',
    baseLb: 1,
    minLb: 0.25,
    maxLb: 8,
    method: 'Direct high heat',
    grill: [450, 475],
    internal: [145],
    time: '4–6 min',
    rest: 'None needed · serve hot',
    timing:
      'About 2 minutes, turn once, then 2–4 minutes more. Jumbo shrimp at this heat go from translucent to rubbery inside a minute, so this is not one to walk away from. Smaller shrimp are faster still.',
    headline: ['Four minutes.', 'Do not wander.'],
    description:
      'A garlicky herb chimichurri split in two — half to dress the raw shrimp, half held back for the plate — with orange halves charred alongside and squeezed over at the end.',
    family: 'shrimp',
  },
  {
    id: 'champagne-garlic-butter-bath-lobster-tails',
    protein: 'Seafood',
    name: 'Lobster tails',
    baseId: 'lemon-salmon',
    baseLb: 1,
    minLb: 0.25,
    maxLb: 8,
    method: 'Butter bath over an unlit zone',
    grill: [325, 350],
    internal: [145],
    time: '8–22 min + rest',
    rest: '1–2 minutes',
    timing:
      'Tail size decides this, not batch weight. Reckon 8–12 minutes for 4–6 oz tails with a first check at 6, 12–16 for 7–9 oz checking at 9, and 16–22 for 10–12 oz checking at 12.',
    headline: ['Gentle bath.', 'Pearly meat.'],
    description:
      'Split tails nestled shell-down in a shallow pan of butter, sparkling wine, garlic and tarragon, sat over an unlit burner and basted. No flipping, no direct flame, and the basting butter never reaches the table.',
    family: 'lobster',
  },
];
export const defaultCuts: Record<Protein, string> = {
  Beef: 'pepper-ribeye',
  Pork: 'pork-shoulder',
  Poultry: 'smoky-chicken',
  Seafood: 'lemon-salmon',
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
  | 'triTip'
  | 'foilBoat'
  | 'primeRib'
  | 'jerkTurkey'
  | 'shrimp'
  | 'achiote'
  | 'bbqChicken'
  | 'burger'
  | 'lobster'
  | 'mayoChop'
  | 'beefRibs';
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
  // No mustard binder and no dry rub: the boat is the technique, and the
  // butter is what carries the seasoning onto the fish.
  foilBoat: [
    {
      title: 'Butter & seasoning',
      items: [
        m(2, 'tbsp', 'unsalted butter, cut into small pieces'),
        m(1, 'tsp', 'lemon-pepper seasoning; read the label for salt'),
        m(
          1,
          'tsp',
          'fresh lemon juice, added on the plate rather than the grill',
        ),
      ],
    },
    {
      title: 'The boat itself',
      items: [
        'Heavy-duty aluminium foil, doubled, sides folded up 1–2 inches with the corners crimped tight',
      ],
    },
  ],
  primeRib: [
    {
      title: 'Rosemary–juniper crust',
      items: [
        m(2, 'tbsp', 'coarse black pepper'),
        m(2, 'tbsp', 'fresh rosemary, minced'),
        m(1, 'tbsp', 'fresh thyme, minced'),
        m(6, 'clove(s)', 'fresh garlic, grated'),
        m(1, 'tbsp', 'juniper berries, crushed'),
        m(1, 'tbsp', 'orange zest'),
        m(2, 'tbsp', 'olive oil'),
      ],
    },
    {
      title: 'Horseradish cream · served cold',
      items: [
        m(1, 'cup', 'sour cream'),
        m(
          0.5,
          'cup',
          'prepared horseradish; a strong ratio, so start lower and pass more at the table',
        ),
        m(2, 'tbsp', 'Dijon mustard'),
        m(1, 'tbsp', 'fresh lemon juice'),
        m(2, 'tbsp', 'chives, sliced'),
      ],
    },
  ],
  jerkTurkey: [
    {
      title: 'Jerk paste · salt already counted above',
      items: [
        m(1, 'tbsp', 'fresh lime juice'),
        m(1, 'tbsp', 'neutral oil'),
        m(2, 'tsp', 'ground allspice'),
        m(1, 'tsp', 'dried thyme'),
        m(1, 'tsp', 'smoked paprika'),
        m(0.5, 'tsp', 'ground cinnamon'),
        m(0.5, 'tsp', 'black pepper'),
      ],
    },
    {
      title: 'Charred pineapple salsa',
      items: [
        m(1, 'cup', 'pineapple, diced'),
        m(0.25, 'cup', 'red onion and scallion, finely chopped'),
      ],
    },
  ],
  shrimp: [
    {
      title: 'Chimichurri · half dresses the shrimp, half is served',
      items: [
        m(1, 'cup', 'parsley and cilantro, finely chopped'),
        m(2, 'clove(s)', 'fresh garlic, grated'),
        m(3, 'tbsp', 'olive oil'),
        m(1, 'tbsp', 'red-wine vinegar'),
        m(1, 'tsp', 'smoked paprika'),
        m(0.25, 'tsp', 'red pepper flakes'),
      ],
    },
    {
      title: 'Citrus',
      items: [
        m(
          1,
          'orange(s)',
          'zested into the chimichurri, then halved and charred cut-side down',
        ),
      ],
    },
  ],
  achiote: [
    {
      title: 'Achiote marinade · salt already counted above',
      items: [
        m(3, 'tbsp', 'achiote paste'),
        m(3, 'tbsp', 'fresh lime juice'),
        m(1, 'tsp', 'lime zest'),
        m(2, 'tbsp', 'neutral oil'),
        m(1, 'tbsp', 'honey'),
        m(1, 'tsp', 'ground cumin'),
        m(1, 'tsp', 'Mexican oregano'),
        m(3, 'clove(s)', 'fresh garlic, grated'),
        m(0.5, 'tsp', 'black pepper'),
      ],
    },
  ],
  bbqChicken: [
    {
      title: 'Dry rub · salt already counted above',
      items: [
        m(2, 'tsp', 'smoked paprika'),
        m(1, 'tsp', 'garlic powder'),
        m(1, 'tsp', 'onion powder'),
        m(1, 'tsp', 'black pepper'),
        m(0.25, 'tsp', 'cayenne'),
      ],
    },
    {
      title: 'BBQ sauce · half of it is reserved clean',
      items: [
        m(0.75, 'cup', 'ketchup'),
        m(3, 'tbsp', 'molasses'),
        m(2, 'tbsp', 'apple cider vinegar'),
        m(2, 'tbsp', 'brown sugar'),
        m(1, 'tbsp', 'Worcestershire sauce'),
        m(1, 'tsp', 'smoked paprika, in the sauce as well as the rub'),
        m(1, 'tbsp', 'hot sauce'),
      ],
    },
  ],
  burger: [
    {
      title: 'Worked into the patties · salt already counted above',
      items: [
        m(2, 'tbsp', 'Worcestershire sauce'),
        m(1, 'tsp', 'coarse black pepper'),
        m(2, 'tsp', 'SPG seasoning; check the label, most are salt-first'),
        m(1, 'clove(s)', 'fresh garlic, grated'),
        m(0.25, 'small', 'yellow onion, grated and squeezed dry'),
        m(2, 'tbsp', 'olive oil per pound, for bison only; beef needs none'),
      ],
    },
    {
      title: 'The build',
      items: [
        m(4, 'slice(s)', 'smoked cheddar'),
        m(1, 'large', 'yellow onion, cut into thick rounds for the grill'),
        m(4, '', 'brioche buns'),
        'Pickles and your preferred steakhouse or peppercorn sauce, to finish',
      ],
    },
  ],
  lobster: [
    {
      title: 'The butter bath · salt already counted above',
      items: [
        m(6, 'tbsp', 'unsalted butter'),
        m(0.25, 'cup', 'dry sparkling wine'),
        m(2, 'clove(s)', 'fresh garlic, finely grated'),
        m(1, 'tsp', 'lemon zest'),
        m(1, 'tbsp', 'fresh tarragon, chopped'),
        m(1, 'tbsp', 'fresh chives, sliced; keep half back for serving'),
        m(0.25, 'tsp', 'smoked paprika'),
      ],
    },
    {
      title: 'To finish · kept clean, never basted with',
      items: [m(1, 'tbsp', 'fresh lemon juice')],
    },
  ],
  beefRibs: [
    {
      title: 'Mustard binder & peppery rub \u00b7 salt already counted above',
      items: [
        m(2, 'tbsp', 'yellow mustard, for a thin binder coat'),
        m(1, 'tbsp', 'coarse black pepper'),
        m(2, 'tsp', 'garlic powder'),
        m(1, 'tsp', 'onion powder'),
        m(2, 'tsp', 'smoked paprika'),
      ],
    },
    {
      title: 'Shallow braise \u00b7 the pan sets the depth, not the recipe',
      items: [
        m(0.75, 'cup', 'unsalted beef stock'),
        m(1, 'tbsp', 'apple cider vinegar, for the pan'),
        'Hot water as needed to hold about \u00bc inch of liquid under the ribs',
      ],
    },
    {
      title: 'Brown sugar sauce \u00b7 half of it is reserved clean',
      items: [
        m(1.5, 'cup', 'ketchup'),
        m(0.25, 'cup', 'dark brown sugar, packed'),
        m(2, 'tbsp', 'unsulphured molasses'),
        m(3, 'tbsp', 'Worcestershire sauce'),
        m(3, 'tbsp', 'apple cider vinegar, for the sauce'),
        m(0.25, 'cup', 'water, plus a splash to loosen it'),
        m(1, 'tsp', 'garlic powder, in the sauce as well as the rub'),
        m(1, 'tsp', 'smoked paprika, in the sauce as well as the rub'),
        m(1, 'tsp', 'black pepper'),
        m(0.125, 'tsp', 'cayenne, optional'),
        m(2, 'tbsp', 'unsalted butter, whisked in off the heat'),
      ],
    },
  ],
  mayoChop: [
    {
      title: 'Garlic-herb mayonnaise binder · salt already counted above',
      items: [
        m(0.5, 'cup', 'mayonnaise'),
        m(1, 'tbsp', 'Worcestershire sauce'),
        m(2, 'clove(s)', 'fresh garlic, finely grated'),
        m(1, 'tbsp', 'fresh rosemary, finely chopped'),
        m(1, 'tbsp', 'fresh thyme leaves'),
        m(1, 'tsp', 'smoked paprika'),
        m(1, 'tsp', 'coarse black pepper'),
      ],
    },
    {
      title: 'To finish',
      items: [
        m(2, 'tbsp', 'chopped parsley'),
        m(1, 'lemon(s)', 'cut into wedges for the table, optional'),
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
  // Both halves of this sentence are family-specific: a shrimp is not "meat",
  // and telling a foil-boat cook "not again in the rub" names a step that
  // recipe does not have.
  const saltNoun =
    f === 'shrimp'
      ? 'shrimp'
      : f === 'lobster'
        ? 'lobster'
        : cut.protein === 'Seafood'
          ? 'fish'
          : 'meat';
  const saltUse =
    f === 'burger'
      ? 'mixed in at the grill, not ahead — salting ground meat early turns it springy'
      : f === 'beef-ribs'
        ? 'use once on the ribs, not again in the rub and not in the sauce'
        : f === 'mayo-chop'
          ? 'use once on the chops ahead of time, not again in the binder'
          : f === 'lobster'
            ? 'split between the meat and the bath'
            : f === 'foil-boat'
              ? 'use once, and only if your lemon pepper is salt-free'
              : f === 'shrimp'
                ? 'stirred into the chimichurri, not sprinkled on separately'
                : f === 'prime-rib'
                  ? 'use once, on the roast the night before, not again in the crust'
                  : f === 'jerk-turkey'
                    ? 'use once, mixed into the paste'
                    : 'use once, not again in the rub';
  const saltLine =
    salt +
    ' (no scale? about ' +
    saltVolumes(saltGrams) +
    ') total for the ' +
    saltNoun +
    ' — ' +
    saltUse;
  const group: SeasoningGroup =
    f === 'beef-ribs'
      ? 'beefRibs'
      : f === 'mayo-chop'
        ? 'mayoChop'
        : f === 'burger'
          ? 'burger'
          : f === 'lobster'
            ? 'lobster'
            : f === 'achiote'
              ? 'achiote'
              : f === 'bbq-chicken'
                ? 'bbqChicken'
                : f === 'prime-rib'
                  ? 'primeRib'
                  : f === 'jerk-turkey'
                    ? 'jerkTurkey'
                    : f === 'shrimp'
                      ? 'shrimp'
                      : f === 'foil-boat'
                        ? 'foilBoat'
                        : f === 'tri-tip'
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
      title: 'Your ' + saltNoun + ' & salt',
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
    f === 'beef-ribs'
      ? 'Whole beef cuts reach their safety minimum at 145\u00b0F with a 3-minute rest. Short ribs go far past that, and not for safety \u2014 the long covered cook is what softens the connective tissue. Reheat leftovers to 165\u00b0F.'
      : f === 'burger'
        ? 'Ground beef and ground bison: 160°F, measured in the centre of every patty. Grinding spreads surface bacteria right through the meat, which is why this is higher than the 145°F used for whole cuts of beef.'
        : cut.protein === 'Poultry'
          ? 'Chicken must reach 165°F in every piece. Thighs and drumsticks can go higher for tenderness.'
          : cut.protein === 'Seafood'
            ? 'Fish and shellfish must reach 145°F in the thickest part before leaving the grill.'
            : cut.protein === 'Beef'
              ? 'Whole beef cuts — steaks, roasts and chops alike: at least 145°F before removal, followed by a 3-minute rest.'
              : 'Whole pork: at least 145°F before removal, followed by a 3-minute rest.';
  const finish =
    f === 'beef-ribs'
      ? 'Probe several meaty spots away from the bone and stop when it glides in with almost no resistance, usually around 200\u2013205\u00b0F. That is a tenderness reading rather than the safety number, and a rib that still feels tight is not finished whatever the probe says.'
      : f === 'mayo-chop'
        ? 'At least 145°F in the thickest part of every chop, then a 3-minute rest. The binder is fat, so the crust browns early and the colour arrives well before the centre does.'
        : f === 'burger'
          ? 'Every patty reaches 160°F in its centre before it leaves the grill, then rests 3 minutes. A safe burger can still be pink; colour is not a doneness test.'
          : f === 'lobster'
            ? 'Each tail comes out at 145°F in the thickest meat. Pearly and opaque is the clue, the probe is the decision, and the shell and pan both read hotter than the lobster.'
            : f === 'achiote'
              ? 'Every thigh reaches 165°F in its thickest part before it comes off. Colour and clear juices prove nothing, least of all under a red marinade.'
              : f === 'bbq-chicken'
                ? 'Every thigh reaches 165°F in its thickest part before it comes off. Probe under the glaze; sauce colour is not a doneness reading.'
                : f === 'prime-rib'
                  ? 'At least 145°F in the centre before it is carved and served, then rest. Three minutes is the safety minimum; 20–30 is what a roast this size actually wants. The sear does not count toward the endpoint.'
                  : f === 'jerk-turkey'
                    ? 'Every part of the tenderloin reaches 165°F before it comes off. That is the poultry endpoint, not the 145°F used for whole cuts of beef and pork.'
                    : f === 'shrimp'
                      ? 'Take them off at 145°F in the thickest shrimp. Opaque flesh is a clue, not a reading, and no rest is needed.'
                      : f === 'foil-boat'
                        ? 'Every fillet reaches 145°F in its thickest part before it leaves the boat. Flaking is a clue, not a reading, and fish needs no rest at this target.'
                        : f === 'tri-tip'
                          ? 'Reach at least 145°F in the thickest part before it leaves the grill, then rest 10–15 minutes. Three minutes is the safety minimum; the rest of it is for the slicing.'
                          : f === 'shoulder'
                            ? 'Pull-apart target: 195–205°F. Probe several thick spots; finish when it slides in with almost no resistance.'
                            : f === 'thigh' || f === 'drumstick'
                              ? 'For tender dark meat, aim for 175–185°F. The poultry safety minimum is 165°F.'
                              : cut.protein === 'Poultry'
                                ? 'Reach 165°F in the thickest part of every breast.'
                                : cut.protein === 'Seafood'
                                  ? 'Reach 145°F at the center of the thickest part.'
                                  : 'Reach 145°F before removing from heat, then rest at least 3 minutes.';
  const prepTime =
    f === 'beef-ribs'
      ? '15 min prep \u00b7 4\u201324 hr ahead, optional'
      : f === 'mayo-chop'
        ? '30 min ahead, or overnight'
        : f === 'burger'
          ? 'Season at the grill, not ahead'
          : f === 'lobster'
            ? '10 min prep'
            : f === 'achiote'
              ? '20–30 min marinade, no longer'
              : f === 'bbq-chicken'
                ? '15–30 min'
                : f === 'shrimp'
                  ? '15 min in the marinade, no longer'
                  : f === 'prime-rib'
                    ? '12–24 hr ahead'
                    : f === 'jerk-turkey'
                      ? 'Just before cooking'
                      : f === 'tri-tip'
                        ? '4–24 hr ahead, optional'
                        : f === 'shoulder'
                          ? '12–24 hr ahead, optional'
                          : cut.protein === 'Poultry'
                            ? '2–12 hr ahead, optional'
                            : f === 'fish' || f === 'foil-boat'
                              ? 'Just before cooking'
                              : '2–4 hr ahead, optional';
  // Each family opens differently, so the opener is picked as a whole Step.
  // Title and body used to be two parallel ladders that had to be kept in
  // step with each other by hand.
  const openers: Partial<Record<Cut['family'], Step>> = {
    'foil-boat': {
      title: 'Read the label, then salt',
      cue: prepTime,
      body: `Thaw the fillets in the refrigerator and follow whatever the packet says — vacuum-packed fish usually wants opening before it thaws. Pat them dry and run a finger over each one for pin bones. Now read your lemon-pepper label, because it decides what happens next: most supermarket blends list salt first, and using one of those on top of the listed ${salt} will over-salt a thin fillet badly. Use the full measured salt only if your blend is salt-free. Otherwise cut it right back, or leave it out and let the seasoning do the job. Skin can stay on; it goes down against the foil. Keep everything cold until the grill is ready.`,
    },
    fish: {
      title: 'Season lightly',
      cue: prepTime,
      body: `Pat the fish dry and remove pin bones. Use the listed ${salt} across the batch, then brush the flesh with Dijon and add the pepper, garlic, and zest. Keep it refrigerated until the grill is ready.`,
    },
    'tri-tip': {
      title: 'Map the grain. Salt once.',
      cue: prepTime,
      body: `Before anything goes on the meat, find where the grain changes direction and note it — the rub will hide it, and you need it again at the end. Trim silverskin and hard fat without cutting away good meat. Spread the listed ${salt} over the whole roast and refrigerate it uncovered on a rack for 4–24 hours if you have the time. That is the entire salt allowance for the meat, not an extra brine on top of the rub. Cooking now instead? Apply the same salt just before the mustard. For enhanced, injected, koshered, or already-salted beef, skip this added salt.`,
    },
    'prime-rib': {
      title: 'Salt early. Crust later.',
      cue: prepTime,
      body: `Pat the roast dry and season it all over with the listed ${salt}, then leave it uncovered on a rack in the refrigerator for 12–24 hours. Salt needs that time to work inward; a roast this thick is the one cut where skipping it is genuinely noticeable. The herb paste goes on much later — mix the pepper, rosemary, thyme, juniper, garlic, orange zest and oil into a rough paste shortly before it goes on the grill, and press it over the roast with only a light coat on the bone side. Rosemary and juniper left out overnight go dull and papery, which is why they are not part of the overnight step.`,
    },
    'jerk-turkey': {
      title: 'Mix the paste, keep it thin',
      cue: prepTime,
      body: `Stir the lime juice, oil, allspice, thyme, paprika, cinnamon and pepper together with the listed ${salt} into a loose paste, and rub it over the tenderloin. Keep it thin: a wet coating steams rather than browns, and this cut gets only about half a minute a side of direct heat at the end to fix that. Toss the pineapple, red onion and scallion together separately with a pinch of salt — keep that bowl well away from the raw turkey and its paste. Chill the turkey while the grill comes up.`,
    },
    burger: {
      title: 'Mix cold. Shape loose. Salt late.',
      cue: prepTime,
      body: `Keep the meat cold and work it as little as you can get away with: fold the Worcestershire, pepper, SPG, garlic and squeezed onion through it just until combined, and stop. Overworking ground meat turns it springy and sausage-like. For bison add the listed oil, because it carries almost none of its own fat and will otherwise eat dry. Shape patties three-quarters to an inch thick with a shallow dimple pressed into the middle, which stops them doming as they cook. Two things about salt: the listed ${salt} goes on **at the grill and not before**, since salting ground meat in advance dissolves its proteins and gives you the same springy texture; and most SPG blends are salt-first, so if yours is, cut that measured salt right back or leave it out.`,
    },
    lobster: {
      title: 'Split the shell, lift the meat',
      cue: prepTime,
      body: `Thaw the tails in the refrigerator. Cut down the top of each shell lengthwise with kitchen shears, stopping before the tail fan, then loosen the meat and lift it so it rides on top of the shell rather than sitting inside it. Leave it attached at the base. Pull out the dark vein if there is one, and pat everything dry. Season the exposed meat with part of the listed ${salt} and a little of the smoked paprika, keeping the rest of both for the bath. The shell is doing a job here: it cradles the underside and keeps that side from overcooking while the top takes the gentle heat.`,
    },
    achiote: {
      title: 'Marinate, but not for long',
      cue: prepTime,
      body: `Whisk the achiote paste, lime juice and zest, oil, honey, cumin, oregano, garlic, black pepper and the listed ${salt} into a loose marinade, then coat the thighs and refrigerate them while the grill heats. Twenty to thirty minutes, and no more. This is a lime-heavy mixture: left overnight the acid tightens the outside of the meat while the centre stays exactly as it was, so you end up with a firm surface and no more flavour than half an hour would have given you. Open out any thighs that are folded over on themselves, or the thick fold will still be behind when the rest is done.`,
    },
    'bbq-chicken': {
      title: 'Season, then split the sauce',
      cue: prepTime,
      body: `Mix the smoked paprika, garlic powder, onion powder, black pepper, cayenne and the listed ${salt}, and season the thighs all over with it. Then stir the sauce together: ketchup, molasses, vinegar, brown sugar, Worcestershire, the second smaller measure of smoked paprika, and the hot sauce. Now divide that sauce in two before any of it goes near raw chicken. Half into a clean bowl for the table, half for brushing during the cook. Use a separate brush for each, and never carry the brushing half back to the table at the end.`,
    },
    'beef-ribs': {
      title: 'Mustard, pepper, and a little patience',
      cue: prepTime,
      body: `Thaw the ribs in the refrigerator. Pat them dry and trim hard surface fat and any silverskin you can reach, keeping the meat attached to each bone. Brush on a thin film of the measured mustard, mix the pepper, garlic powder, onion powder and smoked paprika with the listed ${salt}, and season every meaty side. Cook now, or refrigerate them uncovered for 4\u201324 hours \u2014 if you season ahead, that is the whole salt allowance and none goes on again later. For enhanced or already-brined beef, skip the added salt.`,
    },
    'mayo-chop': {
      title: 'Salt the chops, keep the surface dry',
      cue: prepTime,
      body: `Pat the chops dry and season them all over with the listed ${salt}, then leave them uncovered on a rack in the refrigerator for anything from 30 minutes to overnight. That is the whole salt allowance for the meat — the binder that goes on later carries none of its own. If half an hour is all you have, give them the last 20 minutes out of the refrigerator so they are not going onto the grill fridge-cold. For enhanced, injected, koshered or already-brined pork, skip this added salt.`,
    },
    shrimp: {
      title: 'Chimichurri, then a short marinade',
      cue: prepTime,
      body: `Stir the herbs, garlic, oil, vinegar, orange zest, paprika, pepper flakes and the listed ${salt} together. Now split it: half goes on the raw shrimp, half is set aside for serving and must not touch them. Toss the shrimp in their half for no more than 15 minutes while the grill heats, and no longer — the vinegar and orange start firming the surface before any heat does, and shrimp left sitting in acid turn chalky. Peel and devein first if that has not been done.`,
    },
  };
  const steps: [Step, ...Step[]] = [
    openers[f] ?? {
      title: 'Salt ahead. Mustard later.',
      cue: prepTime,
      body: `Use the listed ${salt} once across the meat. Refrigerate on a rack ${f === 'shoulder' ? '12–24 hours' : cut.protein === 'Poultry' ? '2–12 hours' : '2–4 hours'} if time allows. Just before grilling, pat any wet patches dry, add a thin mustard coat, and apply the salt-free rub. If cooking immediately, apply the same measured salt just before the mustard and rub. For injected, enhanced, koshered, or already salted meat, skip the added dry-brine salt.`,
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
  else if (f === 'foil-boat')
    steps.push(
      {
        title: 'Build the boat',
        cue: 'About 5 min · leave the top open',
        body: 'Double a sheet of heavy-duty foil, fold the sides up an inch or two and crimp the corners tight so melted butter cannot run out. Keep the bottom flat and the top open. A sealed packet steams the fish, which is a different cook and not this one. Grease the base with a little of the measured butter and lay the fillets in a single layer, skin down if they have it. Fold any very thin tail back under itself so it does not overcook before the rest.',
      },
      {
        title: 'Butter and season',
        cue: 'Lemon juice waits for the plate',
        body: 'Scatter the lemon pepper evenly over the fish, then dot the rest of the butter across the fillets. That is the whole seasoning — no binder, no rub, nothing to press on. Hold the fresh lemon juice back until the fish is cooked and plated; adding it now just dilutes the butter and does nothing for the flavour.',
      },
      {
        title: 'Set an unlit zone for the boat',
        cue: 'Grill ambient: 375–400°F · lid closed',
        body: 'Follow your grill’s lighting sequence, preheat and clean the grates. You choose which burners are lit, but keep at least one going and leave an unlit area big enough for the whole boat. Read the air beside the fish at grate level and settle it at 375–400°F — the lid gauge measures somewhere else entirely. Never lay foil across the whole grate or block the vents.',
      },
      {
        title: 'Lid down, boat open',
        cue: 'First check at 6–12 min by thickness',
        body: 'Sit the boat over the unlit area and close the lid. Nothing gets flipped. Check at 6 minutes for a thin fillet, 8 for a medium one, 12 for anything near an inch. Rotate the boat if one end is running ahead. Spoon a little of the melted butter back over the top if you like. If the butter is browning hard or drying out, move the boat further from the lit burners and check the ambient temperature before you touch the fish.',
      },
      {
        title: 'Probe every fillet, then serve',
        cue: 'Internal: 145°F in each one',
        body: 'Slide the probe in sideways through the thickest part of each fillet, keeping it clear of the foil, which will read hot. Every fillet needs 145°F before it comes off — easy flaking is a hint, not a measurement. Support the boat underneath with a wide spatula and slide the whole thing onto a rimmed tray; use gloves and mind the hot butter. Lift the fish onto plates, spoon the butter over, and add the lemon juice now. Fish needs no resting time at this target. Refrigerate leftovers within 2 hours, or within 1 hour if it is above 90°F out.',
      },
    );
  else if (f === 'burger')
    steps.push(
      {
        title: 'Two zones, and a hot one',
        cue: 'Grill ambient: 450–500°F',
        body: 'Follow your grill’s lighting sequence, get the direct zone properly hot and clean the grates, then oil them. Leave a cooler or unlit side free. Burgers drip fat onto burners and flare, and the cooler side is where you move them when that happens rather than standing there watching them blacken.',
      },
      {
        title: 'Sear hard, and flip once',
        cue: 'About 3–5 minutes a side',
        body: 'Lay the patties over the direct zone and leave them alone for three to five minutes, then flip once. Do not press them — every drop that hisses onto the burners is juice that has left the burger, and it buys you nothing but a flare-up. If the crust is running ahead of the centre, move them to the cooler side and close the lid.',
      },
      {
        title: 'Cheese, onions, buns',
        cue: 'Final 2 minutes',
        body: 'Lay the smoked cheddar on for the last minute or two and close the lid; trapped heat melts it far better than direct flame. Put the thick onion rounds on beside the burgers until they are marked and softened, and toast the buns cut-side down for the last minute. Watch them — buns go from toasted to charcoal in well under a minute at this heat.',
      },
      {
        title: 'Probe every patty',
        cue: 'Internal 160°F · rest 3 min',
        body: 'Slide the probe in sideways through the centre of each patty, not down through the top. Every one needs 160°F. This is the one cut here that is not 145°F, because grinding takes whatever was on the surface of the meat and distributes it throughout, so the centre has to get hot enough to deal with it. A safe burger can still look pink inside — colour has never been a doneness test, and in ground meat it is a particularly bad one. Rest three minutes, then build with the charred onion, pickles and sauce.',
      },
    );
  else if (f === 'lobster')
    steps.push(
      {
        title: 'Start the butter bath',
        cue: 'Grill ambient: 325–350°F · 3–5 min',
        body: 'Follow your grill’s lighting sequence and settle it at 325–350°F measured at grate level beside the pan. Set a shallow pan over the **unlit** zone and add the butter, sparkling wine, garlic, lemon zest, tarragon, half the chives and the rest of the paprika and salt. Let it melt and come together gently. An unlit burner is still a cooking zone — the pan is heated by the air and the surfaces around it, which is exactly the point. Put it over a live flame and the butter splits and scorches from underneath.',
      },
      {
        title: 'Bathe and baste, never flip',
        cue: 'Baste every 3–4 minutes',
        body: 'Nestle the tails shell-side down in the bath so the meat sits above the butter rather than under it, spoon butter over the exposed meat and close the lid. Baste every three or four minutes, and rotate the pan if one end of the grill runs hotter. The tails do not get turned at any point. Start probing at the first-check time for your tail size: six minutes for small, nine for medium, twelve for jumbo.',
      },
      {
        title: 'Probe, then finish bright',
        cue: 'Internal 145°F · rest 1–2 min',
        body: 'Slide a thin probe sideways into the thickest part of the meat, keeping it clear of both the shell and the pan, which read hotter than the lobster does. Take each tail out at 145°F; the meat should look pearly and opaque by then, though that is the clue and the probe is the decision. Neither the wine nor the lemon makes undercooked shellfish safe. Rest one to two minutes. Finish with the reserved lemon juice and the chives you held back, and if you want butter on the table, warm a clean portion for it — the basting butter has been sitting with raw lobster in it all cook and does not come to the table.',
      },
    );
  else if (f === 'achiote')
    steps.push(
      {
        title: 'Grill hot and clean',
        cue: 'Grill ambient: 425–450°F',
        body: 'Follow your grill’s lighting sequence, get the direct zone to 425–450°F at grate level, then clean the grates and oil them lightly. Leave one cooler edge or unlit patch free — you will want it. Lift each thigh out of the marinade and let the excess run off before it goes on: a wet coating steams and then scorches instead of browning, and the marinade left in the dish is not a sauce.',
      },
      {
        title: 'Turn once and watch the colour',
        cue: 'About 5–8 minutes on the first side',
        body: 'Lay the thighs down smooth side first and close the lid. Give them five to eight minutes, turn once, and leave them alone. Achiote is deep red before it meets any heat and there is honey in the marinade, so this will look further along than it is — that is exactly the trap. If it is darkening faster than the centre is cooking, move it to the cooler edge and keep the lid closed.',
      },
      {
        title: 'Probe, rest, and build the tacos',
        cue: 'Internal 165°F · rest 5 min',
        body: 'Probe sideways into the thickest thigh and take it off only at 165°F. Colour and clear juices prove nothing here, least of all under a red marinade. Move it to a clean tray, rest five minutes, then slice across the grain. Serve it with warm tortillas, charred lime, cilantro, pickled onion and avocado, and use a clean board and knife rather than the ones the raw chicken touched.',
      },
    );
  else if (f === 'bbq-chicken')
    steps.push(
      {
        title: 'Grill it clean before any sauce',
        cue: 'Sear 3–4 minutes a side · 400–425°F',
        body: 'Follow your grill’s lighting sequence, hold 400–425°F at grate level and clean the grates. Sear the thighs over direct heat for three to four minutes a side to get colour on them, then move them over the unlit zone and close the lid. Keep going there until the thickest piece is around 150–155°F. No sauce yet — none of it goes on while the chicken still has this much cooking left.',
      },
      {
        title: 'Paint, turn, paint again',
        cue: 'Final 4–6 minutes',
        body: 'Brush a thin layer of the brushing half over the chicken, close the lid for a minute or two, turn, and brush again. Repeat once or twice over the unlit zone. Thin coats are the whole technique: each one sets and dries before the next goes on, and that is what builds a lacquer. One thick coat does the opposite — the outside burns while the inside of the layer is still wet. If you want a little more tack and char at the very end, a short spell over direct heat will do it, but stand there and watch it, because this sauce is mostly sugar.',
      },
      {
        title: 'Probe, rest, and use the clean half',
        cue: 'Internal 165°F · rest 5 min',
        body: 'Probe the thickest thigh sideways, under the glaze rather than through it, and remove only at 165°F. Sauce colour tells you nothing about the centre. Rest five minutes on a clean tray, then spoon or brush over the half of the sauce you set aside at the start — the half that never met the raw-chicken brush. Pickles, toasted buns or slaw, and refrigerate leftovers within 2 hours.',
      },
    );
  else if (f === 'prime-rib')
    steps.push(
      {
        title: 'Set the grill for a gentle roast',
        cue: 'Grill ambient: 250–275°F',
        body: 'Follow your grill’s lighting sequence and settle the air at grate level to 250–275°F, with the roast over the unlit burners. Sit it bone-side down on a rack over a rimmed pan. Put a leave-in probe into the centre of the thickest muscle, keeping clear of bone and any large fat seam — both read hotter or cooler than the meat and will lie to you all afternoon. Ambient heat is the supply; the centre probe is the decision.',
      },
      {
        title: 'Cook indirect and ignore the clock',
        cue: 'First check at 60 min',
        body: 'Close the lid and leave it alone. Reckon on roughly 40 minutes a pound at this ambient, but treat that as a planning number only: shape and thickness matter far more than weight, and a long flat roast beats a short fat one to temperature every time. Take it off the indirect heat at about 135–140°F, which leaves room for the sear and for carryover.',
      },
      {
        title: 'Sear it hard at the end',
        cue: '45–75 seconds per broad side',
        body: 'Move the roast to a tray and turn your lit burners up until the grates are properly hot. Sear each broad face for 45–75 seconds, rotating to brown rather than blacken — rosemary and juniper burn fast and turn acrid. Then check the centre again. It must read at least 145°F before the roast is carved and served; if the sear and carryover have not carried it there, put it back over indirect heat until they do. Searing is for the crust, not for the safety endpoint.',
      },
      {
        title: 'Rest, whisk, and carve',
        cue: 'Rest 20–30 min',
        body: 'Tent it loosely on a board and give it the full 20–30 minutes; a roast this size genuinely needs it, and the crust firms up while it waits. Meanwhile stir the sour cream, horseradish, Dijon, lemon juice, chives and a pinch of salt together, taste it, and hold back extra horseradish to pass at the table. Carve between the bones, or take the bones off in one piece first and then slice across the grain. Keep the raw-beef board and knife away from the finished sauce.',
      },
    );
  else if (f === 'jerk-turkey')
    steps.push(
      {
        title: 'Set up two zones',
        cue: 'Grill ambient: 400–425°F',
        body: 'Follow your grill’s lighting sequence and hold 400–425°F at grate level, lighting enough burners to get there while leaving an unlit area for the turkey. Clean the grates now, because the paste will stick to anything left on them. Keep the lid closed between checks.',
      },
      {
        title: 'Indirect first, and turn once',
        cue: 'About 12–15 min a side',
        body: 'Put the tenderloin over the unlit zone and close the lid. Turn it once after 12–15 minutes. Turkey tenderloin is about as lean as poultry gets, so the indirect heat is doing the real work here — it brings the centre up without driving the surface past the point where the spices scorch. Start checking the centre at 20 minutes.',
      },
      {
        title: 'Char the pineapple',
        cue: '4–6 min over direct heat',
        body: 'While the turkey is over the unlit side, put the pineapple, onion and scallion in a basket or on a sheet of foil over the lit burners for 4–6 minutes, stirring once. Pineapple carries a lot of sugar and will flare given the chance, so keep it moving and keep an eye on it. Set it aside somewhere clean.',
      },
      {
        title: 'Sear, probe, rest, slice',
        cue: 'Internal: 165°F · rest 5 min',
        body: 'Once the centre reads 155–160°F, move the tenderloin over direct heat for 30–45 seconds a side to brown the paste. Then probe the thickest part from the side and take it off only at 165°F — that is the poultry endpoint, not the 145°F used for whole cuts of beef and pork, and it is not negotiable for turkey. Rest 5 minutes, slice across the grain, and fold the charred pineapple through with a squeeze of lime.',
      },
    );
  else if (f === 'shrimp')
    steps.push(
      {
        title: 'Get the grill properly hot',
        cue: 'Grill ambient: 450–475°F',
        body: 'Follow your grill’s lighting sequence and get a direct zone to 450–475°F at grate level, keeping a cooler edge or unlit patch free to move things to. Clean the grates and oil them. Shrimp want real heat and a short cook: too low and they poach in their own liquid and go soft before anything browns. Thread them onto skewers or load a grill basket — loose shrimp find the gaps in the grate every time.',
      },
      {
        title: 'Two minutes, turn, two to four more',
        cue: 'Char the orange halves alongside',
        body: 'Lay the shrimp out in a single layer over the direct zone and put the orange halves cut-side down beside them. Give the shrimp about 2 minutes, turn them once, then 2–4 minutes more depending on size. This is the whole cook. Shrimp proteins tighten fast, so the window between properly done and rubbery is measured in seconds rather than minutes — stay at the grill.',
      },
      {
        title: 'Probe, dress, and serve',
        cue: 'Internal: 145°F',
        body: 'Slide the probe sideways into the thickest shrimp and take them off at 145°F. Opaque flesh is a clue; the thermometer is the decision. Toss them with the half of the chimichurri you set aside at the start — the half that never touched raw shrimp — and squeeze the charred orange over the top. Never reuse the marinade half as a sauce. Refrigerate leftovers within 2 hours, or within 1 hour if it is above 90°F out.',
      },
    );
  else if (f === 'beef-ribs')
    steps.push(
      {
        title: 'Build the peppery crust, uncovered',
        cue: 'Grill ambient: 275\u2013300\u00b0F \u00b7 1\u00bd\u20133 hr',
        body: 'Follow your grill\u2019s lighting sequence and your own burner plan, and settle the air beside the food at 275\u2013300\u00b0F measured at grate level. Set the ribs bone-side down over the unlit burners with space between them and close the lid. Rotate them if one end of the grill colours faster. You are waiting for a deep brown crust that no longer wipes off under a finger, not for a number \u2014 the meat will read somewhere around 160\u2013175\u00b0F when that happens. The sauce stays off entirely at this stage; its sugar would burn long before the meat is ready.',
      },
      {
        title: 'Cover it, and wait for the probe to glide',
        cue: 'About 300\u00b0F \u00b7 2\u20134 hr covered',
        body: 'Arrange the ribs bone-side down in a snug metal pan in a single layer. Pour the measured stock and the pan vinegar around them, leaving the tops exposed, and aim for roughly a quarter inch of liquid underneath. The pan decides that depth, not the recipe, so top it up with hot water. Seal tightly with foil and put it back over the unlit burners. Start checking 90 minutes in, then every 20\u201330 minutes, opening the foil away from your face. Probe several thick spots clear of the bone, and keep cooking any rib that still resists.',
      },
      {
        title: 'Make the sauce, then split it',
        cue: 'During the last 30\u201345 min under foil',
        body: 'Whisk everything for the sauce except the butter together in a saucepan: ketchup, brown sugar, molasses, Worcestershire, the sauce vinegar, water, garlic powder, smoked paprika, black pepper and the cayenne if you want it. Simmer gently for 8\u201312 minutes, stirring, until it coats a spoon but still pours \u2014 consistency decides this, not a multiplied timer, so use a wider pan for a big batch. Off the heat, whisk in the butter. Now divide it in two before any of it goes near the grill: half for brushing, half covered and kept clean for the table.',
      },
      {
        title: 'Paint on the sticky layers',
        cue: '275\u2013300\u00b0F indirect \u00b7 15\u201325 min',
        body: 'Lift the ribs carefully onto a clean, lightly oiled rack over a shallow tray, or straight onto clean grates if they will hold together, and leave the braising liquid behind. Keep everything over the unlit burners. Brush a thin coat of the brushing half over the tops and sides, close the lid for five to eight minutes until it turns tacky, and repeat for about three coats. Stop sooner if the edges are darkening fast. This stage is only setting a glaze; the ribs are already tender and direct flame has nothing to add.',
      },
      {
        title: 'Rest, smother, bring napkins',
        cue: 'Rest 15\u201320 min',
        body: 'Rest the ribs loosely tented for 15\u201320 minutes. Warm the clean half of the sauce gently and spoon it generously over each rib, passing the rest at the table. Use clean utensils, and never tip the brushing half back in with the serving half. Refrigerate leftovers in shallow containers within 2 hours, or within 1 hour if it is above 90\u00b0F outside, and reheat them to 165\u00b0F.',
      },
    );
  else if (f === 'mayo-chop')
    steps.push(
      {
        title: 'Mix the binder, spread it thin',
        cue: 'About 5 min · 1–2 tsp per side',
        body: 'Stir the mayonnaise, Worcestershire, grated garlic, rosemary, thyme, smoked paprika and black pepper together in a clean bowl. Pat any moisture off the chops again, then spread the mixture over every surface in a thin, even film. One to two teaspoons a side is plenty; anything thicker slides off into the burners instead of browning. No oil goes on the meat, because the binder is the fat. Throw away whatever touched raw pork.',
      },
      {
        title: 'Set a hot zone and an unlit one',
        cue: 'Sear zone 450–500°F · finish zone 350–400°F',
        body: 'Follow your grill’s lighting sequence, preheat, and clean the grates. You choose which burners stay lit, but leave an unlit area big enough to hold every chop at once. Read the air at grate level rather than trusting the knob positions: about 450–500°F over the lit side for the sear, and 350–400°F beside the chops on the unlit side for the finish.',
      },
      {
        title: 'Sear, and move it if it flares',
        cue: '2–3 min per side',
        body: 'Lay the chops over the lit burners and leave them there for two to three minutes a side, turning once — or a quarter turn first if you want crosshatch marks. Mayonnaise is fat, and fat reaching a burner flares. If that happens, move the chop over to the unlit side and close the lid for a moment rather than trying to beat the flame down with it still over the fire. Do not press the meat.',
      },
      {
        title: 'Finish over the unlit zone',
        cue: 'Start probing around 140°F',
        body: 'Move every chop fully over the unlit burners, close the lid, and hold the air near them at 350–400°F. Begin checking about five minutes after they cross for a pair of chops, six for four of them. Slide the probe into the thickest part from the side and keep it clear of the bone, which runs hotter than the meat around it. Take each chop off at 145°F, and check them separately — thickness decides this, not how many are on the grill.',
      },
      {
        title: 'Rest, then brighten',
        cue: 'Rest at least 3 min',
        body: 'Rest the chops on a clean platter for at least three minutes. That rest is part of the pork safety target rather than only a texture choice. Scatter over the parsley, and add a squeeze of lemon at the table if you want it — the acid is a finishing note here, not something to cook with. Refrigerate leftovers within 2 hours, or within 1 hour if it is above 90°F outside, and reheat them to 165°F.',
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
    f === 'beef-ribs'
      ? 'Sear-iously smothered beef ribs'
      : f === 'mayo-chop'
        ? 'Garlic-herb mayonnaise pork chops'
        : f === 'burger'
          ? 'Steakhouse burgers, beef or bison'
          : f === 'lobster'
            ? 'Champagne–garlic butter-bath ' + midName
            : f === 'achiote'
              ? 'Achiote-lime grilled chicken thighs'
              : f === 'bbq-chicken'
                ? 'Sauce-heavy BBQ chicken thighs'
                : f === 'prime-rib'
                  ? 'Rosemary & juniper prime rib'
                  : f === 'jerk-turkey'
                    ? 'Jerk-spiced ' + midName
                    : f === 'shrimp'
                      ? 'Chimichurri-orange ' + midName
                      : f === 'foil-boat'
                        ? 'Butter & lemon-pepper ' + midName
                        : f === 'tri-tip'
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
    f === 'beef-ribs'
      ? 1
      : f === 'mayo-chop'
        ? 0.625
        : f === 'burger'
          ? 0.375
          : f === 'lobster'
            ? 0.5
            : f === 'achiote' || f === 'bbq-chicken'
              ? 0.5
              : f === 'prime-rib'
                ? 1
                : f === 'jerk-turkey'
                  ? 0.4
                  : f === 'shrimp' || f === 'foil-boat'
                    ? 0.5
                    : f === 'tri-tip'
                      ? 0.45
                      : f === 'shoulder'
                        ? 0.6
                        : cut.protein === 'Poultry' && f !== 'breast'
                          ? 0.75
                          : cut.protein === 'Seafood'
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
      f === 'beef-ribs'
        ? 'Pepper & paprika carry it \u00b7 no wood needed'
        : f === 'burger'
          ? 'No smoke needed · this one is all sear'
          : f === 'lobster'
            ? 'None · the bath is the flavour'
            : f === 'achiote'
              ? 'The paste carries it · no wood needed'
              : f === 'bbq-chicken'
                ? 'Hickory, optional'
                : f === 'jerk-turkey'
                  ? 'Pimento wood if you can get it · otherwise none'
                  : f === 'prime-rib'
                    ? 'Rosemary & juniper carry it · no wood needed'
                    : f === 'tri-tip'
                      ? 'Coffee & ancho carry it · no wood needed'
                      : f === 'shoulder'
                        ? 'Apple + hickory'
                        : cut.protein === 'Poultry'
                          ? 'Apple, optional'
                          : 'No smoke needed',
    tip:
      f === 'beef-ribs'
        ? 'Keep half the sauce clean and away from the brush, leave the sugar off until the meat is already tender, and let the probe rather than the clock decide when that is.'
        : f === 'mayo-chop'
          ? 'Spread the binder thin, sear over the lit side, then finish over the unlit one and probe every chop clear of the bone. A flare-up is the binder doing its job, not a fault.'
          : f === 'burger'
            ? 'Mix it cold, handle it as little as you can, and salt at the grill rather than ahead. Do not press the patties, and probe every one: 160°F here, not 145°F.'
            : f === 'lobster'
              ? 'Keep the pan over an unlit burner, never flip the tails, and warm a clean portion of butter for the table rather than serving the one you basted with.'
              : f === 'achiote'
                ? 'Twenty to thirty minutes in the marinade and no longer. Achiote and honey both darken well before the centre is done, so keep a cooler edge free.'
                : f === 'bbq-chicken'
                  ? 'Grill it clean first and sauce it last, in thin coats. Keep the serving half of the sauce away from the brush that touched raw chicken.'
                  : f === 'prime-rib'
                    ? 'Salt it the night before, keep the probe out of bone and fat seams, and give it the full rest. The sear builds the crust; the probe decides doneness.'
                    : f === 'jerk-turkey'
                      ? 'Keep the paste thin so it browns rather than steams, cook it indirect, and use the 165°F poultry endpoint. Pineapple carries sugar and will flare.'
                      : f === 'shrimp'
                        ? 'Split the chimichurri before any of it touches raw shrimp. Fifteen minutes is the marinade limit, and four to six minutes is the entire cook.'
                        : f === 'foil-boat'
                          ? 'Check the lemon-pepper label before you salt, keep the boat open rather than sealed, and probe every fillet. Thickness sets the time here, not weight.'
                          : f === 'tri-tip'
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
  if (cut.family === 'burger')
    return {
      title: 'Why ground meat is 160°F when a steak is 145°F',
      body: 'On a whole steak, essentially everything that matters lives on the outside, and searing the outside deals with it — which is why a rare centre is a defensible choice there. Grinding takes that surface and mixes it all the way through, so the middle of a patty now contains what used to be the outside of the meat. There is no longer an inside that was never exposed.',
      takeaway:
        'The higher number is not caution about a different animal, it is the same caution applied to meat that no longer has a protected centre. Probe every patty, and ignore the colour.',
    };
  if (cut.family === 'beef-ribs')
    return {
      title: 'Safe and tender are two different numbers',
      body: 'Whole-cut beef is safe at 145\u00b0F with a short rest, and a short rib hits that in the first hour or so. It is still inedible. What makes a rib worth eating is collagen turning to gelatin, and that is a slow conversion that only really gets going well above the safety figure and keeps going for hours. Covering the pan is what makes the wait bearable for the meat: it cuts the evaporation that would otherwise dry the outside while the inside is still converting.',
      takeaway:
        'Stop reading the thermometer as a doneness test here. Around 200\u2013205\u00b0F is where the probe usually glides, but the resistance is the actual signal.',
    };
  if (cut.family === 'mayo-chop')
    return {
      title: 'Why a mayonnaise coat browns better than oil does',
      body: 'Mayonnaise is an emulsion: oil suspended in a little water and held there by egg yolk. Spread thin on meat it does three jobs at once. The water phase makes it cling, so the herbs and garlic stay where loose seasoning would fall off. The oil spreads heat evenly across an uneven surface. And the egg proteins brown alongside the meat’s own, which starts the crust at a lower surface temperature than plain oil manages. What is left by serving time is crust, not sauce — there is far too little of it to taste of mayonnaise.',
      takeaway:
        'A thin film is the entire technique. Laid on thick, the outside of the coating burns while the inside stays wet and slides off the chop.',
    };
  if (cut.family === 'lobster')
    return {
      title: 'A bath, not a boil',
      body: 'Butter held gently around the meat does two things at once: it keeps the exposed surface from drying in moving air, and it carries the garlic, herbs and wine onto it. Let that butter get too hot and both stop working — it splits, the milk solids catch, and the outside of the tail races ahead of the centre. Lobster gives you a narrow window between translucent and rubbery, so anything that widens it is worth doing.',
      takeaway:
        'Keep the pan over an unlit burner where the air heats it rather than the flame, and baste rather than submerge.',
    };
  if (cut.family === 'achiote')
    return {
      title: 'An acid marinade only reaches the surface',
      body: 'Lime juice does not travel far into meat. It works on the outermost layer, where it unwinds proteins and firms them up, and that layer is the only part it ever really changes. So a longer soak does not push more flavour inward; it just keeps working on the same thin shell until the texture turns tight and slightly chalky. Salt migrates inward given hours. Acid essentially does not.',
      takeaway:
        'Twenty to thirty minutes buys you everything this marinade has to give. Overnight only costs you texture.',
    };
  if (cut.family === 'bbq-chicken')
    return {
      title: 'Thin coats set; one thick coat burns',
      body: 'A barbecue sauce this sweet is mostly sugar and water. Brushed on thin, the water flashes off and leaves the sugars to caramelise into a dry, glossy layer that the next coat can grip. Brushed on thick, the outside of the layer hits burning temperature while the inside is still wet, so you get a scorched skin over a sticky, uncooked middle that slides off the meat.',
      takeaway:
        'Four or five thin coats over indirect heat, each given a minute to set. Save direct heat for a few seconds at the very end, if at all.',
    };
  if (cut.family === 'prime-rib')
    return {
      title: 'Why reverse-sear a roast this size',
      body: 'Heat travels into meat from the outside in, so a hot grill drives a steep gradient: the outer inch is well past done by the time the centre arrives. Cooking low keeps that gradient shallow, which is the whole reason a reverse-seared roast shows a thin grey band instead of a thick one. The trade is that almost no crust forms at 250°F, because browning needs a far hotter surface than that.',
      takeaway:
        'Do the gentle cook first for an evenly coloured interior, then build the crust in the last two minutes over high heat.',
    };
  if (cut.family === 'jerk-turkey')
    return {
      title: 'Lean meat has no buffer',
      body: 'Fat and connective tissue buy you time: they melt, they hold water, and they forgive a few extra minutes. Turkey tenderloin has very little of either, so the gap between 165°F and dry is narrow and it closes fast over direct heat. The paste has a second problem of its own — its sugars, and the sugar in the pineapple beside it, brown and then burn long before the centre is ready.',
      takeaway:
        'Cook it over the unlit side so the surface cannot run ahead of the centre, and save direct heat for the last thirty seconds a side.',
    };
  if (cut.family === 'shrimp')
    return {
      title: 'Two clocks are running at once',
      body: 'Shrimp proteins tighten at a low temperature and do it quickly, which is why the difference between springy and rubbery is under a minute at this heat. The marinade is a slower version of the same process: vinegar and citrus firm the surface with no heat involved at all, which is exactly how ceviche works. Fifteen minutes is seasoning. An hour gives you shrimp that were already half cooked before they reached the grate.',
      takeaway:
        'Keep the marinade short and the cook shorter. Probe the thickest shrimp rather than reading the colour.',
    };
  if (cut.family === 'foil-boat')
    return {
      title: 'An open boat is not a sealed packet',
      body: 'The foil is doing the job of a small pan. It holds a fragile fillet together and keeps the butter and the cooking juices against the fish rather than letting them drip into the burners. Leaving the top open lets steam escape as it forms. Crimp it shut and the fish cooks in its own trapped moisture instead, which is much closer to steaming than to grilling and gives a softer, wetter surface.',
      takeaway:
        'Fold the sides up, leave the top open, and let the closed grill lid be the thing that surrounds it with heat.',
    };
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
  if (cut.protein === 'Seafood')
    return {
      title: 'Brown the outside, check the center',
      body: 'Maillard reactions create browned flavor at the hot surface. The center can still be behind, especially in a thick fillet. A browned exterior is not evidence that the fish has reached its internal target.',
      takeaway:
        'Move to the unlit zone if the surface is ready first. Probe the center and finish at 145°F.',
    };
  if (cut.protein === 'Poultry') {
    // Only the skin-on families get the baking powder note. The breast here
    // is boneless, and the skinless thigh, turkey and BBQ recipes carry their
    // own science above and never reach this branch.
    const skinOn = cut.family !== 'breast';
    return {
      title: 'Skin needs a different finish',
      body:
        'Chicken skin browns and renders better with more heat than a long, low smoking session usually provides. A brief finish over direct heat can crisp it after the interior is almost ready. Sweet sauces can scorch during that finish.' +
        (skinOn
          ? ' If you want the skin genuinely crisp rather than merely browned, a little baking powder worked into the dry-brine salt is the one trick that reliably does it. Powder, not soda — bicarbonate of soda on its own is a raw alkali and leaves a soapy, faintly metallic taste. Baking powder buffers that same bicarbonate with acid salts, and on skin it does two things at once: it lifts the surface pH, so the browning reactions run faster and begin at a lower temperature, and the carbon dioxide it gives off blisters the skin into a finely pitted surface with far more area to crisp.'
          : ''),
      takeaway: skinOn
        ? 'Brown the skin late and watch closely, and check each piece with a thermometer. For the crispest result, mix about ½ tsp of aluminum-free baking powder per pound of chicken into the measured salt and leave the pieces uncovered in the refrigerator overnight. Much more than that and you can taste it.'
        : 'Skinless breasts do not need a skin-crisping step. Finish at 165°F and keep the sauce away from hard flame.',
    };
  }
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
    match: 'lemon-pepper',
    label: 'Lemon-pepper seasoning',
    options: [
      {
        use: 'Lemon zest with coarse black pepper',
        amount: 'About ½ tsp zest per tsp, plus pepper to taste',
        note: 'Brighter than the jar and reliably salt-free, so the measured salt stays as listed.',
      },
      {
        use: 'Salt-free lemon-pepper blend',
        amount: 'Same amount',
        note: 'The straight swap. This is the version the measured salt above assumes.',
      },
      {
        use: 'Salted lemon-pepper blend',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Most supermarket jars are this. Salt is usually the first ingredient on the label.',
      },
      {
        use: 'Old Bay or a seafood blend',
        amount: 'Same amount',
        addsSalt: true,
        note: 'A different direction entirely — celery salt and paprika rather than citrus — but it suits walleye.',
      },
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
  {
    match: 'rosemary',
    label: 'Fresh rosemary',
    options: [
      {
        use: 'Dried rosemary, crumbled',
        amount: 'About a third as much',
        note: 'Dried herbs are more concentrated by volume. Crumble it or it stays woody.',
      },
      {
        use: 'Fresh sage or oregano',
        amount: 'Same amount',
        note: 'A different resinous herb doing the same job against rich beef.',
      },
    ],
  },
  {
    match: 'fresh thyme',
    label: 'Fresh thyme',
    options: [
      { use: 'Dried thyme', amount: 'About a third as much' },
      {
        use: 'Extra rosemary',
        amount: 'Half again as much rosemary',
        note: 'Coarser and more assertive, so do not match the thyme volume exactly.',
      },
    ],
  },
  {
    match: 'juniper',
    label: 'Juniper berries',
    options: [
      {
        use: 'Gin, in the paste',
        amount: 'About 1 tsp per tsp of berries',
        note: 'Gin is flavoured with juniper, so this is the closest thing in most kitchens.',
      },
      {
        use: 'Caraway seed, crushed',
        amount: 'Half as much',
        note: 'Not the same flavour, but the same piney, slightly bitter role.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'The crust still works. It reads more herbal and less like winter.',
      },
    ],
  },
  {
    match: 'orange',
    label: 'Orange',
    options: [
      {
        use: 'Lemon',
        amount: 'Same amount',
        note: 'Sharper and less sweet. Use a little less zest, since lemon carries further.',
      },
      {
        use: 'Clementine or mandarin',
        amount: 'About two per orange',
        note: 'Sweeter and thinner-skinned, so there is less zest on each one.',
      },
      {
        use: 'Grapefruit',
        amount: 'Half as much zest',
        note: 'More bitter than orange. Good against rich beef, heavy-handed on shrimp.',
      },
    ],
  },
  {
    match: 'olive oil',
    label: 'Olive oil',
    options: [
      { use: 'Any neutral oil', amount: 'Same amount' },
      {
        use: 'Avocado oil',
        amount: 'Same amount',
        note: 'Higher smoke point, which suits the hotter cooks here.',
      },
      {
        use: 'Melted butter',
        amount: 'Same amount',
        note: 'Richer, but the milk solids brown and can burn over direct heat.',
      },
    ],
  },
  {
    match: 'neutral oil',
    label: 'Neutral oil',
    options: [
      { use: 'Canola, sunflower or grapeseed', amount: 'Same amount' },
      {
        use: 'Olive oil',
        amount: 'Same amount',
        note: 'Adds its own flavour, which is fine here and works against the spice.',
      },
      {
        use: 'Coconut oil, melted',
        amount: 'Same amount',
        note: 'Closer to the Caribbean original, and it sets firm if the paste gets cold.',
      },
    ],
  },
  {
    match: 'sour cream',
    label: 'Sour cream',
    options: [
      { use: 'Crème fraîche', amount: 'Same amount' },
      {
        use: 'Plain Greek yogurt',
        amount: 'Same amount',
        note: 'Tangier and thicker. Loosen it with a spoon of water if it will not spread.',
      },
      {
        use: 'Mayonnaise',
        amount: 'About two thirds as much',
        note: 'Much richer and not sour, so add extra lemon to make up for it.',
      },
    ],
  },
  {
    match: 'horseradish',
    label: 'Prepared horseradish',
    options: [
      {
        use: 'Fresh horseradish, grated',
        amount: 'About half as much',
        note: 'Far stronger than the jarred sort, and it fades within the hour once grated.',
      },
      {
        use: 'Wasabi paste',
        amount: 'About a quarter as much',
        note: 'Hotter and sharper. Start very small; it is easy to overshoot.',
      },
      {
        use: 'Dijon mustard',
        amount: 'Same amount',
        note: 'A different heat entirely, but it keeps the sauce sharp against the beef.',
      },
    ],
  },
  {
    match: 'chives',
    label: 'Chives',
    options: [
      { use: 'Scallion greens, sliced thin', amount: 'Same amount' },
      {
        use: 'Chopped parsley',
        amount: 'Same amount',
        note: 'No onion note, but it keeps the sauce looking like it should.',
      },
    ],
  },
  {
    match: 'allspice',
    label: 'Ground allspice',
    options: [
      {
        use: 'Equal parts cinnamon, nutmeg and clove',
        amount: 'Same total amount',
        note: 'Allspice tastes like all three, which is where the name comes from.',
      },
      {
        use: 'Jerk seasoning blend',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Most blends are salted and already contain the allspice and thyme below.',
      },
    ],
  },
  {
    match: 'cinnamon',
    label: 'Ground cinnamon',
    options: [
      { use: 'Ground nutmeg or mace', amount: 'Half as much' },
      {
        use: 'Extra allspice',
        amount: 'Same amount',
        note: 'Allspice already carries a cinnamon note, so this stays in character.',
      },
      { use: 'Leave it out', amount: '—' },
    ],
  },
  {
    match: 'pineapple',
    label: 'Pineapple',
    options: [
      {
        use: 'Mango',
        amount: 'Same amount',
        note: 'Softer, so it chars faster and falls apart sooner. Watch it closely.',
      },
      {
        use: 'Peach or nectarine',
        amount: 'Same amount',
        note: 'Less acidic than pineapple, so add an extra squeeze of lime.',
      },
      {
        use: 'Tinned pineapple, drained and patted dry',
        amount: 'Same amount',
        note: 'Wetter and sweeter. Dry it properly or it steams instead of charring.',
      },
    ],
  },
  {
    match: 'red onion and scallion',
    label: 'Red onion & scallion',
    options: [
      { use: 'Either one on its own', amount: 'Same total amount' },
      {
        use: 'Shallot',
        amount: 'Same amount',
        note: 'Milder and sweeter, and it softens faster over the heat.',
      },
      {
        use: 'White onion, soaked in cold water',
        amount: 'Same amount',
        note: 'Soaking takes the harsh edge off, which red onion does not need.',
      },
    ],
  },
  {
    match: 'parsley and cilantro',
    label: 'Parsley & cilantro',
    options: [
      {
        use: 'All parsley',
        amount: 'Same total amount',
        note: 'The usual move if cilantro tastes like soap to anyone at the table.',
      },
      {
        use: 'Parsley with mint or oregano',
        amount: 'Same total amount',
        note: 'Mint takes it somewhere brighter; oregano is closer to a classic chimichurri.',
      },
    ],
  },
  {
    match: 'red-wine vinegar',
    label: 'Red-wine vinegar',
    options: [
      { use: 'Sherry or white-wine vinegar', amount: 'Same amount' },
      {
        use: 'Apple cider vinegar',
        amount: 'Same amount',
        note: 'A touch sweeter and fruitier, which suits the orange here.',
      },
      {
        use: 'Fresh lemon juice',
        amount: 'Half again as much',
        note: 'Less acidic than vinegar, so it takes a little more to balance the oil.',
      },
    ],
  },
  {
    match: 'red pepper flakes',
    label: 'Red pepper flakes',
    options: [
      { use: 'Cayenne', amount: 'About a third as much' },
      {
        use: 'Aleppo or gochugaru',
        amount: 'About twice as much',
        note: 'Both are milder and fruitier, so you need more for the same heat.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'The chimichurri is garlic-led anyway; the flakes are the back note.',
      },
    ],
  },
  {
    match: 'achiote',
    label: 'Achiote paste',
    options: [
      {
        use: 'Smoked paprika with a pinch of turmeric',
        amount: 'About 2 tsp paprika per tbsp of paste',
        note: 'Gets you most of the colour. Achiote is earthier and slightly peppery, so it will not be identical.',
      },
      {
        use: 'Sazón with achiote',
        amount: 'About 1 sachet per tbsp',
        addsSalt: true,
        note: 'Usually salted and often carries MSG. Cut the measured salt back accordingly.',
      },
      {
        use: 'Ground annatto seed',
        amount: 'About 1 tsp per tbsp',
        note: 'Achiote paste is annatto plus spices and acid, so add a little extra lime and cumin with it.',
      },
    ],
  },
  {
    match: 'lime zest',
    label: 'Lime zest',
    options: [
      { use: 'Lemon or orange zest', amount: 'Same amount' },
      {
        use: 'Extra lime juice',
        amount: 'About 1 tsp juice per tsp of zest',
        note: 'Weaker, because the oils that carry most of the aroma live in the peel and not the juice.',
      },
      { use: 'Leave it out', amount: '—' },
    ],
  },
  {
    match: 'honey',
    label: 'Honey',
    options: [
      { use: 'Agave nectar or maple syrup', amount: 'Same amount' },
      {
        use: 'Brown sugar',
        amount: 'Same amount',
        note: 'Dry rather than liquid, so the marinade will be slightly thicker.',
      },
      {
        use: 'Leave it out',
        amount: '—',
        note: 'You lose some browning and a little stickiness, but nothing structural.',
      },
    ],
  },
  {
    match: 'oregano',
    label: 'Mexican oregano',
    options: [
      {
        use: 'Mediterranean oregano',
        amount: 'Same amount',
        note: 'The common supermarket sort. More minty and less citrusy, but it does the job.',
      },
      {
        use: 'Marjoram',
        amount: 'Half again as much',
        note: 'Milder and sweeter, so it takes a little more.',
      },
    ],
  },
  {
    match: 'ketchup',
    label: 'Ketchup',
    options: [
      {
        use: 'Tomato passáta with a spoon of sugar and a splash of vinegar',
        amount: 'Same amount',
        note: 'Ketchup is already sweet and sour, so plain tomato needs both added back.',
      },
      {
        use: 'Tomato paste, thinned with water',
        amount: 'About a third as much paste',
        note: 'Much more concentrated. Thin it to a ketchup consistency before measuring.',
      },
    ],
  },
  {
    match: 'molasses',
    label: 'Molasses',
    options: [
      {
        use: 'Dark brown sugar',
        amount: 'Same amount',
        note: 'Brown sugar is sugar with molasses already in it, so this is the closest swap there is.',
      },
      {
        use: 'Maple syrup or honey',
        amount: 'Same amount',
        note: 'Sweeter and far less bitter, so the sauce loses some of its depth.',
      },
      {
        use: 'Treacle',
        amount: 'About two thirds as much',
        note: 'Stronger and more bitter than molasses. Easy to overdo.',
      },
    ],
  },
  {
    match: 'worcestershire',
    label: 'Worcestershire sauce',
    options: [
      {
        use: 'Soy sauce with a squeeze of lemon',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Saltier than Worcestershire, so pull the measured salt back a little.',
      },
      {
        use: 'Fish sauce',
        amount: 'About half as much',
        addsSalt: true,
        note: 'Worcestershire is anchovy-based too, so this is closer than it sounds. Much saltier.',
      },
      {
        use: 'Balsamic vinegar',
        amount: 'Same amount',
        note: 'The vegetarian route. Sweeter and without the savoury depth.',
      },
    ],
  },
  {
    match: 'spg',
    label: 'SPG seasoning',
    options: [
      {
        use: 'Equal parts salt, pepper and garlic powder',
        amount: 'Same total amount',
        addsSalt: true,
        note: 'That is all SPG is. Mixing it yourself is also the only way to know how salty it is.',
      },
      {
        use: 'Garlic powder and pepper, no salt',
        amount: 'Two thirds as much',
        note: 'Leaves the measured kosher salt above as the only salt, which is the cleanest way to run this.',
      },
      {
        use: 'Montreal steak seasoning',
        amount: 'Same amount',
        addsSalt: true,
        note: 'Coarser, with coriander and dill seed in it. Salt-first, so cut the measured salt back.',
      },
    ],
  },
  {
    match: 'yellow onion',
    label: 'Yellow onion',
    options: [
      { use: 'White or sweet onion', amount: 'Same amount' },
      {
        use: 'Shallot',
        amount: 'Same amount',
        note: 'Milder and sweeter. Fine grated into the patty, a little lost as a grilled round.',
      },
      {
        use: 'Onion powder, in the patty only',
        amount: 'About 1 tsp per quarter onion',
        note: 'No moisture, which changes the patty texture. It cannot stand in for the grilled rounds.',
      },
    ],
  },
  {
    match: 'smoked cheddar',
    label: 'Smoked cheddar',
    options: [
      { use: 'Sharp cheddar', amount: 'Same amount' },
      {
        use: 'Gruyère or Swiss',
        amount: 'Same amount',
        note: 'Melts more readily and runs further. Nuttier, less tangy.',
      },
      {
        use: 'American cheese',
        amount: 'Same amount',
        note: 'The best melt of any of them, if the least interesting flavour.',
      },
      { use: 'Leave it off', amount: '—' },
    ],
  },
  {
    match: 'brioche',
    label: 'Brioche buns',
    options: [
      {
        use: 'Potato rolls',
        amount: 'Same count',
        note: 'Softer and less sweet, and they hold up to juice better than brioche does.',
      },
      { use: 'Sesame seed buns', amount: 'Same count' },
      {
        use: 'English muffins',
        amount: 'Same count',
        note: 'Sturdier and chewier. Toast them hard.',
      },
    ],
  },
  {
    match: 'sparkling wine',
    label: 'Dry sparkling wine',
    options: [
      {
        use: 'Dry white wine',
        amount: 'Same amount',
        note: 'The bubbles cook off in seconds anyway; it is the acidity that matters here.',
      },
      {
        use: 'Dry vermouth',
        amount: 'About two thirds as much',
        note: 'More aromatic and more assertive, so hold some back.',
      },
      {
        use: 'Stock with a squeeze of lemon',
        amount: 'Same amount',
        note: 'The alcohol-free route. Add the lemon off the heat or it turns bitter.',
      },
    ],
  },
  {
    match: 'tarragon',
    label: 'Fresh tarragon',
    options: [
      {
        use: 'Fresh chervil or parsley',
        amount: 'Same amount',
        note: 'Neither has the aniseed note, but both keep it fresh and green.',
      },
      {
        use: 'Dried tarragon',
        amount: 'About a third as much',
        note: 'Add it to the butter early so it has time to soften and open up.',
      },
      {
        use: 'Fresh dill',
        amount: 'Same amount',
        note: 'A different direction entirely, and a good one with shellfish and butter.',
      },
    ],
  },
  {
    match: 'beef stock',
    label: 'Unsalted beef stock',
    options: [
      {
        use: 'Unsalted chicken stock',
        amount: 'Same amount',
        note: 'Lighter, and it lets the pepper and the sauce carry more of the flavour.',
      },
      {
        use: 'Water with a splash of Worcestershire',
        amount: 'Same amount',
        note: 'The braise is shallow and mostly there to stop the pan drying out, so this works.',
      },
      {
        use: 'Salted stock or a bouillon cube',
        amount: 'Same amount',
        note: 'Then cut the measured kosher salt back, because the braise reduces around the ribs.',
        addsSalt: true,
      },
    ],
  },
  {
    match: 'mayonnaise',
    label: 'Mayonnaise',
    options: [
      {
        use: 'Egg-free mayonnaise',
        amount: 'Same amount',
        note: 'Mayonnaise is an egg allergen, and this is the direct answer to that. The fat is doing most of the work regardless.',
      },
      {
        use: 'Plain full-fat Greek yogurt',
        amount: 'Same amount',
        note: 'Clings and browns much the same way but tastes tangier, and it is thinner, so spread it thinner still.',
      },
      {
        use: 'Softened butter or olive oil',
        amount: 'About half as much',
        note: 'Carries the herbs and browns, but with no egg there is less crust and it runs more as it warms.',
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
