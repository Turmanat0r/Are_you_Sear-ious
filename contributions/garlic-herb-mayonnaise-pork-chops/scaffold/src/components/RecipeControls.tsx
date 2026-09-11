import { useState } from 'react';
import { parseServings, recipe, sizeLabel, variants, vesselFor, vessels, type Settings } from '../recipe';

export function RecipeControls({ settings, onChange }: { settings: Settings; onChange: (patch: Partial<Settings>) => void }) {
  const display = String(settings.servings);
  const [draft, setDraft] = useState(display);
  const [error, setError] = useState('');
  function commit() {
    if (draft === display) return;
    const value = parseServings(draft);
    if (value === null) { setError(`Enter a whole number from ${recipe.minServings} to ${recipe.maxServings}. Ingredients still use ${settings.servings} servings.`); return; }
    setError(''); onChange({ servings: value });
  }
  return <div className="recipe-controls recipe-controls-extra" aria-label="Configure this recipe">
    <div className="cut-field"><label htmlFor="variant">Protein option</label><select className="select-control" id="variant" value={settings.variant} onChange={(event) => onChange({ variant: event.target.value as Settings['variant'] })}>{variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.name}</option>)}</select></div>
    <div><label htmlFor="vessel">Batch size</label><select className="select-control" id="vessel" value={settings.vessel} onChange={(event) => onChange({ vessel: event.target.value as Settings['vessel'] })}>{vessels.map((vessel) => <option key={vessel.id} value={vessel.id}>{vessel.name}</option>)}</select></div>
    <div className="weight-field"><label htmlFor="servings">Servings</label><div className="weight-input"><input id="servings" type="number" inputMode="numeric" step="1" min={recipe.minServings} max={recipe.maxServings} value={draft} aria-invalid={Boolean(error)} aria-describedby="servings-help servings-error" onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }} /><span>people</span></div><p id="servings-help" className="micro">Press Enter or leave the field to apply.</p><p id="servings-error" className="weight-error" role="status">{error}</p></div>
    <div><label htmlFor="measure-unit">Measures</label><select className="select-control" id="measure-unit" value={settings.measureUnit} onChange={(event) => onChange({ measureUnit: event.target.value as Settings['measureUnit'] })}><option value="us">US</option><option value="metric">Metric</option></select></div>
    <div className="scale-status"><strong>{sizeLabel(settings)}</strong><span>Ingredients scale. Cook time follows depth, grill behavior and temperature.</span></div>
    <p className="scaling-note">{vesselFor(settings).note} Ingredient quantity scales; cooking time does not scale mathematically.</p>
  </div>;
}
