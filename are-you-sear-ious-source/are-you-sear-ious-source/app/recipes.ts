/**
 * Grouped the way the USDA safe-temperature chart groups them. 'Seafood'
 * rather than 'Fish' because shrimp is a crustacean, and the chart's own
 * row reads "Fish & Shellfish" at a shared 145°F.
 */
export type Protein =
  | 'Beef'
  | 'Pork'
  | 'Poultry'
  | 'Seafood'
  /**
   * Not a protein, and the odd one out on purpose. The picker is grouped by
   * what you walk to the counter and buy, and a stuffed pepper does not
   * belong behind any of the four above even when its filling contains meat.
   */
  | 'Vegetarian';
export type Unit = 'F' | 'C';
/** A temperature range that always has at least a low bound. */
export type Temperatures = [number, ...number[]];
export type Step = { title: string; cue: string; body: string };
/**
 * Credit for a recipe adapted from someone else's published work. Ingredient
 * proportions are facts and not copyrightable, but the prose that explains a
 * method is, so adapted recipes here are rewritten and then say where the
 * idea came from.
 */
export type Attribution = { label: string; url: string; note: string };
export type Recipe = {
  id: string;
  protein: Protein;
  title: string;
  headline: string[];
  description: string;
  time: string;
  rest: string;
  serves: string;
  method: string;
  grill: Temperatures;
  internal: Temperatures;
  finish: string;
  safety: string;
  wood: string;
  tip: string;
  ingredients: { title: string; items: string[] }[];
  steps: [Step, ...Step[]];
  attribution?: Attribution;
};
export const safetySource =
  'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart';
