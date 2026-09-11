import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import { defaultSettings } from '../recipe';
import { initialGrillPlan, toggleBurner } from '../grill';
import { ChickenControls } from './ChickenControls';
import { CookMode } from './CookMode';
import { GrillPlanner } from './GrillPlanner';
import { Ingredients } from './Ingredients';
import { RecipePrint } from './RecipePrint';

describe('charcoal stuffed-pepper surfaces', () => {
  it('uses the template and recipe WebP', () => {
    const html = renderToStaticMarkup(createElement(App));
    for (const value of [
      'site-header',
      'feature-grid',
      'temp-card',
      'recipe-columns',
      'fire-kissed-stuffed-bell-peppers.webp',
    ])
      expect(html).toContain(value);
  });
  it('renders exactly three burner buttons', () => {
    const html = renderToStaticMarkup(
      createElement(GrillPlanner, { plan: initialGrillPlan(), onChange: vi.fn(), unit: 'F' }),
    );
    expect(html.match(/aria-label="Burner [123]: OFF"/g)).toHaveLength(3);
    expect(html).not.toContain('Burner 4');
  });
  it('prints metric beef values and burner plan', () => {
    const html = renderToStaticMarkup(
      createElement(RecipePrint, {
        settings: {
          ...defaultSettings,
          filling: 'beef',
          pepperCount: 8,
          measureUnit: 'metric',
          tempUnit: 'C',
        },
        plan: toggleBurner(initialGrillPlan(), 1),
      }),
    );
    for (const value of ['8 peppers', '907 g', '340 g', '191–204°C', '71°C', 'ON: 2. OFF: 1, 3.'])
      expect(html).toContain(value);
  });
  it('keeps filling guidance specific', () => {
    const veg = renderToStaticMarkup(
      createElement(RecipePrint, { settings: defaultSettings, plan: initialGrillPlan() }),
    );
    const chicken = renderToStaticMarkup(
      createElement(RecipePrint, {
        settings: { ...defaultSettings, filling: 'chicken' },
        plan: initialGrillPlan(),
      }),
    );
    expect(veg).toContain('Black bean');
    expect(veg).not.toContain('Ground chicken');
    expect(chicken).toContain('Ground chicken');
    expect(chicken).toContain('165°F');
  });
  it('updates checklist length for the split option', () => {
    const html = renderToStaticMarkup(
      createElement(Ingredients, {
        settings: { ...defaultSettings, filling: 'split' },
        checked: ['salt', 'beef'],
      }),
    );
    expect(html.match(/type="checkbox"/g)).toHaveLength(16);
    expect(html).toContain('2 of 16 checked');
  });
  it('renders every recipe selector', () => {
    const html = renderToStaticMarkup(
      createElement(ChickenControls, { settings: defaultSettings, onChange: vi.fn() }),
    );
    for (const value of [
      'Black bean &amp; corn',
      'Seasoned ground beef',
      'Seasoned ground chicken',
      'Half vegetarian',
      'Pepper halves',
      'Upright pepper cups',
    ])
      expect(html).toContain(value);
    expect(html).toContain('min="2"');
    expect(html).toContain('max="12"');
  });
  it('renders the controlled safety step and timer', () => {
    const n = vi.fn();
    const html = renderToStaticMarkup(
      createElement(CookMode, {
        open: true,
        onClose: n,
        settings: { ...defaultSettings, filling: 'beef' },
        plan: initialGrillPlan(),
        step: 4,
        onStep: n,
        done: false,
        onDone: n,
        minutes: 3,
        onMinutes: n,
        timer: {
          seconds: 125,
          running: true,
          expired: false,
          start: n,
          pause: n,
          resume: n,
          reset: n,
        },
      }),
    );
    expect(html).toContain('Probe the center');
    expect(html).toContain('02:05');
    expect(html).toContain('160°F');
  });
});
