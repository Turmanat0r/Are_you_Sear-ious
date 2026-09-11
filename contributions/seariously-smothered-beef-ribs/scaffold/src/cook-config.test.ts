import { describe, expect, it } from 'vitest';
import {
  buildRecipe,
  cuts,
  validateWeight,
  fromLb,
  toLb,
  parseWeight,
  parseGrillPlan,
  initialGrillPlan,
  burnerMessage,
  grillPlanSummary,
} from './cook-config';
import { ingredientGroups, scaledIngredient } from './ribs';
import { temp, unitText } from './recipes';

describe('rib formula and scaling', () => {
  it('preserves all 20 ingredients and the mustard/sauce base', () => {
    expect(ingredientGroups.flatMap((group) => group.items)).toHaveLength(20);
    const all = buildRecipe(cuts[0].id, 4).ingredients.flatMap((group) => group.items);
    expect(all).toContain('2 tbsp yellow mustard, for the binder');
    expect(all).toContain('12 g kosher salt, weighed');
    expect(all).toContain('3 tbsp Worcestershire sauce');
    expect(all).toContain('1 ½ cups ketchup');
  });
  it('scales all ingredient amounts in both systems, retaining grams for salt', () => {
    for (const weight of [2, 4, 8, 12])
      for (const unit of ['lb', 'kg'] as const)
        for (const group of ingredientGroups)
          for (const ingredient of group.items)
            expect(scaledIngredient(ingredient, weight / 4, unit).amount).toBeCloseTo(
              ((unit === 'kg' ? ingredient.metricAmount : ingredient.amount) * weight) / 4,
            );
    const all = buildRecipe(cuts[0].id, 8, 'kg').ingredients.flatMap((group) => group.items);
    expect(all).toContain('24 g kosher salt, weighed');
    expect(all).toContain('720 ml ketchup');
  });
  it('keeps times independent of total batch weight', () => {
    for (const cut of cuts)
      for (const weight of [2, 4, 8, 12]) {
        const result = buildRecipe(cut.id, weight);
        expect(result.time).toBe(cut.thick ? '5–8 hours + rest' : '4–6 hours + rest');
        expect(result.grill).toEqual([275, 300]);
        expect(result.internal).toEqual([200, 205]);
        expect(result.steps).toHaveLength(6);
      }
  });
  it('distinguishes whole-cut safety from probe tenderness', () => {
    const result = buildRecipe(cuts[0].id, 4);
    expect(result.safety).toMatch(/145°F.*3-minute rest/);
    expect(result.finish).toContain('200–205°F');
    expect(result.scalingNote).toContain('not thin flanken');
    expect(result.scalingNote).toContain('pan shape determines liquid depth');
  });
  it('converts every written method temperature and preserves weight', () => {
    expect(temp([275, 300], 'C')).toBe('135–149°C');
    expect(temp([200, 205], 'C')).toBe('93–96°C');
    expect(unitText('145°F plus rest; reheat 165°F', 'C')).toBe('63°C plus rest; reheat 74°C');
    expect(toLb(fromLb(8, 'kg'), 'kg')).toBe(8);
    for (const step of buildRecipe(cuts[1].id, 6).steps)
      expect(unitText(step.cue + step.body, 'C')).not.toContain('°F');
  });
});

describe('input and manual burner validation', () => {
  it.each([-1, 0, 1.99, 12.01, Infinity, NaN])('rejects invalid weight %s', (value) =>
    expect(validateWeight(cuts[0], value)).toBe(false),
  );
  it('rejects unknown cuts and blank or malformed input', () => {
    expect(() => buildRecipe('unknown', 4)).toThrow();
    for (const input of ['', ' ', 'bad', '-4', 'Infinity'])
      expect(parseWeight(cuts[0], input, 'lb')).toBeNull();
  });
  it('keeps the displayed kg boundaries valid without rounding drift', () => {
    expect(parseWeight(cuts[0], '0.9072', 'kg')).toBe(2);
    expect(parseWeight(cuts[0], '5.4431', 'kg')).toBe(12);
    expect(parseWeight(cuts[0], '5.5', 'kg')).toBeNull();
  });
  it('starts all burners off and isolates mutable defaults', () => {
    const first = initialGrillPlan();
    expect(first.states).toEqual([false, false, false]);
    first.states[0] = true;
    expect(initialGrillPlan().states[0]).toBe(false);
  });
  it('restores a valid physical plan while fixing this recipe to indirect heat', () => {
    const value = {
      count: 4,
      states: [true, false, true, false],
      orientation: 'vertical',
      method: 'direct',
    };
    const result = parseGrillPlan(JSON.stringify(value));
    expect(result.states).toEqual(value.states);
    expect(result.method).toBe('indirect');
    expect(grillPlanSummary(result)).toContain('ON: 1, 3. OFF: 2, 4');
  });
  it('falls back safely on malformed stored plans', () => {
    for (const raw of [null, 'bad', 'null', '{}', '{"count":3,"states":[true]}'])
      expect(parseGrillPlan(raw)).toEqual(initialGrillPlan());
  });
  it('distinguishes no heat, all heat, and usable indirect space in every supported layout', () => {
    for (let count = 2; count <= 6; count++)
      for (let mask = 0; mask < 2 ** count; mask++) {
        const states = Array.from({ length: count }, (_, i) => Boolean(mask & (1 << i)));
        const lit = states.filter(Boolean).length;
        expect(burnerMessage(states, 'indirect')).toContain(
          !lit ? 'No burners' : lit === count ? 'Every burner is ON' : 'OFF zones for ribs',
        );
      }
  });
});
