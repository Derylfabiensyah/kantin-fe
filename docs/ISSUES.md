# 📋 Daftar Issue & Tugas Fitur Frontend (`kantin-fe`)

Dokumen ini memuat daftar lengkap **16 Issue Tugas per Fitur** untuk tim frontend `kantin-fe`:
- **Pilar 1 (@wibisanabama)**: Fondasi, Auth, dan Layar Kasir POS
- **Pilar 2 (@Derylfabiensyah)**: Back Office Menu, Stok, Barang Masuk, Opname & HPP
- **Pilar 3 (@Mayoranz)**: Kasir TU, Kartu Tamu, Saldo, Pengaturan & Laporan Excel

Template UI: [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin)
Stack: React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + TanStack Router & Query + shadcn/ui

---

## 📌 PILAR 1: Fondasi, Auth & Layar Kasir POS (@wibisanabama)

---

### Issue #01: `[FE-CORE] Scaffolding Project berbasis satnaing/shadcn-admin & Mock API Layer`
- **Assignee**: `@wibisanabama`
- **Labels**: `frontend`, `core`, `setup`
- **Referensi PRD**: §4, §11.1–11.11

#### Deskripsi Fitur
Inisialisasi repositori frontend `kantin-fe` menggunakan template [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin). Setup ini menjadi pondasi seluruh pilar fitur dan memastikan keseragaman visual dengan portal SKOOLIA.

#### Rincian Tugas & File
1. **Inisialisasi Template**:
   - Clone / adopsi template `satnaing/shadcn-admin` ke direktori `kantin-fe`.
   - Bersihkan halaman dan route demo (tasks, apps dummy, dll.).
   - Pastikan build toolchain (Vite 7, React 19, TypeScript ~5.9, Tailwind CSS v4) dapat berjalan bersih.
2. **Design System & Components**:
   - Verifikasi komponen dasar Radix UI / `shadcn/ui` di `src/components/ui/` (Button, Input, Dialog, Table, Badge, Card, Sheet, Dropdown, Sonner Toast).
   - Pastikan theme switcher (dark/light mode) berjalan normal.
3. **Mock API Layer**:
   - Buat layer mock menggunakan Axios Mock Adapter atau MSW di `src/mocks/` dan `src/lib/apiClient.ts`.
   - Tambahkan env flag `VITE_USE_MOCK=true` pada `.env.example` agar tim dapat menguji UI secara independen dari backend.
4. **Layout Setup**:
   - Konfigurasi 2 layout utama:
     * `src/layouts/BackofficeLayout.tsx` (sidebar + header admin-be style).
     * `src/layouts/KasirLayout.tsx` (fullscreen kiosk mode tanpa sidebar).

#### Kriteria Selesai (DoD)
- [ ] `npm run dev` dan `npm run build` berhasil tanpa error.
- [ ] Komponen shadcn-admin render sempurna.
- [ ] Layer mock API aktif saat `VITE_USE_MOCK=true`.
- [ ] Pull Request `feat/core-scaffold-shadcn-admin` siap direview.

---

### Issue #02: `[FE-AUTH] Login Staf, JWT Token Storage, & RBAC Route Guard`
- **Assignee**: `@wibisanabama`
- **Labels**: `frontend`, `auth`, `security`
- **Referensi PRD**: §3, §4, §9.6

#### Deskripsi Fitur
Implementasi modul otentikasi staf kantin yang memanggil endpoint login `admin-be`, verifikasi token JWT RS256, penyimpanan sesi di secure client state, serta perlindungan route berdasarkan role SKOOLIA.

#### Rincian Tugas & File
1. **Halaman Login**:
   - Form login di `src/features/auth/LoginPage.tsx` (Email/Username + Password + Sekolah ID).
   - Validasi form menggunakan `react-hook-form` + `zod`.
2. **State & Token Management**:
   - `src/features/auth/useAuthStore.ts` (Zustand): menyimpan token JWT, profil staf (`userId`, `nama`, `sekolahId`, `roles`).
   - Axios request interceptor: otomatis menyematkan `Authorization: Bearer <token>` pada setiap request ke `kantin-be`.
   - Axios response interceptor: penanganan error 401 (token kedaluwarsa) diarahkan kembali ke `/login`.
