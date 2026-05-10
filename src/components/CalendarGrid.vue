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
      >{{ label.slice(0, 1) }}</span>
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
      ><span>{{ cell.dayOfMonth }}</span></button>
    </div>
  </div>
</template>

<style scoped>
.dp-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dp-weekday-row,
.dp-grid-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--dp-gap);
}

.dp-grid-body {
  grid-template-rows: repeat(6, var(--dp-cell-size));
}

.dp-weekday {
  display: grid;
  place-items: center;
  height: 24px;
  font-family: var(--dp-font-sans);
  font-size: var(--dp-font-size-label);
  font-weight: 500;
  color: var(--dp-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.dp-cell {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: var(--dp-cell-size);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dp-color-muted);
  font-family: var(--dp-font-mono);
  font-size: 13px;
  font-weight: var(--dp-font-weight-day);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  border-radius: var(--dp-radius-cell);
  transition:
    background-color var(--dp-transition),
    color var(--dp-transition),
    transform var(--dp-transition);
}

.dp-cell > span {
  position: relative;
  z-index: 1;
  line-height: 1;
}

.dp-cell.dp-cell--current {
  color: var(--dp-color-fg);
  font-weight: var(--dp-font-weight-current);
}

.dp-cell:hover:not(:disabled):not(.dp-cell--selected) {
  background: var(--dp-color-hover);
  color: var(--dp-color-fg);
}

.dp-cell:active:not(:disabled) {
  transform: scale(0.94);
}

.dp-cell.dp-cell--today:not(.dp-cell--selected)::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid var(--dp-color-today-ring);
  border-radius: var(--dp-radius-cell);
  opacity: 0.7;
}

.dp-cell.dp-cell--selected {
  color: var(--dp-color-accent-fg);
  font-weight: 500;
}

.dp-cell.dp-cell--selected::before {
  content: '';
  position: absolute;
  inset: 3px;
  background: var(--dp-color-accent);
  border-radius: var(--dp-radius-cell);
  z-index: 0;
}

.dp-cell.dp-cell--disabled {
  color: var(--dp-color-disabled-fg);
  cursor: not-allowed;
  text-decoration: line-through;
  text-decoration-thickness: 0.5px;
  text-decoration-color: var(--dp-color-disabled-fg);
}

.dp-cell:focus-visible {
  outline: none;
  box-shadow: var(--dp-focus-ring);
}
</style>
