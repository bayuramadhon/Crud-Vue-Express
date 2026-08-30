<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Product, ProductFormData } from "../types/product";

const props = defineProps<{ productToEdit: Product | null }>();
const emit = defineEmits<{ submit: [payload: ProductFormData]; close: [] }>();

const form = reactive<ProductFormData>({
  name: "", category: "", price: null, stock: null, description: "",
});
const errors = reactive<Record<string, string>>({});

// Kalau productToEdit berubah (misal user klik Edit di baris beda), isi ulang form.
watch(
  () => props.productToEdit,
  (product) => {
    if (product) {
      form.name = product.name;
      form.category = product.category;
      form.price = product.price;
      form.stock = product.stock;
      form.description = product.description;
    } else {
      form.name = ""; form.category = ""; form.price = null;
      form.stock = null; form.description = "";
    }
  },
  { immediate: true }
);

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.name.trim()) errors.name = "Nama produk wajib diisi";
  if (!form.category.trim()) errors.category = "Kategori wajib diisi";
  if (form.price === null || form.price < 0) errors.price = "Harga harus angka >= 0";
  if (form.stock === null || form.stock < 0) errors.stock = "Stok harus angka >= 0";
  return Object.keys(errors).length === 0;
}

function handleSubmit() {
  if (!validate()) return;
  emit("submit", { ...form });
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h2>{{ productToEdit ? "Edit Produk" : "Tambah Produk" }}</h2>
        <button type="button" class="icon-btn" @click="emit('close')">&times;</button>
      </header>

      <form class="form" @submit.prevent="handleSubmit" novalidate>
        <div class="field">
          <label for="name">Nama Produk</label>
          <input id="name" v-model="form.name" type="text" placeholder="Contoh: Keyboard Mekanikal" />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <div class="field">
          <label for="category">Kategori</label>
          <input id="category" v-model="form.category" type="text" placeholder="Contoh: Elektronik" />
          <span v-if="errors.category" class="error">{{ errors.category }}</span>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="price">Harga (Rp)</label>
            <input id="price" v-model.number="form.price" type="number" min="0" placeholder="0" />
            <span v-if="errors.price" class="error">{{ errors.price }}</span>
          </div>
          <div class="field">
            <label for="stock">Stok</label>
            <input id="stock" v-model.number="form.stock" type="number" min="0" placeholder="0" />
            <span v-if="errors.stock" class="error">{{ errors.stock }}</span>
          </div>
        </div>

        <div class="field">
          <label for="description">Deskripsi</label>
          <textarea id="description" v-model="form.description" rows="3" placeholder="Opsional"></textarea>
        </div>

        <div class="actions">
          <button type="button" class="btn btn-ghost" @click="emit('close')">Batal</button>
          <button type="submit" class="btn btn-primary">
            {{ productToEdit ? "Simpan Perubahan" : "Tambah Produk" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(15, 23, 32, 0.5); display: grid; place-items: center; z-index: 50; padding: 1rem; }
.modal { background: var(--color-surface); border-radius: 16px; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 70px rgba(15, 23, 32, 0.3); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border); }
.modal-header h2 { margin: 0; font-family: var(--font-display); font-size: 1.25rem; }
.icon-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-muted); }
.form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
.field-row { display: flex; gap: 1rem; }
label { font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted); }
input, textarea {
  border: 1px solid var(--color-border); border-radius: 8px; padding: 0.6rem 0.75rem;
  font-size: 0.92rem; font-family: inherit; color: var(--color-text); background: var(--color-bg);
}
input:focus, textarea:focus { outline: none; border-color: var(--color-accent-dark); box-shadow: 0 0 0 3px var(--color-accent-soft); }
.error { color: var(--color-danger); font-size: 0.78rem; }
.actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.5rem; }
</style>