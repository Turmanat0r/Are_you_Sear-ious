import { methodSteps, unitText, type Settings } from '../recipe';

export function Method({ settings }: { settings: Settings }) {
  return (
    <section className="method" id="method" aria-label="Method and cooking science">
      <h3>The method</h3>
      <ol>
        {methodSteps(settings).map((step, index) => (
          <li key={step.title}>
            <span className="step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h4>{step.title}</h4>
              <p className="step-cue">{unitText(step.cue, settings.tempUnit)}</p>
              <p>{unitText(step.body, settings.tempUnit)}</p>
              <aside className="science-note">
                <div className="science-label">THE SCIENCE</div>
                <p>{unitText(step.science, settings.tempUnit)}</p>
              </aside>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