3. **Route Guard & RBAC**:
   - Guard route TanStack Router di `src/routes/_auth.tsx`.
   - Pengecekan role:
     * `Petugas Kantin`: akses ke `/kasir`.
     * `Pengelola Kantin`: akses ke `/backoffice/menu`, `/backoffice/stok`.
     * `TU`: akses ke `/backoffice/tu`, `/backoffice/kartu-tamu`.
     * `Bendahara`: akses ke seluruh backoffice + laporan keuangan.
     * `Admin Sekolah`: akses penuh ke konfigurasi dan kontrol siswa.

#### Kriteria Selesai (DoD)
- [ ] Staf berhasil login dan diarahkan ke halaman yang sesuai perannya.
- [ ] Pengguna tanpa token otomatis diredirect ke `/login`.
- [ ] Role yang tidak berhak mengakses halaman tertentu dicegah dengan tampilan Unauthorized / 403.
- [ ] Pull Request `feat/auth-jwt-rbac` siap direview.

---

### Issue #03: `[FE-KASIR] Katalog Menu POS, Pencarian, Filter Kategori, & Keranjang Belanja`
- **Assignee**: `@wibisanabama`
- **Labels**: `frontend`, `kasir`, `pos`
- **Referensi PRD**: §6.1, §6.2

#### Deskripsi Fitur
Halaman antarmuka POS (`/kasir`) layar penuh: grid kartu menu, badge stok, badge "Habis" jika stok 0 (tombol disabled), filter per kategori makanan/minuman, pencarian cepat, serta keranjang belanja responsif.

#### Rincian Tugas & File
1. **Grid Katalog Menu**:
   - `src/features/kasir/components/MenuGrid.tsx` & `MenuItemCard.tsx`.
   - Menampilkan foto menu, nama, harga (rupiah integer), badge stok, dan badge "Habis".
   - Jika stok = 0, item berstatus nonaktif dan tidak bisa diklik.
2. **Pencarian & Filter Kategori**:
   - Tab / pill kategori (Makanan Berat, Snack, Minuman Manis, dll.).
   - Input search dengan shortcut keyboard (misal: tombol `/` untuk fokus cari).
3. **Keranjang Belanja (Cart)**:
   - `src/stores/useCartStore.ts` (Zustand): item list, qty increment/decrement, remove item, clear cart.
   - Panel keranjang `CartSidebar.tsx` di sisi kanan layar kasir.
   - Penghitungan subtotal per item dan Total Belanja dalam Rupiah integer.

#### Kriteria Selesai (DoD)
- [ ] Menu dengan stok 0 tidak dapat ditambahkan ke keranjang.
- [ ] Keranjang belanja menghitung total secara akurat tanpa floating point error.
- [ ] UI nyaman dioperasikan baik dengan mouse maupun touchscreen tablet kasir.
- [ ] Pull Request `feat/kasir-pos-catalog-cart` siap direview.

---

### Issue #04: `[FE-KASIR] Integrasi RFID USB Reader, Web Audio Beep Engine, & Transaksi Tap Otomatis`
- **Assignee**: `@wibisanabama`
- **Labels**: `frontend`, `kasir`, `rfid`, `audio`
- **Referensi PRD**: §4 (poin 3), §6.1, §6.2, §11.2, §11.8

#### Deskripsi Fitur
Penerimaan tap kartu RFID reader USB (Keyboard Wedge burst detector + modal fallback manual UID); Web Audio API synthesizer untuk suara beep sukses dan gagal; pengiriman transaksi dengan idempotency key `UUIDv4`; eksekusi 6 validasi server; dan overlay modal hasil transaksi (foto, nama, kelas siswa 3 detik + tombol "Batalkan" darurat).

#### Rincian Tugas & File
1. **Hook RFID Reader**:
   - `src/hooks/useRfidScanner.ts`: mendeteksi keyboard burst input dari USB reader RFID yang diakhiri `Enter`.
   - Modal input UID manual untuk kebutuhan testing / reader darurat (`ManualRfidModal.tsx`).
2. **Web Audio Synthesizer**:
   - `src/hooks/useBeepAudio.ts`:
     * Suara sukses: nada frekuensi tinggi C5-G5 (800Hz - 1200Hz, durasi ~150ms).
     * Suara gagal: nada ganda frekuensi rendah (220Hz buzz, durasi ~300ms).
     * Dibuat murni dengan `AudioContext` browser tanpa file external MP3.
