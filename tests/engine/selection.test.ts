import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { DatePickerEngine } from '../../src/engine';

describe('DatePickerEngine — selection', () => {
  it('starts with selectedDate = null when no initialDate is given', () => {
    const engine = new DatePickerEngine();
    expect(engine.getState().selectedDate).toBeNull();
  });

  it('starts with selectedDate = initialDate when provided', () => {
    const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
    const sel = engine.getState().selectedDate;
    expect(sel).not.toBeNull();
    expect(sel!.toString()).toBe('2024-03-15');
  });

  describe('select', () => {
    it('updates selectedDate from an ISO string', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.select('2024-03-20');
      expect(engine.getState().selectedDate!.toString()).toBe('2024-03-20');
    });

    it('updates selectedDate from a Temporal.PlainDate', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.select(Temporal.PlainDate.from({ year: 2024, month: 3, day: 25 }));
      expect(engine.getState().selectedDate!.toString()).toBe('2024-03-25');
    });

    it('flips isSelected on exactly one matching grid cell', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.select('2024-03-20');
      const grid = engine.getGrid();
      const selectedCells = grid.filter(c => c.isSelected);
      expect(selectedCells).toHaveLength(1);
      expect(selectedCells[0]!.iso).toBe('2024-03-20');
    });

    it('jumps viewYearMonth to the selected month when selecting outside the view', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.select('2024-09-10');
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2024);
      expect(ym.month).toBe(9);
    });

    it('keeps the current view when selecting a date within it', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.select('2024-03-22');
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2024);
      expect(ym.month).toBe(3);
    });
  });

  describe('clear', () => {
    it('sets selectedDate to null', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      expect(engine.getState().selectedDate).not.toBeNull();
      engine.clear();
      expect(engine.getState().selectedDate).toBeNull();
    });

    it('removes isSelected from every grid cell', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.clear();
      const selectedCells = engine.getGrid().filter(c => c.isSelected);
      expect(selectedCells).toHaveLength(0);
    });
  });
});
