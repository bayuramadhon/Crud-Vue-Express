import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

// Pastikan folder "data" ada, tempat file database SQLite akan disimpan secara fisik.
const dataDir = path.join(__dirname, "..", "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "products.db");

// DatabaseSync bersifat SINKRON, jadi query langsung dapat hasil tanpa await.
export const db = new DatabaseSync(dbPath);

// Bikin tabel "products" kalau belum ada, lalu isi 3 data contoh biar gak kosong.
export function runMigrations(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const row = db.prepare("SELECT COUNT(*) as total FROM products").get() as { total: number };
  if (row.total === 0) {
    const insert = db.prepare(`
      INSERT INTO products (name, category, price, stock, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run("Keyboard Mekanikal 87 Key", "Aksesoris Komputer", 650000, 25, "Keyboard mekanikal dengan switch blue, RGB backlight.");
    insert.run("Mouse Wireless Ergonomis", "Aksesoris Komputer", 220000, 40, "Mouse nirkabel dengan desain ergonomis.");
    insert.run("Monitor LED 24 Inch", "Elektronik", 1850000, 12, "Monitor Full HD 24 inci, refresh rate 75Hz.");
  }
}