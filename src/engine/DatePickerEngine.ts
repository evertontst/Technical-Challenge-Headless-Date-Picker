import { Temporal } from '@js-temporal/polyfill';
import type {
  DateInput,
  DayCell,
  EngineOptions,
  EngineState,
  Listener,
  Unsubscribe,
  WeekStartDay,
  YearMonthInput,
} from './types';

const DEFAULT_FIRST_DAY_OF_WEEK: WeekStartDay = 1;

function toPlainDate(input: DateInput): Temporal.PlainDate {
  return typeof input === 'string' ? Temporal.PlainDate.from(input) : input;
}

const notImplemented = (method: string): Error =>
  new Error(`DatePickerEngine.${method}() is not yet implemented`);

export class DatePickerEngine {
  private state: EngineState;
  private readonly firstDayOfWeek: WeekStartDay;
  private readonly minDate: Temporal.PlainDate | null;
  private readonly maxDate: Temporal.PlainDate | null;
  private readonly locale: string | undefined;

  constructor(options: EngineOptions = {}) {
    const today = Temporal.Now.plainDateISO();
    const seed = options.initialDate ? toPlainDate(options.initialDate) : today;

    this.firstDayOfWeek = options.firstDayOfWeek ?? DEFAULT_FIRST_DAY_OF_WEEK;
    this.minDate = options.minDate ? toPlainDate(options.minDate) : null;
    this.maxDate = options.maxDate ? toPlainDate(options.maxDate) : null;
    this.locale = options.locale;

    this.state = {
      today,
      viewYearMonth: seed.toPlainYearMonth(),
      selectedDate: options.initialDate ? seed : null,
    };
  }

  getState(): Readonly<EngineState> {
    return this.state;
  }

  getGrid(): readonly DayCell[] {
    throw notImplemented('getGrid');
  }

  getWeekdayLabels(): readonly string[] {
    throw notImplemented('getWeekdayLabels');
  }

  nextMonth(): void {
    throw notImplemented('nextMonth');
  }

  prevMonth(): void {
    throw notImplemented('prevMonth');
  }

  nextYear(): void {
    throw notImplemented('nextYear');
  }

  prevYear(): void {
    throw notImplemented('prevYear');
  }

  goToToday(): void {
    throw notImplemented('goToToday');
  }

  goToYearMonth(_ym: YearMonthInput): void {
    throw notImplemented('goToYearMonth');
  }

  select(_date: DateInput): void {
    throw notImplemented('select');
  }

  clear(): void {
    throw notImplemented('clear');
  }

  subscribe(_listener: Listener): Unsubscribe {
    throw notImplemented('subscribe');
  }
}
