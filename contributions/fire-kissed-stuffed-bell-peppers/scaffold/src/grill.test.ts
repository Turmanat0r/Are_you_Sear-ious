import { describe, expect, it } from 'vitest';
import {
  burnerCount,
  burnerMessage,
  initialGrillPlan,
  isGrillPlan,
  planSummary,
  toggleBurner,
  type BurnerStates,
} from './grill';

describe('exactly three manual burners', () => {
  it('has a fixed count and no preselected burners', () => {
    expect(burnerCount).toBe(3);
    expect(initialGrillPlan()).toEqual({
      count: 3,
      orientation: 'horizontal',
      states: [false, false, false],
    });
  });
  it('toggles only the selected burner without mutating the old plan', () => {
    const plan = initialGrillPlan();
    expect(toggleBurner(plan, 1).states).toEqual([false, true, false]);
    expect(plan.states).toEqual([false, false, false]);
    expect(toggleBurner(plan, 3)).toBe(plan);
    expect(toggleBurner(plan, -1)).toBe(plan);
  });
  it('handles all eight possible choices and both orientations', () => {
    for (let mask = 0; mask < 8; mask++) {
      const states: BurnerStates = [Boolean(mask & 1), Boolean(mask & 2), Boolean(mask & 4)];
      expect(burnerMessage(states)).toContain(
        mask === 0 ? 'No burners' : mask === 7 ? 'All three burners' : 'OFF',
      );
      for (const orientation of ['horizontal', 'vertical'] as const) {
        const plan = { ...initialGrillPlan(), orientation, states };
        expect(isGrillPlan(plan)).toBe(true);
        expect(planSummary(plan)).toContain('3 burners');
        expect(planSummary(plan)).not.toContain('Burner 4');
      }
    }
  });
  it('rejects wrong counts and malformed state arrays including older template layouts', () => {
    for (const count of [2, 4, 5, 6, '3', 3.5])
      expect(isGrillPlan({ ...initialGrillPlan(), count })).toBe(false);
    for (const states of [[false], [false, false, false, false], [0, 0, 0], ['OFF', 'OFF', 'OFF']])
      expect(isGrillPlan({ ...initialGrillPlan(), states })).toBe(false);
    expect(isGrillPlan({ ...initialGrillPlan(), orientation: 'diagonal' })).toBe(false);
  });
  it('prints exact selected positions and warns about an all-lit grill', () => {
    const plan = toggleBurner(toggleBurner(initialGrillPlan(), 0), 2);
    expect(planSummary(plan)).toContain('ON: 1, 3. OFF: 2.');
    expect(burnerMessage([true, true, true])).toContain('Turn enough burners OFF');
  });
});
