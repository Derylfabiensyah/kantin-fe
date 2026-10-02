# Kantin Cashless SKOOLIA - Frontend (kantin-fe)

Kantin Cashless SKOOLIA adalah aplikasi antarmuka web untuk operasional transaksi non-tunai kantin sekolah. Aplikasi ini terintegrasi dengan ekosistem identitas SKOOLIA (admin-be) dan backend pencatatan transaksi (kantin-be).

---

## Arsitektur Aplikasi

Aplikasi dibangun menggunakan model antarmuka ganda berbasis TanStack Router:

1. Terminal Kasir POS (/kasir):
   - Dirancang khusus untuk kecepatan pelayanan antrean transaksi tap kartu RFID siswa.
   - Mode layar penuh (kiosk mode) tanpa sidebar navigasi.
   - Dilengkapi sinkronisasi status jaringan, jam operasional, dan integrasi hardware reader RFID USB.

2. Backoffice Pengelola (/ dan /backoffice):
   - Panel manajemen operasional untuk administrator, pengelola kantin, petugas tata usaha, dan bendahara.
   - Navigasi modular berbasis Role-Based Access Control (RBAC).
   - Menyediakan dashboard metrik penjualan harian, pemantauan status rekonsiliasi kas, peringatan stok minimum, dan pengelolaan saldo.

---

## Tech Stack

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| Runtime & Framework | React 19, TypeScript 5.9 | Library UI utama dan pengetikan statis ketat |
| Tooling & Bundler | Vite 7 | Server pengembangan dan bundler produksi |
| Styling | Tailwind CSS v4 | Framework utility styling berbasis CSS modern |
| Routing | @tanstack/react-router | Router berbasis file dengan type safety penuh |
| State Management | Zustand | Manajemen state global untuk antarmuka kasir dan RBAC |
| Server State | @tanstack/react-query | Manajemen cache dan fetching data asynchronous |
| Komponen UI | Radix UI, shadcn/ui, Lucide Icons | Primitif komponen antarmuka yang aksesibel |
| Visualisasi Data | Recharts | Grafik batang dan tren statistik penjualan |
| Form & Validasi | React Hook Form, Zod | Penanganan formulir dan skema validasi data |
| HTTP Client | Axios | Klien HTTP terpusat dengan interceptor Bearer token |
| Utilitas Ekspor | xlsx | Pustaka pembuatan berkas laporan spreadsheet Excel |
| Mock Layer | Custom Axios Adapter | Simulasi respons API untuk pengujian lokal mandiri |

---

## Struktur Direktori

```text
kantin-fe/
├── src/
│   ├── assets/            # Aset statis gambar dan ikon
│   ├── components/        # Komponen UI bersama (shadcn/ui, layout shell, navigasi)
│   ├── context/           # Penyedia konteks React (tema, layout)
│   ├── features/          # Modul fungsional (dashboard, kasir, tu, auth, users)
│   ├── hooks/             # Custom hooks
│   ├── layouts/           # Shell tata letak (BackofficeLayout, KasirLayout)
│   ├── lib/               # Klien API terpusat, fungsi format, dan utilitas umum
│   ├── mocks/             # Mock data dan adapter API untuk pengujian lokal
│   ├── routes/            # Definisi rute berbasis struktur berkas TanStack Router
│   ├── stores/            # State global Zustand (auth, RBAC simulator)
│   ├── styles/            # Berkas CSS global dan tema
│   ├── main.tsx           # Titik masuk aplikasi
│   └── routeTree.gen.ts   # Berkas registrasi rute yang dibuat otomatis oleh compiler
├── .env.example           # Contoh variabel konfigurasi lingkungan
├── package.json           # Dependensi dan skrip proyek
├── tsconfig.json          # Konfigurasi compiler TypeScript
└── vite.config.ts         # Konfigurasi bundler Vite
```

---

## Prasyarat Sistem

- Node.js versi 20.x LTS atau lebih baru
- Package manager pnpm versi 9.x atau npm versi 10.x

---

## Instalasi dan Menjalankan Proyek

1. Kloning repositori dan masuk ke direktori proyek:
   ```bash
   git clone https://github.com/Derylfabiensyah/kantin-fe.git
   cd kantin-fe
   ```

2. Pasang seluruh dependensi:
   ```bash
   pnpm install
   ```

3. Siapkan berkas konfigurasi lingkungan:
   ```bash
   cp .env.example .env
   ```

4. Jalankan server pengembangan:
   ```bash
   pnpm dev
   ```
   Aplikasi aktif pada alamat http://localhost:5173.

---

## Konfigurasi Variabel Lingkungan

Seluruh konfigurasi lingkungan diatur melalui berkas .env:

| Variabel | Tipe | Wajib | Nilai Default | Penjelasan |
|---|---|---|---|---|
| VITE_API_URL | String | Ya | http://localhost:8080 | Alamat endpoint API server backend kantin-be |
| VITE_ADMIN_BE_URL | String | Ya | http://localhost:8081 | Alamat endpoint API autentikasi SKOOLIA admin-be |
| VITE_USE_MOCK | Boolean | Tidak | true | Flag untuk mengaktifkan mock API tanpa dependensi server backend |
| VITE_APP_NAME | String | Tidak | Kantin Cashless SKOOLIA | Nama aplikasi yang ditampilkan pada judul dan antarmuka |

---

## Perintah Pengembangan

| Perintah | Deskripsi |
|---|---|
| pnpm dev | Menjalankan server pengembangan lokal dengan Hot Module Replacement |
| pnpm build | Memvalidasi tipe data TypeScript dan melakukan kompilasi bundel produksi |
| pnpm preview | Menjalankan preview lokal dari hasil kompilasi produksi di folder dist |
| pnpm lint | Menjalankan ESLint untuk memeriksa standar kualitas dan aturan kode |
| pnpm exec tsc -b | Menjalankan pengecekan tipe data TypeScript di seluruh proyek |

---

## Lisensi

Didistribusikan di bawah lisensi MIT sesuai ketentuan template satnaing/shadcn-admin. Informasi lengkap tersedia pada berkas LICENSE.
