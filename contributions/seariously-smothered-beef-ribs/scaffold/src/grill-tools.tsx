'use client';
import { useEffect, useState } from 'react';
import { Flame, ArrowUpRight, FlaskConical, SlidersHorizontal, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  fromLb,
  numberLabel,
  parseWeight,
  parseGrillPlan,
  burnerMessage,
  zoneScience,
  type ConfiguredRecipe,
  type WeightUnit,
  type Cut,
  type Science,
  type GrillPlan,
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
  const displayWeight = (value: number) => Number(fromLb(value, weightUnit).toFixed(4)).toString();
  const [draft, setDraft] = useState<string | null>(null);
  const input = draft ?? displayWeight(weightLb);
  const valid = parseWeight(cut, input, weightUnit) !== null;
  const min = displayWeight(cut.minLb),
    max = displayWeight(cut.maxLb);
  return (
    <div className="weight-field">
      <label htmlFor="meat-weight">Total raw weight</label>
      <div className="weight-input">
        <Input
          id="meat-weight"
          type="number"
          inputMode="decimal"
          step="any"
          value={input}
          min={min}
          max={max}
          aria-invalid={!valid}
          aria-describedby="weight-help"
          onChange={(event) => {
            const value = event.target.value;
            setDraft(value);
            const lb = parseWeight(cut, value, weightUnit);
            onValidity(lb !== null);
            if (lb !== null) onWeight(lb);
          }}
          onBlur={() => {
            if (valid) setDraft(null);
          }}
        />
        <span>{weightUnit}</span>
      </div>
      <p id="weight-help" className={valid ? 'micro' : 'weight-error'}>
        {valid
          ? `${min}–${max} ${weightUnit} supported`
          : `Enter ${min}–${max} ${weightUnit}. Ingredients keep the last valid weight.`}
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
        <label id="cut-label">Your cut / recipe</label>
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
      <div className="weight-unit-field">
        <label id="weight-unit-label">Weight unit</label>
        <Select
          value={weightUnit}
          onValueChange={(v) => {
            if (v === 'lb' || v === 'kg') {
              onUnit(v);
              onValidity(true);
            }
          }}
        >
          <SelectTrigger aria-labelledby="weight-unit-label" className="select-control">
            <SelectValue>{weightUnit === 'lb' ? 'Pounds' : 'Kilograms'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lb">Pounds</SelectItem>
            <SelectItem value="kg">Kilograms</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="scale-status" role="status">
        <strong>{numberLabel(recipe.scale)}× ingredients</strong>
        <span>For {recipe.sizeLabel} of this cut</span>
      </div>
      <p className="scaling-note">
        Seasonings and sauce scale with weight. Cook times are estimates for the stated thickness,
        not a weight multiplier. {recipe.scalingNote}
      </p>
    </section>
  );
}

export function ProteinTemperatures({ recipe, unit }: { recipe: ConfiguredRecipe; unit: Unit }) {
  return (
    <section id="temperatures" className="guide-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BEEF RIBS · KNOW YOUR NUMBERS</p>
          <h2>Heat outside. Doneness inside.</h2>
        </div>
        <span className="guide-unit">°{unit}</span>
      </div>
      <p className="section-description">
        Measure grill air beside the ribs at grate level and internal temperature in thick meat,
        away from bone. Safe beef and tender short ribs are different targets.
      </p>
      <Table className="temperature-table">
        <TableHeader>
          <TableRow>
            <TableHead>Cut</TableHead>
            <TableHead>Grill ambient</TableHead>
            <TableHead>Tenderness target</TableHead>
            <TableHead>Rest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-selected="true">
            <TableCell>{recipe.cut.name}</TableCell>
            <TableCell>
              {temp(recipe.grill, unit)}
              <small>Indirect low heat</small>
            </TableCell>
            <TableCell>
              <strong>{temp(recipe.internal, unit)}</strong>
              <small>Probe-tender range, not the safety minimum</small>
            </TableCell>
            <TableCell>{recipe.rest}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="source-note">
        {unitText(recipe.safety, unit)}{' '}
        <a href={safetySource} target="_blank" rel="noreferrer">
          USDA temperature reference <ArrowUpRight size={13} />
        </a>
      </p>
    </section>
  );
}

export function GrillSetup({
  unit,
  onPlanChange,
}: {
  unit: Unit;
  onPlanChange?: (plan: GrillPlan) => void;
}) {
  const [count, setCount] = useState(3),
    [states, setStates] = useState<boolean[]>([false, false, false]),
    [orientation, setOrientation] = useState<GrillPlan['orientation']>('horizontal'),
    [loaded, setLoaded] = useState(false);
  const method = 'indirect' as const;
  useEffect(() => {
    try {
      const saved = parseGrillPlan(localStorage.getItem('searious-ribs-grill-v2'));
      setCount(saved.count);
      setStates(saved.states);
      setOrientation(saved.orientation);
    } catch {
      /* Storage is optional. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(
          'searious-ribs-grill-v2',
          JSON.stringify({ count, states, orientation, method }),
        );
      } catch {
        /* Storage is optional. */
      }
  }, [count, states, orientation, method, loaded]);
  useEffect(() => {
    onPlanChange?.({ count, states, orientation, method });
  }, [count, states, orientation, method, onPlanChange]);
  const countChange = (n: number) => {
    setStates((old) => Array.from({ length: n }, (_, i) => old[i] ?? false));
    setCount(n);
  };
  const labels = (i: number) =>
    orientation === 'horizontal'
      ? i === 0
        ? 'Left'
        : i === count - 1
          ? 'Right'
          : `Center ${count > 3 ? i : ''}`
      : i === 0
        ? 'Back'
        : i === count - 1
          ? 'Front'
          : `Middle ${count > 3 ? i : ''}`;
  return (
    <section id="setup" className="setup-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR GRILL. YOUR CALL.</p>
          <h2>You pick the burners.</h2>
        </div>
        <SlidersHorizontal className="muted" size={24} />
      </div>
      <div className="setup-grid">
        <div>
          <p className="section-description">
            Tap any burner switch to plan ON or OFF. Match your grill’s layout, then adjust its
            physical controls using the manufacturer’s lighting sequence.
          </p>
          <div className="setup-selects">
            <div>
              <label id="burner-label">Burners</label>
              <Select
                value={String(count)}
                onValueChange={(v) => {
                  if (v) countChange(Number(v));
                }}
              >
                <SelectTrigger aria-labelledby="burner-label" className="select-control">
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
              <label id="layout-label">Arrangement</label>
              <Select
                value={orientation}
                onValueChange={(v) => {
                  if (v === 'horizontal' || v === 'vertical') setOrientation(v);
                }}
              >
                <SelectTrigger aria-labelledby="layout-label" className="select-control">
                  <SelectValue>
                    {orientation === 'horizontal' ? 'Left to right' : 'Back to front'}
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
            <label id="heat-label">Cooking method</label>
            <Select value={method}>
              <SelectTrigger aria-labelledby="heat-label" className="select-control">
                <SelectValue>Indirect · all rib stages</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indirect">Indirect · all rib stages</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="setup-tip" role="status">
            {burnerMessage(states, method)}
          </p>
          <p className="micro">
            This is a planning diagram, not a grill connection. Changing rib thickness or method
            never changes your burner choices. Your layout is saved in this browser.
          </p>
          <ScienceNote note={zoneScience} unit={unit} />
        </div>
        <div className="zone-board">
          <div className="zone-board-heading">
            <span>TOP VIEW · {count} BURNERS</span>
            <span>PLANNED SETTINGS</span>
          </div>
          <div
            className={`burner-diagram interactive-burners ${orientation}`}
            style={
              orientation === 'horizontal'
                ? { gridTemplateColumns: `repeat(${count},minmax(0,1fr))` }
                : { gridTemplateColumns: '1fr' }
            }
          >
            {states.map((on, i) => (
              <label className={`burner-zone ${on ? 'on' : 'off'}`} key={i}>
                <span className="burner-position">{labels(i)}</span>
                <div className="grate-lines" aria-hidden="true" />
                <Flame size={23} />
                <strong>{on ? 'ON' : 'OFF'}</strong>
                <Switch
                  checked={on}
                  onCheckedChange={(v) =>
                    setStates((old) => old.map((s, index) => (index === i ? v : s)))
                  }
                  aria-label={`${labels(i)} burner ${i + 1}`}
                  className="burner-switch"
                />
                <small>{on ? 'Direct heat' : 'Unlit area'}</small>
              </label>
            ))}
          </div>
          <div className="burner-summary">
            <span>
              {states.filter(Boolean).length} of {count} ON
            </span>
            <button className="text-button" onClick={() => setStates(Array(count).fill(false))}>
              <RotateCcw size={13} /> All off
            </button>
          </div>
          <p>
            {unitText(
              'Unlit does not mean cold. Hold 275–300°F beside the food and keep the entire rib pan above unlit burners.',
              unit,
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