3. **Alur Checkout Tap**:
   - Klien men-generate `idempotency_key` (UUIDv4) baru setiap checkout.
   - Panggil API `POST /api/v1/kasir/transaksi`:
     ```json
     {
       "idempotency_key": "uuid-v4",
       "kartu_uid": "04A1B2C3D4",
       "titik_kasir_id": 1,
       "items": [{ "menu_id": 10, "qty": 2 }]
     }
     ```
   - Penanganan error validasi 6 tahap:
     * Kartu tidak dikenal
     * Kartu diblokir
     * Item diblokir orang tua
     * Stok tidak cukup
     * Melebihi limit harian
     * **Saldo kurang Rp X** (tampilkan kekurangan nominal secara mencolok).
4. **Modal Feedback Siswa**:
   - `StudentFeedbackModal.tsx`: Tampilkan foto siswa ukuran besar, nama lengkap, dan kelas.
   - Countdown otomatis 3 detik lalu reset keranjang.
   - Tombol **Batalkan**: petugas dapat membatalkan transaksi seketika jika wajah tidak cocok dengan pemilik kartu.

#### Kriteria Selesai (DoD)
- [ ] Tap reader USB langsung memproses transaksi tanpa klik konfirmasi tambahan.
- [ ] Transaksi sukses memutar beep sukses dan menampilkan foto siswa 3 detik.
- [ ] Transaksi gagal memutar beep gagal dan menampilkan pesan error merah (nominal saldo kurang akurat).
- [ ] Tap ganda tidak memicu transaksi ganda berkat idempotency key.
- [ ] Pull Request `feat/kasir-rfid-audio-checkout` siap direview.

---

### Issue #05: `[FE-KASIR] Riwayat Sesi Kasir, Void Transaksi Hari Ini, & Tutup Kasir Harian`
- **Assignee**: `@wibisanabama`
- **Labels**: `frontend`, `kasir`, `void`, `sesi`
- **Referensi PRD**: §6.3, §6.4, §6.5

#### Deskripsi Fitur
Modal riwayat transaksi dalam sesi kasir yang sedang berjalan; fitur pembatalan transaksi (Void) pada sesi terbuka dengan alasan wajib; fitur Tutup Kasir harian dengan ringkasan rekapitulasi; serta deteksi status koneksi dan banner offline.

#### Rincian Tugas & File
1. **Riwayat Sesi Kasir**:
   - Modal drawer `SessionHistoryModal.tsx`: daftar transaksi sesi hari ini (waktu, nama siswa/kartu tamu, item, total, status SUKSES/VOID).
2. **Fitur Void Transaksi**:
   - Tombol "Void" per transaksi: membuka dialog `VoidDialog.tsx`.
   - Pilihan alasan: "Salah input menu", "Pembeli membatalkan", "Kartu dipakai bukan pemiliknya", "Lainnya".
   - Panggil API `POST /api/v1/kasir/transaksi/{id}/void`.
3. **Tutup Kasir Harian**:
   - Tombol "Tutup Kasir" di pojok kasir: membuka `CloseSessionModal.tsx`.
   - Tampilkan rekapitulasi sesi: Total Transaksi, Total Bruto, Total Void, dan **Total Bersih**.
   - Konfirmasi penutupan kasir mengunci transaksi sesi tersebut.
4. **Offline Handling**:
   - `src/components/shared/OfflineBanner.tsx` + hook `useOnlineStatus.ts`.
   - Bila internet terputus: tampilkan banner merah *"Offline — transaksi tidak tersedia"* dan nonaktifkan tombol checkout / tap listener.

#### Kriteria Selesai (DoD)
- [ ] Transaksi yang di-void memperbarui status transaksi dan mengembalikan keranjang/stok.
- [ ] Tutup kasir menampilkan ringkasan sesi akurat dan memanggil endpoint penutupan.
- [ ] Banner offline otomatis muncul saat koneksi jaringan mati dan mencegah transaksi.
- [ ] Pull Request `feat/kasir-sesi-void-tutup` siap direview.

---

## 📌 PILAR 2: Menu, Stok & HPP (@Derylfabiensyah)

---

### Issue #06: `[FE-BACKOFFICE] Layout Dashboard Back Office, Navigasi Sidebar, & Widget Ringkasan`
- **Assignee**: `@Derylfabiensyah`
- **Labels**: `frontend`, `backoffice`, `dashboard`
- **Referensi PRD**: §8.2, §9.6

#### Deskripsi Fitur
Penyusunan shell Back Office (`/backoffice`) menggunakan sidebar dan header template `satnaing/shadcn-admin`, breadcrumbs navigasi, user navigation menu, serta halaman Dashboard Back Office utama dengan widget metrik kunci.

