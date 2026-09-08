'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Flame,
  Beef,
  Ham,
  Drumstick,
  Fish,
  ArrowUpRight,
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
  Gauge,
  Replace,
  TriangleAlert,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RecipeControls,
  ProteinTemperatures,
  GrillSetup,
  ScienceNote,
  useBurnerPlan,
} from './grill-tools';
import {
  cuts,
  buildRecipe,
  defaultCuts,
  validateWeight,
  dryBrineScience,
  cookingScience,
  cookTimeEstimate,
  formatMinutes,
  substitutionsFor,
  substitutedItem,
  saltWarning,
  type WeightUnit,
  type ConfiguredRecipe,
} from './cook-config';
import {
  temp,
  unitText,
  safetySource,
  type Protein,
  type Unit,
  type Recipe,
} from './recipes';

const proteins = [
  { name: 'Beef', icon: Beef, note: 'Sear it hard' },
  { name: 'Pork', icon: Ham, note: 'Take your time' },
  { name: 'Poultry', icon: Drumstick, note: 'Keep it juicy' },
  { name: 'Seafood', icon: Fish, note: 'Go easy' },
];
const validProteins = proteins.map((p) => p.name);
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
  heatWindow,
  displayItem,
}: {
  recipe: ConfiguredRecipe;
  unit: Unit;
  heatWindow: [number, number] | null;
  displayItem: (item: string) => string;
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
        <strong>Serves:</strong> {recipe.serves} · <strong>Cook:</strong>{' '}
        {recipe.time} · <strong>Rest:</strong> {recipe.rest}
      </p>
      {heatWindow && (
        <p>
          <strong>At your burner plan:</strong> {formatMinutes(heatWindow[0])}–
          {formatMinutes(heatWindow[1])}. An estimate from planned heat input,
          not a doneness target.
        </p>
      )}
      <p>
        <strong>Grill ambient:</strong> {temp(recipe.grill, unit)} ·{' '}
        <strong>Internal target:</strong> {temp(recipe.internal, unit)} ·{' '}
        {recipe.method}
      </p>
      <p>
        {unitText(recipe.finish, unit)} {unitText(recipe.safety, unit)}
      </p>
      <p className="print-safety">
        <strong>Temperature decides doneness, not time.</strong> Every duration
        on this sheet is an estimate. Probe the thickest part and cook to{' '}
        {temp(recipe.internal, unit)} before the food leaves the grill.
      </p>
      <h2>Ingredients</h2>
      {recipe.ingredients.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{displayItem(item)}</li>
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
      {recipe.attribution && (
        <p>
          <strong>Adapted from:</strong> {recipe.attribution.label}
          <br />
          {recipe.attribution.url}
          <br />
          {recipe.attribution.note}
        </p>
      )}
      <p>
        <strong>Grill note:</strong> Ambient ranges are recipe settings measured
        near the food at grate level, with the lid closed. Knob positions vary
        by grill.
      </p>
      <p>
        Safety reference: USDA FSIS Safe Minimum Internal Temperature Chart
        <br />
        {safetySource}
      </p>
      <p>
        Shared as-is with no warranty. The meal photographs on the website are
        AI-generated illustrations, not photographs of food cooked from these
        recipes. This sheet makes no record of anything you do.
      </p>
    </article>
  );
}

