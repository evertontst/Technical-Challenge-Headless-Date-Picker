<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue';

const value = ref<string | null>(null);
const sundayStart = ref<string | null>('2026-05-09');
const valueWithBounds = ref<string | null>(null);

const today = new Date().toISOString().slice(0, 10);

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const minIso = isoOffset(-7);
const maxIso = isoOffset(14);
</script>

<template>
  <main class="page">
    <header class="page-header">
      <h1 class="title">Headless Date Picker</h1>
      <p class="subtitle">
        A Vue 3 wrapper around a vanilla TypeScript engine, built on the Temporal API.
      </p>
    </header>

    <section class="demo">
      <div class="demo__meta">
        <label for="dp-default" class="demo__label">Default</label>
        <p class="demo__description">Week starts Monday.</p>
      </div>
      <div class="demo__field">
        <DatePicker
          input-id="dp-default"
          v-model="value"
          placeholder="Pick a date"
        />
        <output class="demo__output">
          {{ value ? `selected — ${value}` : 'no selection' }}
        </output>
      </div>
    </section>

    <section class="demo">
      <div class="demo__meta">
        <label for="dp-sunday" class="demo__label">Sunday start</label>
        <p class="demo__description">
          Locale <code>en-US</code>, week begins Sunday.
        </p>
      </div>
      <div class="demo__field">
        <DatePicker
          input-id="dp-sunday"
          v-model="sundayStart"
          :first-day-of-week="0"
          locale="en-US"
          placeholder="MM/DD/YYYY"
        />
        <output class="demo__output">
          {{ sundayStart ? `selected — ${sundayStart}` : 'no selection' }}
        </output>
      </div>
    </section>

    <section class="demo">
      <div class="demo__meta">
        <label for="dp-bounds" class="demo__label">Bounded</label>
        <p class="demo__description">
          Constrained to {{ minIso }} → {{ maxIso }} (today: {{ today }}).
        </p>
      </div>
      <div class="demo__field">
        <DatePicker
          input-id="dp-bounds"
          v-model="valueWithBounds"
          :min-date="minIso"
          :max-date="maxIso"
          placeholder="In-range only"
        />
        <output class="demo__output">
          {{ valueWithBounds ? `selected — ${valueWithBounds}` : 'no selection' }}
        </output>
      </div>
    </section>

    <footer class="page-footer">
      <p class="footer-line">
        <span class="footer-label">Keyboard</span>
        <kbd>Enter</kbd> / <kbd>↓</kbd> open
        <span class="sep">·</span>
        <kbd>Esc</kbd> close
        <span class="sep">·</span>
        <kbd>← → ↑ ↓</kbd> navigate
        <span class="sep">·</span>
        <kbd>Enter</kbd> select
      </p>
    </footer>
  </main>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 96px 32px 64px;
  font-family: var(--dp-font-sans);
  color: var(--dp-color-fg);
}

.page-header {
  margin-bottom: 64px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--dp-color-rule);
}

.title {
  margin: 0 0 12px;
  font-family: var(--dp-font-display);
  font-weight: 500;
  font-size: clamp(36px, 6vw, 56px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--dp-color-fg);
}

.subtitle {
  margin: 0;
  max-width: 52ch;
  font-size: 16px;
  line-height: 1.55;
  color: var(--dp-color-muted);
}

.demo {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  align-items: flex-start;
  padding: 28px 0;
  border-bottom: 1px dashed var(--dp-color-rule);
}

.demo:last-of-type {
  border-bottom: 0;
}

.demo__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
}

.demo__label {
  font-family: var(--dp-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: var(--dp-color-fg);
  letter-spacing: -0.01em;
}

.demo__description {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--dp-color-muted);
}

.demo__description code {
  font-family: var(--dp-font-mono);
  font-size: 12px;
  color: var(--dp-color-fg);
  background: var(--dp-color-hover);
  padding: 1px 5px;
  border-radius: 3px;
}

.demo__field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo__output {
  font-family: var(--dp-font-mono);
  font-size: 12px;
  color: var(--dp-color-muted);
  letter-spacing: 0.01em;
  font-variant-numeric: tabular-nums;
}

.page-footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--dp-color-rule);
}

.footer-line {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-family: var(--dp-font-sans);
  font-size: 12px;
  color: var(--dp-color-muted);
}

.footer-label {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 500;
  margin-right: 8px;
}

.sep {
  color: var(--dp-color-rule);
}

kbd {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  font-family: var(--dp-font-mono);
  font-size: 11px;
  color: var(--dp-color-fg);
  background: var(--dp-color-surface);
  border: 1px solid var(--dp-color-border);
  border-bottom-width: 2px;
  border-radius: 3px;
}

@media (max-width: 600px) {
  .page {
    padding: 64px 20px 48px;
  }
  .demo {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .demo__meta {
    padding-top: 0;
  }
}
</style>
