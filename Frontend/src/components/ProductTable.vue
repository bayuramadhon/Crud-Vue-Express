<script setup lang="ts">
import type { Product } from "../types/product";
import CategoryBadge from "./CategoryBadge.vue";

defineProps<{ products: Product[] }>();
const emit = defineEmits<{ edit: [product: Product]; delete: [product: Product] }>();

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}
</script>

<template>
  <div class="table-wrapper">
    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th>Produk</th><th>Kategori</th>
          <th class="align-right">Harga</th>
          <th class="align-right">Stok</th>
          <th class="align-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-desc">{{ product.description || "—" }}</div>
          </td>
          <td><CategoryBadge :category="product.category" /></td>
          <td class="align-right">{{ formatRupiah(product.price) }}</td>
          <td class="align-right">
            <span :class="['stock', { low: product.stock <= 5 }]">{{ product.stock }}</span>
          </td>
          <td class="align-right">
            <div class="row-actions">
              <button type="button" class="btn btn-ghost btn-sm" @click="emit('edit', product)">Edit</button>
              <button type="button" class="btn btn-danger-ghost btn-sm" @click="emit('delete', product)">Hapus</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <p>Belum ada produk.</p>
      <span>Klik "Tambah Produk" untuk mulai mengisi katalog.</span>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper { background: var(--color-surface); border-radius: 14px; border: 1px solid var(--color-border); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
thead th { text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); padding: 0.9rem 1.25rem; background: var(--color-bg); border-bottom: 1px solid var(--color-border); }
tbody td { padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--color-border); vertical-align: top; font-size: 0.9rem; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: var(--color-bg); }
.align-right { text-align: right; }
.product-name { font-weight: 600; color: var(--color-text); }
.product-desc { font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.15rem; max-width: 320px; }
.stock { font-weight: 600; }
.stock.low { color: var(--color-danger); }
.row-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
.empty-state { padding: 3rem 1.5rem; text-align: center; color: var(--color-text-muted); }
.empty-state p { margin: 0 0 0.25rem; font-weight: 600; color: var(--color-text); }
</style>