import { describe, it, expect, vi } from 'vitest';
import { DatePickerEngine } from '../../src/engine';

describe('DatePickerEngine — subscribe/notify', () => {
  it('subscribe() returns an unsubscribe function', () => {
    const engine = new DatePickerEngine();
    const unsubscribe = engine.subscribe(() => {});
    expect(typeof unsubscribe).toBe('function');
  });

  it('fires the listener when state changes (nextMonth)', () => {
    const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.nextMonth();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('passes the new state to the listener', () => {
    const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.nextMonth();
    expect(listener).toHaveBeenCalledWith(engine.getState());
  });

  it('fires once per distinct state change', () => {
    const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.nextMonth();
    engine.nextMonth();
    engine.prevMonth();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  describe('no-op operations do not notify', () => {
    it('does NOT fire when select() targets the already-selected date', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const listener = vi.fn();
      engine.subscribe(listener);
      engine.select('2024-03-15');
      expect(listener).not.toHaveBeenCalled();
    });

    it('does NOT fire when goToYearMonth() targets the current view', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const listener = vi.fn();
      engine.subscribe(listener);
      engine.goToYearMonth('2024-03');
      expect(listener).not.toHaveBeenCalled();
    });

    it('does NOT fire when clear() is called and selection is already null', () => {
      const engine = new DatePickerEngine();
      const listener = vi.fn();
      engine.subscribe(listener);
      engine.clear();
      expect(listener).not.toHaveBeenCalled();
    });

    it('does NOT fire when select() is blocked by isDisabled', () => {
      const engine = new DatePickerEngine({
        initialDate: '2024-03-15',
        maxDate: '2024-03-20',
      });
      const listener = vi.fn();
      engine.subscribe(listener);
      engine.select('2024-03-25');
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('stops further notifications', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const listener = vi.fn();
      const unsubscribe = engine.subscribe(listener);
      engine.nextMonth();
      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
      engine.nextMonth();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('called more than once is a no-op', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const listener = vi.fn();
      const unsubscribe = engine.subscribe(listener);
      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });
  });

  describe('multiple subscribers', () => {
    it('notifies all of them', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const a = vi.fn();
      const b = vi.fn();
      engine.subscribe(a);
      engine.subscribe(b);
      engine.nextMonth();
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('unsubscribing one does not affect the other', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const a = vi.fn();
      const b = vi.fn();
      const unsubA = engine.subscribe(a);
      engine.subscribe(b);
      unsubA();
      engine.nextMonth();
      expect(a).not.toHaveBeenCalled();
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('a listener that unsubscribes itself during the callback does not break others', () => {
      const engine = new DatePickerEngine({ initialDate: '2024-03-15' });
      const b = vi.fn();
      const unsubA = engine.subscribe(() => unsubA());
      engine.subscribe(b);
      expect(() => engine.nextMonth()).not.toThrow();
      expect(b).toHaveBeenCalledTimes(1);
    });
  });
});
