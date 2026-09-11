import { useEffect, useRef } from 'react';
import {
  variantFor,
  methodSteps,
  recipe,
  safetySentence,
  sizeLabel,
  temp,
  unitText,
  type Settings,
} from '../recipe';
import { planSummary, type GrillPlan } from '../grill';
import { clockLabel } from '../lib/timer';
import type { useTimer } from '../hooks/useTimer';

type Props = {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  plan: GrillPlan;
  step: number;
  onStep: (step: number) => void;
  done: boolean;
  onDone: (done: boolean) => void;
  minutes: number;
  onMinutes: (minutes: number) => void;
  timer: ReturnType<typeof useTimer>;
};
export function CookMode({
  open,
  onClose,
  settings,
  plan,
  step,
  onStep,
  done,
  onDone,
  minutes,
  onMinutes,
  timer,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const steps = methodSteps(settings);
  const current = steps[step];
  const variant = variantFor(settings);
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="cook-dialog"
      aria-labelledby="cook-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <header className="dialog-header">
        <h2 id="cook-title">Cook mode</h2>
        <button type="button" className="secondary" onClick={onClose} autoFocus>
          Close
        </button>
      </header>
      <p>
        {sizeLabel(settings)} · {variant.name}
      </p>
      <p className="cook-targets">
        Ambient {temp(recipe.grillAmbientF, settings.tempUnit)} · Finish{' '}
        {temp(recipe.finishF, settings.tempUnit)} in the center
      </p>
      <p className="note">
        Safety: {safetySentence(settings)} Grill marks and firmness are secondary cues, not substitutes for the target.
      </p>
      <progress
        max={steps.length}
        value={done ? steps.length : step}
        aria-label="Cooking progress"
      />
      {done ? (
        <section>
          <h3>Steps complete</h3>
          <p>
            The checklist cannot confirm doneness. Verify the selected protein and finished dish reached their targets.
          </p>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              onDone(false);
              onStep(0);
            }}
          >
            Review from step 1
          </button>
        </section>
      ) : (
        <section aria-live="polite">
          <p className="eyebrow">
            Step {step + 1} of {steps.length}
          </p>
          <h3>{current.title}</h3>
          <p className="cue">{unitText(current.cue, settings.tempUnit)}</p>
          <p>{unitText(current.body, settings.tempUnit)}</p>
          <p className="science">{unitText(current.science, settings.tempUnit)}</p>
          <div className="cook-navigation">
            <button
              type="button"
              className="secondary"
              disabled={step === 0}
              onClick={() => onStep(step - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => (step === steps.length - 1 ? onDone(true) : onStep(step + 1))}
            >
              {step === steps.length - 1 ? 'Mark steps complete' : 'Next step'}
            </button>
          </div>
        </section>
      )}
      <details>
        <summary>Your three-burner plan</summary>
        <p>{planSummary(plan)}</p>
      </details>
      <section className="timer-panel" aria-label="Check-in timer">
        <h3>Check-in timer</h3>
        <label htmlFor="timer-minutes">
          Minutes{' '}
          <select
            id="timer-minutes"
            value={minutes}
            onChange={(event) => onMinutes(Number(event.target.value))}
          >
            {[1, 2, 3, 5, 8, 10, 15, 20, 30].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <output className="timer" aria-label="Time remaining">
          {clockLabel(timer.seconds)}
        </output>
        <p role="status">
          {timer.expired
            ? 'Timer finished—check the food. This is not a doneness reading.'
            : timer.running
              ? 'Timer running'
              : 'Timer paused or not started'}
        </p>
        <div className="timer-buttons">
          <button className="secondary" type="button" onClick={() => timer.start(minutes)}>
            Start {minutes} min
          </button>
          <button
            className="secondary"
            type="button"
            disabled={!timer.running && timer.seconds === 0}
            onClick={timer.running ? timer.pause : timer.resume}
          >
            {timer.running ? 'Pause' : 'Resume'}
          </button>
          <button className="secondary" type="button" onClick={timer.reset}>
            Reset timer
          </button>
        </div>
        <p className="note">
          Continues when this dialog closes. Reloading or closing the page resets the timer and
          cooking progress. No background alarm is guaranteed; set a separate timer if you leave the
          page. Changing servings, batch size or chop cut resets this cook session.
        </p>
      </section>
    </dialog>
  );
}
