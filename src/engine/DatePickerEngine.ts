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
const GRID_CELLS = 42;

function toPlainDate(input: DateInput): Temporal.PlainDate {
  return typeof input === 'string' ? Temporal.PlainDate.from(input) : input;
}

function computeLeadingDays(
  firstOfMonth: Temporal.PlainDate,
  firstDayOfWeek: WeekStartDay,
): number {
  // Temporal: dayOfWeek 1=Mon … 7=Sun. Our setting: 0=Sun, 1=Mon … 6=Sat.
  const anchor = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
  return (firstOfMonth.dayOfWeek - anchor + 7) % 7;
}

function plainDateEquals(
  a: Temporal.PlainDate | null,
  b: Temporal.PlainDate | null,
): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  return a.equals(b);
}

export class DatePickerEngine {
  private state: EngineState;
  private readonly firstDayOfWeek: WeekStartDay;
  private readonly minDate: Temporal.PlainDate | null;
  private readonly maxDate: Temporal.PlainDate | null;
  private readonly locale: string | undefined;
  private readonly listeners: Set<Listener> = new Set();

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
    const { viewYearMonth, selectedDate, today } = this.state;
    const firstOfMonth = viewYearMonth.toPlainDate({ day: 1 });
    const leadingDays = computeLeadingDays(firstOfMonth, this.firstDayOfWeek);
    const startDate = firstOfMonth.subtract({ days: leadingDays });

    const cells: DayCell[] = [];
    for (let i = 0; i < GRID_CELLS; i++) {
      const date = startDate.add({ days: i });
      cells.push({
        date,
        iso: date.toString(),
        dayOfMonth: date.day,
        isCurrentMonth:
          date.year === viewYearMonth.year && date.month === viewYearMonth.month,
        isToday: date.equals(today),
        isSelected: selectedDate ? date.equals(selectedDate) : false,
        isDisabled: this.isDateDisabled(date),
      });
    }
    return cells;
  }

  getWeekdayLabels(): readonly string[] {
    // Anchor on a known Sunday so anchor[0..6] = [Sun, Mon, Tue, Wed, Thu, Fri, Sat].
    const sunday = Temporal.PlainDate.from({ year: 2024, month: 1, day: 7 });
    const anchored: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = sunday.add({ days: i });
      anchored.push(day.toLocaleString(this.locale, { weekday: 'short' }));
    }
    const labels: string[] = [];
    for (let i = 0; i < 7; i++) {
      labels.push(anchored[(i + this.firstDayOfWeek) % 7]!);
    }
    return labels;
  }

  private isDateDisabled(date: Temporal.PlainDate): boolean {
    if (this.minDate && Temporal.PlainDate.compare(date, this.minDate) < 0) return true;
    if (this.maxDate && Temporal.PlainDate.compare(date, this.maxDate) > 0) return true;
    return false;
  }

  nextMonth(): void {
    this.setState({ viewYearMonth: this.state.viewYearMonth.add({ months: 1 }) });
  }

  prevMonth(): void {
    this.setState({ viewYearMonth: this.state.viewYearMonth.subtract({ months: 1 }) });
  }

  nextYear(): void {
    this.setState({ viewYearMonth: this.state.viewYearMonth.add({ years: 1 }) });
  }

  prevYear(): void {
    this.setState({ viewYearMonth: this.state.viewYearMonth.subtract({ years: 1 }) });
  }

  goToToday(): void {
    this.setState({ viewYearMonth: this.state.today.toPlainYearMonth() });
  }

  goToYearMonth(ym: YearMonthInput): void {
    const target = typeof ym === 'string' ? Temporal.PlainYearMonth.from(ym) : ym;
    this.setState({ viewYearMonth: target });
  }

  private setState(patch: Partial<EngineState>): void {
    const next: EngineState = { ...this.state, ...patch };
    if (this.statesEqual(this.state, next)) return;
    this.state = next;
    this.notify();
  }

  private statesEqual(a: EngineState, b: EngineState): boolean {
    return (
      a.viewYearMonth.equals(b.viewYearMonth) &&
      plainDateEquals(a.selectedDate, b.selectedDate) &&
      a.today.equals(b.today)
    );
  }

  private notify(): void {
    for (const listener of [...this.listeners]) {
      listener(this.state);
    }
  }

  select(date: DateInput): void {
    const target = toPlainDate(date);
    if (this.isDateDisabled(target)) return;
    this.setState({
      selectedDate: target,
      viewYearMonth: target.toPlainYearMonth(),
    });
  }

  clear(): void {
    this.setState({ selectedDate: null });
  }

  subscribe(listener: Listener): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
