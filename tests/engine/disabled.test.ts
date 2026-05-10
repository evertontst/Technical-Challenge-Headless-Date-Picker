import { describe, it, expect } from 'vitest';
import { DatePickerEngine } from '../../src/engine';

describe('DatePickerEngine — disabled (min/max) dates', () => {
  describe('grid flags', () => {
    it('marks days strictly before minDate as disabled (inclusive boundary)', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        minDate: '2024-03-10',
      });
      const grid = engine.getGrid();
      expect(grid.find(c => c.iso === '2024-03-09')?.isDisabled).toBe(true);
      expect(grid.find(c => c.iso === '2024-03-10')?.isDisabled).toBe(false);
      expect(grid.find(c => c.iso === '2024-03-11')?.isDisabled).toBe(false);
    });

    it('marks days strictly after maxDate as disabled (inclusive boundary)', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        maxDate: '2024-03-20',
      });
      const grid = engine.getGrid();
      expect(grid.find(c => c.iso === '2024-03-19')?.isDisabled).toBe(false);
      expect(grid.find(c => c.iso === '2024-03-20')?.isDisabled).toBe(false);
      expect(grid.find(c => c.iso === '2024-03-21')?.isDisabled).toBe(true);
    });

    it('marks no days disabled when neither min nor max is set', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const disabled = engine.getGrid().filter(c => c.isDisabled);
      expect(disabled).toHaveLength(0);
    });
  });

  describe('select() respects disabled days', () => {
    it('does not change selectedDate when selecting before minDate', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        minDate: '2024-03-10',
      });
      const before = engine.getState().selectedDate!.toString();
      engine.select('2024-03-05');
      expect(engine.getState().selectedDate!.toString()).toBe(before);
    });

    it('does not change selectedDate when selecting after maxDate', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        maxDate: '2024-03-20',
      });
      const before = engine.getState().selectedDate!.toString();
      engine.select('2024-03-25');
      expect(engine.getState().selectedDate!.toString()).toBe(before);
    });

    it('allows selection at the minDate boundary', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        minDate: '2024-03-10',
      });
      engine.select('2024-03-10');
      expect(engine.getState().selectedDate!.toString()).toBe('2024-03-10');
    });

    it('allows selection at the maxDate boundary', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        maxDate: '2024-03-20',
      });
      engine.select('2024-03-20');
      expect(engine.getState().selectedDate!.toString()).toBe('2024-03-20');
    });
  });
});
