<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue';

const value = ref<string | null>(null);
const valueWithBounds = ref<string | null>(null);
const sundayStart = ref<string | null>('2026-05-09');

const today = new Date().toISOString().slice(0, 10);
const minIso = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
})();
const maxIso = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
})();
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>Headless Date Picker</h1>
      <p class="lede">
        A vanilla TypeScript engine + a thin Vue 3 wrapper. Powered by the Temporal API.
      </p>
    </header>

    <section class="demo">
      <label for="dp-default" class="demo__label">Default (week starts Monday)</label>
      <DatePicker
        input-id="dp-default"
        v-model="value"
        placeholder="Pick a date"
      />
      <output class="demo__output">
        {{ value ? `Selected ISO: ${value}` : 'Nothing selected' }}
      </output>
    </section>

    <section class="demo">
      <label for="dp-sunday" class="demo__label">
        Week starts Sunday, locale en-US
      </label>
      <DatePicker
        input-id="dp-sunday"
        v-model="sundayStart"
        :first-day-of-week="0"
        locale="en-US"
        placeholder="MM/DD/YYYY"
      />
      <output class="demo__output">
        {{ sundayStart ? `Selected ISO: ${sundayStart}` : 'Nothing selected' }}
      </output>
    </section>

    <section class="demo">
      <label for="dp-bounds" class="demo__label">
        Constrained to {{ minIso }} → {{ maxIso }} (today: {{ today }})
      </label>
      <DatePicker
        input-id="dp-bounds"
        v-model="valueWithBounds"
        :min-date="minIso"
        :max-date="maxIso"
        placeholder="In-range only"
      />
      <output class="demo__output">
        {{ valueWithBounds ? `Selected ISO: ${valueWithBounds}` : 'Nothing selected' }}
      </output>
    </section>

    <footer class="page__footer">
      <p>
        Try keyboard nav: <kbd>Tab</kbd> to focus, <kbd>Enter</kbd>/<kbd>↓</kbd>
        to open, arrows to move, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to close.
      </p>
    </footer>
  </main>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 4rem auto;
  padding: 0 1.5rem;
  font-family: var(--dp-font-family);
  color: var(--dp-color-fg);
}

.page__header {
  margin-bottom: 2.5rem;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.875rem;
  font-weight: 600;
}

.lede {
  margin: 0;
  color: var(--dp-color-muted);
  font-size: 1rem;
}

.demo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.demo__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dp-color-muted);
}

.demo__output {
  font-size: 0.8125rem;
  color: var(--dp-color-muted);
  font-variant-numeric: tabular-nums;
}

.page__footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--dp-color-border);
  font-size: 0.875rem;
  color: var(--dp-color-muted);
}

kbd {
  display: inline-block;
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  background: var(--dp-color-hover);
  border: 1px solid var(--dp-color-border);
  border-radius: 4px;
}
</style>

<style>
body {
  margin: 0;
  background: var(--dp-color-bg);
}
</style>
