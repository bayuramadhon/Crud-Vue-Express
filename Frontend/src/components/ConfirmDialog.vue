<script setup lang="ts">
defineProps<{ productName: string }>();
const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <div class="overlay" @click.self="emit('cancel')">
    <div class="dialog" role="alertdialog" aria-modal="true">
      <h3>Hapus produk ini?</h3>
      <p>Produk <strong>{{ productName }}</strong> akan dihapus permanen.</p>
      <div class="actions">
        <button type="button" class="btn btn-ghost" @click="emit('cancel')">Batal</button>
        <button type="button" class="btn btn-danger" @click="emit('confirm')">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 32, 0.5);
  display: grid; place-items: center;
  z-index: 50; padding: 1rem;
}
.dialog {
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1.5rem;
  max-width: 380px; width: 100%;
  box-shadow: 0 20px 60px rgba(15, 23, 32, 0.25);
}
.dialog h3 { margin: 0 0 0.5rem; font-family: var(--font-display); }
.dialog p { margin: 0 0 1.25rem; color: var(--color-text-muted); font-size: 0.9rem; }
.actions { display: flex; justify-content: flex-end; gap: 0.6rem; }
</style>