import {
  cuts,
  equipment,
  methodSteps,
  recipe,
  safetySentence,
  sizeLabel,
  sources,
  targetFor,
  temp,
  unitText,
  type Settings,
} from '../recipe';
import { planSummary, type GrillPlan } from '../grill';
import { Ingredients } from './Ingredients';

export function RecipePrint({ settings, plan }: { settings: Settings; plan: GrillPlan }) {
  const cut = cuts.find((entry) => entry.id === settings.cut)!;
  const target = targetFor(settings);
  return (
    <article className="print-only" aria-label="Printable configured recipe">
      <p>ARE YOU SEAR-IOUS · Three-burner gas-grill recipe</p>
      <h1>{recipe.title}</h1>
      <p>
        {sizeLabel(settings)} · {cut.name}
      </p>
      <p>
        Indirect grill ambient: <strong>{temp(recipe.grillAmbientF, settings.tempUnit)}</strong> at
        grate level beside the peppers.
      </p>
      <p>
        Selected finish:{' '}
        <strong>
          {temp(target.internalF, settings.tempUnit)} — {target.targetName}.
        </strong>{' '}
        {safetySentence(settings)} Rest 5–8 minutes for serving quality.
      </p>
      <p>
        Prep: about 15 minutes. Estimate: {cut.time}. {cut.timing} Time does not scale with pepper
        count.
      </p>
      <h2>Your three-burner plan</h2>
      <p>{planSummary(plan)}</p>
      <Ingredients settings={settings} checked={[]} printable />
      <h2>Equipment</h2>
      <ul>
        {equipment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>Method & science</h2>
      {methodSteps(settings).map((step, index) => (
        <section className="print-step" key={step.title}>
          <h3>
            {index + 1}. {step.title} — {unitText(step.cue, settings.tempUnit)}
          </h3>
          <p>{unitText(step.body, settings.tempUnit)}</p>
          <p>
            <em>{unitText(step.science, settings.tempUnit)}</em>
          </p>
        </section>
      ))}
      <h2>Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            {source.label}: <a href={source.url}>{source.url}</a>
          </li>
        ))}
      </ul>
      <p>
        Original Are You Sear-ious recipe. Filling options, scaling and method details are
        documented in RECIPE.md. Not physically kitchen-tested.
      </p>
    </article>
  );
}
