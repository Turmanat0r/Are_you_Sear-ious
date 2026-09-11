export const burnerCount = 3 as const;
export type BurnerStates = [boolean, boolean, boolean];
export type GrillPlan = { count: 3; orientation: 'horizontal' | 'vertical'; states: BurnerStates };
export function initialGrillPlan(): GrillPlan {
  return { count: burnerCount, orientation: 'horizontal', states: [false, false, false] };
}
export function isGrillPlan(value: unknown): value is GrillPlan {
  if (!value || typeof value !== 'object') return false;
  const plan = value as GrillPlan;
  return (
    plan.count === 3 &&
    ['horizontal', 'vertical'].includes(plan.orientation) &&
    Array.isArray(plan.states) &&
    plan.states.length === 3 &&
    plan.states.every((on) => typeof on === 'boolean')
  );
}
export function toggleBurner(plan: GrillPlan, index: number): GrillPlan {
  if (!Number.isInteger(index) || index < 0 || index >= burnerCount) return plan;
  const states: BurnerStates = [...plan.states];
  states[index] = !states[index];
  return { ...plan, states };
}
export function burnerMessage(states: BurnerStates) {
  const on = states.filter(Boolean).length;
  if (!on)
    return 'No burners selected. Choose the burners you will light. This diagram does not control a real grill.';
  if (on === 3)
    return 'All three burners are ON. Turn enough burners OFF to create an indirect zone for the chops.';
  return 'Keep the chops above your chosen OFF burners for the indirect phase. Adjust the selected ON burners to hold the grate-level ambient target.';
}
export function planSummary(plan: GrillPlan) {
  const list = (on: boolean) =>
    plan.states.flatMap((value, i) => (value === on ? [i + 1] : [])).join(', ') || 'none';
  return `3 burners, ${plan.orientation === 'horizontal' ? 'left to right' : 'back to front'}. ON: ${list(true)}. OFF: ${list(false)}. ${burnerMessage(plan.states)}`;
}
