CRUD Manajemen Produk — Vue 3 + TypeScript + Express

Aplikasi web full-stack untuk mengelola data produk (tambah, lihat, ubah, hapus) dengan REST API buatan sendiri. Dibuat sebagai project portofolio untuk mempraktikkan alur kerja frontend-backend yang terpisah namun saling terhubung lewat HTTP.

Fitur
Tambah, lihat, ubah, dan hapus data produk secara real-time tanpa reload halaman
Pencarian produk berdasarkan nama atau kategori
Ringkasan statistik (total produk, total stok, total nilai inventori)
Validasi input di sisi frontend maupun backend
Konfirmasi sebelum menghapus data
Tech Stack

Frontend

Vue 3 (Composition API, <script setup>)
TypeScript
Vite
Axios

Backend

Node.js + Express
TypeScript
SQLite (node:sqlite, modul bawaan Node.js — tanpa driver database eksternal)
Struktur Project
├── Backend/     → REST API (Express + TypeScript + SQLite)
└── Frontend/    → Single Page App (Vue 3 + TypeScript)
Cara Menjalankan di Lokal

Dibutuhkan Node.js versi 22.5 atau lebih baru.

1. Clone repository

git clone https://github.com/bayuramadhon/Crud-Vue-Express.git
cd Crud-Vue-Express

2. Jalankan backend

cd Backend
npm install
npm run dev

Server berjalan di http://localhost:3000.

3. Jalankan frontend (di terminal terpisah)

cd Frontend
npm install
npm run dev

Buka http://localhost:5173 di browser.

Endpoint API
Method	Endpoint	Deskripsi
GET	/api/products	Ambil semua produk
GET	/api/products/:id	Ambil satu produk
POST	/api/products	Tambah produk baru
PUT	/api/products/:id	Update produk
DELETE	/api/products/:id	Hapus produk