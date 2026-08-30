<script setup lang="ts">
defineProps<{ category: string }>();
</script>

<template>
  <span class="badge">{{ category }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-dark);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>