'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import {
  Flame,
  ArrowUpRight,
  FlaskConical,
  RotateCcw,
  Gauge,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { temp, unitText, safetySource, type Unit } from './recipes';
import {
  cuts,
  isCounted,
  displayAmount,
  storeAmount,
  amountSuffix,
  numberLabel,
  validateWeight,
  burnerMessage,
  burnerLevels,
  burnerLevelLabels,
  burnerOutput,
  cookTimeEstimate,
  formatMinutes,
  zoneScience,
  type BurnerLevel,
  type HeatEstimate,
  type ConfiguredRecipe,
  type WeightUnit,
  type Cut,
  type Science,
} from './cook-config';

export function ScienceNote({ note, unit }: { note: Science; unit: Unit }) {
  return (
    <aside className="science-note">
      <div className="science-label">
        <FlaskConical size={17} />
        <span>A LITTLE GRILL SCIENCE</span>
      </div>
      <h3>{note.title}</h3>
      <p>{unitText(note.body, unit)}</p>
      <p className="science-takeaway">{unitText(note.takeaway, unit)}</p>
    </aside>
  );
}

function WeightField({
  cut,
  weightLb,
  weightUnit,
  onWeight,
  onValidity,
}: {
  cut: Cut;
  weightLb: number;
  weightUnit: WeightUnit;
  onWeight: (value: number) => void;
  onValidity: (valid: boolean) => void;
}) {
  const counted = isCounted(cut);
  const displayWeight = (value: number) =>
    Number(displayAmount(cut, value, weightUnit).toFixed(4)).toString();
  const [draft, setDraft] = useState(displayWeight(weightLb));
  useEffect(() => {
    // Re-syncs the input draft when the weight changes from outside this
    // field (the Web MCP tool, or a restored value). A lazy initializer
    // cannot see later prop changes, so the cascading render is intended.
    // oxlint-disable-next-line react/react-compiler
    setDraft((current) =>
      current.trim() !== '' &&
      Math.abs(storeAmount(cut, Number(current), weightUnit) - weightLb) < 1e-6
        ? current
        : Number(
            displayAmount(cut, weightLb, weightUnit).toFixed(4),
          ).toString(),
    );
  }, [cut, weightLb, weightUnit]);
  const numeric = Number(draft),
    valid =
      draft.trim() !== '' &&
      validateWeight(cut, storeAmount(cut, numeric, weightUnit));
  const min = displayWeight(cut.minLb),
    max = displayWeight(cut.maxLb);
  return (
    <div className="weight-field">
      <label htmlFor="meat-weight">
        {counted ? 'How many' : 'Total raw weight'}
      </label>
      <div className="weight-input">
        <Input
          id="meat-weight"
          type="number"
          inputMode="decimal"
          step={counted ? '1' : 'any'}
          value={draft}
          min={min}
          max={max}
          aria-invalid={!valid}
          aria-describedby="weight-help"
          onChange={(event) => {
            const value = event.target.value;
            setDraft(value);
            const lb = storeAmount(cut, Number(value), weightUnit);
            const ok = value.trim() !== '' && validateWeight(cut, lb);
            onValidity(ok);
            if (ok) onWeight(lb);
          }}
        />
        <span>{amountSuffix(cut, numeric, weightUnit)}</span>
      </div>
      <p id="weight-help" className={valid ? 'micro' : 'weight-error'}>
        {valid
          ? `${min}–${max} ${amountSuffix(cut, cut.maxLb, weightUnit)} supported`
          : `Enter ${min}–${max} ${amountSuffix(cut, cut.maxLb, weightUnit)}. Ingredients keep the last valid ${counted ? 'count' : 'weight'}.`}
      </p>
    </div>
  );
}