#### Rincian Tugas & File
1. **Layout Shell Backoffice**:
   - `src/layouts/BackofficeLayout.tsx` & `src/components/shared/Sidebar.tsx`.
   - Navigasi sidebar dinamis sesuai role (Menu, Stok, Kasir TU, Kartu Tamu, Saldo & Refund, Kontrol Siswa, Laporan, Pengaturan).
   - Header: profil user, nama sekolah, badge status modul, toggle dark/light mode.
2. **Dashboard Overview**:
   - `src/features/dashboard/DashboardPage.tsx`.
   - Widget:
     * Total Penjualan Hari Ini (Rp).
     * Total Transaksi Hari Ini.
     * Alert Kartu: **"Stok Menipis"** (daftar item dengan stok $\le$ batas minimum).
     * Alert Status: **"Rekonsiliasi Kas"** (indikator seimbang / peringatan selisih).
     * Grafik ringkas tren penjualan 7 hari terakhir (menggunakan Recharts).

#### Kriteria Selesai (DoD)
- [ ] Layout sidebar backoffice responsif (collapsible) dan rapi di desktop & mobile.
- [ ] Dashboard menampilkan kartu metrik dan peringatan stok menipis secara akurat.
- [ ] Breadcrumb navigasi sinkron dengan URL rute.
- [ ] Pull Request `feat/backoffice-layout-dashboard` siap direview.

---

### Issue #07: `[FE-KATALOG] Manajemen Kategori & Katalog Menu Kantin`
- **Assignee**: `@Derylfabiensyah`
- **Labels**: `frontend`, `katalog`, `menu`
- **Referensi PRD**: §7.1, §7.5

#### Deskripsi Fitur
Modul Back Office untuk pengelolaan Kategori Menu dan Katalog Menu Kantin Sekolah (CRUD), termasuk status aktif/nonaktif, batas stok minimum, harga jual rupiah, dan upload/preview foto produk.

#### Rincian Tugas & File
1. **Manajemen Kategori**:
   - `src/features/katalog/KategoriPage.tsx`: daftar kategori menu (Makanan Berat, Snack, Minuman Manis, dll.).
   - Modal tambah/edit kategori (`KategoriFormModal.tsx`): nama kategori, status aktif.
   - Pengecekan: kategori yang masih digunakan oleh menu hanya dapat dinonaktifkan (tidak bisa dihapus).
2. **Katalog Menu**:
   - `src/features/katalog/MenuPage.tsx`: tabel data menu (foto, nama, kategori, harga jual, stok berjalan, satuan, stok minimum, status aktif/nonaktif).
   - Fitur pencarian, filter kategori, dan pagination.
   - Modal formulir menu (`MenuFormModal.tsx`):
     * Nama menu, pilih kategori.
     * Harga jual (input integer rupiah dengan format otomatis Rp).
     * Satuan (pcs, porsi, botol, cup).
     * Ambang stok minimum (peringatan stok menipis).
     * Upload foto produk (preview gambar).
     * Status aktif / nonaktif (soft delete).

#### Kriteria Selesai (DoD)
- [ ] CRUD kategori dan menu berjalan normal dengan validasi Zod.
- [ ] Harga jual tersimpan sebagai integer rupiah (bukan float).
- [ ] Menu yang dinonaktifkan otomatis hilang dari daftar aktif kasir.
- [ ] Pull Request `feat/katalog-menu-kategori` siap direview.

---

### Issue #08: `[FE-STOK] Pencatatan Barang Masuk (Restock) & Barang Masuk Pembalik`
- **Assignee**: `@Derylfabiensyah`
- **Labels**: `frontend`, `stok`, `hpp`
- **Referensi PRD**: §5.1, §7.2, §7.4

#### Deskripsi Fitur
Formulir pencatatan pembelian stok baru (barang masuk) dari pemasok/supplier; penghitungan otomatis simulasi HPP baru dengan rumus rata-rata tertimbang; upload nota pembelian; serta modul koreksi "Barang Masuk Pembalik" jika terjadi salah input.

#### Rincian Tugas & File
1. **Formulir Barang Masuk**:
   - `src/features/stok/BarangMasukPage.tsx` & `src/features/stok/components/BarangMasukForm.tsx`.
   - Field header: Tanggal pembelian, Nama Pemasok (opsional), Upload Foto Nota/Faktur.
   - Tabel dinamis item:
     * Pilih menu dari katalog.
     * Input Qty masuk.
     * Input Harga beli per unit (rupiah).
     * Total biaya pembelian per item.
