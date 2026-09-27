# Kriya Nusantara PKWU — Showcase & Katalog Produk

Website showcase/portofolio produk kelompok PKWU (Prakarya dan Kewirausahaan) berbasis React + Tailwind CSS, dengan panel admin terintegrasi Supabase untuk mengelola data produk.

## Struktur Proyek

```
kriya-nusantara-pkwu/
├── index.html              # Entry HTML (memuat font Google: Fraunces & Inter)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example             # Contoh konfigurasi Supabase
├── .gitignore
└── src/
    ├── main.jsx              # Entry point React
    ├── App.jsx                # Seluruh komponen aplikasi (single-file)
    └── index.css              # Tailwind directives + style tambahan
```

## Cara Menjalankan

1. Ekstrak file zip, lalu masuk ke folder project:
   ```bash
   cd kriya-nusantara-pkwu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Opsional) Aktifkan Supabase — salin `.env.example` menjadi `.env` lalu isi:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   Tanpa langkah ini, aplikasi tetap berjalan normal menggunakan data lokal (mock data) — cocok untuk demo cepat.

4. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser.

5. Build untuk produksi:
   ```bash
   npm run build
   npm run preview
   ```

## Setup Supabase

1. Buat project di [Supabase](https://supabase.com/) dan tunggu sampai project siap.
2. Buka **Project Settings > API** (atau **Connect**) lalu salin Project URL dan publishable/anon key.
3. Buka **SQL Editor**, tempel seluruh isi `supabase-schema.sql`, lalu jalankan.
4. Pastikan tabel `showcase_products`, `showcase_reviews`, dan `showcase_documentation` tersedia, dan Storage memiliki bucket publik bernama `product-images`. Skrip SQL membuat tabel, bucket, serta policy yang dibutuhkan aplikasi.
5. Untuk pengembangan lokal, salin `.env.example` ke `.env`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan nilai project tadi. Jangan masukkan `service_role` key ke file `.env` frontend.

Skema mencakup kolom galeri `documentation` dan `infographic` bertipe `jsonb`. Jika project Supabase sudah memiliki tabel lama, jalankan skrip yang sama untuk menambahkan kolom yang belum ada.

Foto pada section dokumentasi disimpan sebagai daftar URL di tabel `showcase_documentation`, sedangkan file fotonya disimpan di bucket Storage. Menjalankan `supabase-schema.sql` yang terbaru akan membuat tabel dan policy ini; foto lama di `localStorage` browser akan dicoba dipindahkan saat aplikasi berikutnya terhubung ke Supabase.

## Deploy ke Netlify

Konfigurasi build sudah disimpan di `netlify.toml` (`npm run build`, direktori hasil `dist`).

1. Push branch yang akan diterbitkan ke GitHub.
2. Di Netlify, pilih **Add new site > Import an existing project**, hubungkan GitHub, lalu pilih repository dan branch.
3. Pastikan build command `npm run build` dan publish directory `dist` (otomatis diambil dari `netlify.toml`).
4. Sebelum deploy, buka **Site configuration > Environment variables** dan tambahkan:
   - `VITE_SUPABASE_URL` = Project URL Supabase.
   - `VITE_SUPABASE_ANON_KEY` = publishable/anon key Supabase.
5. Jalankan deploy. Jika environment variable diubah setelahnya, picu deploy baru agar nilainya masuk ke build frontend.
6. Buka URL Netlify dan uji pemuatan produk/ulasan serta unggah gambar. Pastikan URL Supabase dan bucket `product-images` benar.

## Catatan Keamanan Sebelum Publikasi

`VITE_*` adalah nilai publik yang disertakan ke bundle browser. Gunakan hanya publishable/anon key, tidak pernah `service_role` key. Saat ini kata sandi admin ditanam langsung dalam kode frontend dan policy pada `supabase-schema.sql` mengizinkan anon membaca serta mengubah produk, ulasan, dan gambar. Karena itu panel admin bukan autentikasi yang aman dan siapa pun dapat mengakses operasi tulis melalui API. Konfigurasi ini hanya cocok untuk demo dengan data non-sensitif. Untuk penggunaan publik, pindahkan admin ke Supabase Auth dan ubah policy RLS agar operasi tulis hanya untuk pengguna admin terautentikasi sebelum membuka akses pengelolaan data.

## Struktur Tabel Supabase (jika ingin mengaktifkan CRUD penuh)

Buat tabel bernama `showcase_products` dengan kolom berikut:

| Kolom             | Tipe        |
|-------------------|-------------|
| id                | text (PK)   |
| name              | text        |
| category          | text        |
| image_url         | text        |
| description       | text        |
| specs             | text        |
| process           | text        |
| documentation     | jsonb       |
| infographic       | jsonb       |
| created_at        | timestamptz (default now()) |

Buat tabel bernama `showcase_reviews` dengan kolom berikut:

| Kolom      | Tipe                        |
|------------|-----------------------------|
| id         | text (PK)                   |
| name       | text                        |
| role       | text                        |
| rating     | int                         |
| comment    | text                        |
| blocked    | boolean DEFAULT false       |
| reply      | text                        |
| created_at | timestamptz DEFAULT now()   |

Atau gunakan skrip SQL di `supabase-schema.sql` untuk membuat kedua tabel secara otomatis.

## Login Admin

- Klik tombol **Admin** di navigasi.
- Kata sandi demo saat ini ditulis langsung di `src/App.jsx` pada konstanta `ADMIN_PASSWORD`. Nilai ini dapat dilihat siapa pun dari kode/bundle dan bukan perlindungan akses yang aman; jangan gunakan panel ini untuk mengamankan operasi pada data publik.

## Kontak WhatsApp

Nomor WhatsApp perwakilan kelompok dapat diubah pada konstanta `GROUP_PROFILE.waNumber` di `src/App.jsx`.
