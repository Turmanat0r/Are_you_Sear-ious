import { useEffect, useState } from 'react';
import { ArrowRight, Bookmark, Clock3, Flame, Printer, Thermometer } from 'lucide-react';
import {
  cuts,
  equipment,
  fillings,
  normalizeSettings,
  recipe,
  safetySentence,
  servings,
  sizeLabel,
  sources,
  targetFor,
  temp,
  type Settings,
} from './recipe';
import type { GrillPlan } from './grill';
import { readSavedRecipe, writeSavedRecipe } from './storage';
import { useTimer } from './hooks/useTimer';
import { ChickenControls } from './components/ChickenControls';
import { CookMode } from './components/CookMode';
import { GrillPlanner } from './components/GrillPlanner';
import { Ingredients } from './components/Ingredients';
import { Method } from './components/Method';
import { RecipePrint } from './components/RecipePrint';

export default function App() {
  const [initial] = useState(readSavedRecipe);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [plan, setPlan] = useState<GrillPlan>(initial.plan);
  const [saved, setSaved] = useState(initial.saved);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const [cookOpen, setCookOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [minutes, setMinutes] = useState(3);
  const timer = useTimer();
  const target = targetFor(settings);
  const cut = cuts.find((entry) => entry.id === settings.cut)!;
  useEffect(() => {
    setStorageAvailable(writeSavedRecipe(saved, settings, plan));
  }, [saved, settings, plan]);
  function updateSettings(patch: Partial<Settings>) {
    const next = normalizeSettings({ ...settings, ...patch });
    if (
      next.pepperCount !== settings.pepperCount ||
      next.cut !== settings.cut ||
      next.filling !== settings.filling ||
      next.texture !== settings.texture
    ) {
      setChecked([]);
      setStep(0);
      setDone(false);
      timer.reset();
    }
    setSettings(next);
  }
  const savedLabel = saved && storageAvailable ? 'Saved' : saved ? 'Session only' : 'Save recipe';
  return (
    <>
      <div className="screen-app recipe-app">
        <a className="skip" href="#recipe">
          Skip to recipe
        </a>
        <header className="site-header">
          <a className="brand" href="#recipes" aria-label="Are You Sear-ious home">
            <Flame />
            <span>
              Are You <span className="brand-accent">Sear-ious</span>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#recipes" className="active">
              Recipes
            </a>
            <a href="#temperatures">Temperature guide</a>
            <a href="#setup">Grill setup</a>
          </nav>
          <div className="header-actions">
            <button
              className="save-nav"
              type="button"
              aria-pressed={saved}
              aria-label={savedLabel}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark size={17} />
              <span>{savedLabel}</span>
            </button>
            <select
              className="unit-select"
              aria-label="Temperature unit"
              value={settings.tempUnit}
              onChange={(event) =>
                updateSettings({ tempUnit: event.target.value as Settings['tempUnit'] })
              }
            >
              <option value="F">°F</option>
              <option value="C">°C</option>
            </select>
          </div>
        </header>
        <main className="container">
          <div className="intro" id="recipes">
            <div>
              <p className="eyebrow">THE GAS GRILL PLAYBOOK · VEGETABLES</p>
              <h1>Fire-kissed stuffed bell peppers</h1>
              <p className="muted">
                Vegetarian, beef, chicken or a split batch. Three burners, chosen by you.
              </p>
            </div>
            <span className="gas-label">
              <span />
              MADE FOR GAS
            </span>
          </div>
          <ChickenControls
            key={`${settings.cut}:${settings.filling}:${settings.pepperCount}:${settings.measureUnit}`}
            settings={settings}
            onChange={updateSettings}
          />
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-copy">
                <span className="eyebrow orange">INDIRECT HEAT · PICK YOUR FILLING</span>
                <h2>
                  Fire-kissed.
                  <br />
                  Stuffed peppers.
                </h2>
                <p>
                  Smoky rice, tomato and Jack cheese with black beans, beef, chicken—or both lanes
                  at once.
                </p>
                <div className="recipe-meta">
                  <span>
                    <Clock3 size={16} />
                    {cut.time}
                  </span>
                  <span>
                    <Flame size={16} />
                    3-burner gas grill
                  </span>
                </div>
                <a className="primary-button" href="#recipe">
                  View recipe <ArrowRight size={18} />
                </a>
              </div>
              <img
                src={recipe.image}
                alt={recipe.imageAlt}
                width="1120"
                height="747"
                fetchPriority="high"
              />
              <span className="photo-caption">Stuffed bell peppers · AI-generated image</span>
            </article>
            <aside className="temp-card">
              <p className="eyebrow">
                {fillings.find((entry) => entry.id === settings.filling)!.shortName.toUpperCase()}
              </p>
              <div>
                <span>
                  <Flame size={18} />
                  Grill ambient
                </span>
                <strong>{temp(recipe.grillAmbientF, settings.tempUnit)}</strong>
                <p>Indirect zone · grate level</p>
              </div>
              <div>
                <span>
                  <Thermometer size={18} />
                  Internal finish
                </span>
                <strong>{temp(target.internalF, settings.tempUnit)}</strong>
                <p>{target.targetName}</p>
              </div>
              <p>{target.targetNote}</p>
              <a href="#setup">
                Choose your burners <ArrowRight size={16} />
              </a>
            </aside>
          </div>
          <p className="source-note">
            Image generated for this recipe. Browning does not prove ground-meat doneness.{' '}
            <a href="./provenance/image-details.json">Image details</a>.
          </p>
          <section className="bottom-strip" aria-label="Grilling essentials">
            <div>
              <Flame />
              <strong>Three burners. Your choice.</strong>
              <p>Nothing preselected. Cook every pepper over an OFF zone.</p>
            </div>
            <div>
              <Thermometer />
              <strong>Check every piece.</strong>
              <p>The thickest center must reach the safety target.</p>
            </div>
            <div>
              <Printer />
              <strong>Take it to the grill.</strong>
              <p>Print a clean recipe, or follow cook mode.</p>
            </div>
          </section>
          <section id="recipe" className="recipe-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow orange">YOUR CONFIGURED RECIPE</p>
                <h2>Fire-kissed stuffed bell peppers</h2>
              </div>
              <div className="action-row">
                <button className="secondary-button" type="button" onClick={() => window.print()}>
                  <Printer size={17} />
                  Print recipe
                </button>
                <button className="primary-button" type="button" onClick={() => setCookOpen(true)}>
                  <Flame size={17} />
                  Start cook mode
                </button>
              </div>
            </div>
            <div className="recipe-facts">
              <span>
                {sizeLabel(settings)} · about {servings(settings)} servings
              </span>
              <span>Prep: about 15 min</span>
              <span>Rest: 5–8 min</span>
            </div>
            <p className="timing-note">
              {cut.timing} These estimates do not increase with pepper count; use extra indirect
              space or cook another batch when needed.
            </p>
            <p className="source-note" role="status">
              {!storageAvailable
                ? 'Device storage is unavailable. Settings remain in this session only.'
                : saved
                  ? 'Saved on this browser: filling, pepper style, count, units and the three-burner plan update as you change them. Click Saved again to remove this saved copy.'
                  : 'Save to restore this setup on this browser. Checklists, cook progress and timers are session-only.'}
            </p>
            <div className="recipe-columns">
              <aside>
                <Ingredients
                  settings={settings}
                  checked={checked}
                  onToggle={(id) =>
                    setChecked((values) =>
                      values.includes(id)
                        ? values.filter((value) => value !== id)
                        : [...values, id],
                    )
                  }
                  onReset={() => setChecked([])}
                />
                <div className="ingredients equipment">
                  <h3>Bring to the grill</h3>
                  <ul className="recipe-equipment">
                    {equipment.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="micro">
                    For meat or split batches, keep raw-meat bowls and utensils away from vegetarian
                    and serving tools.
                  </p>
                </div>
              </aside>
              <Method settings={settings} />
            </div>
          </section>
          <section id="temperatures" className="guide-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">STUFFED BELL PEPPERS</p>
                <h2>Know your temperatures.</h2>
              </div>
              <span className="guide-unit">°{settings.tempUnit}</span>
            </div>
            <p className="section-description">
              {safetySentence(settings)} Pepper tenderness and cheese color are quality cues, not
              substitutes for checking a meat filling.
            </p>
            <div className="table-scroll">
              <table className="temperature-table">
                <thead>
                  <tr>
                    <th scope="col">Stage</th>
                    <th scope="col">Temperature</th>
                    <th scope="col">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Covered indirect grilling</th>
                    <td>{temp(recipe.grillAmbientF, settings.tempUnit)}</td>
                    <td>Ambient at grate level beside peppers over OFF burners</td>
                  </tr>
                  <tr>
                    <th scope="row">Ground beef</th>
                    <td>{temp(160, settings.tempUnit)}</td>
                    <td>Safety minimum in the center of every beef filling</td>
                  </tr>
                  <tr>
                    <th scope="row">Ground chicken</th>
                    <td>{temp(165, settings.tempUnit)}</td>
                    <td>Safety minimum in the center of every chicken filling</td>
                  </tr>
                  <tr>
                    <th scope="row">Leftover reheating</th>
                    <td>{temp(165, settings.tempUnit)}</td>
                    <td>Measure after reheating</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">
              Insert the probe into the geometric center of the filling and check multiple peppers.
              Color cannot replace the safety endpoint. <a href={sources[0].url}>USDA guidance</a>.
            </p>
          </section>
          <GrillPlanner plan={plan} onChange={setPlan} unit={settings.tempUnit} />
          <section className="guide-section" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources & adaptation</h2>
            <p className="recipe-origin">
              This original Are You Sear-ious recipe scales by pepper count and switches the
              ingredient list, method and temperatures with the selected filling. The split option
              keeps a vegetarian lane while adding beef. <a href="./RECIPE.md">Recipe details</a> ·{' '}
              <a href="./SOURCES.md">Source notes</a> ·{' '}
              <a href="./THIRD-PARTY-NOTICES.txt">Software notices</a>.
            </p>
            <p className="recipe-origin">
              USDA supplies safety guidance; Weber is an indirect-heat technique reference, not an
              endorsement. No physical cooking test was performed.
            </p>
            <ul className="source-links">
              {sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>{source.label}</a>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <footer className="container">
          <a className="brand" href="#recipes">
            Are You <span className="brand-accent">Sear-ious</span>
          </a>
          <span>Gas grill. Good food.</span>
        </footer>
      </div>
      <CookMode
        open={cookOpen}
        onClose={() => setCookOpen(false)}
        settings={settings}
        plan={plan}
        step={step}
        onStep={setStep}
        done={done}
        onDone={setDone}
        minutes={minutes}
        onMinutes={setMinutes}
        timer={timer}
      />
      <RecipePrint settings={settings} plan={plan} />
    </>
  );
}
