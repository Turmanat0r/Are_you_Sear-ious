'use client';

import { useEffect, useState } from 'react';
import {
  Flame,
  ArrowRight,
  Thermometer,
  Clock3,
  Wind,
  Printer,
  Play,
  Bookmark,
  Users,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RecipeControls, ProteinTemperatures, GrillSetup, ScienceNote } from './grill-tools';
import {
  cuts,
  buildRecipe,
  defaultCuts,
  validateWeight,
  dryBrineScience,
  cookingScience,
  type WeightUnit,
  type GrillPlan,
} from './cook-config';
import { temp, unitText, safetySource, type Protein, type Unit } from './recipes';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function saveLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Preferences are optional when browser storage is unavailable. */
  }
}
function TempValue({ values, unit }: { values: number[]; unit: Unit }) {
  const value = temp(values, unit);
  return (
    <>
      {value.slice(0, -2)}
      <small>°{unit}</small>
    </>
  );
}

import { RecipePrint } from './components/RecipePrint';
import { CookMode, type CookSession } from './components/CookMode';
import { useTimer } from './hooks/useTimer';
import { clockLabel } from './lib/timer';

export default function Home() {
  const timer = useTimer();
  const [cookSession, setCookSession] = useState<CookSession>({
    step: 0,
    done: false,
    preset: '10',
  });
  const resetCook = () => {
    timer.reset();
    setCookSession({ step: 0, done: false, preset: '10' });
  };
  const [protein, setProtein] = useState<Protein>('Beef');
  const [unit, setUnit] = useState<Unit>('F');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lb');
  const [selectedCuts, setSelectedCuts] = useState<Record<Protein, string>>({
    ...defaultCuts,
  });
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(cuts.map((c) => [c.id, c.baseLb])),
  );
  const [weightValid, setWeightValid] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dialog, setDialog] = useState<'cook' | 'saved' | null>(null);
  const [ready, setReady] = useState(false);
  const [grillPlan, setGrillPlan] = useState<GrillPlan>({
    count: 3,
    states: [false, false, false],
    orientation: 'horizontal',
    method: 'indirect',
  });
  const selectedCut = cuts.find((c) => c.id === selectedCuts[protein])!;
  const recipe = buildRecipe(
    selectedCut.id,
    weights[selectedCut.id] ?? selectedCut.baseLb,
    weightUnit,
  );
  const chooseCut = (id: string) => {
    const cut = cuts.find((c) => c.id === id);
    if (!cut) return;
    resetCook();
    setWeights((current) => ({
      ...current,
      [id]: weights[selectedCut.id] ?? cut.baseLb,
    }));
    setSelectedCuts((current) => ({ ...current, [cut.protein]: id }));
    setWeightValid(true);
  };
  const openSaved = (id: string) => {
    const cut = cuts.find((entry) => entry.id === id);
    if (!cut) return;
    resetCook();
    setProtein(cut.protein);
    setSelectedCuts((current) => ({ ...current, [cut.protein]: id }));
    setWeightValid(true);
    setDialog(null);
  };
  useEffect(() => {
    const u = readLocal('searious-ribs-unit', 'F');
    if (u === 'F' || u === 'C') setUnit(u);
    const wu = readLocal('searious-ribs-weight-unit', 'lb');
    if (wu === 'lb' || wu === 'kg') setWeightUnit(wu);
    const savedIds = readLocal<unknown>('searious-ribs-saved', []);
    if (Array.isArray(savedIds))
      setSaved(
        savedIds.filter((v): v is string => typeof v === 'string' && cuts.some((c) => c.id === v)),
      );
    const storedWeights = readLocal<unknown>('searious-ribs-weights', null);
    if (storedWeights && typeof storedWeights === 'object' && !Array.isArray(storedWeights))
      setWeights(
        Object.fromEntries(
          cuts.map((c) => {
            const v = (storedWeights as Record<string, unknown>)[c.id];
            return [c.id, typeof v === 'number' && validateWeight(c, v) ? v : c.baseLb];
          }),
        ),
      );
    const selectedId = readLocal<unknown>('searious-ribs-selected-cut', null);
    const linkedRecipe = new URLSearchParams(window.location.search).get('recipe') ?? selectedId;
    const linkedCut = cuts.find((c) => c.id === linkedRecipe);
    if (linkedCut) {
      setProtein(linkedCut.protein);
      setSelectedCuts((current) => ({
        ...current,
        [linkedCut.protein]: linkedCut.id,
      }));
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      saveLocal('searious-ribs-unit', unit);
      saveLocal('searious-ribs-saved', saved);
      saveLocal('searious-ribs-weights', weights);
      saveLocal('searious-ribs-weight-unit', weightUnit);
      saveLocal('searious-ribs-selected-cut', selectedCuts.Beef);
    }
  }, [unit, saved, weights, weightUnit, selectedCuts, ready]);

  const toggleSaved = () =>
    setSaved((s) =>
      s.includes(recipe.id) ? s.filter((id) => id !== recipe.id) : [...s, recipe.id],
    );
  const print = () => window.print();
  const allItems = recipe.ingredients.flatMap((g) => g.items.map((_, index) => g.title + index));
  const checkedCount = allItems.filter((item) => checked[recipe.id + '::' + item]).length;
  const isSaved = saved.includes(recipe.id);
  return (
    <>
      <div className="screen-app">
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
              aria-label="View saved recipes"
              onClick={() => setDialog('saved')}
            >
              <Bookmark size={17} />
              <span>Saved{saved.length > 0 ? ` (${saved.length})` : ''}</span>
            </button>
            <Select
              value={unit}
              onValueChange={(v) => {
                if (v === 'F' || v === 'C') setUnit(v);
              }}
            >
              <SelectTrigger aria-label="Temperature unit" className="unit-select">
                <SelectValue>°{unit}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F">°F</SelectItem>
                <SelectItem value="C">°C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="container">
          <div className="intro" id="recipes">
            <div>
              <p className="eyebrow">THE GAS GRILL PLAYBOOK · BEEF</p>
              <h1>Sear-iously smothered beef ribs</h1>
              <p className="muted">
                Sticky brown sugar–Worcestershire sauce. Your ribs, your burner layout.
              </p>
            </div>
            <span className="gas-label">
              <span /> MADE FOR GAS
            </span>
          </div>
          <div>
            <RecipeControls
              recipe={recipe}
              weightUnit={weightUnit}
              onCut={chooseCut}
              onWeight={(value) => {
                resetCook();
                setWeights((w) => ({ ...w, [recipe.id]: value }));
                setChecked({});
              }}
              onUnit={setWeightUnit}
              onValidity={setWeightValid}
            />
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-copy">
                  <span className="eyebrow orange">STICKY BBQ · MUSTARD BINDER</span>
                  <h2>
                    {recipe.headline[0]}
                    <br />
                    {recipe.headline[1]}
                  </h2>
                  <p>{recipe.description}</p>
                  <div className="recipe-meta">
                    <span>
                      <Clock3 size={16} /> {recipe.time}
                    </span>
                    <span>
                      <Wind size={16} /> {recipe.wood}
                    </span>
                  </div>
                  <a className="primary-button" href="#recipe">
                    View recipe <ArrowRight size={18} />
                  </a>
                </div>
                <img
                  key={recipe.id}
                  src={recipe.photo}
                  srcSet="./images/seariously-smothered-beef-ribs-small.webp 640w, ./images/seariously-smothered-beef-ribs.webp 1200w"
                  sizes="(max-width:760px) 65vw, 600px"
                  alt={recipe.photoAlt}
                  width="1200"
                  height="800"
                  decoding="async"
                />
                <span className="photo-caption">Beef short ribs · AI illustration</span>
              </article>
              <aside className="temp-card">
                <p className="eyebrow">{recipe.cut.name.toUpperCase()}</p>
                <div>
                  <span>
                    <Flame size={18} /> Grill ambient
                  </span>
                  <strong>
                    <TempValue values={recipe.grill} unit={unit} />
                  </strong>
                  <p>{recipe.method} · lid closed</p>
                </div>
                <div>
                  <span>
                    <Thermometer size={18} /> Tenderness target
                  </span>
                  <strong>
                    <TempValue values={recipe.internal} unit={unit} />
                  </strong>
                  <p>{unitText(recipe.finish, unit)}</p>
                </div>
                <p>
                  {unitText(
                    'Safety minimum: 145°F + 3-minute rest. The higher target is for tenderness.',
                    unit,
                  )}
                </p>
                <a href="#setup">
                  Set up your grill <ArrowRight size={16} />
                </a>
              </aside>
            </div>
          </div>
          <section className="bottom-strip" aria-label="Grilling essentials">
            <div>
              <Flame />
              <strong>Two zones. More control.</strong>
              <p>A lit zone for heat. An unlit zone for the ribs.</p>
            </div>
            <div>
              <Thermometer />
              <strong>Temperature over time.</strong>
              <p>Measure at grate level and inside the meat.</p>
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
                <p className="eyebrow orange">
                  {recipe.protein.toUpperCase()} / {recipe.method.toUpperCase()}
                </p>
                <h2>{recipe.title}</h2>
              </div>
              <div className="action-row">
                <button
                  className={`icon-button ${isSaved ? 'is-saved' : ''}`}
                  aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
                  aria-pressed={isSaved}
                  onClick={toggleSaved}
                >
                  <Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
                <button className="secondary-button" disabled={!weightValid} onClick={print}>
                  <Printer size={17} /> Print
                </button>
                <button
                  className="primary-button"
                  disabled={!weightValid}
                  onClick={() => setDialog('cook')}
                >
                  <Play size={16} /> Cook mode
                </button>
              </div>
            </div>
            <div className="recipe-facts">
              <span>
                {recipe.sizeLabel} · {recipe.cut.name}
              </span>
              <span>
                <Users size={17} /> About {recipe.serves}
              </span>
              <span>
                <Clock3 size={17} /> {recipe.time}
              </span>
              <span>Rest: {recipe.rest}</span>
              <span>
                <Wind size={17} /> {recipe.wood}
              </span>
            </div>
            <p className="timing-note">{recipe.timingNote}</p>
            {(timer.running || timer.seconds > 0 || timer.expired) && (
              <p className="timing-note" role="status">
                Check-in timer:{' '}
                {timer.expired
                  ? 'Done—check the ribs.'
                  : `${clockLabel(timer.seconds)} ${timer.running ? 'running' : 'paused'}`}
                . Open cook mode to manage it.
              </p>
            )}
            {recipe.attribution && (
              <p className="recipe-origin">
                <a href={recipe.attribution.url} target="_blank" rel="noreferrer">
                  Recipe origin: {recipe.attribution.label} ↗
                </a>
                <span>{recipe.attribution.note}</span>
              </p>
            )}
            <div className="recipe-columns">
              <aside className="ingredients">
                <div className="ingredients-heading">
                  <h3>What you’ll need</h3>
                  <span>
                    {checkedCount}/{allItems.length}
                  </span>
                </div>
                <p className="micro">Check items as you gather them.</p>
                {recipe.ingredients.map((group) => (
                  <div className="ingredient-group" key={group.title}>
                    <h4>{group.title}</h4>
                    {group.items.map((item, itemIndex) => {
                      const id = recipe.id + '::' + group.title + itemIndex;
                      return (
                        <label className={`ingredient ${checked[id] ? 'checked' : ''}`} key={id}>
                          <Checkbox
                            checked={Boolean(checked[id])}
                            onCheckedChange={(v) => setChecked((c) => ({ ...c, [id]: v }))}
                            aria-label={item}
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
                {recipe.equipment && (
                  <div className="ingredient-group">
                    <h4>Equipment</h4>
                    <ul className="recipe-equipment">
                      {recipe.equipment.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {checkedCount > 0 && (
                  <button
                    className="text-button"
                    onClick={() =>
                      setChecked((c) =>
                        Object.fromEntries(
                          Object.entries(c).filter(([k]) => !k.startsWith(recipe.id + '::')),
                        ),
                      )
                    }
                  >
                    Reset checklist
                  </button>
                )}
              </aside>
              <div className="method">
                <h3>Make it happen</h3>
                <ol>
                  {recipe.steps.map((step, i) => (
                    <li key={step.title}>
                      <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h4>{step.title}</h4>
                        <p className="step-cue">{unitText(step.cue, unit)}</p>
                        <p>{unitText(step.body, unit)}</p>
                        {i === 0 && <ScienceNote note={dryBrineScience} unit={unit} />}{' '}
                        {i === 2 && <ScienceNote note={cookingScience()} unit={unit} />}{' '}
                        {recipe.extraScience
                          ?.filter((item) => item.afterStep === i)
                          .map((item) => (
                            <ScienceNote key={item.note.title} note={item.note} unit={unit} />
                          ))}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="grill-note">
                  <Wind size={21} />
                  <div>
                    <strong>From the grill</strong>
                    <p>{recipe.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="recipe-origin" id="sources" aria-labelledby="sources-title">
            <h3 id="sources-title">Recipe notes & sources</h3>
            <p>
              Your supplied mustard-rub and brown sugar–Worcestershire formula is preserved. This
              gas-grill adaptation is not kitchen-tested. The recipe's grill settings and timing
              estimates are separate from government safety guidance.
            </p>
            <p>
              <a
                href="https://www.weber.com/US/en/recipes/red-meat/beer-braised-and-mesquite-smoked-short-ribs/weber-7841.html"
                target="_blank"
                rel="noreferrer"
              >
                Weber: braised short-rib technique
              </a>{' '}
              ·{' '}
              <a
                href="https://www.weber.com/GB/en/recipes/beef/smoked-beef-short-ribs-with-bourbon-glaze/weber-2513232.html"
                target="_blank"
                rel="noreferrer"
              >
                Weber: probe-tender ribs and glazing
              </a>{' '}
              ·{' '}
              <a href={safetySource} target="_blank" rel="noreferrer">
                FoodSafety.gov: safe temperatures
              </a>
            </p>
            <p>
              <a href="./provenance/image-details.json" target="_blank" rel="noreferrer">
                Supplied image details
              </a>{' '}
              ·{' '}
              <a href="./SOURCES.md" target="_blank" rel="noreferrer">
                Full adaptation notes
              </a>
              . No affiliation or endorsement is implied.
            </p>
          </section>
          <ProteinTemperatures recipe={recipe} unit={unit} />

          <GrillSetup unit={unit} onPlanChange={setGrillPlan} />
        </main>
        <footer className="container">
          <span className="brand">
            Are You <span className="brand-accent">Sear-ious</span>
          </span>
          <span>Gas grill, dialed in.</span>
          <a href={safetySource} target="_blank" rel="noreferrer">
            Temperature sources ↗
          </a>
        </footer>
      </div>
      <RecipePrint recipe={recipe} unit={unit} grillPlan={grillPlan} />
      <Dialog
        open={dialog === 'cook'}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="cook-dialog">
          <DialogTitle className="dialog-title">{recipe.title}</DialogTitle>
          <DialogDescription>Cook mode · take it one step at a time</DialogDescription>
          {dialog === 'cook' && (
            <CookMode
              recipe={recipe}
              unit={unit}
              timer={timer}
              session={cookSession}
              onSessionChange={setCookSession}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialog === 'saved'}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="saved-dialog">
          <DialogTitle className="dialog-title">Your saved recipes</DialogTitle>
          <DialogDescription>Saved in this browser, on this device.</DialogDescription>
          {saved.length === 0 ? (
            <div className="saved-empty">
              <Bookmark size={32} />
              <h3>Your next great cook goes here.</h3>
              <p>Use the bookmark beside a recipe to save it.</p>
            </div>
          ) : (
            <div className="saved-list">
              {saved.map((id) => {
                const c = cuts.find((c) => c.id === id)!;
                const r = buildRecipe(id, weights[id] ?? c.baseLb, weightUnit);
                return (
                  <button
                    key={id}
                    onClick={() => {
                      openSaved(r.id);
                      setTimeout(
                        () =>
                          document.getElementById('recipe')?.scrollIntoView({ behavior: 'smooth' }),
                        0,
                      );
                    }}
                  >
                    <span>
                      <small>
                        {r.protein} · {r.sizeLabel}
                      </small>
                      <strong>{r.title}</strong>
                    </span>
                    <ArrowRight size={18} />
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