export const recipes: Recipe[] = [
  {
    id: 'pork-shoulder',
    protein: 'Pork',
    title: 'Mustard-bound smoked pork shoulder',
    headline: ['Low & slow.', 'Big damn flavor.'],
    description:
      'Deep bark, a little heat, and fall-apart tender. Your all-day cook, built for a gas grill.',
    time: '10–16 hr + rest',
    rest: '1–2 hours',
    serves: '12–16',
    method: 'Indirect low heat',
    grill: [250, 275],
    internal: [195, 205],
    finish:
      'Tenderness target. Probe several spots; it should slide in with almost no resistance.',
    safety:
      'Whole pork: 145°F minimum with a 3-minute rest. Shoulder needs a higher finish for pull-apart tenderness.',
    wood: 'Apple + hickory',
    tip: 'A temperature stall is normal. Wrap when the bark is set, and let tenderness decide when you are done.',
    ingredients: [
      {
        title: 'The shoulder',
        items: [
          '1 bone-in pork shoulder (Boston butt), 7–9 lb',
          '3–4 tbsp yellow mustard, enough for a thin binder coat',
          'Apple and/or hickory chips for a gas-grill smoker box',
        ],
      },
      {
        title: 'The rub',
        items: [
          '27 g kosher salt (weigh it; brands vary)',
          '¼ cup packed brown sugar',
          '3 tbsp smoked paprika',
          '2 tbsp coarse black pepper',
          '1 tbsp garlic powder',
          '1 tbsp onion powder',
          '1–2 tsp cayenne, to taste',
        ],
      },
      {
        title: 'Spritz & wrap',
        items: [
          '½ cup apple cider vinegar + ½ cup apple juice, for optional spritz',
          '¼ cup apple juice, for the wrap',
        ],
      },
      {
        title: 'Vinegar finishing sauce',
        items: [
          '1 cup apple cider vinegar',
          '2 tbsp brown sugar',
          '1 tbsp hot sauce',
          '1 tsp kosher salt, then adjust to taste',
          '½ tsp black pepper + a pinch of cayenne',
        ],
      },
    ],
    steps: [
      {
        title: 'Mustard. Rub. Rest.',
        cue: '20 min prep · overnight optional',
        body: 'Trim hard fat to about ¼ inch. Pat the meat dry, coat lightly with yellow mustard, then cover every side with the rub. Refrigerate uncovered overnight if you have time. Otherwise keep refrigerated while you set up the grill; no room-temperature warmup is needed.',
      },
      {
        title: 'Build the cool zone',
        cue: 'Grill ambient: 250–275°F',
        body: 'Follow your grill’s lighting instructions and preheat with the lid closed. Turn off the burners below the pork and adjust the burner on the opposite side to hold 250–275°F at grate level. Put a drip pan below the meat without blocking burner airflow. Place a smoker box or foil packet on the grill’s approved support above the lit burner, never directly on the burner tube. Use dry wood chips unless your smoker-box instructions specify otherwise.',
      },
      {
        title: 'Let the bark happen',
        cue: 'About 5–8 hr · bark decides',
        body: 'Place the pork over the unlit burners, fat cap toward the strongest heat. Keep the lid closed. Maintain light smoke for the first 3–4 hours, replenishing chips as needed. After 3 hours, lightly spritz only dry-looking patches, no more than hourly. Expect the temperature to stall around 150–170°F; that is normal.',
      },
      {
        title: 'Wrap when it is ready',
        cue: 'Usually 160–175°F internally',
        body: 'When the bark is dark and firmly attached, wrap tightly in two layers of heavy foil with ¼ cup apple juice. Unwaxed butcher paper also works, but use little or no liquid. Return to indirect heat at 250–275°F. Once wrapped, a 275°F oven is an equally useful finish and saves propane.',
      },
      {
        title: 'Chase tenderness',
        cue: 'Usually 195–205°F · about 3–8 hr more',
        body: 'Start testing around 195°F. Probe several thick spots away from the bone; it should feel like softened butter. Keep cooking if there is resistance, even if it reaches 203°F. Allow roughly 10–16 hours total cooking for a 7–9 lb shoulder, with extra buffer. Time and temperature are guides, not a promise.',
      },
      {
        title: 'Rest, pull, finish',
        cue: 'Rest 1–2 hr · hold at 140°F or above',
        body: 'Open the wrap briefly for about 10 minutes to release steam, then rewrap. Rest 1–2 hours in an insulated cooler or low oven, checking that the meat stays at least 140°F if holding hot. Pull, discard large fat pockets, and mix in defatted cooking juices. Stir the finishing sauce until dissolved; add a few tablespoons at a time to taste. Refrigerate leftovers within 2 hours after hot holding ends.',
      },
    ],
  },
  {
    id: 'pepper-ribeye',
    protein: 'Beef',
    title: 'Pepper-crusted ribeye',
    headline: ['Hard sear.', 'Soft center.'],
    description:
      'A proper pepper crust, garlic butter, and a cooler zone to finish with control.',
    time: '15–25 min + rest',
    rest: '5–10 minutes',
    serves: '2',
    method: 'Direct, then indirect',
    grill: [450, 500],
    internal: [145],
    finish:
      'Reach 145°F before removing from heat, then rest at least 3 minutes.',
    safety:
      'Whole beef steaks: 145°F minimum + 3-minute rest. Ground beef: 160°F. Lower steak doneness carries more risk.',
    wood: 'No smoke needed',
    tip: 'Thickness matters more than weight. Move the steak to the cool zone once the crust looks right.',
    ingredients: [
      {
        title: 'Steaks & seasoning',
        items: [
          '2 ribeye steaks, 1¼–1½ inches thick',
          '2 tsp Dijon mustard, for a thin binder coat',
          '1½ tsp kosher salt, or to taste',
          '2 tsp coarse black pepper',
          '1 tsp garlic powder',
        ],
      },
      {
        title: 'Garlic butter',
        items: [
          '2 tbsp softened unsalted butter',
          '1 small garlic clove, finely grated',
          '1 tsp chopped parsley',
          'A squeeze of lemon',
        ],
      },
    ],
    steps: [
      {
        title: 'Season the steaks',
        cue: '10 min prep',
        body: 'Pat the steaks dry. Brush with a very thin layer of Dijon mustard, then season with salt, pepper, and garlic powder. Mix the butter, garlic, parsley, and lemon in a small bowl. Keep meat refrigerated while the grill preheats.',
      },
      {
        title: 'Set a hot and cool side',
        cue: 'Grill ambient: 450–500°F',
        body: 'Preheat the gas grill with the lid closed. Clean the grates. Leave one burner area unlit for finishing and move the steaks there if you see a flare-up.',
      },
      {
        title: 'Build the crust',
        cue: 'About 3–4 min per side',
        body: 'Sear over the lit burners until a brown crust forms, turning with tongs. Keep the lid closed between turns. These times are approximate; thickness and the grill’s actual heat matter.',
      },
      {
        title: 'Finish with control',
        cue: 'Internal: 145°F before removal',
        body: 'Move the steaks over the unlit burner to finish, keeping the grill around 450–500°F. Probe from the side into the center, away from fat and bone. Cook to at least 145°F before removing from the grill.',
      },
      {
        title: 'Butter and rest',
        cue: 'Rest 5–10 min',
        body: 'Top each steak with garlic butter, loosely tent with foil, and rest 5–10 minutes (at least 3 minutes for safety). Slice against the grain and spoon the board juices over the meat.',
      },
    ],
  },
  {
    id: 'smoky-chicken',
    protein: 'Poultry',
    title: 'Smoky mustard chicken thighs',
    headline: ['Crisp edges.', 'All the juice.'],
    description:
      'Mustard, paprika, and a little brown sugar. Forgiving thighs with a smoky, savory finish.',
    time: '35–50 min + rest',
    rest: '5 minutes',
    serves: '4',
    method: 'Mostly indirect',
    grill: [375, 425],
    internal: [175, 185],
    finish:
      'Thigh texture target: 175–185°F. Check every piece; poultry must reach at least 165°F.',
    safety:
      'All poultry, including ground chicken and turkey: 165°F minimum. Thighs can go higher for tenderness.',
    wood: 'Apple, optional',
    tip: 'Add sweet sauce only in the final few minutes so its sugars do not burn.',
    ingredients: [
      {
        title: 'Chicken & rub',
        items: [
          '8 bone-in, skin-on chicken thighs, about 3 lb',
          '2 tbsp yellow or Dijon mustard',
          '1½ tsp kosher salt, or to taste',
          '2 tsp smoked paprika',
          '1 tsp garlic powder',
          '1 tsp black pepper',
          '2 tsp brown sugar',
          '½ tsp cayenne, optional',
          '¼ cup barbecue sauce, optional',
        ],
      },
    ],
    steps: [
      {
        title: 'Season under and over',
        cue: '15 min prep',
        body: 'Pat thighs dry and trim dangling skin. Spread a thin coat of mustard over the chicken, then apply the mixed dry seasonings. Keep refrigerated while the grill preheats. Do not rinse raw chicken.',
      },
      {
        title: 'Prepare indirect heat',
        cue: 'Grill ambient: 375–425°F',
        body: 'Preheat and clean the gas grill. Leave the burners below the chicken off and run the burners beside it. If using apple chips, place them in a smoker box according to your grill’s instructions.',
      },
      {
        title: 'Cook skin-side up',
        cue: 'About 30–40 min',
        body: 'Arrange thighs skin-side up over the unlit burners and close the lid. Rotate pieces if one side browns faster. Begin checking each piece’s thickest part after 25 minutes, away from bone.',
      },
      {
        title: 'Crisp and finish',
        cue: 'Internal: 175–185°F for thighs',
        body: 'Briefly move thighs skin-side down over moderate direct heat for 1–3 minutes, watching for flare-ups. Return to indirect heat as needed. Brush on optional sauce near the end. Every piece must reach at least 165°F; thighs are often more tender at 175–185°F.',
      },
      {
        title: 'Give it five',
        cue: 'Rest 5 min',
        body: 'Move to a clean serving platter and rest for 5 minutes. Serve with slaw, pickles, and anything that catches those juices.',
      },
    ],
  },
  {
    id: 'lemon-salmon',
    protein: 'Seafood',
    title: 'Dijon & lemon grilled salmon',
    headline: ['Clean heat.', 'Bright finish.'],
    description:
      'A light Dijon coat, lemon, and a little dill. An easy weeknight cook with almost no fuss.',
    time: '10–15 min',
    rest: '3 minutes',
    serves: '4',
    method: 'Direct medium heat',
    grill: [400, 450],
    internal: [145],
    finish:
      'Measure in the thickest part; reach 145°F before removing from the grill.',
    safety:
      'Fish: 145°F minimum. Use a probe in the thickest part, rather than relying on color alone.',
    wood: 'None, or mild alder',
    tip: 'Start skin-side down and leave it there. A fish basket makes delicate fillets easier to lift.',
    ingredients: [
      {
        title: 'Fish & finish',
        items: [
          '4 skin-on salmon fillets, about 6 oz each and 1 inch thick',
          '1½ tbsp Dijon mustard',
          '¾ tsp kosher salt, or to taste',
          '½ tsp black pepper',
          '1 tsp garlic powder',
          '1 lemon, zest and wedges',
          '1 tbsp chopped fresh dill',
          'Neutral oil, only for the grates or fish basket',
        ],
      },
    ],
    steps: [
      {
        title: 'Prep the fillets',
        cue: '10 min prep',
        body: 'Pat the salmon dry and check for pin bones. Brush the flesh with a thin layer of Dijon mustard. Sprinkle with salt, pepper, garlic powder, and lemon zest. The mustard is the binder; the oil is only for the cooking surface.',
      },
      {
        title: 'Get the grates ready',
        cue: 'Grill ambient: 400–450°F',
        body: 'Preheat and clean the gas grill. Lightly oil the grates using tongs and a folded paper towel, or use a lightly oiled fish basket. Leave an unlit zone available if the skin browns too quickly.',
      },
      {
        title: 'Skin-side down',
        cue: 'About 10–15 min',
        body: 'Place salmon skin-side down over direct medium heat and close the lid. It usually does not need flipping. Start checking at 8 minutes; move to the unlit zone if the bottom is darkening too fast.',
      },
      {
        title: 'Probe, then finish',
        cue: 'Internal: 145°F',
        body: 'Insert an instant-read probe from the side into the thickest part. Cook to 145°F, then lift with a wide spatula. Rest about 3 minutes and finish with fresh dill and lemon juice.',
      },
    ],
  },
];
export function temp(values: readonly number[], unit: Unit) {
  return (
    values
      .map((v) => (unit === 'F' ? v : Math.round(((v - 32) * 5) / 9)))
      .join('–') +
    '°' +
    unit
  );
}
export function unitText(text: string, unit: Unit) {
  return unit === 'F'
    ? text
    : text.replace(/(\d+)(?:–(\d+))?°F/g, (_, a, b) =>
        temp(b ? [+a, +b] : [+a], 'C'),
      );
}