2. **Simulasi HPP Baru (Preview)**:
   - Komponen badge/tooltip: $\text{HPP Baru} = \frac{(\text{Stok Lama} \times \text{HPP Lama}) + (\text{Qty Baru} \times \text{Harga Beli})}{\text{Stok Lama} + \text{Qty Baru}}$.
   - Menampilkan estimasi HPP baru sebelum form disubmit.
3. **Riwayat & Barang Masuk Pembalik**:
   - Tabel daftar histori barang masuk.
   - Tombol "Koreksi / Batalkan": membuka modal `BarangMasukPembalikModal.tsx`.
   - Wajib mencantumkan alasan pembatalan; data lama tidak dihapus melainkan membuat transaksi pembalik.

#### Kriteria Selesai (DoD)
- [ ] Restock multi-item berhasil menambah stok di sistem.
- [ ] Simulasi HPP rata-rata tertimbang terhitung akurat sesuai formula matematika PRD.
- [ ] Koreksi salah input barang masuk berhasil membuat entri pembalik dengan alasan wajib.
- [ ] Pull Request `feat/stok-barang-masuk-hpp` siap direview.

---

### Issue #09: `[FE-STOK] Stok Opname Fisik & Pencatatan Barang Rusak/Basi Harian`
- **Assignee**: `@Derylfabiensyah`
- **Labels**: `frontend`, `stok`, `opname`
- **Referensi PRD**: §7.3

#### Deskripsi Fitur
Modul audit fisik inventaris (Stok Opname) secara berkala dan modul penyesuaian barang rusak/basi/kedaluwarsa harian dengan pencatatan selisih dan alasan wajib.

#### Rincian Tugas & File
1. **Stok Opname Fisik**:
   - `src/features/stok/StokOpnamePage.tsx` & `OpnameInputTable.tsx`.
   - Menampilkan daftar semua item menu, stok sistem saat ini, kolom input **Stok Fisik Aktual**.
   - Kalkulasi otomatis: Selisih Qty (Fisik - Sistem) dan Nilai Selisih (Qty Selisih $\times$ HPP).
   - Dropdown alasan wajib per baris yang berselisih: `Rusak`, `Kedaluwarsa`, `Hilang`, `Salah Hitung`, `Lainnya`.
2. **Pencatatan Barang Rusak Harian**:
   - `src/features/stok/BarangRusakPage.tsx` & `BarangRusakModal.tsx`.
   - Form cepat untuk mencatat item yang rusak/basi di luar sesi opname (misal: 5 porsi nasi tidak terjual dan basi di akhir hari).
   - Memilih menu, jumlah qty rusak, alasan, dan catatan.

#### Kriteria Selesai (DoD)
- [ ] Selisih stok dan nilai kerugian (Rp) terhitung otomatis.
- [ ] Form menolak submit jika ada baris berselisih yang belum diisi alasannya.
- [ ] Pencatatan barang rusak langsung mengurangi stok berjalan.
- [ ] Pull Request `feat/stok-opname-barang-rusak` siap direview.

---

### Issue #10: `[FE-STOK] Kartu Stok per Item & Laporan Inventaris Nilai Persediaan`
- **Assignee**: `@Derylfabiensyah`
- **Labels**: `frontend`, `stok`, `kartu-stok`
- **Referensi PRD**: §5, §7.5, §9.5

#### Deskripsi Fitur
Tampilan histori mutasi pergerakan inventaris (Kartu Stok) per item dan halaman laporan persediaan barang kantin lengkap dengan total nilai aset persediaan (stok $\times$ HPP).

#### Rincian Tugas & File
1. **Kartu Stok per Menu**:
   - `src/features/stok/KartuStokPage.tsx` & `KartuStokTimeline.tsx`.
   - Filter pemilihan menu dan rentang tanggal.
   - Tabel mutasi kronologis:
     * Tanggal & Jam.
     * Jenis Mutasi (`BARANG_MASUK`, `PENJUALAN`, `VOID`, `OPNAME_MASUK`, `OPNAME_KELUAR`).
     * Qty Masuk / Keluar.
     * Saldo Stok Akhir Berjalan.
     * Snapshot HPP & Nama Petugas/Aktor.
2. **Tabel Inventaris Persediaan**:
   - `src/features/stok/InventarisPage.tsx`.
   - Ringkasan seluruh barang: Stok Saat Ini, HPP Terakhir, Nilai Persediaan Total (Stok $\times$ HPP), dan Status Stok (Aman / Menipis / Habis).

