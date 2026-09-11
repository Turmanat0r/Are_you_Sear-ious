import type { ConfiguredRecipe, Cut, Science, WeightUnit } from "./cook-config";
import { amountLabel, numberLabel } from "./amounts";

export const tailCounts = [1, 2, 3, 4, 6, 8] as const;
export const lobsterCuts: Cut[] = [
  {
    id: "lobster-small",
    name: "Small · 4–6 oz",
    metricName: "Small · 113–170 g",
    tailOz: 5,
    time: "8–12 min",
    firstCheck: 6,
  },
  {
    id: "lobster-medium",
    name: "Medium · 7–9 oz",
    metricName: "Medium · 198–255 g",
    tailOz: 8,
    time: "12–16 min",
    firstCheck: 9,
  },
  {
    id: "lobster-jumbo",
    name: "Jumbo · 10–12 oz",
    metricName: "Jumbo · 283–340 g",
    tailOz: 11,
    time: "16–22 min",
    firstCheck: 12,
  },
];
export type LobsterIngredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  metricAmount: number;
  metricUnit: string;
};
// Original quantities for two medium tails. US measures are unchanged.
export const bathIngredients: LobsterIngredient[] = [
  {
    id: "butter",
    name: "unsalted butter",
    amount: 6,
    unit: "tbsp",
    metricAmount: 84,
    metricUnit: "g",
  },
  {
    id: "wine",
    name: "dry sparkling wine",
    amount: 0.25,
    unit: "cup",
    metricAmount: 60,
    metricUnit: "ml",
  },
  {
    id: "garlic",
    name: "garlic, finely grated",
    amount: 2,
    unit: "cloves",
    metricAmount: 2,
    metricUnit: "cloves",
  },
  {
    id: "zest",
    name: "lemon zest",
    amount: 1,
    unit: "tsp",
    metricAmount: 5,
    metricUnit: "ml",
  },
  {
    id: "tarragon",
    name: "fresh tarragon, chopped",
    amount: 1,
    unit: "tbsp",
    metricAmount: 15,
    metricUnit: "ml",
  },
  {
    id: "chives",
    name: "fresh chives, sliced; divided",
    amount: 1,
    unit: "tbsp",
    metricAmount: 15,
    metricUnit: "ml",
  },
  {
    id: "paprika",
    name: "smoked paprika; divided",
    amount: 0.25,
    unit: "tsp",
    metricAmount: 1.25,
    metricUnit: "ml",
  },
  {
    id: "salt",
    name: "kosher salt; divided",
    amount: 0.5,
    unit: "tsp",
    metricAmount: 2.5,
    metricUnit: "ml",
  },
  {
    id: "lemon",
    name: "fresh lemon juice, to finish",
    amount: 1,
    unit: "tbsp",
    metricAmount: 15,
    metricUnit: "ml",
  },
];
export function scaledIngredient(
  item: LobsterIngredient,
  scale: number,
  unit: WeightUnit,
) {
  return {
    amount: (unit === "kg" ? item.metricAmount : item.amount) * scale,
    unit: unit === "kg" ? item.metricUnit : item.unit,
  };
}
function ingredientText(
  item: LobsterIngredient,
  scale: number,
  unit: WeightUnit,
) {
  const value = scaledIngredient(item, scale, unit);
  const amount =
    unit === "lb" ? amountLabel(value.amount) : numberLabel(value.amount);
  const measure =
    value.unit === "cup" && value.amount > 1
      ? "cups"
      : value.unit === "cloves" && value.amount === 1
        ? "clove"
        : value.unit;
  return amount + " " + measure + " " + item.name;
}
export const shellScience: Science = {
  title: "Open the shell. Protect the underside.",
  body: "Splitting the top shell exposes the meat to gentle heat and basting while the shell cradles the underside. It also makes it easier to insert a thin probe sideways into the center.",
  takeaway:
    "Keep the meat attached at the base. Check the thickest meat, not the shell or the hot butter.",
};
export const butterScience: Science = {
  title: "A butter bath, not a rolling boil.",
  body: "Gentle heat helps limit surface drying. A hard boil can separate the butter mixture and cook the outside too quickly, narrowing the window between juicy and tough.",
  takeaway:
    "Keep the pan over unlit burners. The 325–350°F target is grill air at grate level, not the temperature of the butter.",
};
const wineScience: Science = {
  title: "A little wine. A lot of aroma.",
  body: "Sparkling wine brings acidity and aroma; butter carries the garlic and herbs across the exposed meat. Neither wine nor lemon makes undercooked shellfish safe.",
  takeaway:
    "Baste every 3–4 minutes. Tail thickness and the thermometer decide the finish, not the number of tails.",
};
const safetyScience: Science = {
  title: "Pearly is a clue. Temperature is the decision.",
  body: "Lobster flesh becomes firm, pearly, and opaque as it cooks. A thin probe in the thickest meat provides the temperature check; keep it clear of the shell and pan.",
  takeaway:
    "Cook each tail to 145°F before removal. Use clean reserved butter for serving and discard the bath that contacted raw lobster.",
};
export function makeLobsterRecipe(
  cut: Cut,
  tailCount: number,
  weightUnit: WeightUnit,
): ConfiguredRecipe {
  const weightLb = (tailCount * cut.tailOz) / 16;
  const scale = weightLb;
  const sizeLabel =
    "about " +
    numberLabel(weightUnit === "lb" ? weightLb : weightLb * 0.45359237) +
    " " +
    weightUnit +
    " total";
  const cutLabel = weightUnit === "kg" ? cut.metricName : cut.name;
  return {
    id: cut.id,
    protein: "Lobster",
    title: "Champagne–garlic butter-bath lobster tails",
    headline: ["Champagne.", "Butter-bath lobster."],
    description:
      "Sweet lobster tails gently basted in garlic–tarragon butter, brightened with sparkling wine and lemon.",
    cut,
    cutLabel,
    tailCount,
    weightLb,
    scale,
    sizeLabel,
    batchLabel: tailCount + " lobster tail" + (tailCount === 1 ? "" : "s"),
    timingNote:
      "Plan 10 minutes prep and 3–5 minutes to melt the bath, then " +
      cut.time +
      " cooking. First check at " +
      cut.firstCheck +
      " minutes. Timing follows individual tail thickness, not total batch weight. Rest 1–2 minutes.",
    time: cut.time,
    rest: "1–2 minutes",
    serves: String(tailCount) + " with accompaniments",
    method: "Indirect butter bath",
    grill: [325, 350],
    internal: [145],
    finish:
      "Cook to 145°F in the thickest meat before removal. Probe sideways without touching shell; flesh should be pearly and opaque.",
    safety:
      "Seafood safe internal target: 145°F. Rest 1–2 minutes for serving, not as a substitute for reaching the target.",
    wood: "Split shell · no flipping",
    tip: "Use extra small pans instead of crowding a large batch. Keep a clean spoon and a little reserved butter separate for finishing. Shellfish and milk allergens; sparkling wine contains alcohol and may contain sulfites.",
    photo: "./images/champagne-garlic-butter-bath-lobster-tails.webp",
    photoAlt:
      "AI illustration of champagne–garlic butter-bath lobster tails, preserved from the supplied recipe package",
    photoCaption: "Butter-bath lobster · AI illustration",
    scalingNote:
      "Amounts use 5, 8, or 11 oz per tail as size estimates. Keep tails in a single layer in snug pans. Salt and paprika are one total allowance, divided between seasoning and the bath.",
    attribution: {
      label: "Original Are You Sear-ious recipe",
      url: "https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-fresh-and-frozen-seafood-safely",
      note: "Recipe and image retained from your supplied lobster package. FDA seafood guidance informs the safety notes. Not kitchen-tested.",
    },
    equipment: [
      "Kitchen shears",
      "Shallow metal or sturdy doubled-foil pan; rimmed tray",
      "Grate-level and thin-probe instant-read thermometers",
      "Heatproof spoon, clean serving spoon, and small clean butter cup",
      "Heatproof gloves and enough room above unlit burners",
    ],
    ingredients: [
      {
        title: "Lobster tails",
        items: [
          tailCount +
            " lobster tail" +
            (tailCount === 1 ? "" : "s") +
            " · " +
            cutLabel.toLowerCase() +
            " each",
        ],
      },
      {
        title: "Champagne–garlic butter bath",
        items: bathIngredients.map((item) =>
          ingredientText(item, scale, weightUnit),
        ),
      },
    ],
    extraScience: [
      { afterStep: 2, note: wineScience },
      { afterStep: 3, note: safetyScience },
    ],
    steps: [
      {
        title: "Split, loosen, and season",
        cue: "10 min prep",
        body: "Thaw tails in the refrigerator. Cut the top shell lengthwise, stopping before the tail fan. Loosen the meat but leave it attached at the base; lift it slightly above the shell. Remove the dark intestinal vein if present. Pat dry. Use a little of the measured salt and smoked paprika to season the meat; reserve the remainder for the bath. Do not add a second full allowance.",
      },
      {
        title: "Start the champagne butter bath",
        cue: "325–350°F ambient · 3–5 min",
        body: "Follow your grill's lighting instructions and selected burner plan. Preheat to 325–350°F, measured at grate level beside the pan. Set a shallow pan over the unlit zone. Add the measured butter, sparkling wine, garlic, lemon zest, tarragon, most of the chives, and the remaining measured paprika and salt. Close the lid until the butter melts and the garlic smells sweet, 3–5 minutes. The bath should shimmer, not boil. Before adding raw lobster, reserve a little clean butter mixture in a separate heatproof cup for serving.",
      },
      {
        title: "Bathe and baste—do not flip",
        cue: cut.time + " estimate · first check at " + cut.firstCheck + " min",
        body:
          "Nestle tails shell-side down in the bath, spoon butter over the exposed meat, and close the lid. Baste every 3–4 minutes. Rotate the pan if one side runs hotter. Start probing at " +
          cut.firstCheck +
          " minutes. Do not scale cooking time by the number of tails. For larger batches, use additional snug pans and leave room for heat to circulate; keep every pan above unlit burners.",
      },
      {
        title: "Verify and finish bright",
        cue: "145°F internal · rest 1–2 min",
        body: "Insert a thin probe sideways into the thickest meat without touching shell. Remove each tail when it reaches 145°F; the meat should be pearly and opaque. Rest 1–2 minutes. Gently warm the clean reserved butter without using the basting spoon, spoon it over the tails, and finish with the measured lemon juice and remaining chives. Discard the used bath. Refrigerate leftovers within 2 hours, or within 1 hour when air is above 90°F.",
      },
    ],
  };
}
