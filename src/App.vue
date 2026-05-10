<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue';

const value = ref<string | null>(null);
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
      <label for="dp" class="demo__label">Select a date</label>
      <DatePicker
        input-id="dp"
        v-model="value"
        placeholder="Pick a date"
      />
      <output class="demo__output">
        {{ value ? `selected — ${value}` : 'no selection' }}
      </output>
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
  max-width: 520px;
  margin: 0 auto;
  padding: 96px 32px 64px;
  font-family: var(--dp-font-sans);
  color: var(--dp-color-fg);
}

.page-header {
  margin-bottom: 56px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.demo__label {
  font-family: var(--dp-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: var(--dp-color-fg);
  letter-spacing: -0.01em;
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
}
</style>
