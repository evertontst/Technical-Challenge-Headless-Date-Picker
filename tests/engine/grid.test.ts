import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { DatePickerEngine } from '../../src/engine';
import type { EngineOptions } from '../../src/engine';

const setup = (options: EngineOptions = {}) => {
  const engine = new DatePickerEngine(options);
  return { engine, grid: engine.getGrid() };
};

describe('DatePickerEngine — grid generation', () => {
  describe('shape', () => {
    it('returns exactly 42 cells (6 rows × 7 columns)', () => {
      const { grid } = setup({ initialDate: '2026-05-15' });
      expect(grid).toHaveLength(42);
    });

    it('grid cells are contiguous — each one day after the previous', () => {
      const { grid } = setup({ initialDate: '2026-05-15' });
      for (let i = 1; i < grid.length; i++) {
        const expected = grid[i - 1]!.date.add({ days: 1 });
        expect(grid[i]!.iso).toBe(expected.toString());
      }
    });

    it('uses YYYY-MM-DD ISO format for the iso field', () => {
      const { grid } = setup({ initialDate: '2026-05-15' });
      for (const cell of grid) {
        expect(cell.iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('dayOfMonth matches the underlying date.day', () => {
      const { grid } = setup({ initialDate: '2026-05-15' });
      for (const cell of grid) {
        expect(cell.dayOfMonth).toBe(cell.date.day);
      }
    });
  });

  describe('May 2026 with firstDayOfWeek = 1 (Monday)', () => {
    const opts: EngineOptions = { initialDate: '2026-05-15', firstDayOfWeek: 1 };

    it('starts on Mon Apr 27 2026 (4 leading days)', () => {
      const { grid } = setup(opts);
      expect(grid[0]!.iso).toBe('2026-04-27');
      expect(grid[0]!.isCurrentMonth).toBe(false);
    });

    it('marks May 1 as the first current-month day', () => {
      const { grid } = setup(opts);
      const may1 = grid.find(c => c.iso === '2026-05-01');
      expect(may1).toBeDefined();
      expect(may1!.isCurrentMonth).toBe(true);
      expect(may1!.dayOfMonth).toBe(1);
    });

    it('marks May 31 as the last current-month day', () => {
      const { grid } = setup(opts);
      const may31 = grid.find(c => c.iso === '2026-05-31');
      expect(may31).toBeDefined();
      expect(may31!.isCurrentMonth).toBe(true);
      expect(may31!.dayOfMonth).toBe(31);
    });

    it('ends on Sun Jun 7 2026 (7 trailing days)', () => {
      const { grid } = setup(opts);
      expect(grid[41]!.iso).toBe('2026-06-07');
      expect(grid[41]!.isCurrentMonth).toBe(false);
    });
  });

  describe('May 2026 with firstDayOfWeek = 0 (Sunday)', () => {
    it('starts on Sun Apr 26 2026', () => {
      const { grid } = setup({ initialDate: '2026-05-15', firstDayOfWeek: 0 });
      expect(grid[0]!.iso).toBe('2026-04-26');
    });
  });

  describe('Feb 2024 (leap year), firstDayOfWeek = 1', () => {
    const opts: EngineOptions = { initialDate: '2024-02-10', firstDayOfWeek: 1 };

    it('starts on Mon Jan 29 2024 (3 leading days)', () => {
      const { grid } = setup(opts);
      expect(grid[0]!.iso).toBe('2024-01-29');
    });

    it('includes Feb 29 as a current-month day', () => {
      const { grid } = setup(opts);
      const feb29 = grid.find(c => c.iso === '2024-02-29');
      expect(feb29).toBeDefined();
      expect(feb29!.isCurrentMonth).toBe(true);
      expect(feb29!.dayOfMonth).toBe(29);
    });

    it('ends on Sun Mar 10 2024', () => {
      const { grid } = setup(opts);
      expect(grid[41]!.iso).toBe('2024-03-10');
    });
  });

  describe('Jan 2024 — month start equals firstDayOfWeek (no leading days)', () => {
    it('has zero leading days when Jan 1 is Monday and firstDayOfWeek = 1', () => {
      const { grid } = setup({ initialDate: '2024-01-15', firstDayOfWeek: 1 });
      expect(grid[0]!.iso).toBe('2024-01-01');
      expect(grid[0]!.isCurrentMonth).toBe(true);
      expect(grid[41]!.iso).toBe('2024-02-11');
    });
  });

  describe('Dec 2024 — year boundary in trailing days', () => {
    const opts: EngineOptions = { initialDate: '2024-12-15', firstDayOfWeek: 1 };

    it('starts on Mon Nov 25 2024', () => {
      const { grid } = setup(opts);
      expect(grid[0]!.iso).toBe('2024-11-25');
      expect(grid[0]!.isCurrentMonth).toBe(false);
    });

    it('ends on Sun Jan 5 2025', () => {
      const { grid } = setup(opts);
      expect(grid[41]!.iso).toBe('2025-01-05');
      expect(grid[41]!.isCurrentMonth).toBe(false);
    });
  });

  describe('today flag', () => {
    it('marks today’s cell with isToday = true when in the visible view', () => {
      const today = Temporal.Now.plainDateISO();
      const { grid } = setup();
      const todayCell = grid.find(c => c.iso === today.toString());
      expect(todayCell).toBeDefined();
      expect(todayCell!.isToday).toBe(true);
    });

    it('marks at most one cell as today', () => {
      const { grid } = setup({ initialDate: '2024-01-15' });
      const todayCells = grid.filter(c => c.isToday);
      expect(todayCells.length).toBeLessThanOrEqual(1);
    });
  });
});
