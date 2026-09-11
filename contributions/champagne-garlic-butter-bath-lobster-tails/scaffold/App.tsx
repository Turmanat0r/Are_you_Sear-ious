"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Thermometer,
  Clock3,
  Wind,
  Printer,
  Play,
  Pause,
  RotateCcw,
  Check,
  Bookmark,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RecipeControls,
  ProteinTemperatures,
  GrillSetup,
  ScienceNote,
} from "./grill-tools";
import {
  cuts,
  buildRecipe,
  defaultCutId,
  validateCount,
  shellScience,
  butterScience,
  type WeightUnit,
  type ConfiguredRecipe,
  type GrillPlan,
  grillPlanSummary,
} from "./cook-config";
import {
  temp,
  unitText,
  safetySource,
  type Unit,
  type Recipe,
} from "./recipes";

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

function RecipePrint({
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
        <strong>Tail size & batch:</strong> {recipe.cutLabel} ·{" "}
        {recipe.batchLabel} · {recipe.sizeLabel}
      </p>
      <p>{recipe.timingNote}</p>
      <p>
        <strong>Serves:</strong> {recipe.serves} · <strong>Cook:</strong>{" "}
        {recipe.time} · <strong>Rest:</strong> {recipe.rest}
      </p>
      <p>
        <strong>Grill ambient:</strong> {temp(recipe.grill, unit)} ·{" "}
        <strong>Lobster internal:</strong> {temp(recipe.internal, unit)} ·{" "}
        {recipe.method}
      </p>
      <p>
        {unitText(recipe.finish, unit)} {unitText(recipe.safety, unit)}
      </p>
      {recipe.scalingNote && <p>{recipe.scalingNote}</p>}
      {recipe.equipment && (
        <p>
          <strong>Equipment:</strong> {recipe.equipment.join(" · ")}
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
          {[
            shellScience,
            butterScience,
            ...recipe.extraScience.map((item) => item.note),
          ].map((note) => (
            <div key={note.title}>
              <h3>{note.title}</h3>
              <p>{unitText(note.body, unit)}</p>
              <p>{unitText(note.takeaway, unit)}</p>
            </div>
          ))}
        </section>
      )}
      <p>
        <strong>Grill note:</strong> Ambient ranges are recipe settings measured
        near the food at grate level, with the lid closed. Knob positions vary
        by grill.
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
        Safety reference: FDA seafood handling and cooking guidance
        <br />
        {safetySource}
      </p>
    </article>
  );
}

