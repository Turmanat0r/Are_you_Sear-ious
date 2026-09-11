import {
  cuts,
  defaultSettings,
  fillings,
  normalizeSettings,
  parsePepperCount,
  type Settings,
} from './recipe';
import { initialGrillPlan, isGrillPlan, type GrillPlan } from './grill';
export const storageKey = 'searious-stuffed-peppers-3burner-v1';
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
      !cuts.some((cut) => cut.id === s.cut) ||
      !fillings.some((filling) => filling.id === s.filling) ||
      s.texture !== 'minimum' ||
      !['us', 'metric'].includes(s.measureUnit) ||
      !['F', 'C'].includes(s.tempUnit) ||
      typeof s.pepperCount !== 'number' ||
      parsePepperCount(String(s.pepperCount)) === null
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
