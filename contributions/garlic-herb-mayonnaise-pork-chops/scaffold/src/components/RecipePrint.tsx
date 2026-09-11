import {
  equipment,
  methodSteps,
  recipe,
  safetySentence,
  sizeLabel,
  sources,
  variantFor,
  vesselFor,
  temp,
  unitText,
  type Settings,
} from '../recipe';
import { planSummary, type GrillPlan } from '../grill';
import { Ingredients } from './Ingredients';

export function RecipePrint({ settings, plan }: { settings: Settings; plan: GrillPlan }) {
  const vessel = vesselFor(settings);
  const variant = variantFor(settings);
  return (
    <article className="print-only" aria-label="Printable configured recipe">
      <p>ARE YOU SEAR-IOUS · Three-burner gas-grill recipe</p>
      <h1>{recipe.title}</h1>
      <p>
        {sizeLabel(settings)} · {variant.name}
      </p>
      <p>
        Indirect grill ambient: <strong>{temp(recipe.grillAmbientF, settings.tempUnit)}</strong> at
        grate level beside the chops. Direct sear zone: <strong>{temp(recipe.searAmbientF, settings.tempUnit)}</strong>.
      </p>
      <p>
        Selected finish:{' '}
        <strong>
          {temp(recipe.finishF, settings.tempUnit)} — thickest part of the chop.
        </strong>{' '}
        {safetySentence(settings)} Rest {recipe.rest} for serving quality.
      </p>
      <p>
        Prep: about {recipe.prep}. Estimate: {vessel.time}. {vessel.timing} Time does not scale mathematically with servings.
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
        Original Are You Sear-ious adaptation. Protein options, scaling and method details are
        documented in RECIPE.md. Not physically kitchen-tested.
      </p>
    </article>
  );
}
