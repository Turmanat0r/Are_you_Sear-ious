import { describe, expect, it } from 'vitest';
import { amountLabel, defaultSettings, methodSteps, parseServings, recipe, safetySentence, scaledIngredients, temp, temperatureRows, variants, vessels } from './recipe';

describe('recipe model', () => {
  it('uses a valid default', () => { expect(parseServings(String(defaultSettings.servings))).toBe(defaultSettings.servings); });
  it('rejects fractional servings', () => { expect(parseServings('4.5')).toBeNull(); });
  it('rejects out-of-range servings', () => { expect(parseServings(String(recipe.maxServings + 1))).toBeNull(); });
  it('scales ingredient quantities', () => { const base=scaledIngredients(defaultSettings); const doubled=scaledIngredients({...defaultSettings,servings:defaultSettings.servings*2}); expect(doubled[0].amount).toBe(base[0].amount*2); });
  it('changes selected chop cut', () => { expect(variants.map(v=>v.id)).toContain('bone-in'); expect(variants.map(v=>v.id)).toContain('boneless'); });
  it('has six complete method steps', () => { expect(methodSteps(defaultSettings)).toHaveLength(6); });
  it('includes grill care', () => { expect(methodSteps(defaultSettings).map(x=>x.body).join(' ')).toMatch(/clean.*grill|grates/i); });
  it('includes cooking science', () => { expect(methodSteps(defaultSettings).every(x=>x.science.length>30)).toBe(true); });
  it('includes an indirect zone', () => { expect(methodSteps(defaultSettings).map(x=>x.body).join(' ')).toMatch(/OFF zone/i); });
  it('converts Fahrenheit', () => { expect(temp(165,'C')).toBe('74°C'); });
  it('converts a binder volume to metric', () => { const item=scaledIngredients(defaultSettings).find(i=>i.id==='mayo')!; expect(amountLabel(item,'metric')).toMatch(/mL$/); });
  it('defines at least two cookware sizes', () => { expect(vessels.length).toBeGreaterThanOrEqual(2); });
  it('defines both chop cuts', () => { expect(variants.length).toBe(2); });
  it('lists sear, ambient and finish rows', () => { const rows=temperatureRows(defaultSettings); expect(rows[0].value).toEqual(recipe.searAmbientF); expect(rows.some(r=>r.value===recipe.grillAmbientF)).toBe(true); expect(rows.some(r=>r.value===recipe.finishF)).toBe(true); });
  it('states the whole-pork target', () => { expect(safetySentence(defaultSettings)).toContain('145°F'); });
});
