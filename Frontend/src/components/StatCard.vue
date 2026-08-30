<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <div class="stat-card">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.stat-label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-text);
}
</style>