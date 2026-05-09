<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill';
import type { DayCell } from '../engine';

interface Props {
  grid: readonly DayCell[];
  weekdayLabels: readonly string[];
  focusedIso?: string | null;
}

withDefaults(defineProps<Props>(), {
  focusedIso: null,
});

const emit = defineEmits<{
  select: [date: Temporal.PlainDate];
}>();
</script>

<template>
  <div class="dp-grid" role="grid" aria-label="Calendar">
    <div class="dp-weekday-row" role="row">
      <span
        v-for="(label, i) in weekdayLabels"
        :key="i"
        class="dp-weekday"
        role="columnheader"
        scope="col"
      >{{ label }}</span>
    </div>
    <div class="dp-grid-body" role="rowgroup">
      <button
        v-for="cell in grid"
        :key="cell.iso"
        type="button"
        class="dp-cell"
        :class="{
          'dp-cell--current': cell.isCurrentMonth,
          'dp-cell--selected': cell.isSelected,
          'dp-cell--today': cell.isToday,
          'dp-cell--disabled': cell.isDisabled,
        }"
        :data-iso="cell.iso"
        :disabled="cell.isDisabled"
        :aria-selected="cell.isSelected"
        :aria-current="cell.isToday ? 'date' : undefined"
        :aria-disabled="cell.isDisabled"
        :tabindex="focusedIso === cell.iso ? 0 : -1"
        role="gridcell"
        @click="emit('select', cell.date)"
      >{{ cell.dayOfMonth }}</button>
    </div>
  </div>
</template>

<style scoped>
.dp-grid {
  display: flex;
  flex-direction: column;
  gap: var(--dp-gap);
}

.dp-weekday-row,
.dp-grid-body {
  display: grid;
  grid-template-columns: repeat(7, var(--dp-cell-size));
  gap: var(--dp-gap);
}

.dp-grid-body {
  grid-template-rows: repeat(6, var(--dp-cell-size));
}

.dp-weekday {
  display: grid;
  place-items: center;
  height: calc(var(--dp-cell-size) * 0.75);
  font-size: var(--dp-font-size-label);
  color: var(--dp-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dp-cell {
  display: grid;
  place-items: center;
  width: var(--dp-cell-size);
  height: var(--dp-cell-size);
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dp-color-fg);
  border-radius: var(--dp-radius-cell);
  font-family: inherit;
  font-size: var(--dp-font-size);
  font-weight: var(--dp-font-weight-day);
  cursor: pointer;
  transition: background-color var(--dp-transition), color var(--dp-transition);
}

.dp-cell:not(.dp-cell--current) {
  color: var(--dp-color-muted);
}

.dp-cell.dp-cell--current {
  font-weight: var(--dp-font-weight-current);
}

.dp-cell:hover:not(:disabled) {
  background: var(--dp-color-hover);
}

.dp-cell.dp-cell--today:not(.dp-cell--selected) {
  box-shadow: inset 0 0 0 1px var(--dp-color-today-ring);
}

.dp-cell.dp-cell--selected {
  background: var(--dp-color-accent);
  color: var(--dp-color-accent-fg);
}

.dp-cell.dp-cell--disabled {
  color: var(--dp-color-disabled-fg);
  cursor: not-allowed;
}

.dp-cell:focus-visible {
  outline: none;
  box-shadow: var(--dp-focus-ring);
  position: relative;
  z-index: 1;
}
</style>
