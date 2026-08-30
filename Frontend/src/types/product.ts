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

export interface ProductFormData {
  name: string;
  category: string;
  price: number | null;
  stock: number | null;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}