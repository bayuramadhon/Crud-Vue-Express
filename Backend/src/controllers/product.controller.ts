import { Request, Response } from "express";
import { db } from "../db";
import { Product } from "../types";

// Ambil semua produk
export function getAllProducts(req: Request, res: Response): void {
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as Product[];
  res.json({ data: rows });
}

// Ambil satu produk berdasarkan id
export function getProductById(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;

  if (!row) {
    res.status(404).json({ message: `Produk dengan id ${id} tidak ditemukan` });
    return;
  }
  res.json({ data: row });
}

// Tambah produk baru
export function createProduct(req: Request, res: Response): void {
  const { name, category, price, stock, description } = req.body;

  const errors: string[] = [];
  if (!name || typeof name !== "string") errors.push("name wajib diisi (string)");
  if (!category || typeof category !== "string") errors.push("category wajib diisi (string)");
  if (price === undefined || isNaN(Number(price))) errors.push("price wajib diisi (angka)");
  if (stock === undefined || isNaN(Number(stock))) errors.push("stock wajib diisi (angka)");

  if (errors.length > 0) {
    res.status(400).json({ message: "Validasi gagal", errors });
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products (name, category, price, stock, description, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);
  const result = insert.run(name, category, Number(price), Number(stock), description ?? "");

  const newProduct = db.prepare("SELECT * FROM products WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as Product;

  res.status(201).json({ data: newProduct, message: "Produk berhasil ditambahkan" });
}

// Update produk yang sudah ada
export function updateProduct(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;

  if (!existing) {
    res.status(404).json({ message: `Produk dengan id ${id} tidak ditemukan` });
    return;
  }

  const {
    name = existing.name,
    category = existing.category,
    price = existing.price,
    stock = existing.stock,
    description = existing.description,
  } = req.body;

  db.prepare(`
    UPDATE products
    SET name = ?, category = ?, price = ?, stock = ?, description = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(name, category, Number(price), Number(stock), description, id);

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product;
  res.json({ data: updated, message: "Produk berhasil diperbarui" });
}

// Hapus produk
export function deleteProduct(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;

  if (!existing) {
    res.status(404).json({ message: `Produk dengan id ${id} tidak ditemukan` });
    return;
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  res.json({ message: "Produk berhasil dihapus" });
}