#### Kriteria Selesai (DoD)
- [ ] Saldo berjalan pada kartu stok konsisten dan terverifikasi dari awal hingga akhir periode.
- [ ] Nilai persediaan total terhitung tepat.
- [ ] Filter tanggal dan pencarian item menu bekerja cepat.
- [ ] Pull Request `feat/stok-kartu-stok-inventaris` siap direview.

---

## 📌 PILAR 3: Kasir TU, Kartu Tamu, Saldo & Laporan (@Mayoranz)

---

### Issue #11: `[FE-TU] Kasir TU: Top-up Saldo Tunai Siswa & Cetak Nota Slip Bukti`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `tu`, `saldo`
- **Referensi PRD**: §5, §6.7, §9.2

#### Deskripsi Fitur
Modul layanan TU untuk pengisian saldo tunai siswa (satu-satunya titik penerimaan uang tunai kantin); pencarian siswa via NIS/nama atau tap kartu RFID; pengecekan batas maksimal saldo; dan pencetakan bukti setor bernomor unik.

#### Rincian Tugas & File
1. **Pencarian Siswa**:
   - `src/features/tu/TopupTunaiPage.tsx` & `StudentSearchCard.tsx`.
   - Input autokomplit NIS / Nama Siswa atau tap kartu RFID pada reader TU.
   - Menampilkan detail siswa: Foto, Nama, Kelas, dan Saldo Saat Ini.
2. **Form Pengisian Saldo**:
   - Tombol nominal preset (Rp20.000, Rp50.000, Rp100.000, Rp200.000) dan input nominal bebas.
   - Input "Nama Penyetor" (Orang Tua / Wali / Siswa).
   - Validasi: Saldo saat ini + Nominal top-up tidak boleh melebihi Batas Saldo Maksimal Sekolah (misal: Rp1.000.000).
3. **Cetak Slip Bukti Transaksi**:
   - Modal `PrintSlipModal.tsx`: Tampilan nota slip bukti setor dengan nomor referensi unik, tanggal, nama petugas TU, nominal, dan saldo baru.
   - Fitur cetak langsung (browser print style thermal 58mm/80mm atau PDF).

#### Kriteria Selesai (DoD)
- [ ] Top-up tunai berhasil menambah saldo siswa secara instan.
- [ ] Sistem menolak jika top-up melampaui batas maksimum saldo.
- [ ] Slip bukti setor dapat dicetak dengan format rapi dan nomor referensi jelas.
- [ ] Pull Request `feat/tu-topup-tunai-slip` siap direview.

---

### Issue #12: `[FE-KARTU] Manajemen Kartu Tamu (Registrasi, Top-up, Pengembalian/Refund, Blokir Hilang)`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `kartu-tamu`, `tu`
- **Referensi PRD**: §2.1, §6.9, §9.4

#### Deskripsi Fitur
Modul Back Office TU untuk mengelola Kartu Tamu RFID (digunakan oleh guru, staf, tamu dinas/acara): pendaftaran kartu fisik, pengisian saldo tunai, pengembalian kartu & refund saldo tunai, serta blokir kartu hilang.

#### Rincian Tugas & File
1. **Registrasi Kartu Tamu**:
   - `src/features/kartu-tamu/KartuTamuPage.tsx` & `RegisterKartuModal.tsx`.
   - Tap kartu kosong pada reader $\rightarrow$ sistem men-generate nomor kartu unik (misal: `KT-012`).
   - Input label pemegang (opsional, misal: "Pak Budi Guru Olahraga", atau "Tamu Seminar").
2. **Top-up Saldo Kartu Tamu**:
   - Alur pengisian saldo tunai mirip dengan top-up siswa (saldo terikat ke nomor kartu).
3. **Pengembalian Kartu & Refund Tunai**:
   - `RefundKartuModal.tsx`: Sisa saldo di-refund tunai kepada pemegang, saldo direset menjadi Rp 0, label pemegang dikosongkan, dan kartu siap dipakai kembali.
4. **Penanganan Kartu Hilang**:
   - `BlokirKartuModal.tsx`: Pemegang lapor nomor kartu $\rightarrow$ TU memblokir kartu secara instan $\rightarrow$ opsi memindahkan sisa saldo ke Kartu Tamu baru.
5. **Histori Transaksi Kartu Tamu**:
   - Riwayat transaksi belanja kasir dan mutasi saldo per kartu tamu.

