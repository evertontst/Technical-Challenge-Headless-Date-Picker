import { Temporal } from '@js-temporal/polyfill';

export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateInput = Temporal.PlainDate | string;
export type YearMonthInput = Temporal.PlainYearMonth | string;

export interface DayCell {
  readonly date: Temporal.PlainDate;
  readonly iso: string;
  readonly dayOfMonth: number;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly isDisabled: boolean;
}

export interface EngineState {
  readonly viewYearMonth: Temporal.PlainYearMonth;
  readonly selectedDate: Temporal.PlainDate | null;
  readonly today: Temporal.PlainDate;
}

export interface EngineOptions {
  readonly initialDate?: DateInput;
  readonly firstDayOfWeek?: WeekStartDay;
  readonly minDate?: DateInput;
  readonly maxDate?: DateInput;
  readonly locale?: string;
}

export type Listener = (state: EngineState) => void;
export type Unsubscribe = () => void;
