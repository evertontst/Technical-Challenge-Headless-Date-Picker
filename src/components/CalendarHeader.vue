<script setup lang="ts">
import { computed } from 'vue';
import { Temporal } from '@js-temporal/polyfill';

interface Props {
  viewYearMonth: Temporal.PlainYearMonth;
  locale?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  prevMonth: [];
  nextMonth: [];
  prevYear: [];
  nextYear: [];
}>();

const monthLabel = computed(() => {
  const firstOfMonth = props.viewYearMonth.toPlainDate({ day: 1 });
  return firstOfMonth.toLocaleString(props.locale, { month: 'long' });
});

const yearLabel = computed(() => String(props.viewYearMonth.year));
</script>

<template>
  <div class="dp-header">
    <div class="dp-nav-cluster" aria-label="Year navigation">
      <button
        type="button"
        class="dp-nav-btn"
        aria-label="Previous year"
        @click="emit('prevYear')"
      >«</button>
      <button
        type="button"
        class="dp-nav-btn"
        aria-label="Previous month"
        @click="emit('prevMonth')"
      >‹</button>
    </div>

    <div class="dp-month-title" aria-live="polite">
      <span class="dp-month-name">{{ monthLabel }}</span>
      <span class="dp-year">{{ yearLabel }}</span>
    </div>

    <div class="dp-nav-cluster" aria-label="Year navigation">
      <button
        type="button"
        class="dp-nav-btn"
        aria-label="Next month"
        @click="emit('nextMonth')"
      >›</button>
      <button
        type="button"
        class="dp-nav-btn"
        aria-label="Next year"
        @click="emit('nextYear')"
      >»</button>
    </div>
  </div>
</template>

<style scoped>
.dp-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--dp-color-rule);
}

.dp-nav-cluster {
  display: flex;
  gap: 0;
}

.dp-nav-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dp-color-muted);
  font-family: var(--dp-font-display);
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  border-radius: 999px;
  transition:
    color var(--dp-transition),
    background-color var(--dp-transition);
}

.dp-nav-btn:hover {
  color: var(--dp-color-accent);
  background: var(--dp-color-hover);
}

.dp-nav-btn:focus-visible {
  outline: none;
  color: var(--dp-color-accent);
  box-shadow: var(--dp-focus-ring);
}

.dp-month-title {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  text-align: center;
  font-family: var(--dp-font-display);
  font-size: var(--dp-font-size-display);
  letter-spacing: -0.01em;
}

.dp-month-name {
  font-style: italic;
  font-weight: 500;
  color: var(--dp-color-fg);
}

.dp-year {
  font-family: var(--dp-font-mono);
  font-size: 12px;
  font-weight: 400;
  color: var(--dp-color-muted);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  position: relative;
  top: -1px;
}
</style>
