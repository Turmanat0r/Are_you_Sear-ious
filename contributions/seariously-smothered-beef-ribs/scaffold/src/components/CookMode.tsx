import {
  Flame,
  Thermometer,
  Clock3,
  ArrowLeft,
  Check,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { temp, unitText, type Unit } from '../recipes';
import type { ConfiguredRecipe } from '../cook-config';
import type { useTimer } from '../hooks/useTimer';

export type CookSession = { step: number; done: boolean; preset: string };

export function CookMode({
  recipe,
  unit,
  timer,
  session,
  onSessionChange,
}: {
  recipe: ConfiguredRecipe;
  unit: Unit;
  timer: ReturnType<typeof useTimer>;
  session: CookSession;
  onSessionChange: (session: CookSession) => void;
}) {
  const { step, done, preset } = session;
  const seconds = timer.seconds || (timer.expired ? 0 : Number(preset) * 60);
  const deadline = timer.running;
  const expired = timer.expired;
  const active = recipe.steps[step];
  const resetTimer = timer.reset;
  return (
    <div className="cook-mode">
      <div className="cook-targets">
        <span>
          <Flame size={17} /> Grill <strong>{temp(recipe.grill, unit)}</strong>
        </span>
        <span>
          <Thermometer size={17} /> Tenderness <strong>{temp(recipe.internal, unit)}</strong>
        </span>
      </div>
      <p className="micro">
        {unitText(recipe.safety, unit)} Probe resistance—not temperature alone—decides tenderness.
      </p>
      <div className="progress-label">
        <span>{done ? 'Cook complete' : `Step ${step + 1} of ${recipe.steps.length}`}</span>
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
          <p>You’ve completed the recipe. Enjoy it, and refrigerate leftovers promptly.</p>
          <button
            className="secondary-button"
            onClick={() => {
              onSessionChange({ ...session, step: 0, done: false });
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
              onClick={() => onSessionChange({ ...session, step: step - 1 })}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="primary-button"
              onClick={() =>
                step === recipe.steps.length - 1
                  ? onSessionChange({ ...session, done: true })
                  : onSessionChange({ ...session, step: step + 1 })
              }
            >
              {step === recipe.steps.length - 1 ? 'Finish cook' : 'Complete step'}
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
                onSessionChange({ ...session, preset: v });
                timer.reset();
              }
            }}
          >
            <SelectTrigger aria-label="Timer duration" className="select-control">
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
          <output className="timer-digits" aria-label="Time remaining">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </output>
          <button
            className="icon-button"
            aria-label={deadline ? 'Pause timer' : 'Start timer'}
            disabled={seconds === 0}
            onClick={() => {
              if (deadline) {
                timer.pause();
              } else {
                if (timer.seconds > 0) timer.resume();
                else timer.start(Number(preset));
              }
            }}
          >
            {deadline ? <Pause size={19} /> : <Play size={19} />}
          </button>
          <button className="icon-button" onClick={resetTimer} aria-label="Reset timer">
            <RotateCcw size={18} />
          </button>
        </div>
        <p className={expired ? 'timer-alert' : 'micro'} role="status">
          {expired
            ? 'Timer done. Time to check your cook.'
            : 'The timer keeps running when this panel closes. Keep the page open; reloading resets it and no background alarm is guaranteed.'}
        </p>
      </div>
    </div>
  );
}
