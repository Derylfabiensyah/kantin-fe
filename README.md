# Kantin Cashless SKOOLIA - Frontend (kantin-fe)

Frontend aplikasi kantin sekolah 100% cashless berbasis template [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin). Terintegrasi dengan ekosistem identitas SKOOLIA dan backend [kantin-be](https://github.com/Zenixu/kantin-be).

---

## Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | React 19 + TypeScript 5.9 | Komponen modern dan type safety |
| Build Tool | Vite 7 (@vitejs/plugin-react) | HMR cepat dan bundling optimal |
| Styling | Tailwind CSS v4 (@tailwindcss/vite) | Utility-first CSS |
| Routing | @tanstack/react-router | Type-safe file-based routing |
| Server State | @tanstack/react-query | Caching dan server synchronization |
| Client State | zustand | State keranjang kasir, sesi, dan RBAC simulator |
| UI Primitives | Radix UI (shadcn/ui) + Lucide Icons | Komponen aksesibel dan responsif |
| Charts | Recharts | Visualisasi metrik penjualan 7 hari |
| Form & Validasi | react-hook-form + zod | Validasi input form terstruktur |
| Notifications | sonner | Toast feedback |
| Exporting | xlsx | Ekspor laporan akuntansi ke format Excel |
| Mock Layer | Custom Axios Mock Adapter | Pengembangan mandiri saat backend offline (VITE_USE_MOCK=true) |

---

## Modul dan Status Implementasi

| Modul | Rute | Deskripsi | Status |
|---|---|---|---|
| Core Scaffolding & Mock | - | Setup template shadcn-admin, Axios client, formatters, dan mock layer | Selesai (#1) |
| Dashboard Backoffice | / dan /backoffice | Metrik penjualan harian, tren 7 hari, alert stok menipis, alert rekonsiliasi kas, dan RBAC simulator | Selesai (#6) |
| Kasir POS Layar Penuh | /kasir | Terminal kasir fullscreen kiosk mode tanpa sidebar pengganggu antrean | Selesai (#1) |
| Layanan Kasir TU | /tu/topup | Pencarian siswa via autokomplit NIS/nama dan simulasi tap RFID, form top-up nominal bebas/preset, limit validasi, dan cetak slip thermal 80mm | Selesai (#11) |
| Katalog & Menu | /menu, /kategori | Manajemen kategori dan menu makanan/minuman | Dalam antrean (#7) |
| Manajemen Stok | /stok/* | Pencatatan barang masuk, kartu stok, dan stok opname | Dalam antrean (#8, #9, #10) |
| Kartu Tamu & Refund | /kartu-tamu, /refund | Peminjaman kartu tamu, refund siswa lulus, dan kontrol limit orang tua | Dalam antrean (#12, #14) |
| Rekonsiliasi & Laporan | /laporan/* | Rekonsiliasi kas harian, laporan laba rugi, dan ekspor excel | Dalam antrean (#13, #16) |

---

## Arsitektur Tampilan

Aplikasi terbagi menjadi dua layout navigasi utama:
1. Layar Kasir POS (/kasir):
   - Layout fullscreen kiosk mode tanpa sidebar yang mendistraksi antrean kasir.
   - Dilengkapi jam digital realtime, status koneksi online/offline, tombol fullscreen, dan tombol kembali ke backoffice.
   - Dipersiapkan untuk integrasi hardware barcode/RFID USB keyboard-wedge dan Web Audio synthesizer.
2. Back Office Kantin (/ dan /backoffice/*):
   - Mengadopsi sidebar responsif collapsible dengan filter navigasi dinamis berbasis role (admin, pengelola, tu, bendahara, kasir).
   - Dilengkapi breadcrumb navigasi otomatis, simulator pergantian role, status indikator modul, pencarian cepat command palette, dan tema gelap/terang.

---

## Panduan Menjalankan Lokal

### 1. Prasyarat
- Node.js versi 20 atau lebih baru
- pnpm (disarankan) atau npm

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Environment
Salin file .env.example menjadi .env:
```bash
cp .env.example .env
```

Nilai konfigurasi default:
```env
# Backend API Kantin
VITE_API_URL=http://localhost:8080

# SKOOLIA Admin BE (Login Staf)
VITE_ADMIN_BE_URL=http://localhost:8081

# Mock API Layer (aktifkan untuk pengembangan mandiri tanpa backend)
VITE_USE_MOCK=true
```

### 4. Menjalankan Server Development
```bash
pnpm dev
```
Aplikasi dapat diakses di http://localhost:5173.

### 5. Typecheck, Linting, dan Build Produksi
```bash
# Typecheck
pnpm exec tsc -b

# Linting
pnpm run lint

# Build produksi
pnpm run build
```


