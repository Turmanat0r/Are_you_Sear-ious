import { describe, expect, it } from 'vitest';
import { clockLabel, remainingSeconds } from './timer';

describe('deadline-based check-in timer', () => {
  it('measures elapsed wall-clock time rather than counting callbacks', () => {
    expect(remainingSeconds(480_000, 0)).toBe(480);
    expect(remainingSeconds(480_000, 470_000)).toBe(10);
    expect(remainingSeconds(480_000, 600_000)).toBe(0);
  });
  it('rounds partial seconds up and never produces a negative countdown', () => {
    expect(remainingSeconds(1000, 999)).toBe(1);
    expect(remainingSeconds(1000, 1000)).toBe(0);
  });
  it('formats the clock consistently', () => {
    expect(clockLabel(480)).toBe('08:00');
    expect(clockLabel(61)).toBe('01:01');
    expect(clockLabel(0)).toBe('00:00');
  });
});