#### Kriteria Selesai (DoD)
- [ ] Registrasi kartu RFID baru menghasilkan nomor kartu berurutan format `KT-xxx`.
- [ ] Pengembalian kartu mereset saldo ke 0 dan mengeluarkan tanda terima refund.
- [ ] Blokir kartu hilang langsung mengubah status kartu menjadi BLOCKED.
- [ ] Pull Request `feat/kartu-tamu-manajemen` siap direview.

---

### Issue #13: `[FE-TU] Rekapitulasi Setoran Kas TU Harian & Mutasi Koreksi Bendahara`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `tu`, `bendahara`, `kas`
- **Referensi PRD**: §5, §6.8, §6.10, §9.2

#### Deskripsi Fitur
Modul rekapitulasi penerimaan uang tunai harian per petugas TU untuk diserahkan ke Bendahara; pencatatan selisih kas fisik; serta modul mutasi koreksi bendahara untuk memperbaiki kesalahan input pada sesi yang sudah ditutup.

#### Rincian Tugas & File
1. **Setoran Kas TU Harian**:
   - `src/features/tu/SetoranKasPage.tsx`.
   - Rekap penerimaan top-up tunai per petugas TU per tanggal.
   - Modal konfirmasi Bendahara (`KonfirmasiSetoranModal.tsx`):
     * Total uang tunai menurut sistem.
     * Input nominal uang fisik yang diserahkan.
     * Pencatatan selisih kas (jika ada lebih/kurang uang fisik, selisih dicatat dalam audit log tanpa dihapus).
2. **Mutasi Koreksi Bendahara**:
   - `src/features/saldo-refund/KoreksiBendaharaPage.tsx` & `KoreksiMutasiModal.tsx`.
   - Digunakan khusus oleh role Bendahara untuk:
     * Mengoreksi salah input top-up tunai.
     * Mengoreksi transaksi belanja pada sesi kasir yang sudah ditutup.
   - Wajib menyertakan alasan pembetulan (audit trail terjaga).

#### Kriteria Selesai (DoD)
- [ ] Rekap harian menyajikan rincian top-up tunai per petugas dengan benar.
- [ ] Selisih kas fisik tercatat rapi pada laporan setoran.
- [ ] Koreksi bendahara mencatat entri mutasi pembalik dengan alasan audit.
- [ ] Pull Request `feat/tu-setoran-koreksi-bendahara` siap direview.

---

### Issue #14: `[FE-SALDO] Refund Siswa Lulus/Keluar & Kontrol Siswa atas Nama Ortu`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `bendahara`, `admin`, `saldo`
- **Referensi PRD**: §6.11, §6.13, §8.6, §9.3

#### Deskripsi Fitur
Modul otomatis menampilkan daftar siswa nonaktif (lulus/pindah/keluar) yang masih memiliki sisa saldo; opsi refund uang ke orang tua atau transfer saldo ke saudara kandung yang aktif; serta modul Admin Sekolah untuk mengatur limit belanja dan larangan menu bagi siswa yang orang tuanya belum memakai aplikasi mobile.

#### Rincian Tugas & File
1. **Refund Siswa Keluar / Lulus**:
   - `src/features/saldo-refund/RefundSiswaKeluarPage.tsx`.
   - Daftar siswa nonaktif dengan saldo $> 0$.
   - Opsi A: **Refund ke Orang Tua** (tunai/transfer bank, input nomor rekening & upload bukti).
   - Opsi B: **Pindahkan ke Saudara Kandung** (`PindahSaldoModal.tsx`: cari adik/kakak di sekolah yang sama, saldo dipindahkan).
   - Setelah diproses, saldo siswa menjadi Rp 0 dan kartu RFID lama otomatis diblokir permanen.
2. **Kontrol Siswa atas Nama Orang Tua**:
   - `src/features/kontrol-siswa/KontrolSiswaPage.tsx` & `LimitBlokirForm.tsx`.
   - Memilih siswa $\rightarrow$ Pengaturan batas limit belanja harian (Rp atau Tanpa Limit).
   - Blokir menu tertentu: centang kategori (misal: "Minuman Manis") atau item spesifik (misal: "Kopi Botol").
   - Berlaku seketika di kasir.

#### Kriteria Selesai (DoD)
- [ ] Refund siswa nonaktif mengosongkan saldo dan memblokir kartu secara otomatis.
- [ ] Pindah saldo ke saudara kandung mentransfer saldo secara atomik.
- [ ] Batasan limit dan blokir menu tersimpan dan langsung berlaku pada validasi kasir.
- [ ] Pull Request `feat/saldo-refund-kontrol-siswa` siap direview.

---