function CookMode({ recipe, unit }: { recipe: Recipe; unit: Unit }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(180);
  const [preset, setPreset] = useState("3");
  const [deadline, setDeadline] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const active = recipe.steps[step];
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        setDeadline(null);
        setExpired(true);
      }
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [deadline]);
  const resetTimer = () => {
    setDeadline(null);
    setSeconds(Number(preset) * 60);
    setExpired(false);
  };
  return (
    <div className="cook-mode">
      <div className="cook-targets">
        <span>
          <Flame size={17} /> Grill <strong>{temp(recipe.grill, unit)}</strong>
        </span>
        <span>
          <Thermometer size={17} /> Internal{" "}
          <strong>{temp(recipe.internal, unit)}</strong>
        </span>
      </div>
      <div className="progress-label">
        <span>
          {done
            ? "Cook complete"
            : `Step ${step + 1} of ${recipe.steps.length}`}
        </span>
        <span>{recipe.method}</span>
      </div>
      <Progress
        value={done ? 100 : (step / recipe.steps.length) * 100}
        aria-label="Cooking progress"
      />
      {done ? (
        <div className="cook-step">
          <CheckCircle2 size={42} className="orange" />
          <h2>That’s a good cook.</h2>
          <p>
            You’ve completed the recipe. Enjoy it, and refrigerate leftovers
            promptly.
          </p>
          <button
            className="secondary-button"
            onClick={() => {
              setStep(0);
              setDone(false);
              resetTimer();
            }}
          >
            Start over
          </button>
        </div>
      ) : (
        <div className="cook-step" aria-live="polite">
          <p className="eyebrow orange">{unitText(active.cue, unit)}</p>
          <h2>{active.title}</h2>
          <p>{unitText(active.body, unit)}</p>
          <div className="cook-navigation">
            <button
              className="secondary-button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="primary-button"
              onClick={() =>
                step === recipe.steps.length - 1
                  ? setDone(true)
                  : setStep((s) => s + 1)
              }
            >
              {step === recipe.steps.length - 1
                ? "Finish cook"
                : "Complete step"}
              <Check size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="timer-panel">
        <div className="timer-title">
          <Clock3 size={18} />
          <strong>Check-in timer</strong>
          <span>Temperature decides doneness.</span>
        </div>
        <div className="timer-controls">
          <Select
            value={preset}
            onValueChange={(v) => {
              if (v) {
                setPreset(v);
                setSeconds(Number(v) * 60);
                setDeadline(null);
                setExpired(false);
              }
            }}
          >
            <SelectTrigger
              aria-label="Timer duration"
              className="select-control"
            >
              <SelectValue>{preset} min</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {["1", "3", "4", "6", "9", "12", "15"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <output className="timer-digits" aria-label="Time remaining">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </output>
          <button
            className="icon-button"
            aria-label={deadline ? "Pause timer" : "Start timer"}
            disabled={seconds === 0}
            onClick={() => {
              if (deadline) {
                setSeconds(
                  Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
                );
                setDeadline(null);
              } else {
                setDeadline(Date.now() + seconds * 1000);
                setExpired(false);
              }
            }}
          >
            {deadline ? <Pause size={19} /> : <Play size={19} />}
          </button>
          <button
            className="icon-button"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <p className={expired ? "timer-alert" : "micro"} role="status">
          {expired
            ? "Timer done. Time to check your cook."
            : "Keep cook mode open for the timer. It resets when you close this panel."}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [unit, setUnit] = useState<Unit>("F");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");
  const [cutId, setCutId] = useState(defaultCutId);
  const [tailCount, setTailCount] = useState(2);
  const [saved, setSaved] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dialog, setDialog] = useState<"cook" | "saved" | null>(null);
  const [ready, setReady] = useState(false);
  const [grillPlan, setGrillPlan] = useState<GrillPlan>({
    count: 4,
    states: [false, true, true, false],
    orientation: "horizontal",
    method: "indirect",
  });
  const recipe = buildRecipe(cutId, tailCount, weightUnit);
  const chooseCut = (id: string) => {
    if (cuts.some((cut) => cut.id === id)) setCutId(id);
  };
  useEffect(() => {
    const preference = readLocal<Record<string, unknown> | null>(
      "searious-lobster-preferences",
      null,
    );
    if (
      preference &&
      typeof preference === "object" &&
      !Array.isArray(preference)
    ) {
      if (preference.unit === "F" || preference.unit === "C")
        setUnit(preference.unit);
      if (preference.weightUnit === "lb" || preference.weightUnit === "kg")
        setWeightUnit(preference.weightUnit);
      if (
        typeof preference.tailCount === "number" &&
        validateCount(preference.tailCount)
      )
        setTailCount(preference.tailCount);
      if (
        typeof preference.cutId === "string" &&
        cuts.some((cut) => cut.id === preference.cutId)
      )
        setCutId(preference.cutId);
    }
    const savedIds = readLocal<unknown>("searious-lobster-saved-sizes", []);
    if (Array.isArray(savedIds))
      setSaved(
        savedIds.filter(
          (id): id is string =>
            typeof id === "string" && cuts.some((cut) => cut.id === id),
        ),
      );
    const linkedRecipe = new URLSearchParams(window.location.search).get(
      "recipe",
    );
    if (linkedRecipe && cuts.some((cut) => cut.id === linkedRecipe))
      setCutId(linkedRecipe);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    saveLocal("searious-lobster-preferences", {
      unit,
      weightUnit,
      tailCount,
      cutId,
    });
    saveLocal("searious-lobster-saved-sizes", saved);
  }, [unit, weightUnit, tailCount, cutId, saved, ready]);

  const toggleSaved = () =>
    setSaved((s) =>
      s.includes(recipe.id)
        ? s.filter((id) => id !== recipe.id)
        : [...s, recipe.id],
    );
  const print = () => window.print();
  const allItems = recipe.ingredients.flatMap((g) =>
    g.items.map((_, index) => g.title + index),
  );
  const checkedCount = allItems.filter(
    (item) => checked[recipe.id + item],
  ).length;
  const isSaved = saved.includes(recipe.id);
  return (
    <>
      <div className="screen-app">
        <header className="site-header">
          <a
            className="brand"
            href="#recipes"
            aria-label="Are You Sear-ious home"
          >
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
              onClick={() => setDialog("saved")}
            >
              <Bookmark size={17} />
              <span>Saved{saved.length > 0 ? ` (${saved.length})` : ""}</span>
            </button>
            <Select
              value={unit}
              onValueChange={(v) => {
                if (v === "F" || v === "C") setUnit(v);
              }}
            >
              <SelectTrigger
                aria-label="Temperature unit"
                className="unit-select"
              >
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
              <p className="eyebrow">THE GAS GRILL PLAYBOOK · LOBSTER</p>
              <h1>{recipe.title}</h1>
              <p className="muted">
                Champagne, garlic, and a gentle butter bath. Your tails, your
                burner layout.
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
              onCount={setTailCount}
              onUnit={setWeightUnit}
            />
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-copy">
                  <span className="eyebrow orange">
                    SPECIAL OCCASION · BUTTER BATH
                  </span>
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
                  alt={recipe.photoAlt}
                  width="1120"
                  height="747"
                  decoding="async"
                />
                <span className="photo-caption">{recipe.photoCaption}</span>
              </article>
              <aside className="temp-card">
                <p className="eyebrow">{recipe.cutLabel.toUpperCase()}</p>
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
                    <Thermometer size={18} /> Lobster internal
                  </span>
                  <strong>
                    <TempValue values={recipe.internal} unit={unit} />
                  </strong>
                  <p>{unitText(recipe.finish, unit)}</p>
                </div>
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
              <p>A lit zone for heat. An unlit zone for the butter bath.</p>
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
                  className={`icon-button ${isSaved ? "is-saved" : ""}`}
                  aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                  aria-pressed={isSaved}
                  onClick={toggleSaved}
                >
                  <Bookmark
                    size={19}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
                <button className="secondary-button" onClick={print}>
                  <Printer size={17} /> Print
                </button>
                <button
                  className="primary-button"
                  onClick={() => setDialog("cook")}
                >
                  <Play size={16} /> Cook mode
                </button>
              </div>
            </div>
            <div className="recipe-facts">
              <span>
                {recipe.batchLabel} · {recipe.cutLabel} · {recipe.sizeLabel}
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
            {recipe.attribution && (
              <p className="recipe-origin">
                <a
                  href={recipe.attribution.url}
                  target="_blank"
                  rel="noreferrer"
                >
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
                      const id = recipe.id + group.title + itemIndex;
                      return (
                        <label
                          className={`ingredient ${checked[id] ? "checked" : ""}`}
                          key={item}
                        >
                          <Checkbox
                            checked={Boolean(checked[id])}
                            onCheckedChange={(v) =>
                              setChecked((c) => ({ ...c, [id]: v }))
                            }
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
                          Object.entries(c).filter(
                            ([k]) => !k.startsWith(recipe.id),
                          ),
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
                      <span className="step-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h4>{step.title}</h4>
                        <p className="step-cue">{unitText(step.cue, unit)}</p>
                        <p>{unitText(step.body, unit)}</p>
                        {i === 0 && (
                          <ScienceNote note={shellScience} unit={unit} />
                        )}{" "}
                        {i === 1 && (
                          <ScienceNote note={butterScience} unit={unit} />
                        )}{" "}
                        {recipe.extraScience
                          ?.filter((item) => item.afterStep === i)
                          .map((item) => (
                            <ScienceNote
                              key={item.note.title}
                              note={item.note}
                              unit={unit}
                            />
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
        open={dialog === "cook"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="cook-dialog">
          <DialogTitle className="dialog-title">{recipe.title}</DialogTitle>
          <DialogDescription>
            Cook mode · take it one step at a time
          </DialogDescription>
          {dialog === "cook" && (
            <CookMode
              recipe={recipe}
              unit={unit}
              key={recipe.id + recipe.weightLb}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialog === "saved"}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="saved-dialog">
          <DialogTitle className="dialog-title">Your saved recipes</DialogTitle>
          <DialogDescription>
            Saved in this browser, on this device.
          </DialogDescription>
          {saved.length === 0 ? (
            <div className="saved-empty">
              <Bookmark size={32} />
              <h3>Your next great cook goes here.</h3>
              <p>Use the bookmark beside a recipe to save it.</p>
            </div>
          ) : (
            <div className="saved-list">
              {saved.map((id) => {
                const r = buildRecipe(id, tailCount, weightUnit);
                return (
                  <button
                    key={id}
                    onClick={() => {
                      chooseCut(r.id);
                      setDialog(null);
                      setTimeout(
                        () =>
                          document
                            .getElementById("recipe")
                            ?.scrollIntoView({ behavior: "smooth" }),
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
