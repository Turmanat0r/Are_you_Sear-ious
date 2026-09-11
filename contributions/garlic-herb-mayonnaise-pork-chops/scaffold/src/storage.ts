import {
  defaultSettings,
  normalizeSettings,
  parseServings,
  recipe,
  variants,
  vessels,
  type Settings,
} from './recipe';
import { initialGrillPlan, isGrillPlan, type GrillPlan } from './grill';
export const storageKey = `searious-${recipe.id}-3burner-v1`;
export type SavedRecipe = { saved: boolean; settings: Settings; plan: GrillPlan };
export function initialSavedRecipe(): SavedRecipe {
  return { saved: false, settings: { ...defaultSettings }, plan: initialGrillPlan() };
}
export function parseSavedRecipe(raw: string | null): SavedRecipe {
  try {
    const data = JSON.parse(raw ?? 'null');
    const s = data?.settings;
    if (
      data?.version !== 1 ||
      !s ||
      !isGrillPlan(data.plan) ||
      !vessels.some((vessel) => vessel.id === s.vessel) ||
      !variants.some((variant) => variant.id === s.variant) ||
      !['us', 'metric'].includes(s.measureUnit) ||
      !['F', 'C'].includes(s.tempUnit) ||
      typeof s.servings !== 'number' ||
      parseServings(String(s.servings)) === null
    )
      return initialSavedRecipe();
    return { saved: true, settings: normalizeSettings(s), plan: data.plan };
  } catch {
    return initialSavedRecipe();
  }
}
export function readSavedRecipe(): SavedRecipe {
  try {
    return parseSavedRecipe(window.localStorage.getItem(storageKey));
  } catch {
    return initialSavedRecipe();
  }
}
export function writeSavedRecipe(saved: boolean, settings: Settings, plan: GrillPlan): boolean {
  try {
    if (saved)
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ version: 1, settings: normalizeSettings(settings), plan }),
      );
    else window.localStorage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}