### Issue #15: `[FE-CONFIG] Pengaturan Kantin Sekolah & Manajemen Titik Kasir`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `admin`, `pengaturan`
- **Referensi PRD**: §6.6, §9.1, §10

#### Deskripsi Fitur
Halaman pengaturan modul kantin (Admin Sekolah): konfigurasi operasional, waktu tutup kasir otomatis, langkah konfirmasi manual, durasi tampil foto, batas saldo; serta pengelolaan perangkat Titik Kasir.

#### Rincian Tugas & File
1. **Pengaturan Operasional Kantin**:
   - `src/features/pengaturan/PengaturanKantinPage.tsx`.
   - Nama Kantin Sekolah.
   - Jam Tutup Kasir Otomatis (default `23:59`).
   - Toggle Langkah Konfirmasi Manual (default: nonaktif).
   - Durasi Tampil Foto Siswa Setelah Transaksi (default: `3` detik, dapat diubah 1–10 detik).
   - Batas Minimum & Maksimum Sekali Top-up (Rp).
   - Batas Saldo Maksimum per Siswa dan per Kartu Tamu (Rp).
2. **Manajemen Titik Kasir**:
   - `src/features/pengaturan/TitikKasirPage.tsx` & `TitikKasirFormModal.tsx`.
   - Tabel titik kasir (Nama Titik, Kode Perangkat, Status Aktif).
   - CRUD titik kasir (misal: "Kasir 1 - Pintu Timur", "Kasir 2 - Pujasera").

#### Kriteria Selesai (DoD)
- [ ] Form konfigurasi tervalidasi dan tersimpan di database kantin-be.
- [ ] Pengaturan jam tutup dan durasi foto tersinkronisasi ke klien kasir.
- [ ] Titik kasir baru dapat dibuat dan dipilih oleh petugas di layar kasir.
- [ ] Pull Request `feat/pengaturan-kantin-titik-kasir` siap direview.

---

### Issue #16: `[FE-LAPORAN] Pusat Laporan Keuangan, Rekonsiliasi Saldo, & Ekspor Excel`
- **Assignee**: `@Mayoranz`
- **Labels**: `frontend`, `laporan`, `excel`, `akuntansi`
- **Referensi PRD**: §5, §9.5, §11.1

#### Deskripsi Fitur
Modul laporan terpadu untuk Bendahara, Kepala Sekolah, dan Pengelola: Laporan Rekonsiliasi Harian (Invariant Saldo), Laporan Saldo Mengendap, Laporan Penjualan & Laba Kotor, Laporan Kerugian Stok, dan Riwayat Belanja per Siswa; dengan tombol Ekspor Excel (.xlsx) di semua laporan.

#### Rincian Tugas & File
1. **Laporan Rekonsiliasi Harian**:
   - `src/features/laporan/LaporanRekonsiliasiPage.tsx`.
   - Memeriksa invariant akuntansi:
     $$\sum \text{Topup} - \sum \text{Refund} = \sum \text{Saldo Siswa} + \sum \text{Saldo Kartu Tamu} + \sum \text{Penjualan Bersih}$$
   - Jika ada ketidakcocokan: tampilkan **Banner Peringatan Merah Mencolok** beserta nilai selisihnya.
2. **Laporan Penjualan & Laba Kotor**:
   - `src/features/laporan/LaporanPenjualanPage.tsx` & `LaporanLabaKotorPage.tsx`.
   - Penjualan bersih, total HPP, dan Laba Kotor ($\text{Penjualan} - \text{HPP}$) per menu, per kategori, per kasir, dan per periode tanggal.
3. **Laporan Saldo Mengendap**:
   - Total dana titipan siswa + kartu tamu yang menjadi kewajiban sekolah.
4. **Laporan Riwayat Belanja per Siswa**:
   - Pencarian siswa untuk memeriksa histori transaksi lengkap (membantu menjawab komplain orang tua).
5. **Ekspor Excel (.xlsx)**:
   - `src/lib/excelExport.ts`: utility fungsi ekspor menggunakan library `xlsx`.
   - Format tabel terstruktur, header rapi, dan nominal terformat mata uang.

#### Kriteria Selesai (DoD)
- [ ] Laporan rekonsiliasi menampilkan indikator status seimbang atau selisih merah secara akurat.
- [ ] Seluruh tabel laporan dapat diekspor ke file Excel (.xlsx) dan diunduh tanpa error.
- [ ] Filter rentang tanggal dan pencarian bekerja responsif.
- [ ] Pull Request `feat/laporan-rekonsiliasi-excel` siap direview.
