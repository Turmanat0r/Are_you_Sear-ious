import type { Protein, Recipe } from './recipes';
import { ribCuts, buildRibsRecipe, collagenScience } from './ribs';
import { numberLabel } from './amounts';
export { amountLabel, numberLabel } from './amounts';

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
  grill: number[];
  internal: number[];
  time: string;
  rest: string;
  timing: string;
  family: 'beef-ribs';
  thick: boolean;
};
export type Science = { title: string; body: string; takeaway: string };
export type ConfiguredRecipe = Recipe & {
  cut: Cut;
  weightLb: number;
  sizeLabel: string;
  scale: number;
  timingNote: string;
  photo: string;
  photoAlt: string;
  photoCaption: string;
  scalingNote?: string;
  attribution?: { label: string; url: string; note: string };
  equipment?: string[];
  extraScience?: { afterStep: number; note: Science }[];
};
export type GrillPlan = {
  count: number;
  states: boolean[];
  orientation: 'horizontal' | 'vertical';
  method: 'indirect';
};
export const cuts = ribCuts;
export const defaultCuts: Record<Protein, string> = { Beef: cuts[0].id };
export function fromLb(lb: number, unit: WeightUnit) {
  return unit === 'lb' ? lb : lb * 0.45359237;
}
export function toLb(value: number, unit: WeightUnit) {
  return unit === 'lb' ? value : value / 0.45359237;
}
export function validateWeight(cut: Cut, value: number) {
  return Number.isFinite(value) && value >= cut.minLb - 1e-6 && value <= cut.maxLb + 1e-6;
}
// Match the four-decimal unit display at exact supported boundaries.
export function parseWeight(cut: Cut, input: string, unit: WeightUnit): number | null {
  if (input.trim() === '') return null;
  let lb = toLb(Number(input), unit);
  for (const boundary of [cut.minLb, cut.maxLb]) {
    if (Math.abs(lb - boundary) <= 0.00012) lb = boundary;
  }
  return validateWeight(cut, lb) ? lb : null;
}

export function initialGrillPlan(): GrillPlan {
  return { count: 3, states: [false, false, false], orientation: 'horizontal', method: 'indirect' };
}

export function parseGrillPlan(raw: string | null): GrillPlan {
  try {
    const value = JSON.parse(raw ?? 'null') as Partial<GrillPlan> | null;
    if (
      !value ||
      !Number.isInteger(value.count) ||
      value.count! < 2 ||
      value.count! > 6 ||
      !Array.isArray(value.states) ||
      value.states.length !== value.count ||
      !value.states.every((item) => typeof item === 'boolean') ||
      !['horizontal', 'vertical'].includes(value.orientation ?? '')
    )
      return initialGrillPlan();
    return {
      count: value.count!,
      states: [...value.states],
      orientation: value.orientation!,
      method: 'indirect',
    };
  } catch {
    return initialGrillPlan();
  }
}
export function buildRecipe(
  cutId: string,
  weightLb: number,
  weightUnit: WeightUnit = 'lb',
): ConfiguredRecipe {
  const cut = cuts.find((entry) => entry.id === cutId);
  if (!cut) throw new Error('Unknown cut');
  if (!validateWeight(cut, weightLb)) throw new Error('Weight outside supported range');
  return buildRibsRecipe({
    cut,
    weightLb,
    weightUnit,
    scale: weightLb / cut.baseLb,
    sizeLabel: numberLabel(fromLb(weightLb, weightUnit)) + ' ' + weightUnit,
  });
}
export const dryBrineScience: Science = {
  title: 'A mustard coat. One measured salt allowance.',
  body: 'Mustard helps the peppery rub adhere. Salt diffuses beneath the surface during a refrigerated rest, giving seasoning more time to move into the meat. The binder itself does not deeply tenderize the ribs.',
  takeaway:
    'Use the listed meat salt once. Cook now or refrigerate seasoned ribs for 4–24 hours; do not salt them again before grilling.',
};
export const zoneScience: Science = {
  title: 'An OFF burner is still a cooking zone',
  body: 'Radiant heat from a lit burner can brown or scorch the surface intensely. Above unlit burners, hot air and surrounding surfaces heat the food more gently. This gives thick ribs time to soften and keeps the sugary sauce away from direct flame.',
  takeaway:
    'Keep ribs and the entire pan above unlit burners. Measure 275–300°F beside the food; knob position is not a temperature.',
};
export function cookingScience(): Science {
  return collagenScience;
}
export function burnerMessage(states: boolean[], method: string) {
  const lit = states.filter(Boolean).length;
  if (!lit)
    return 'No burners selected. Choose the burners you plan to light; the diagram does not control a real grill.';
  if (lit === states.length)
    return 'Every burner is ON. Turn at least one OFF to create an indirect area for these ribs.';
  if (method === 'direct')
    return 'Direct mode is selected, but these ribs need an unlit zone for every cooking stage. Keep the ribs and pan above OFF burners, including while glazing.';
  return 'Use the OFF zones for ribs and the entire pan; use your chosen ON zones for heat. The whole batch must fit above unlit burners.';
}
export function grillPlanSummary(plan: GrillPlan) {
  const lit = plan.states.flatMap((on, i) => (on ? [i + 1] : []));
  const off = plan.states.flatMap((on, i) => (on ? [] : [i + 1]));
  return (
    plan.count +
    ' burners, ' +
    (plan.orientation === 'vertical' ? 'back to front' : 'left to right') +
    '. ON: ' +
    (lit.join(', ') || 'none') +
    '. OFF: ' +
    (off.join(', ') || 'none') +
    '. ' +
    burnerMessage(plan.states, plan.method)
  );
}
