import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { buildRecipe, cuts } from '../cook-config';
import { RecipePrint } from './RecipePrint';
import Home from '../App';
import { CookMode } from './CookMode';

it('prints configured amounts, temperatures, science, steps and the actual burner plan', () => {
  const html = renderToStaticMarkup(
    createElement(RecipePrint, {
      recipe: buildRecipe(cuts[1].id, 8, 'kg'),
      unit: 'C',
      grillPlan: {
        count: 4,
        states: [false, true, false, true],
        orientation: 'vertical',
        method: 'indirect',
      },
    }),
  );
  expect(html).toContain('720 ml ketchup');
  expect(html).toContain('24 g kosher salt');
  expect(html).toContain('93–96°C');
  expect(html).toContain('63°C');
  expect(html).not.toContain('°F');
  expect(html).toContain('ON: 2, 4. OFF: 1, 3');
  expect(html).toContain('Rest, smother, and bring napkins');
  expect(html).toContain('A little grill science');
});

it('renders the full page without localStorage or a browser global', () => {
  const html = renderToStaticMarkup(createElement(Home));
  expect(html).toContain('Sear-iously smothered beef ribs');
  expect(html).toContain('seariously-smothered-beef-ribs-small.webp');
  expect(html).toContain('You pick the burners');
  expect(html).not.toContain('Direct / searing');
  expect(html).toContain('0/20');
});

it('renders an externally owned cook session and labels tenderness separately', () => {
  const noop = () => {};
  const html = renderToStaticMarkup(
    createElement(CookMode, {
      recipe: buildRecipe(cuts[0].id, 4),
      unit: 'C',
      session: { step: 4, done: false, preset: '30' },
      onSessionChange: noop,
      timer: {
        seconds: 125,
        running: true,
        expired: false,
        start: noop,
        pause: noop,
        resume: noop,
        reset: noop,
      },
    }),
  );
  expect(html).toContain('Step 5 of 6');
  expect(html).toContain('Tenderness');
  expect(html).toContain('63°C');
  expect(html).toContain('02:05');
  expect(html).toContain('keeps running when this panel closes');
});
