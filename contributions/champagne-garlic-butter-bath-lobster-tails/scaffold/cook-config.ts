import type { Recipe } from "./recipes";
import { lobsterCuts, tailCounts, makeLobsterRecipe } from "./lobster";
export { numberLabel } from "./amounts";
export { shellScience, butterScience } from "./lobster";
export type WeightUnit = "lb" | "kg";
export type Cut = {
  id: string;
  name: string;
  metricName: string;
  tailOz: number;
  time: string;
  firstCheck: number;
};
export type Science = { title: string; body: string; takeaway: string };
export type ConfiguredRecipe = Recipe & {
  cut: Cut;
  cutLabel: string;
  tailCount: number;
  weightLb: number;
  scale: number;
  sizeLabel: string;
  batchLabel: string;
  timingNote: string;
  photo: string;
  photoAlt: string;
  photoCaption: string;
  scalingNote: string;
  attribution: { label: string; url: string; note: string };
  equipment: string[];
  extraScience: { afterStep: number; note: Science }[];
};
export type GrillPlan = {
  count: number;
  states: boolean[];
  orientation: string;
  method: string;
};
export const cuts = lobsterCuts;
export const defaultCutId = "lobster-medium";
export function validateCount(value: number) {
  return (
    Number.isInteger(value) && (tailCounts as readonly number[]).includes(value)
  );
}
export function buildRecipe(
  cutId: string,
  tailCount: number,
  weightUnit: WeightUnit = "lb",
): ConfiguredRecipe {
  const cut = cuts.find((entry) => entry.id === cutId);
  if (!cut) throw new Error("Unknown tail size");
  if (!validateCount(tailCount)) throw new Error("Unsupported tail count");
  return makeLobsterRecipe(cut, tailCount, weightUnit);
}
export const zoneScience: Science = {
  title: "An OFF burner is still a cooking zone.",
  body: "Hot air and surrounding grill surfaces heat the pan above unlit burners. Direct flame heats its underside much more aggressively, making the butter harder to control.",
  takeaway:
    "Keep the whole pan above OFF burners. Hold grill air at 325–350°F beside the food; adjust the real grill to keep the bath gentle.",
};
export function burnerMessage(states: boolean[], method: string) {
  const lit = states.filter(Boolean).length;
  if (!lit)
    return "No burners selected. Choose the burners you plan to light; the diagram does not control a real grill.";
  if (lit === states.length)
    return "Every burner is ON. Turn at least one OFF to create an indirect area for the butter bath.";
  if (method === "direct")
    return "Direct mode is selected, but this butter bath needs an unlit zone. Keep the entire pan above OFF burners throughout cooking.";
  return "Use the OFF zones for every butter-bath pan; use your chosen ON zones for heat. Keep the bath gently shimmering, never at a hard boil.";
}
export function grillPlanSummary(plan: GrillPlan) {
  const lit = plan.states.flatMap((on, i) => (on ? [i + 1] : []));
  const off = plan.states.flatMap((on, i) => (on ? [] : [i + 1]));
  return (
    plan.count +
    " burners, " +
    (plan.orientation === "vertical" ? "back to front" : "left to right") +
    ". ON: " +
    (lit.join(", ") || "none") +
    ". OFF: " +
    (off.join(", ") || "none") +
    ". " +
    burnerMessage(plan.states, plan.method)
  );
}
