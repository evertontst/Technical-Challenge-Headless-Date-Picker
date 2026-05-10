<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { Temporal } from '@js-temporal/polyfill';
import { useDatePicker } from '../composables/useDatePicker';
import type { EngineOptions, WeekStartDay } from '../engine';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';

interface Props extends EngineOptions {
  modelValue?: string | null;
  placeholder?: string;
  inputId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select a date',
  inputId: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const {
  state,
  grid,
  weekdayLabels,
  select,
  clear,
  prevMonth,
  nextMonth,
  prevYear,
  nextYear,
  goToYearMonth,
} = useDatePicker({
  ...props,
  initialDate: props.modelValue ?? props.initialDate,
});

const open = ref(false);
const focusedIso = ref<string | null>(null);
const inputEl = useTemplateRef<HTMLInputElement>('inputEl');
const popoverEl = useTemplateRef<HTMLDivElement>('popoverEl');

const inputValue = computed(() => {
  const sel = state.value.selectedDate;
  if (!sel) return '';
  return sel.toLocaleString(props.locale, { dateStyle: 'medium' });
});

const announcement = computed(() => {
  if (!focusedIso.value) return '';
  const date = Temporal.PlainDate.from(focusedIso.value);
  return date.toLocaleString(props.locale, { dateStyle: 'full' });
});

function getInitialFocusDate(): Temporal.PlainDate {
  const { selectedDate, today, viewYearMonth } = state.value;
  if (selectedDate && selectedDate.toPlainYearMonth().equals(viewYearMonth)) {
    return selectedDate;
  }
  if (today.toPlainYearMonth().equals(viewYearMonth)) {
    return today;
  }
  return viewYearMonth.toPlainDate({ day: 1 });
}

function focusCell(iso: string): void {
  focusedIso.value = iso;
  void nextTick(() => {
    popoverEl.value
      ?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)
      ?.focus();
  });
}

function moveFocusTo(date: Temporal.PlainDate): void {
  const viewYM = state.value.viewYearMonth;
  if (date.year !== viewYM.year || date.month !== viewYM.month) {
    goToYearMonth(date.toPlainYearMonth());
  }
  focusCell(date.toString());
}

async function openPopover(): Promise<void> {
  if (open.value) return;
  open.value = true;
  await nextTick();
  const initial = getInitialFocusDate();
  focusCell(initial.toString());
}

async function closePopover(): Promise<void> {
  open.value = false;
  focusedIso.value = null;
  await nextTick();
  inputEl.value?.focus();
}

function handleSelect(date: Temporal.PlainDate): void {
  select(date);
  emit('update:modelValue', state.value.selectedDate?.toString() ?? null);
  void closePopover();
}

function startOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
  const fdow: WeekStartDay = props.firstDayOfWeek ?? 1;
  const anchor = fdow === 0 ? 7 : fdow;
  return date.subtract({ days: (date.dayOfWeek - anchor + 7) % 7 });
}

function trapTab(event: KeyboardEvent): void {
  if (!popoverEl.value) return;
  const focusables = Array.from(
    popoverEl.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([tabindex="-1"])',
    ),
  );
  if (focusables.length === 0) return;
  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function onKeyDown(event: KeyboardEvent): void {
  if (!open.value) return;
  const current = focusedIso.value
    ? Temporal.PlainDate.from(focusedIso.value)
    : getInitialFocusDate();

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      void closePopover();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      moveFocusTo(current.subtract({ days: 1 }));
      break;
    case 'ArrowRight':
      event.preventDefault();
      moveFocusTo(current.add({ days: 1 }));
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveFocusTo(current.subtract({ days: 7 }));
      break;
    case 'ArrowDown':
      event.preventDefault();
      moveFocusTo(current.add({ days: 7 }));
      break;
    case 'PageUp':
      event.preventDefault();
      moveFocusTo(
        event.shiftKey
          ? current.subtract({ years: 1 })
          : current.subtract({ months: 1 }),
      );
      break;
    case 'PageDown':
      event.preventDefault();
      moveFocusTo(
        event.shiftKey
          ? current.add({ years: 1 })
          : current.add({ months: 1 }),
      );
      break;
    case 'Home':
      event.preventDefault();
      moveFocusTo(startOfWeek(current));
      break;
    case 'End':
      event.preventDefault();
      moveFocusTo(startOfWeek(current).add({ days: 6 }));
      break;
    case 'Tab':
      trapTab(event);
      break;
  }
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === 'ArrowDown') {
    event.preventDefault();
    void openPopover();
  }
}

function onDocumentMouseDown(event: MouseEvent): void {
  if (!open.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (inputEl.value?.contains(target)) return;
  if (popoverEl.value?.contains(target)) return;
  open.value = false;
  focusedIso.value = null;
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('mousedown', onDocumentMouseDown);
  } else {
    document.removeEventListener('mousedown', onDocumentMouseDown);
  }
});

watch(
  () => props.modelValue,
  (next) => {
    if (next === null || next === undefined) {
      clear();
      return;
    }
    try {
      select(next);
    } catch {
      // invalid date string — silently ignore
    }
  },
);
</script>

<template>
  <div class="dp-root">
    <input
      :id="inputId"
      ref="inputEl"
      type="text"
      class="dp-input"
      :value="inputValue"
      :placeholder="placeholder"
      readonly
      aria-haspopup="dialog"
      :aria-expanded="open"
      @focus="openPopover"
      @click="openPopover"
      @keydown="onInputKeyDown"
    >
    <div
      v-if="open"
      ref="popoverEl"
      class="dp-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Choose date"
      @keydown="onKeyDown"
    >
      <CalendarHeader
        :view-year-month="state.viewYearMonth"
        :locale="locale"
        @prev-month="prevMonth"
        @next-month="nextMonth"
        @prev-year="prevYear"
        @next-year="nextYear"
      />
      <CalendarGrid
        :grid="grid"
        :weekday-labels="weekdayLabels"
        :focused-iso="focusedIso"
        @select="handleSelect"
      />
      <span class="dp-sr-only" aria-live="polite">{{ announcement }}</span>
    </div>
  </div>
</template>

<style scoped>
.dp-root {
  position: relative;
  display: inline-block;
  font-family: var(--dp-font-family);
  color: var(--dp-color-fg);
}

.dp-input {
  width: 100%;
  height: var(--dp-input-height);
  padding: 0 var(--dp-padding);
  background: var(--dp-color-bg);
  color: var(--dp-color-fg);
  border: 1px solid var(--dp-color-border);
  border-radius: var(--dp-radius-input);
  font-family: inherit;
  font-size: var(--dp-font-size);
  cursor: pointer;
  outline: none;
  transition: border-color var(--dp-transition), box-shadow var(--dp-transition);
}

.dp-input:hover {
  border-color: var(--dp-color-muted);
}

.dp-input:focus,
.dp-input:focus-visible {
  border-color: var(--dp-color-accent);
  box-shadow: var(--dp-focus-ring);
}

.dp-popover {
  position: absolute;
  top: calc(var(--dp-input-height) + 4px);
  left: 0;
  z-index: 50;
  width: var(--dp-popover-width);
  padding: var(--dp-padding);
  background: var(--dp-color-bg);
  border: 1px solid var(--dp-color-border);
  border-radius: var(--dp-radius);
  box-shadow: var(--dp-shadow);
}

.dp-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
