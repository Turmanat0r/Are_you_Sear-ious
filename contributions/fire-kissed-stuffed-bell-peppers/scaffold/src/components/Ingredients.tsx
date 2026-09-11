import {
  amountLabel,
  fillings,
  groups,
  scaledIngredients,
  sizeLabel,
  type Settings,
} from '../recipe';

export function Ingredients({
  settings,
  checked,
  onToggle,
  onReset,
  printable = false,
}: {
  settings: Settings;
  checked: string[];
  onToggle?: (id: string) => void;
  onReset?: () => void;
  printable?: boolean;
}) {
  const items = scaledIngredients(settings);
  return (
    <div className={printable ? 'print-ingredients' : 'panel ingredients'}>
      <h3>Ingredients</h3>
      <p className="note">
        For {sizeLabel(settings)} ·{' '}
        {fillings.find((filling) => filling.id === settings.filling)!.name}
      </p>
      {!printable && (
        <div className="checklist-tools">
          <span role="status">
            {checked.length} of {items.length} checked
          </span>
          <button type="button" className="text-button" onClick={onReset}>
            Reset checks
          </button>
        </div>
      )}
      {groups.map((group) => (
        <section key={group}>
          <h4>{group}</h4>
          {items
            .filter((item) => item.group === group)
            .map((item) =>
              printable ? (
                <div className="ingredient" key={item.id}>
                  <span className="amount">{amountLabel(item, settings.measureUnit)}</span>
                  <span>{item.name}</span>
                </div>
              ) : (
                <label
                  className={`ingredient ${checked.includes(item.id) ? 'checked' : ''}`}
                  key={item.id}
                >
                  <input
                    type="checkbox"
                    checked={checked.includes(item.id)}
                    onChange={() => onToggle?.(item.id)}
                  />
                  <span className="amount">{amountLabel(item, settings.measureUnit)}</span>
                  <span>{item.name}</span>
                </label>
              ),
            )}
        </section>
      ))}
      <p className="note">
        Cooked rice means measured after cooking. Drain tomatoes and beans well so the filling stays
        structured.
      </p>
      <p className="note">
        For split batches, divide shared ingredients before raw beef is added. Use marked bowls and
        separate utensils.
      </p>
      <p className="note">
        US spoons and cups convert to approximate metric volumes. Milk is an allergen; choose
        vegetarian-labeled cheese for the vegetarian version.
      </p>
    </div>
  );
}
