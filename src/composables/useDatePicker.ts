import { onScopeDispose, shallowRef, type Ref } from 'vue';
import { DatePickerEngine } from '../engine';
import type {
  DateInput,
  DayCell,
  EngineOptions,
  EngineState,
  YearMonthInput,
} from '../engine';

export interface UseDatePicker {
  readonly engine: DatePickerEngine;
  readonly state: Ref<EngineState>;
  readonly grid: Ref<readonly DayCell[]>;
  readonly weekdayLabels: readonly string[];
  nextMonth(): void;
  prevMonth(): void;
  nextYear(): void;
  prevYear(): void;
  goToToday(): void;
  goToYearMonth(ym: YearMonthInput): void;
  select(date: DateInput): void;
  clear(): void;
}

export function useDatePicker(options: EngineOptions = {}): UseDatePicker {
  const engine = new DatePickerEngine(options);
  const state = shallowRef(engine.getState());
  const grid = shallowRef(engine.getGrid());

  const unsubscribe = engine.subscribe((next) => {
    state.value = next;
    grid.value = engine.getGrid();
  });
  onScopeDispose(unsubscribe);

  return {
    engine,
    state,
    grid,
    weekdayLabels: engine.getWeekdayLabels(),
    nextMonth: () => engine.nextMonth(),
    prevMonth: () => engine.prevMonth(),
    nextYear: () => engine.nextYear(),
    prevYear: () => engine.prevYear(),
    goToToday: () => engine.goToToday(),
    goToYearMonth: (ym) => engine.goToYearMonth(ym),
    select: (date) => engine.select(date),
    clear: () => engine.clear(),
  };
}