export function RecipeControls({
  recipe,
  weightUnit,
  onCut,
  onWeight,
  onUnit,
  onValidity,
}: {
  recipe: ConfiguredRecipe;
  weightUnit: WeightUnit;
  onCut: (id: string) => void;
  onWeight: (value: number) => void;
  onUnit: (unit: WeightUnit) => void;
  onValidity: (valid: boolean) => void;
}) {
  return (
    <section className="recipe-controls" aria-label="Customize your meat">
      <div className="cut-field">
        <span className="field-label" id="cut-label">
          Your cut
        </span>
        <Select
          value={recipe.id}
          onValueChange={(v) => {
            if (v) {
              onCut(v);
              onValidity(true);
            }
          }}
        >
          <SelectTrigger aria-labelledby="cut-label" className="select-control">
            <SelectValue>{recipe.cut.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cuts
              .filter((c) => c.protein === recipe.protein)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <WeightField
        key={recipe.id + weightUnit}
        cut={recipe.cut}
        weightLb={recipe.weightLb}
        weightUnit={weightUnit}
        onWeight={onWeight}
        onValidity={onValidity}
      />
      <div
        className="weight-unit-field"
        hidden={isCounted(recipe.cut)}
        aria-hidden={isCounted(recipe.cut)}
      >
        <span className="field-label" id="weight-unit-label">
          Weight unit
        </span>
        <Select
          value={weightUnit}
          onValueChange={(v) => {
            if (v === 'lb' || v === 'kg') {
              onUnit(v);
              onValidity(true);
            }
          }}
        >
          <SelectTrigger
            aria-labelledby="weight-unit-label"
            className="select-control"
          >
            <SelectValue>
              {weightUnit === 'lb' ? 'Pounds' : 'Kilograms'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lb">Pounds</SelectItem>
            <SelectItem value="kg">Kilograms</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="scale-status" role="status">
        <strong>{numberLabel(recipe.scale)}× ingredients</strong>
        <span>
          {isCounted(recipe.cut)
            ? `For ${recipe.sizeLabel}`
            : `For ${recipe.sizeLabel} of this cut`}
        </span>
      </div>
      <p className="scaling-note">
        Seasonings and sauce scale with weight. Cook times are estimates for the
        stated thickness, not a weight multiplier. Use only enough mustard and
        rub to coat; you may have extra. Salt is calculated once at 0.5% of raw
        weight for unseasoned meat.
      </p>
    </section>
  );
}

export function ProteinTemperatures({
  recipe,
  unit,
}: {
  recipe: ConfiguredRecipe;
  unit: Unit;
}) {
  return (
    <section id="temperatures" className="guide-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {recipe.protein.toUpperCase()} · KNOW YOUR NUMBERS
          </p>
          <h2>Heat outside. Doneness inside.</h2>
        </div>
        <span className="guide-unit">
          {recipe.cut.name} · °{unit}
        </span>
      </div>
      <p className="section-description">
        Showing {recipe.protein.toLowerCase()} only. Your selected cut is
        highlighted. Measure grill air near the food at grate level, and
        internal temperature in the thickest part.
      </p>
      <Table className="temperature-table">
        <TableHeader>
          <TableRow>
            <TableHead>Cut</TableHead>
            <TableHead>Grill ambient</TableHead>
            <TableHead>Internal finish</TableHead>
            <TableHead>Rest / finish</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuts
            .filter((c) => c.protein === recipe.protein)
            .map((c) => (
              <TableRow
                key={c.id}
                data-selected={c.id === recipe.id || undefined}
              >
                <TableCell>
                  {c.name}
                  {c.id === recipe.id && (
                    <small className="selected-cut-label">Your cut</small>
                  )}
                </TableCell>
                <TableCell>
                  {temp(c.grill, unit)}
                  {c.method === 'Reverse sear' && (
                    <small>Then sear at {temp([450, 550], unit)}</small>
                  )}
                </TableCell>
                <TableCell>
                  <strong>{temp(c.internal, unit)}</strong>
                  <small>
                    {c.internal[0] > 165 ? 'Tenderness target' : 'Safe minimum'}
                  </small>
                </TableCell>
                <TableCell>{c.rest}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <p className="source-note">
        {unitText(recipe.safety, unit)}{' '}
        {recipe.cut.family === 'shoulder'
          ? 'A shoulder’s higher finish target is for pulling, not the minimum for food safety.'
          : ''}{' '}
        <a href={safetySource} target="_blank" rel="noopener noreferrer">
          USDA temperature reference <ArrowUpRight size={13} />
        </a>
      </p>
    </section>
  );
}

/**
 * Owns the burner layout and its persistence. Lifted out of GrillSetup so the
 * recipe card and print view can price the same plan the planner shows.
 */
export function useBurnerPlan() {
  const [count, setCount] = useState(3),
    [levels, setLevels] = useState<BurnerLevel[]>(['off', 'off', 'off']),
    [method, setMethod] = useState('indirect'),
    [orientation, setOrientation] = useState('horizontal'),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('searious-grill') || 'null',
      );
      // Layouts saved before per-zone levels stored one boolean per burner.
      const restored: BurnerLevel[] | null =
        saved && Array.isArray(saved.states)
          ? saved.states.every((x: unknown) => typeof x === 'boolean')
            ? saved.states.map((on: boolean) => (on ? 'hi' : 'off'))
            : saved.states.every(
                  (x: unknown) => typeof x === 'string' && x in burnerOutput,
                )
              ? (saved.states as BurnerLevel[])
              : null
          : null;
      if (
        saved &&
        Number.isInteger(saved.count) &&
        saved.count >= 2 &&
        saved.count <= 6 &&
        restored &&
        restored.length === saved.count
      ) {
        // localStorage is unavailable during server rendering, so the burner
        // layout has to be restored after mount. Reading it in a useState
        // initializer would desynchronise the server and client HTML.
        // oxlint-disable-next-line react/react-compiler
        setCount(saved.count);
        setLevels(restored);
        if (['horizontal', 'vertical'].includes(saved.orientation))
          setOrientation(saved.orientation);
        if (['direct', 'indirect'].includes(saved.method))
          setMethod(saved.method);
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(
          'searious-grill',
          JSON.stringify({ count, states: levels, orientation, method }),
        );
      } catch {}
  }, [count, levels, orientation, method, loaded]);
  const changeCount = (n: number) => {
    setLevels((old) => Array.from({ length: n }, (_, i) => old[i] ?? 'off'));
    setCount(n);
  };
  const setLevel = (index: number, level: BurnerLevel) =>
    setLevels((old) => old.map((value, i) => (i === index ? level : value)));
  const allOff = () => setLevels(Array(count).fill('off'));
  return {
    count,
    levels,
    method,
    orientation,
    changeCount,
    setLevel,
    allOff,
    setMethod,
    setOrientation,
  };
}
export type BurnerPlan = ReturnType<typeof useBurnerPlan>;

export function GrillSetup({
  plan,
  recipe,
  unit,
}: {
  plan: BurnerPlan;
  recipe: ConfiguredRecipe;
  unit: Unit;
}) {
  const {
    count,
    levels,
    method,
    orientation,
    changeCount,
    setLevel,
    allOff,
    setMethod,
    setOrientation,
  } = plan;
  const labels = (i: number) =>
    orientation === 'horizontal'
      ? i === 0
        ? 'Left'
        : i === count - 1
          ? 'Right'
          : count > 3
            ? `Center ${i}`
            : 'Center'
      : i === 0
        ? 'Back'
        : i === count - 1
          ? 'Front'
          : `Middle ${count > 3 ? i : ''}`;
  const estimate = cookTimeEstimate(recipe.cut, levels);
  const lit = levels.filter((level) => level !== 'off').length;
  return (
    <section id="setup" className="setup-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR GRILL. YOUR CALL.</p>
          <h2>You pick the burners.</h2>
        </div>
      </div>
      <div className="setup-grid">
        <div>
          <p className="section-description">
            Set each burner to OFF, LO, MED or HI. Match your grill&rsquo;s
            layout, then adjust its physical controls using the
            manufacturer&rsquo;s lighting sequence.
          </p>
          <div className="setup-selects">
            <div>
              <span className="field-label" id="burner-label">
                Burners
              </span>
              <Select
                value={String(count)}
                onValueChange={(v) => {
                  if (v) changeCount(Number(v));
                }}
              >
                <SelectTrigger
                  aria-labelledby="burner-label"
                  className="select-control"
                >
                  <SelectValue>{count} burners</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} burners
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="field-label" id="layout-label">
                Arrangement
              </span>
              <Select
                value={orientation}
                onValueChange={(v) => {
                  if (v) setOrientation(v);
                }}
              >
                <SelectTrigger
                  aria-labelledby="layout-label"
                  className="select-control"
                >
                  <SelectValue>
                    {orientation === 'horizontal'
                      ? 'Left to right'
                      : 'Back to front'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Left to right</SelectItem>
                  <SelectItem value="vertical">Back to front</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="method-choice">
            <span className="field-label" id="heat-label">
              Cooking method
            </span>
            <Select
              value={method}
              onValueChange={(v) => {
                if (v) setMethod(v);
              }}
            >
              <SelectTrigger
                aria-labelledby="heat-label"
                className="select-control"
              >
                <SelectValue>
                  {method === 'indirect'
                    ? 'Indirect / smoking'
                    : 'Direct / searing'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indirect">Indirect / smoking</SelectItem>
                <SelectItem value="direct">Direct / searing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="setup-tip" role="status">
            {burnerMessage(levels, method)}
          </p>
          <p className="micro">
            This is a planning diagram, not a grill connection. Changing protein
            or method never changes your burner choices. Your layout is saved in
            this browser.
          </p>
          <ScienceNote note={zoneScience} unit={unit} />
        </div>
        <div className="zone-board">
          <div className="zone-board-heading">
            <span>TOP VIEW &middot; {count} BURNERS</span>
            <span>PLANNED SETTINGS</span>
          </div>
          <div
            className={`burner-diagram interactive-burners ${orientation}`}
            data-count={count}
            style={{ '--burner-count': count } as CSSProperties}
          >
            {levels.map((level, i) => (
              <div className={`burner-zone level-${level}`} key={i}>
                <span className="burner-position">{labels(i)}</span>
                <div className="grate-lines" aria-hidden="true" />
                <Flame size={23} />
                <strong>{burnerLevelLabels[level]}</strong>
                <fieldset className="burner-levels">
                  <legend>
                    {labels(i)} burner {i + 1}
                  </legend>
                  {burnerLevels.map((option) => (
                    <label className="burner-level" key={option}>
                      <input
                        type="radio"
                        name={`burner-${i}`}
                        value={option}
                        checked={level === option}
                        onChange={() => setLevel(i, option)}
                      />
                      <span>{burnerLevelLabels[option]}</span>
                    </label>
                  ))}
                </fieldset>
                <small>{level === 'off' ? 'Unlit area' : 'Direct heat'}</small>
              </div>
            ))}
          </div>
          <div className="burner-summary">
            <span>
              {lit} of {count} lit
            </span>
            <button type="button" className="text-button" onClick={allOff}>
              <RotateCcw size={13} /> All off
            </button>
          </div>
          <HeatEstimatePanel estimate={estimate} recipe={recipe} unit={unit} />
          <p>
            Unlit does not mean cold. Measure the air beside the meat. Keep
            vents clear and place a smoker box only where your grill
            instructions allow.
          </p>
        </div>
      </div>
    </section>
  );
}

function HeatEstimatePanel({
  estimate,
  recipe,
  unit,
}: {
  estimate: HeatEstimate;
  recipe: ConfiguredRecipe;
  unit: Unit;
}) {
  if (estimate.kind === 'unlit')
    return (
      <div className="heat-estimate" role="status">
        <div className="heat-estimate-heading">
          <Gauge size={17} />
          <strong>Estimated heat</strong>
        </div>
        <p className="micro">
          Nothing is lit yet. Set at least one burner to see an estimated
          chamber temperature and cook time.
        </p>
      </div>
    );

  if (estimate.kind === 'tooCool')
    return (
      <div className="heat-estimate is-warning" role="status">
        <div className="heat-estimate-heading">
          <Gauge size={17} />
          <strong>Estimated heat</strong>
          <span className="heat-ambient">{temp([estimate.ambient], unit)}</span>
        </div>
        <p>
          Too cool to bring {recipe.cut.name.toLowerCase()} to{' '}
          {temp([estimate.target], unit)}. Turn burners up, or the food will
          stall below its safe finish temperature.
        </p>
      </div>
    );

  const { ambient, nominal, factor, window, clamped } = estimate;
  const percent = Math.round((factor - 1) * 100);
  const asWritten = Math.abs(percent) < 5;

  return (
    <div className="heat-estimate" role="status">
      <div className="heat-estimate-heading">
        <Gauge size={17} />
        <strong>Estimated heat</strong>
        <span className="heat-ambient">{temp([ambient], unit)}</span>
      </div>
      <dl className="heat-estimate-grid">
        <div>
          <dt>Recipe wants</dt>
          <dd>{temp(recipe.grill, unit)}</dd>
        </div>
        <div>
          <dt>Your settings</dt>
          <dd>{temp([ambient], unit)}</dd>
        </div>
        <div>
          <dt>Estimated cook</dt>
          <dd>
            {window
              ? `${formatMinutes(window[0])}–${formatMinutes(window[1])}`
              : `${factor.toFixed(2)}× the stated time`}
          </dd>
        </div>
      </dl>
      <p className="micro">
        {asWritten
          ? `Close to the ${temp([nominal], unit)} this recipe assumes, so expect roughly the stated ${recipe.time}.`
          : `About ${Math.abs(percent)}% ${percent > 0 ? 'longer' : 'faster'} than the stated ${recipe.time}, because the chamber sits ${percent > 0 ? 'below' : 'above'} the ${temp([nominal], unit)} it assumes.`}
        {clamped ? ' Capped at the edge of a useful range.' : ''} This models
        chamber air only, not the radiant heat of a direct sear and not the
        evaporative stall on a shoulder. A probe decides doneness.
      </p>
    </div>
  );
}