function CookMode({ recipe, unit }: { recipe: Recipe; unit: Unit }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const [preset, setPreset] = useState('10');
  const [deadline, setDeadline] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  // steps is a non-empty tuple, so index 0 is always present. The fallback
  // keeps a stale step index from blanking the panel.
  const active = recipe.steps[step] ?? recipe.steps[0];
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
          <Thermometer size={17} /> Internal{' '}
          <strong>{temp(recipe.internal, unit)}</strong>
        </span>
      </div>
      <div className="progress-label">
        <span>
          {done
            ? 'Cook complete'
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
            type="button"
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
              type="button"
              className="secondary-button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                step === recipe.steps.length - 1
                  ? setDone(true)
                  : setStep((s) => s + 1)
              }
            >
              {step === recipe.steps.length - 1
                ? 'Finish cook'
                : 'Complete step'}
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
              {['1', '5', '10', '15', '30', '60'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <output
            className="timer-digits"
            aria-label="Time remaining"
            aria-live="off"
          >
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </output>
          <button
            type="button"
            className="icon-button"
            aria-label={deadline ? 'Pause timer' : 'Start timer'}
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
            type="button"
            className="icon-button"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <p className={expired ? 'timer-alert' : 'micro'} role="status">
          {expired
            ? 'Timer done. Time to check your cook.'
            : 'Keep cook mode open for the timer. It resets when you close this panel.'}
        </p>
      </div>
    </div>
  );
}

function IngredientItem({
  item,
  checked,
  onCheck,
  chosen,
  onSwap,
}: {
  item: string;
  checked: boolean;
  onCheck: (value: boolean) => void;
  chosen: number | undefined;
  onSwap: (index: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = substitutionsFor(item);
  const option = set && chosen !== undefined ? set.options[chosen] : undefined;
  const display = set && option ? substitutedItem(item, set, option) : item;
  return (
    <div className={`ingredient-row ${option ? 'is-swapped' : ''}`}>
      <label className={`ingredient ${checked ? 'checked' : ''}`}>
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheck(Boolean(v))}
        />
        <span>
          {display}
          {option && <small className="swap-flag">swapped</small>}
        </span>
      </label>
      {set && (
        <button
          type="button"
          className="swap-button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Replace size={13} />
          <span>{option ? 'Change' : 'Out of this?'}</span>
        </button>
      )}
      {set && open && (
        <div className="swap-panel">
          <p className="swap-panel-title">
            Instead of {set.label.toLowerCase()}
          </p>
          <ul>
            {set.options.map((candidate, index) => (
              <li key={candidate.use}>
                <button
                  type="button"
                  className={`swap-option ${chosen === index ? 'selected' : ''}`}
                  aria-pressed={chosen === index}
                  onClick={() => {
                    onSwap(chosen === index ? undefined : index);
                    setOpen(false);
                  }}
                >
                  <strong>{candidate.use}</strong>
                  <span className="swap-amount">{candidate.amount}</span>
                  {candidate.note && (
                    <span className="swap-note">{candidate.note}</span>
                  )}
                  {candidate.addsSalt && (
                    <span className="swap-salt">
                      <TriangleAlert size={12} /> {saltWarning}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {option && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                onSwap(undefined);
                setOpen(false);
              }}
            >
              Use it as written
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [protein, setProtein] = useState<Protein>('Pork');
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
  const burners = useBurnerPlan();
  const [swaps, setSwaps] = useState<Record<string, number>>({});
  const selectedCut = cuts.find((c) => c.id === selectedCuts[protein])!;
  const recipe = buildRecipe(
    selectedCut.id,
    weights[selectedCut.id] ?? selectedCut.baseLb,
    weightUnit,
  );
  const chooseProtein = (next: Protein) => {
    setProtein(next);
    setWeightValid(true);
  };
  const chooseCut = (id: string) => {
    const cut = cuts.find((c) => c.id === id);
    if (!cut) return;
    setSelectedCuts((current) => ({ ...current, [cut.protein]: id }));
    setWeightValid(true);
  };
  // Mirrors the latest render's state for the Web MCP tools below, which
  // run outside React's lifecycle. Written after commit, never during render.
  const stateRef = useRef({ protein, unit, recipe });
  useEffect(() => {
    stateRef.current = { protein, unit, recipe };
  });
  useEffect(() => {
    const u = readLocal('searline-unit', 'F');
    // Same reason as the burner layout: stored preferences can only be read
    // once the client has mounted, so this effect intentionally sets state.
    // oxlint-disable-next-line react/react-compiler
    if (u === 'F' || u === 'C') setUnit(u);
    const wu = readLocal('searious-weight-unit', 'lb');
    if (wu === 'lb' || wu === 'kg') setWeightUnit(wu);
    const savedIds = readLocal<unknown>('searline-saved', []);
    if (Array.isArray(savedIds))
      setSaved(
        savedIds.filter(
          (v): v is string =>
            typeof v === 'string' && cuts.some((c) => c.id === v),
        ),
      );
    const storedSwaps = readLocal<unknown>('searious-swaps', {});
    if (
      storedSwaps &&
      typeof storedSwaps === 'object' &&
      !Array.isArray(storedSwaps)
    )
      setSwaps(
        Object.fromEntries(
          Object.entries(storedSwaps as Record<string, unknown>).filter(
            ([, v]) => typeof v === 'number' && Number.isInteger(v) && v >= 0,
          ) as [string, number][],
        ),
      );
    const storedWeights = readLocal<unknown>('searious-weights', null);
    if (
      storedWeights &&
      typeof storedWeights === 'object' &&
      !Array.isArray(storedWeights)
    )
      setWeights(
        Object.fromEntries(
          cuts.map((c) => {
            const v = (storedWeights as Record<string, unknown>)[c.id];
            return [
              c.id,
              typeof v === 'number' && validateWeight(c, v) ? v : c.baseLb,
            ];
          }),
        ),
      );
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      saveLocal('searline-unit', unit);
      saveLocal('searline-saved', saved);
      saveLocal('searious-weights', weights);
      saveLocal('searious-weight-unit', weightUnit);
      saveLocal('searious-swaps', swaps);
    }
  }, [unit, saved, weights, weightUnit, swaps, ready]);
  useEffect(() => {
    type Tool = {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const ctx = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!ctx?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: 'get_grilling_recipe',
        title: 'Read configured recipe',
        description:
          'Read the selected cut, raw weight, scaled ingredients, cooking steps and temperatures.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => {
          if (
            !input ||
            typeof input !== 'object' ||
            Array.isArray(input) ||
            Object.keys(input).length
          )
            throw new Error('Expected an empty object.');
          const s = stateRef.current;
          return {
            ...s.recipe,
            unit: s.unit,
            grillTemperature: temp(s.recipe.grill, s.unit),
            internalTemperature: temp(s.recipe.internal, s.unit),
          };
        },
      },
      {
        name: 'select_grilling_recipe',
        title: 'Configure grilling recipe',
        description:
          'Select a protein and optionally a cut ID, raw weight in pounds, and temperature unit. Recalculates ingredients; does not light burners or start a timer.',
        inputSchema: {
          type: 'object',
          properties: {
            protein: { type: 'string', enum: validProteins },
            cutId: { type: 'string', enum: cuts.map((c) => c.id) },
            weightLb: { type: 'number', minimum: 0.25, maximum: 12 },
            unit: { type: 'string', enum: ['F', 'C'] },
          },
          required: ['protein'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          if (!input || typeof input !== 'object' || Array.isArray(input))
            throw new Error('Expected a selection object.');
          const data = input as Record<string, unknown>;
          if (
            Object.keys(data).some(
              (k) => !['protein', 'cutId', 'weightLb', 'unit'].includes(k),
            ) ||
            !validProteins.includes(data.protein as string) ||
            (data.unit !== undefined && data.unit !== 'F' && data.unit !== 'C')
          )
            throw new Error('Invalid protein, unit, or field.');
          const protein = data.protein as Protein,
            cut = cuts.find(
              (c) => c.id === (data.cutId ?? defaultCuts[protein]),
            );
          if (!cut || cut.protein !== protein)
            throw new Error('Cut must belong to the selected protein.');
          const weight = data.weightLb ?? cut.baseLb;
          if (typeof weight !== 'number' || !validateWeight(cut, weight))
            throw new Error("Weight is outside this cut's supported range.");
          flushSync(() => {
            setProtein(protein);
            setSelectedCuts((s) => ({ ...s, [protein]: cut.id }));
            setWeights((w) => ({ ...w, [cut.id]: weight }));
            setWeightValid(true);
            if (data.unit) setUnit(data.unit as Unit);
          });
          return {
            cutId: cut.id,
            weightLb: weight,
            unit: (data.unit as Unit) ?? stateRef.current.unit,
          };
        },
      },
    ];
    for (const tool of tools) {
      try {
        void Promise.resolve(
          ctx.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    }
    return () => lifecycle.abort();
  }, []);
  const toggleSaved = () =>
    setSaved((s) =>
      s.includes(recipe.id)
        ? s.filter((id) => id !== recipe.id)
        : [...s, recipe.id],
    );
  const print = () => window.print();
  const heat = cookTimeEstimate(recipe.cut, burners.levels);
  const heatWindow = heat.kind === 'scaled' ? heat.window : null;
  const displayItem = (item: string) => {
    const set = substitutionsFor(item);
    const chosen = swaps[recipe.id + item];
    const option =
      set && chosen !== undefined ? set.options[chosen] : undefined;
    return set && option ? substitutedItem(item, set, option) : item;
  };
  const allItems = recipe.ingredients.flatMap((g) => g.items);
  const checkedCount = allItems.filter(
    (item) => checked[recipe.id + item],
  ).length;
  const isSaved = saved.includes(recipe.id);
  return (
    <>
      <div className="screen-app">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
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
              type="button"
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
        <main className="container" id="main-content">
          <div className="intro" id="recipes">
            <div>
              <p className="eyebrow">THE GAS GRILL PLAYBOOK</p>
              <h1>What’s on the grill?</h1>
              <p className="muted">
                Pick your protein. Make your next cook a good one.
              </p>
            </div>
            <span className="gas-label">
              <span /> MADE FOR GAS
            </span>
          </div>
          <Tabs
            value={protein}
            onValueChange={(v) => {
              if (validProteins.includes(String(v)))
                chooseProtein(v as Protein);
            }}
          >
            <TabsList className="protein-grid" aria-label="Choose your protein">
              {proteins.map(({ name, icon: Icon, note }) => (
                <TabsTrigger
                  value={name}
                  key={name}
                  className={`protein-card ${protein === name ? 'selected' : ''}`}
                >
                  <Icon className="protein-icon" />
                  <span>
                    <strong>{name}</strong>
                    <small>{note}</small>
                  </span>
                  <ArrowUpRight className="category-arrow" />
                </TabsTrigger>
              ))}
            </TabsList>
            <RecipeControls
              recipe={recipe}
              weightUnit={weightUnit}
              onCut={chooseCut}
              onWeight={(value) =>
                setWeights((w) => ({ ...w, [recipe.id]: value }))
              }
              onUnit={setWeightUnit}
              onValidity={setWeightValid}
            />
            <TabsContent value={protein} className="feature-grid">
              <article className="feature-card">
                <div className="feature-copy">
                  <span className="eyebrow orange">
                    {recipe.cut.family === 'shoulder'
                      ? 'THE SIGNATURE COOK'
                      : 'YOUR NEXT COOK'}{' '}
                    · {protein.toUpperCase()}
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
                  width="1200"
                  height="800"
                  decoding="async"
                />
                <span className="photo-caption">
                  {recipe.photoCaption}
                  <span className="photo-ai">AI illustration</span>
                </span>
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
                  <p>
                    {recipe.method} · lid closed
                    {recipe.cut.method === 'Reverse sear' && (
                      <>. Then sear at {temp([450, 550], unit)}.</>
                    )}
                  </p>
                </div>
                <div>
                  <span>
                    <Thermometer size={18} /> Internal finish
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
            </TabsContent>
          </Tabs>
          <section className="bottom-strip" aria-label="Grilling essentials">
            <div>
              <Flame />
              <strong>Two zones. More control.</strong>
              <p>A hot side for searing. A cool side for finishing.</p>
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
                  type="button"
                  className={`icon-button ${isSaved ? 'is-saved' : ''}`}
                  aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
                  aria-pressed={isSaved}
                  onClick={toggleSaved}
                >
                  <Bookmark
                    size={19}
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={!weightValid}
                  onClick={print}
                >
                  <Printer size={17} /> Print
                </button>
                <button
                  type="button"
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
              {heatWindow && (
                <span
                  className="fact-estimate"
                  title="Estimated from your burner plan"
                >
                  <Gauge size={17} /> {formatMinutes(heatWindow[0])}–
                  {formatMinutes(heatWindow[1])} at your settings
                </span>
              )}
              <span>Rest: {recipe.rest}</span>
              <span>
                <Wind size={17} /> {recipe.wood}
              </span>
            </div>
            <p className="safety-banner">
              <TriangleAlert size={17} />
              <span>
                <strong>Temperature decides doneness, not time.</strong> Every
                duration here is an estimate. Probe the thickest part and cook
                to {temp(recipe.internal, unit)} before it leaves the grill.
              </span>
            </p>
            <p className="timing-note">{recipe.timingNote}</p>
            {recipe.attribution && (
              <p className="attribution-note">
                <span>
                  Adapted from{' '}
                  <a
                    href={recipe.attribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {recipe.attribution.label}
                    <ArrowUpRight size={13} />
                  </a>
                  . {recipe.attribution.note}
                </span>
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
                    {group.items.map((item) => {
                      const id = recipe.id + item;
                      return (
                        <IngredientItem
                          key={item}
                          item={item}
                          checked={Boolean(checked[id])}
                          onCheck={(v) =>
                            setChecked((c) => ({ ...c, [id]: v }))
                          }
                          chosen={swaps[id]}
                          onSwap={(index) =>
                            setSwaps((current) => {
                              const next = { ...current };
                              if (index === undefined) delete next[id];
                              else next[id] = index;
                              return next;
                            })
                          }
                        />
                      );
                    })}
                  </div>
                ))}
                {checkedCount > 0 && (
                  <button
                    type="button"
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
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4>{step.title}</h4>
                        <p className="step-cue">{unitText(step.cue, unit)}</p>
                        <p>{unitText(step.body, unit)}</p>
                        {i === 0 && recipe.protein !== 'Seafood' && (
                          <ScienceNote note={dryBrineScience} unit={unit} />
                        )}{' '}
                        {i === 2 && (
                          <ScienceNote
                            note={cookingScience(recipe.cut)}
                            unit={unit}
                          />
                        )}
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

          <GrillSetup plan={burners} recipe={recipe} unit={unit} />

          <section className="legal-note" aria-labelledby="legal-heading">
            <h2 id="legal-heading">Before you fire it up</h2>
            <div className="legal-grid">
              <div>
                <h3>Cook to temperature, not to the clock</h3>
                <p>
                  Every time on this site is an estimate, including the ones the
                  burner planner works out from your settings. Thickness,
                  weather, wind and your particular grill all move them. The
                  only thing that tells you meat is safe to eat is a thermometer
                  in the thickest part.{' '}
                  <a
                    href={safetySource}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The USDA publishes the minimums
                  </a>{' '}
                  and they are worth trusting over anything here.
                </p>
                <p>
                  The burner diagram is a planner. It is not connected to your
                  grill and cannot light or adjust anything. Follow your
                  manufacturer&rsquo;s lighting sequence, and keep a smoker box
                  only where their instructions allow.
                </p>
              </div>
              <div>
                <h3>The photos are AI-generated</h3>
                <p>
                  All twelve meal images were made with an AI image model. They
                  are photorealistic illustrations, not photographs of food
                  actually cooked from these recipes, so treat them as a mood
                  board rather than a target. Full provenance, including the
                  prompts that were kept, is in the repository.
                </p>
                <h3>Nothing you do here leaves your device</h3>
                <p>
                  This site makes no network requests. There is no analytics, no
                  tracking, and no account. Your saved recipes, weights, burner
                  layout and ingredient swaps live in your own browser&rsquo;s
                  storage and are never sent anywhere. Clearing your browser
                  data removes them.
                </p>
              </div>
            </div>
            <p className="legal-fine">
              This is a personal project shared as-is, with no warranty of any
              kind. I have tried to get the temperatures right and they follow
              published USDA guidance, but I cannot promise the site is free of
              errors and I am not responsible for how a cook turns out. You are
              the one at the grill. Use your own judgement, and a thermometer.
            </p>
          </section>
        </main>
        <footer className="container">
          <span className="brand">
            Are You <span className="brand-accent">Sear-ious</span>
          </span>
          <span>Gas grill, dialed in.</span>
          <a href={safetySource} target="_blank" rel="noopener noreferrer">
            Temperature sources ↗
          </a>
        </footer>
      </div>
      <RecipePrint
        recipe={recipe}
        unit={unit}
        heatWindow={heatWindow}
        displayItem={displayItem}
      />
      <Dialog
        open={dialog === 'cook'}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className="cook-dialog">
          <DialogTitle className="dialog-title">{recipe.title}</DialogTitle>
          <DialogDescription>
            Cook mode · take it one step at a time
          </DialogDescription>
          {dialog === 'cook' && (
            <CookMode
              recipe={recipe}
              unit={unit}
              key={recipe.id + recipe.weightLb}
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
                const c = cuts.find((c) => c.id === id)!;
                const r = buildRecipe(id, weights[id] ?? c.baseLb, weightUnit);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      chooseProtein(r.protein);
                      chooseCut(r.id);
                      setDialog(null);
                      setTimeout(
                        () =>
                          document
                            .getElementById('recipe')
                            ?.scrollIntoView({ behavior: 'smooth' }),
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
