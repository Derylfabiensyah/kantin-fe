# 🍱 Kantin Cashless SKOOLIA — Frontend (`kantin-fe`)

Frontend aplikasi kantin sekolah 100% cashless berbasis template [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin). Terintegrasi dengan ekosistem identitas SKOOLIA dan backend [kantin-be](https://github.com/Zenixu/kantin-be).

---

## 🚀 Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Framework** | React 19 + TypeScript 5.9 | Komponen modern & type safety |
| **Build Tool** | Vite 7 (`@vitejs/plugin-react`) | HMR super cepat & bundling optimal |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first CSS + CSS variables |
| **Routing** | `@tanstack/react-router` | Type-safe file-based routing |
| **Server State** | `@tanstack/react-query` | Caching & server sync |
| **Client State** | `zustand` | State keranjang kasir, sesi, auth |
| **UI Primitives** | Radix UI (`shadcn/ui`) + Lucide Icons | Aksesibel & responsif |
| **Form & Validasi** | `react-hook-form` + `zod` | Validasi input form terstruktur |
| **Notifications** | `sonner` | Toast feedback cepat |
| **Exporting** | `xlsx` | Ekspor laporan akuntansi ke Excel |
| **Mock Layer** | Custom Axios Mock Adapter | Pengembangan independen (`VITE_USE_MOCK=true`) |

---

## 🏛️ Arsitektur Tampilan

Aplikasi terbagi menjadi 2 layout navigasi:
1. **Layar Kasir POS (`/kasir`)**:
   - Layout fullscreen kiosk mode tanpa sidebar yang mendistraksi antrean.
   - Header minimalis: live clock, status online/offline, tombol fullscreen, dan link ke back office.
   - Siap dihubungkan ke RFID reader USB Keyboard-Wedge dan Web Audio API Beep synthesizer.
2. **Back Office Kantin (`/` & `/backoffice/*`)**:
   - Mengadopsi langsung sidebar responsif collapsible, header breadcrumbs, command palette (`cmdk`), dan dark/light mode dari `satnaing/shadcn-admin`.
   - Mengelola katalog menu, stok inventaris, kasir TU, kartu tamu, refund, dan laporan rekonsiliasi.

---

## 🛠️ Cara Menjalankan Lokal

### 1. Prasyarat
- Node.js $\ge$ 20.x
- `pnpm` (disarankan) atau `npm`

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi default:
```env
# Backend API Kantin
VITE_API_URL=http://localhost:8080

# SKOOLIA Admin BE (Login Staf)
VITE_ADMIN_BE_URL=http://localhost:8081

# Mock API Layer (aktifkan untuk coding tanpa harus menjalankan backend)
VITE_USE_MOCK=true
```

### 4. Menjalankan Server Development
```bash
pnpm dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

### 5. Typecheck & Build Produksi
```bash
pnpm run build
```

---

## 👥 Tim & Pembagian Tugas (16 GitHub Issues)

| Pilar | Anggota | Tanggung Jawab & Issues |
|---|---|---|
| **Pilar 1: Fondasi & Layar Kasir POS** | **@wibisanabama** | [#1](https://github.com/Derylfabiensyah/kantin-fe/issues/1) Core Scaffolding, [#2](https://github.com/Derylfabiensyah/kantin-fe/issues/2) Auth JWT, [#3](https://github.com/Derylfabiensyah/kantin-fe/issues/3) Katalog POS & Cart, [#4](https://github.com/Derylfabiensyah/kantin-fe/issues/4) RFID Hook & Beep, [#5](https://github.com/Derylfabiensyah/kantin-fe/issues/5) Sesi & Void/Tutup Kasir |
| **Pilar 2: Menu, Stok & HPP** | **@Derylfabiensyah** | [#6](https://github.com/Derylfabiensyah/kantin-fe/issues/6) Shell Backoffice & Dashboard, [#7](https://github.com/Derylfabiensyah/kantin-fe/issues/7) Kategori & Menu CRUD, [#8](https://github.com/Derylfabiensyah/kantin-fe/issues/8) Barang Masuk & Pembalik, [#9](https://github.com/Derylfabiensyah/kantin-fe/issues/9) Stok Opname & Barang Rusak, [#10](https://github.com/Derylfabiensyah/kantin-fe/issues/10) Kartu Stok & Nilai Persediaan |
| **Pilar 3: TU, Saldo & Laporan** | **@Mayoranz** | [#11](https://github.com/Derylfabiensyah/kantin-fe/issues/11) Top-up Tunai Siswa, [#12](https://github.com/Derylfabiensyah/kantin-fe/issues/12) Manajemen Kartu Tamu, [#13](https://github.com/Derylfabiensyah/kantin-fe/issues/13) Setoran Kas TU & Koreksi, [#14](https://github.com/Derylfabiensyah/kantin-fe/issues/14) Refund Siswa Keluar & Kontrol, [#15](https://github.com/Derylfabiensyah/kantin-fe/issues/15) Pengaturan Kantin, [#16](https://github.com/Derylfabiensyah/kantin-fe/issues/16) Pusat Laporan & Ekspor Excel |

---

## 📄 Lisensi
MIT License.
