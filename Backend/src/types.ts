// Tipe data untuk satu produk, sesuai dengan struktur tabel "products" di database.
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Payload yang dikirim client saat membuat produk baru.
// Tidak menyertakan id/created_at/updated_at karena itu digenerate oleh server & database.
export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}