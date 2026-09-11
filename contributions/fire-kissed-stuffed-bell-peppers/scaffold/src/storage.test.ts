import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultSettings } from './recipe';
import { initialGrillPlan, toggleBurner } from './grill';
import { parseSavedRecipe, readSavedRecipe, storageKey, writeSavedRecipe } from './storage';
afterEach(() => vi.unstubAllGlobals());

describe('stuffed-pepper device storage', () => {
  it('restores filling, style, count, units and three-burner plan', () => {
    const settings = {
      ...defaultSettings,
      pepperCount: 8,
      measureUnit: 'metric' as const,
      tempUnit: 'C' as const,
      cut: 'cups' as const,
      filling: 'chicken' as const,
    };
    const plan = toggleBurner(initialGrillPlan(), 2);
    expect(parseSavedRecipe(JSON.stringify({ version: 1, settings, plan }))).toEqual({
      saved: true,
      settings,
      plan,
    });
  });
  it('rejects wrong burners and invalid settings', () => {
    for (const raw of [
      null,
      '{',
      '{}',
      JSON.stringify({
        version: 1,
        settings: defaultSettings,
        plan: { count: 4, orientation: 'horizontal', states: [false, false, false, false] },
      }),
      JSON.stringify({
        version: 1,
        settings: { ...defaultSettings, pepperCount: 99 },
        plan: initialGrillPlan(),
      }),
      JSON.stringify({
        version: 1,
        settings: { ...defaultSettings, filling: 'pork' },
        plan: initialGrillPlan(),
      }),
    ])
      expect(parseSavedRecipe(raw).saved).toBe(false);
  });
  it('rejects a stale texture preference', () =>
    expect(
      parseSavedRecipe(
        JSON.stringify({
          version: 1,
          settings: { ...defaultSettings, texture: 'tender' },
          plan: initialGrillPlan(),
        }),
      ).saved,
    ).toBe(false));
  it('keeps working without browser storage', () => {
    expect(readSavedRecipe().saved).toBe(false);
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('Blocked');
      },
    });
    expect(readSavedRecipe().saved).toBe(false);
    expect(writeSavedRecipe(true, defaultSettings, initialGrillPlan())).toBe(false);
  });
  it('writes and removes only this recipe key', () => {
    const setItem = vi.fn();
    const removeItem = vi.fn();
    vi.stubGlobal('window', { localStorage: { setItem, removeItem } });
    expect(writeSavedRecipe(true, defaultSettings, initialGrillPlan())).toBe(true);
    expect(setItem.mock.calls[0][0]).toBe(storageKey);
    writeSavedRecipe(false, defaultSettings, initialGrillPlan());
    expect(removeItem).toHaveBeenCalledExactlyOnceWith(storageKey);
  });
});
