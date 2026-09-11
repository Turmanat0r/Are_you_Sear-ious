"use client";
import { useEffect, useState } from "react";
import {
  Flame,
  ArrowUpRight,
  FlaskConical,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { temp, unitText, safetySource, type Unit } from "./recipes";
import {
  cuts,
  numberLabel,
  burnerMessage,
  zoneScience,
  type ConfiguredRecipe,
  type WeightUnit,
  type Science,
  type GrillPlan,
} from "./cook-config";
import { tailCounts } from "./lobster";

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

export function RecipeControls({
  recipe,
  weightUnit,
  onCut,
  onCount,
  onUnit,
}: {
  recipe: ConfiguredRecipe;
  weightUnit: WeightUnit;
  onCut: (id: string) => void;
  onCount: (count: number) => void;
  onUnit: (unit: WeightUnit) => void;
}) {
  return (
    <section className="recipe-controls" aria-label="Customize your lobster">
      <div className="cut-field">
        <label id="cut-label">Individual tail size</label>
        <Select
          value={recipe.id}
          onValueChange={(value) => {
            if (value) onCut(value);
          }}
        >
          <SelectTrigger aria-labelledby="cut-label" className="select-control">
            <SelectValue>{recipe.cutLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cuts.map((cut) => (
              <SelectItem key={cut.id} value={cut.id}>
                {weightUnit === "kg" ? cut.metricName : cut.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="weight-field">
        <label id="tail-count-label">Tail count</label>
        <Select
          value={String(recipe.tailCount)}
          onValueChange={(value) => {
            if (value) onCount(Number(value));
          }}
        >
          <SelectTrigger
            aria-labelledby="tail-count-label"
            className="select-control"
          >
            <SelectValue>
              {recipe.tailCount} {recipe.tailCount === 1 ? "tail" : "tails"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tailCounts.map((count) => (
              <SelectItem key={count} value={String(count)}>
                {count} {count === 1 ? "tail" : "tails"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="micro">Use extra pans for larger batches</p>
      </div>
      <div className="weight-unit-field">
        <label id="weight-unit-label">Measures</label>
        <Select
          value={weightUnit}
          onValueChange={(value) => {
            if (value === "lb" || value === "kg") onUnit(value);
          }}
        >
          <SelectTrigger
            aria-labelledby="weight-unit-label"
            className="select-control"
          >
            <SelectValue>
              {weightUnit === "lb" ? "US · oz / lb" : "Metric · g / kg"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lb">US · oz / lb</SelectItem>
            <SelectItem value="kg">Metric · g / kg</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="scale-status" role="status">
        <strong>{numberLabel(recipe.scale)}× ingredients</strong>
        <span>
          {recipe.batchLabel} · {recipe.sizeLabel}
        </span>
      </div>
      <p className="scaling-note">
        Butter, wine, and seasonings scale with estimated total tail weight.
        Timing follows individual tail size, not tail count.{" "}
        {recipe.scalingNote}
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
          <p className="eyebrow">LOBSTER · KNOW YOUR NUMBERS</p>
          <h2>Heat outside. Doneness inside.</h2>
        </div>
        <span className="guide-unit">°{unit}</span>
      </div>
      <p className="section-description">
        Measure grill air beside the butter pan at grate level. Probe the
        thickest lobster meat sideways, away from the shell. The air temperature
        and the lobster temperature measure different things.
      </p>
      <Table className="temperature-table">
        <TableHeader>
          <TableRow>
            <TableHead>Cut</TableHead>
            <TableHead>Grill ambient</TableHead>
            <TableHead>Safe internal target</TableHead>
            <TableHead>Rest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-selected="true">
            <TableCell>{recipe.cutLabel}</TableCell>
            <TableCell>
              {temp(recipe.grill, unit)}
              <small>Indirect butter bath</small>
            </TableCell>
            <TableCell>
              <strong>{temp(recipe.internal, unit)}</strong>
              <small>Reach this before removing each tail</small>
            </TableCell>
            <TableCell>{recipe.rest}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="source-note">
        {unitText(recipe.safety, unit)}{" "}
        <a href={safetySource} target="_blank" rel="noreferrer">
          FDA seafood guidance <ArrowUpRight size={13} />
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
  const [count, setCount] = useState(4),
    [states, setStates] = useState<boolean[]>([false, true, true, false]),
    [method, setMethod] = useState("indirect"),
    [orientation, setOrientation] = useState("horizontal"),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("searious-lobster-grill") || "null",
      );
      if (
        saved &&
        Number.isInteger(saved.count) &&
        saved.count >= 2 &&
        saved.count <= 6 &&
        Array.isArray(saved.states) &&
        saved.states.length === saved.count &&
        saved.states.every((x: unknown) => typeof x === "boolean")
      ) {
        setCount(saved.count);
        setStates(saved.states);
        if (["horizontal", "vertical"].includes(saved.orientation))
          setOrientation(saved.orientation);
        if (["direct", "indirect"].includes(saved.method))
          setMethod(saved.method);
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(
          "searious-lobster-grill",
          JSON.stringify({ count, states, orientation, method }),
        );
      } catch {}
  }, [count, states, orientation, method, loaded]);
  useEffect(() => {
    onPlanChange?.({ count, states, orientation, method });
  }, [count, states, orientation, method, onPlanChange]);
  const countChange = (n: number) => {
    setStates((old) => Array.from({ length: n }, (_, i) => old[i] ?? false));
    setCount(n);
  };
  const labels = (i: number) =>
    orientation === "horizontal"
      ? i === 0
        ? "Left"
        : i === count - 1
          ? "Right"
          : `Center ${count > 3 ? i : ""}`
      : i === 0
        ? "Back"
        : i === count - 1
          ? "Front"
          : `Middle ${count > 3 ? i : ""}`;
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
            Tap any burner switch to plan ON or OFF. Match your grill’s layout,
            then adjust its physical controls using the manufacturer’s lighting
            sequence.
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
              <label id="layout-label">Arrangement</label>
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
                    {orientation === "horizontal"
                      ? "Left to right"
                      : "Back to front"}
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
                  {method === "indirect"
                    ? "Indirect / smoking"
                    : "Direct / searing"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indirect">Indirect / smoking</SelectItem>
                <SelectItem value="direct">Direct / searing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="setup-tip" role="status">
            {burnerMessage(states, method)}
          </p>
          <p className="micro">
            This is a planning diagram, not a grill connection. Changing tail
            count, size, or method never changes your burner choices. Your
            layout is saved in this browser.
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
              orientation === "horizontal"
                ? { gridTemplateColumns: `repeat(${count},minmax(0,1fr))` }
                : { gridTemplateColumns: "1fr" }
            }
          >
            {states.map((on, i) => (
              <label className={`burner-zone ${on ? "on" : "off"}`} key={i}>
                <span className="burner-position">{labels(i)}</span>
                <div className="grate-lines" aria-hidden="true" />
                <Flame size={23} />
                <strong>{on ? "ON" : "OFF"}</strong>
                <Switch
                  checked={on}
                  onCheckedChange={(v) =>
                    setStates((old) =>
                      old.map((s, index) => (index === i ? v : s)),
                    )
                  }
                  aria-label={`${labels(i)} burner ${i + 1}`}
                  className="burner-switch"
                />
                <small>{on ? "Direct heat" : "Unlit area"}</small>
              </label>
            ))}
          </div>
          <div className="burner-summary">
            <span>
              {states.filter(Boolean).length} of {count} ON
            </span>
            <button
              className="text-button"
              onClick={() => setStates(Array(count).fill(false))}
            >
              <RotateCcw size={13} /> All off
            </button>
          </div>
          <p>
            {unitText(
              "Unlit does not mean cold. Hold 325–350°F beside the food and keep the entire butter-bath pan above unlit burners.",
              unit,
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
