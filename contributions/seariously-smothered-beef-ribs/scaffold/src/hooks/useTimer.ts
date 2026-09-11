import { useEffect, useState } from 'react';
import { remainingSeconds } from '../lib/timer';

export function useTimer() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const remaining = remainingSeconds(deadline, Date.now());
      setSeconds(remaining);
      if (remaining === 0) setDeadline(null);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [deadline]);
  const start = (minutes: number) => {
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 60) return;
    setSeconds(minutes * 60);
    setStarted(true);
    setDeadline(Date.now() + minutes * 60_000);
  };
  const pause = () => {
    if (deadline !== null) setSeconds(remainingSeconds(deadline, Date.now()));
    setDeadline(null);
  };
  const resume = () => {
    if (seconds > 0) setDeadline(Date.now() + seconds * 1000);
  };
  const reset = () => {
    setDeadline(null);
    setSeconds(0);
    setStarted(false);
  };
  return {
    seconds,
    start,
    pause,
    resume,
    reset,
    running: deadline !== null,
    expired: started && seconds === 0,
  };
}
