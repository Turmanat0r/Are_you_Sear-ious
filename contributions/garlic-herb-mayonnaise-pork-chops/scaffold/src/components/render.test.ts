import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defaultSettings, recipe, variants } from '../recipe';
import { initialGrillPlan } from '../grill';
import { Ingredients } from './Ingredients';
import { Method } from './Method';
import { RecipeControls } from './RecipeControls';
import { RecipePrint } from './RecipePrint';

describe('recipe components', () => {
  it('renders every protein option', () => { const html=renderToStaticMarkup(createElement(RecipeControls,{settings:defaultSettings,onChange:()=>{}})); variants.forEach(v=>expect(html).toContain(v.name)); });
  it('renders the ingredient checklist', () => { const html=renderToStaticMarkup(createElement(Ingredients,{settings:defaultSettings,checked:[]})); expect(html).toContain('Ingredients'); expect(html).toContain('checkbox'); });
  it('renders method science', () => { const html=renderToStaticMarkup(createElement(Method,{settings:defaultSettings})); expect(html).toContain('THE SCIENCE'); });
  it('renders a printable title and burner plan', () => { const html=renderToStaticMarkup(createElement(RecipePrint,{settings:defaultSettings,plan:initialGrillPlan()})); expect(html).toContain(recipe.title); expect(html).toContain('OFF: 1, 2, 3'); });
  it('renders Celsius in print', () => { const html=renderToStaticMarkup(createElement(RecipePrint,{settings:{...defaultSettings,tempUnit:'C'},plan:initialGrillPlan()})); expect(html).toContain('°C'); });
});
