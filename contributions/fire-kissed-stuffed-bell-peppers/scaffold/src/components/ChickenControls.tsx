import { useState } from 'react';
import {
  cuts,
  fillings,
  parsePepperCount,
  recipe,
  servings,
  sizeLabel,
  type Settings,
} from '../recipe';

export function ChickenControls({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}) {
  const display = String(settings.pepperCount);
  const [draft, setDraft] = useState(display);
  const [error, setError] = useState('');
  function commitCount() {
    if (draft === display) return;
    const value = parsePepperCount(draft);
    if (value === null) {
      setError(
        `Enter a whole number from ${recipe.minPepperCount} to ${recipe.maxPepperCount}. Ingredients still use ${settings.pepperCount} peppers.`,
      );
      return;
    }
    setError('');
    onChange({ pepperCount: value });
  }
  return (
    <div
      className="recipe-controls recipe-controls-extra"
      aria-label="Configure your stuffed peppers"
    >
      <div className="cut-field">
        <label htmlFor="filling">Filling</label>
        <select
          className="select-control"
          id="filling"
          value={settings.filling}
          onChange={(event) => onChange({ filling: event.target.value as Settings['filling'] })}
        >
          {fillings.map((filling) => (
            <option key={filling.id} value={filling.id}>
              {filling.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="cut">Pepper style</label>
        <select
          className="select-control"
          id="cut"
          value={settings.cut}
          onChange={(event) => onChange({ cut: event.target.value as Settings['cut'] })}
        >
          {cuts.map((cut) => (
            <option key={cut.id} value={cut.id}>
              {cut.name}
            </option>
          ))}
        </select>
      </div>
      <div className="weight-field">
        <label htmlFor="size">Whole peppers</label>
        <div className="weight-input">
          <input
            id="size"
            type="number"
            inputMode="numeric"
            step="1"
            min={recipe.minPepperCount}
            max={recipe.maxPepperCount}
            value={draft}
            aria-invalid={Boolean(error)}
            aria-describedby="count-help count-error"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitCount}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur();
            }}
          />
          <span>each</span>
        </div>
        <p id="count-help" className="micro">
          Press Enter or leave the field to apply.
        </p>
        <p id="count-error" className="weight-error" role="status">
          {error}
        </p>
      </div>
      <div>
        <label htmlFor="measure-unit">Measures</label>
        <select
          className="select-control"
          id="measure-unit"
          value={settings.measureUnit}
          onChange={(event) =>
            onChange({ measureUnit: event.target.value as Settings['measureUnit'] })
          }
        >
          <option value="us">US</option>
          <option value="metric">Metric</option>
        </select>
      </div>
      <div className="scale-status">
        <strong>
          {sizeLabel(settings)} · about {servings(settings)} servings
        </strong>
        <span>Ingredients scale. Time follows pepper style and filling depth.</span>
      </div>
      <p className="scaling-note">
        {cuts.find((cut) => cut.id === settings.cut)!.note} For split batches, keep vegetarian tools
        and filling away from raw beef.
      </p>
    </div>
  );
}
