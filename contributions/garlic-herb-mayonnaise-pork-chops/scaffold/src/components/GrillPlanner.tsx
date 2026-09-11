import { burnerMessage, toggleBurner, type GrillPlan } from '../grill';
import { recipe, temp, type TempUnit } from '../recipe';

export function GrillPlanner({
  plan,
  onChange,
  unit,
}: {
  plan: GrillPlan;
  onChange: (plan: GrillPlan) => void;
  unit: TempUnit;
}) {
  return (
    <section className="planner" id="setup" aria-labelledby="planner-title">
      <p className="eyebrow">THREE BURNERS · MANUAL CONTROL</p>
      <h3 id="planner-title">Your grill. Your burner choice.</h3>
      <p>
        Exactly three burners. Choose the ones you want lit, then place the chops above the OFF zone
        for indirect cooking. Nothing is preselected, and this diagram does not control the grill.
      </p>
      <div className="planner-controls">
        <label htmlFor="orientation">
          Burner layout{' '}
          <select
            id="orientation"
            value={plan.orientation}
            onChange={(event) =>
              onChange({ ...plan, orientation: event.target.value as GrillPlan['orientation'] })
            }
          >
            <option value="horizontal">Left to right</option>
            <option value="vertical">Back to front</option>
          </select>
        </label>
      </div>
      <p>
        Covered-grill ambient beside the chops:{' '}
        <strong>{temp(recipe.grillAmbientF, unit)}</strong>. Keep the pan or rack fully above the
        OFF zone and adjust your chosen ON burners to hold that range. OFF does not mean cold.
      </p>
      <div
        className={`burners ${plan.orientation}`}
        style={{
          gridTemplateColumns:
            plan.orientation === 'horizontal' ? 'repeat(3, minmax(0, 1fr))' : '1fr',
        }}
        aria-label="Three-burner selection"
      >
        {plan.states.map((on, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={on}
            aria-label={`Burner ${index + 1}: ${on ? 'ON' : 'OFF'}`}
            className={on ? 'on' : ''}
            onClick={() => onChange(toggleBurner(plan, index))}
          >
            Burner {index + 1}
            <span>{on ? 'ON' : 'OFF'}</span>
            <small>
              {plan.orientation === 'horizontal'
                ? ['Left', 'Center', 'Right'][index]
                : ['Back', 'Middle', 'Front'][index]}
            </small>
          </button>
        ))}
      </div>
      <p className="burner-note" role="status">
        {burnerMessage(plan.states)}
      </p>
      <small>
        Follow the grill manufacturer’s lighting sequence and limits. Check the actual grate-level
        temperature; knob position is not a temperature. Never leave a lit grill unattended.
      </small>
    </section>
  );
}
