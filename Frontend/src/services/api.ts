import axios from "axios";
import type { ApiResponse, Product, ProductFormData } from "../types/product";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>("/products");
    return response.data.data;
  },
  async create(payload: ProductFormData): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>("/products", payload);
    return response.data.data;
  },
  async update(id: number, payload: ProductFormData): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return response.data.data;
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};