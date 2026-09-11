import { describe, expect, it } from 'vitest';
import { defaultSettings, recipe } from './recipe';
import { initialGrillPlan } from './grill';
import { initialSavedRecipe, parseSavedRecipe, storageKey } from './storage';

describe('saved recipe', () => {
  it('starts unsaved with all burners off', () => { const value=initialSavedRecipe(); expect(value.saved).toBe(false); expect(value.plan.states).toEqual([false,false,false]); });
  it('uses a recipe-specific key', () => { expect(storageKey).toContain(recipe.id); });
  it('parses a valid saved value', () => { const raw=JSON.stringify({version:1,settings:defaultSettings,plan:initialGrillPlan()}); expect(parseSavedRecipe(raw).saved).toBe(true); });
  it('rejects malformed JSON', () => { expect(parseSavedRecipe('{')).toEqual(initialSavedRecipe()); });
  it('rejects unknown versions', () => { const raw=JSON.stringify({version:2,settings:defaultSettings,plan:initialGrillPlan()}); expect(parseSavedRecipe(raw).saved).toBe(false); });
  it('rejects invalid burners', () => { const raw=JSON.stringify({version:1,settings:defaultSettings,plan:{count:3,orientation:'horizontal',states:[true]}}); expect(parseSavedRecipe(raw).saved).toBe(false); });
});
