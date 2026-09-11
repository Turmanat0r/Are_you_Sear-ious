import {
  dryBrineScience,
  cookingScience,
  grillPlanSummary,
  type ConfiguredRecipe,
  type GrillPlan,
} from '../cook-config';
import { temp, unitText, safetySource, type Unit } from '../recipes';

export function RecipePrint({
  recipe,
  unit,
  grillPlan,
}: {
  recipe: ConfiguredRecipe;
  unit: Unit;
  grillPlan: GrillPlan;
}) {
  return (
    <article className="print-recipe">
      <p>ARE YOU SEAR-IOUS · GAS GRILL RECIPE</p>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <p>
        <strong>Cut & size:</strong> {recipe.cut.name} · {recipe.sizeLabel}
      </p>
      <p>{recipe.timingNote}</p>
      <p>
        <strong>Serves:</strong> {recipe.serves} · <strong>Cook:</strong> {recipe.time} ·{' '}
        <strong>Rest:</strong> {recipe.rest}
      </p>
      <p>
        <strong>Grill ambient:</strong> {temp(recipe.grill, unit)} ·{' '}
        <strong>Tenderness target:</strong> {temp(recipe.internal, unit)} · {recipe.method}
      </p>
      <p>
        {unitText(recipe.finish, unit)} {unitText(recipe.safety, unit)}
      </p>
      {recipe.scalingNote && <p>{recipe.scalingNote}</p>}
      {recipe.equipment && (
        <p>
          <strong>Equipment:</strong> {recipe.equipment.join(' · ')}
        </p>
      )}
      <p>
        <strong>Your burner plan:</strong> {grillPlanSummary(grillPlan)}
      </p>
      <h2>Ingredients</h2>
      {recipe.ingredients.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      <h2>Method</h2>
      <ol>
        {recipe.steps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>
              <em>{unitText(step.cue, unit)}</em>
            </p>
            <p>{unitText(step.body, unit)}</p>
          </li>
        ))}
      </ol>
      {recipe.extraScience && (
        <section>
          <h2>A little grill science</h2>
          {[dryBrineScience, cookingScience(), ...recipe.extraScience.map((item) => item.note)].map(
            (note) => (
              <div key={note.title}>
                <h3>{note.title}</h3>
                <p>{unitText(note.body, unit)}</p>
                <p>{unitText(note.takeaway, unit)}</p>
              </div>
            ),
          )}
        </section>
      )}
      <p>
        <strong>Grill note:</strong> Ambient ranges are recipe settings measured near the food at
        grate level, with the lid closed. Knob positions vary by grill.
      </p>
      {recipe.attribution && (
        <p>
          <strong>Recipe origin:</strong> {recipe.attribution.label}
          <br />
          {recipe.attribution.url}
          <br />
          {recipe.attribution.note}
        </p>
      )}
      <p>
        Safety reference: FoodSafety.gov Safe Minimum Internal Temperatures
        <br />
        {safetySource}
      </p>
      <p>
        Method references:
        https://www.weber.com/US/en/recipes/red-meat/beer-braised-and-mesquite-smoked-short-ribs/weber-7841.html
        and
        https://www.weber.com/GB/en/recipes/beef/smoked-beef-short-ribs-with-bourbon-glaze/weber-2513232.html.
        No publisher photograph is reproduced.
      </p>
    </article>
  );
}
