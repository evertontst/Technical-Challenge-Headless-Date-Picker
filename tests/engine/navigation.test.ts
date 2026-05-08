import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { DatePickerEngine } from '../../src/engine';

describe('DatePickerEngine — navigation', () => {
  describe('nextMonth', () => {
    it('advances within the same year', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.nextMonth();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2024);
      expect(ym.month).toBe(4);
    });

    it('rolls Dec → Jan of the next year', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-12-15' });
      engine.nextMonth();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2025);
      expect(ym.month).toBe(1);
    });
  });

  describe('prevMonth', () => {
    it('retreats within the same year', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.prevMonth();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2024);
      expect(ym.month).toBe(2);
    });

    it('rolls Jan → Dec of the previous year', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-01-15' });
      engine.prevMonth();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2023);
      expect(ym.month).toBe(12);
    });
  });

  describe('nextYear / prevYear', () => {
    it('nextYear keeps the month', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.nextYear();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2025);
      expect(ym.month).toBe(3);
    });

    it('prevYear keeps the month', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.prevYear();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2023);
      expect(ym.month).toBe(3);
    });

    it('handles Feb 2024 → Feb 2025 (leap to non-leap) without error', () => {
      // viewYearMonth has no "day", so Feb 29 → Feb (non-leap) is irrelevant for view nav.
      const engine = new DatePickerEngine({ initialDate: '2024-02-29' });
      engine.nextYear();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2025);
      expect(ym.month).toBe(2);
    });
  });

  describe('goToToday', () => {
    it("sets viewYearMonth to today's year-month", () => {
      const engine = new DatePickerEngine({ initialDate: '2020-01-01' });
      engine.goToToday();
      const today = Temporal.Now.plainDateISO();
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(today.year);
      expect(ym.month).toBe(today.month);
    });
  });

  describe('goToYearMonth', () => {
    it('accepts an ISO YYYY-MM string', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.goToYearMonth('2030-08');
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2030);
      expect(ym.month).toBe(8);
    });

    it('accepts a Temporal.PlainYearMonth', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      engine.goToYearMonth(Temporal.PlainYearMonth.from({ year: 2030, month: 8 }));
      const ym = engine.getState().viewYearMonth;
      expect(ym.year).toBe(2030);
      expect(ym.month).toBe(8);
    });
  });

  describe('navigation does not change selection', () => {
    it('keeps selectedDate unchanged after nextMonth', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const before = engine.getState().selectedDate;
      expect(before).not.toBeNull();
      engine.nextMonth();
      const after = engine.getState().selectedDate;
      expect(after).not.toBeNull();
      expect(after!.equals(before!)).toBe(true);
    });
  });
});
