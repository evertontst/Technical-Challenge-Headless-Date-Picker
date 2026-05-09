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

const monthYearLabel = computed(() => {
  const firstOfMonth = props.viewYearMonth.toPlainDate({ day: 1 });
  return firstOfMonth.toLocaleString(props.locale, {
    month: 'long',
    year: 'numeric',
  });
});
</script>

<template>
  <div class="dp-header">
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
    <span class="dp-month-label" aria-live="polite">{{ monthYearLabel }}</span>
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
</template>

<style scoped>
.dp-header {
  display: flex;
  align-items: center;
  gap: var(--dp-gap);
  padding-bottom: var(--dp-padding);
}

.dp-nav-btn {
  height: var(--dp-cell-size);
  min-width: var(--dp-cell-size);
  border: none;
  background: transparent;
  color: var(--dp-color-fg);
  border-radius: var(--dp-radius-cell);
  cursor: pointer;
  font-size: var(--dp-font-size);
  transition: background-color var(--dp-transition);
}

.dp-nav-btn:hover {
  background: var(--dp-color-hover);
}

.dp-nav-btn:focus-visible {
  outline: none;
  box-shadow: var(--dp-focus-ring);
}

.dp-month-label {
  flex: 1;
  text-align: center;
  font-weight: var(--dp-font-weight-current);
  font-size: var(--dp-font-size);
  color: var(--dp-color-fg);
}
</style>
