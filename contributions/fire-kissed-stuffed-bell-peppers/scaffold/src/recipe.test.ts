import { describe, expect, it } from 'vitest';
import {
  amountLabel,
  cuts,
  defaultSettings,
  fillings,
  methodSteps,
  parsePepperCount,
  recipe,
  safetySentence,
  scaledIngredients,
  targetFor,
  temp,
  unitText,
} from './recipe';

describe('stuffed bell pepper recipe', () => {
  it('offers vegetarian, beef, chicken and split fillings', () =>
    expect(fillings.map((item) => item.id)).toEqual(['vegetarian', 'beef', 'chicken', 'split']));
  it('scales every ingredient by whole pepper count', () => {
    const base = scaledIngredients(defaultSettings);
    const doubled = scaledIngredients({ ...defaultSettings, pepperCount: 8 });
    doubled.forEach((item, index) => expect(item.amount).toBeCloseTo(base[index].amount * 2));
  });
  it('changes selected ingredients with the filling', () => {
    expect(scaledIngredients(defaultSettings).map((item) => item.id)).toContain('beans');
    expect(
      scaledIngredients({ ...defaultSettings, filling: 'beef' }).map((item) => item.id),
    ).toContain('beef');
    expect(
      scaledIngredients({ ...defaultSettings, filling: 'chicken' }).map((item) => item.id),
    ).toContain('chicken');
  });
  it('builds a true split batch', () => {
    const items = scaledIngredients({ ...defaultSettings, filling: 'split' });
    expect(items.find((item) => item.id === 'beef')?.amount).toBe(0.5);
    expect(items.find((item) => item.id === 'beans')?.amount).toBe(0.5);
  });
  it('converts useful metric measures', () => {
    const items = scaledIngredients({ ...defaultSettings, filling: 'beef' });
    expect(
      amountLabel(
        items.find((item) => item.id === 'beef')!,
        'metric',
      ),
    ).toBe('454 g');
    expect(
      amountLabel(
        items.find((item) => item.id === 'cheese')!,
        'metric',
      ),
    ).toBe('170 g');
  });
  it('validates whole pepper count', () => {
    expect(parsePepperCount('2')).toBe(2);
    expect(parsePepperCount('4.5')).toBeNull();
    expect(parsePepperCount('13')).toBeNull();
  });
  it('uses filling-specific targets', () => {
    expect(targetFor({ ...defaultSettings, filling: 'beef' }).internalF).toBe(160);
    expect(targetFor({ ...defaultSettings, filling: 'chicken' }).internalF).toBe(165);
    expect(safetySentence({ ...defaultSettings, filling: 'split' })).toContain('160°F');
  });
  it('converts all method temperatures', () => {
    expect(temp(recipe.grillAmbientF, 'C')).toBe('191–204°C');
    for (const step of methodSteps(defaultSettings))
      for (const text of [step.body, step.cue, step.science])
        expect(unitText(text, 'C')).not.toContain('°F');
  });
  it('changes timing by pepper style, not count', () => {
    expect(methodSteps({ ...defaultSettings, pepperCount: 2 })[3].cue).toBe(
      methodSteps({ ...defaultSettings, pepperCount: 12 })[3].cue,
    );
    expect(cuts[0].time).not.toBe(cuts[1].time);
  });
  it('keeps vegetarian tools separate in a split batch', () =>
    expect(methodSteps({ ...defaultSettings, filling: 'split' })[2].body).toContain(
      'separate utensils',
    ));
});
