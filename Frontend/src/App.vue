<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { productService } from "./services/api";
import type { Product, ProductFormData } from "./types/product";

import ProductTable from "./components/ProductTable.vue";
import ProductFormModal from "./components/ProductFormModal.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import StatCard from "./components/StatCard.vue";

const products = ref<Product[]>([]);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const searchQuery = ref("");

const isFormOpen = ref(false);
const productBeingEdited = ref<Product | null>(null);
const productPendingDelete = ref<Product | null>(null);

const toast = ref<{ type: "success" | "error"; text: string } | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(type: "success" | "error", text: string) {
  toast.value = { type, text };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 3000);
}

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return products.value;
  return products.value.filter(
    (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );
});

const totalProducts = computed(() => products.value.length);
const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0));
const totalInventoryValue = computed(() => products.value.reduce((sum, p) => sum + p.price * p.stock, 0));

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

async function loadProducts() {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    products.value = await productService.getAll();
  } catch (err) {
    errorMessage.value = "Gagal memuat data produk. Pastikan server backend berjalan di port 3000.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

function openCreateForm() {
  productBeingEdited.value = null;
  isFormOpen.value = true;
}
function openEditForm(product: Product) {
  productBeingEdited.value = product;
  isFormOpen.value = true;
}
function closeForm() {
  isFormOpen.value = false;
  productBeingEdited.value = null;
}

async function handleFormSubmit(payload: ProductFormData) {
  try {
    if (productBeingEdited.value) {
      const updated = await productService.update(productBeingEdited.value.id, payload);
      const index = products.value.findIndex((p) => p.id === updated.id);
      if (index !== -1) products.value[index] = updated;
      showToast("success", "Produk berhasil diperbarui");
    } else {
      const created = await productService.create(payload);
      products.value.unshift(created);
      showToast("success", "Produk berhasil ditambahkan");
    }
    closeForm();
  } catch (err) {
    showToast("error", "Gagal menyimpan produk. Coba lagi.");
    console.error(err);
  }
}

function askDeleteConfirmation(product: Product) {
  productPendingDelete.value = product;
}
function cancelDelete() {
  productPendingDelete.value = null;
}
async function confirmDelete() {
  if (!productPendingDelete.value) return;
  const id = productPendingDelete.value.id;
  try {
    await productService.remove(id);
    products.value = products.value.filter((p) => p.id !== id);
    showToast("success", "Produk berhasil dihapus");
  } catch (err) {
    showToast("error", "Gagal menghapus produk. Coba lagi.");
    console.error(err);
  } finally {
    productPendingDelete.value = null;
  }
}

onMounted(loadProducts);
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Portofolio &mdash; CRUD Application</p>
        <h1>Manajemen Produk</h1>
        <p class="subtitle">Kelola katalog produk: tambah, ubah, cari, dan hapus data lewat REST API.</p>
      </div>
      <button type="button" class="btn btn-primary" @click="openCreateForm">+ Tambah Produk</button>
    </header>

    <section class="stats">
      <StatCard label="Total Produk" :value="String(totalProducts)" />
      <StatCard label="Total Stok" :value="String(totalStock)" />
      <StatCard label="Nilai Inventori" :value="formatRupiah(totalInventoryValue)" />
    </section>

    <section class="toolbar">
      <input v-model="searchQuery" type="search" class="search-input" placeholder="Cari nama produk atau kategori..." />
    </section>

    <section>
      <div v-if="isLoading" class="state-message">Memuat data produk...</div>
      <div v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</div>
      <ProductTable v-else :products="filteredProducts" @edit="openEditForm" @delete="askDeleteConfirmation" />
    </section>

    <ProductFormModal v-if="isFormOpen" :product-to-edit="productBeingEdited" @submit="handleFormSubmit" @close="closeForm" />
    <ConfirmDialog v-if="productPendingDelete" :product-name="productPendingDelete.name" @confirm="confirmDelete" @cancel="cancelDelete" />
    <div v-if="toast" :class="['toast', toast.type]">{{ toast.text }}</div>
  </div>
</template>

<style scoped>
.page { max-width: 1040px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.eyebrow { margin: 0 0 0.35rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-accent-dark); }
.page-header h1 { margin: 0 0 0.4rem; font-family: var(--font-display); font-size: 2rem; }
.subtitle { margin: 0; color: var(--color-text-muted); max-width: 480px; font-size: 0.92rem; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.toolbar { margin-bottom: 1rem; }
.search-input { width: 100%; max-width: 320px; padding: 0.6rem 0.9rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.9rem; background: var(--color-surface); color: var(--color-text); }
.state-message { padding: 2.5rem; text-align: center; color: var(--color-text-muted); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 14px; }
.state-message.error { color: var(--color-danger); }
.toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); padding: 0.75rem 1.25rem; border-radius: 10px; font-size: 0.88rem; font-weight: 600; color: white; box-shadow: 0 12px 30px rgba(15, 23, 32, 0.25); z-index: 100; }
.toast.success { background: var(--color-accent-dark); }
.toast.error { background: var(--color-danger); }
</style>