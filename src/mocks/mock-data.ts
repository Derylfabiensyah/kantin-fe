/**
 * Initial Mock Data untuk pengembangan lokal kantin-fe
 */

export interface MenuItemMock {
  id: number
  nama: string
  kategori_id: number
  kategori_nama: string
  harga_jual: number
  stok: number
  stok_minimum: number
  satuan: string
  foto_url?: string
  is_active: boolean
  hpp: number
}

export interface KategoriMock {
  id: number
  nama: string
  is_active: boolean
  jumlah_item: number
}

export interface KartuSiswaMock {
  uid: string
  siswa_id: number
  nis: string
  nama: string
  kelas: string
  foto_url: string
  saldo: number
  limit_harian: number
  belanja_hari_ini: number
  is_blocked: boolean
  blocked_items?: number[]
}

export interface KartuTamuMock {
  id: number
  nomor_kartu: string
  uid: string
  label_pemegang: string
  saldo: number
  is_active: boolean
  created_at: string
}

export const MOCK_KATEGORI: KategoriMock[] = [
  { id: 1, nama: 'Makanan Berat', is_active: true, jumlah_item: 4 },
  { id: 2, nama: 'Snack & Roti', is_active: true, jumlah_item: 4 },
  { id: 3, nama: 'Minuman Dingin', is_active: true, jumlah_item: 4 },
  { id: 4, nama: 'Minuman Hangat', is_active: true, jumlah_item: 2 },
]

export const MOCK_MENU: MenuItemMock[] = [
  {
    id: 1,
    nama: 'Nasi Uduk Komplit',
    kategori_id: 1,
    kategori_nama: 'Makanan Berat',
    harga_jual: 12000,
    stok: 25,
    stok_minimum: 5,
    satuan: 'porsi',
    foto_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    is_active: true,
    hpp: 8000,
  },
  {
    id: 2,
    nama: 'Nasi Goreng Ayam',
    kategori_id: 1,
    kategori_nama: 'Makanan Berat',
    harga_jual: 15000,
    stok: 18,
    stok_minimum: 5,
    satuan: 'porsi',
    foto_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    is_active: true,
    hpp: 10000,
  },
  {
    id: 3,
    nama: 'Mie Goreng Spesial',
    kategori_id: 1,
    kategori_nama: 'Makanan Berat',
    harga_jual: 10000,
    stok: 0, // Habis untuk test badge "Habis"
    stok_minimum: 5,
    satuan: 'porsi',
    foto_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    is_active: true,
    hpp: 6500,
  },
  {
    id: 4,
    nama: 'Ayam Geprek Sambal Bawang',
    kategori_id: 1,
    kategori_nama: 'Makanan Berat',
    harga_jual: 14000,
    stok: 12,
    stok_minimum: 5,
    satuan: 'porsi',
    foto_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    is_active: true,
    hpp: 9500,
  },
  {
    id: 5,
    nama: 'Roti Cokelat Keju',
    kategori_id: 2,
    kategori_nama: 'Snack & Roti',
    harga_jual: 5000,
    stok: 30,
    stok_minimum: 8,
    satuan: 'pcs',
    foto_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    is_active: true,
    hpp: 3200,
  },
  {
    id: 6,
    nama: 'Pastel Goreng Renyah',
    kategori_id: 2,
    kategori_nama: 'Snack & Roti',
    harga_jual: 3500,
    stok: 15,
    stok_minimum: 5,
    satuan: 'pcs',
    foto_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
    is_active: true,
    hpp: 2200,
  },
  {
    id: 7,
    nama: 'Risoles Mayo',
    kategori_id: 2,
    kategori_nama: 'Snack & Roti',
    harga_jual: 4000,
    stok: 3, // Stok menipis (< stok_minimum)
    stok_minimum: 5,
    satuan: 'pcs',
    foto_url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400',
    is_active: true,
    hpp: 2500,
  },
  {
    id: 8,
    nama: 'Donat Gula Halus',
    kategori_id: 2,
    kategori_nama: 'Snack & Roti',
    harga_jual: 4000,
    stok: 20,
    stok_minimum: 5,
    satuan: 'pcs',
    foto_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    is_active: true,
    hpp: 2400,
  },
  {
    id: 9,
    nama: 'Es Teh Manis',
    kategori_id: 3,
    kategori_nama: 'Minuman Dingin',
    harga_jual: 4000,
    stok: 40,
    stok_minimum: 10,
    satuan: 'cup',
    foto_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    is_active: true,
    hpp: 1800,
  },
  {
    id: 10,
    nama: 'Air Mineral 600ml',
    kategori_id: 3,
    kategori_nama: 'Minuman Dingin',
    harga_jual: 4000,
    stok: 50,
    stok_minimum: 12,
    satuan: 'botol',
    foto_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400',
    is_active: true,
    hpp: 2800,
  },
  {
    id: 11,
    nama: 'Jus Jeruk Segar',
    kategori_id: 3,
    kategori_nama: 'Minuman Dingin',
    harga_jual: 7000,
    stok: 15,
    stok_minimum: 5,
    satuan: 'cup',
    foto_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    is_active: true,
    hpp: 4200,
  },
  {
    id: 12,
    nama: 'Susu UHT Cokelat',
    kategori_id: 3,
    kategori_nama: 'Minuman Dingin',
    harga_jual: 6000,
    stok: 24,
    stok_minimum: 8,
    satuan: 'kotak',
    foto_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    is_active: true,
    hpp: 4500,
  },
]

export const MOCK_SISWA: KartuSiswaMock[] = [
  {
    uid: '04A1B2C3D4',
    siswa_id: 101,
    nis: '2026001',
    nama: 'Budi Santoso',
    kelas: 'X IPA 1',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    saldo: 45000,
    limit_harian: 30000,
    belanja_hari_ini: 10000,
    is_blocked: false,
  },
  {
    uid: '04B2C3D4E5',
    siswa_id: 102,
    nis: '2026002',
    nama: 'Siti Rahmawati',
    kelas: 'XI IPS 2',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    saldo: 5000, // Saldo sedikit untuk test validasi "Saldo kurang"
    limit_harian: 25000,
    belanja_hari_ini: 0,
    is_blocked: false,
  },
  {
    uid: '04C3D4E5F6',
    siswa_id: 103,
    nis: '2026003',
    nama: 'Ahmad Fauzi',
    kelas: 'XII IPA 3',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    saldo: 80000,
    limit_harian: 35000,
    belanja_hari_ini: 0,
    is_blocked: true, // Untuk test validasi "Kartu diblokir"
  },
]

export const MOCK_KARTU_TAMU: KartuTamuMock[] = [
  {
    id: 1,
    nomor_kartu: 'KT-001',
    uid: '04KT01A1',
    label_pemegang: 'Pak Hartono (Guru Fisika)',
    saldo: 75000,
    is_active: true,
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 2,
    nomor_kartu: 'KT-002',
    uid: '04KT02B2',
    label_pemegang: 'Ibu Ratna (Staf TU)',
    saldo: 50000,
    is_active: true,
    created_at: '2026-10-01T08:30:00Z',
  },
  {
    id: 3,
    nomor_kartu: 'KT-003',
    uid: '04KT03C3',
    label_pemegang: 'Tamu Seminar Pengawas',
    saldo: 20000,
    is_active: true,
    created_at: '2026-10-02T09:00:00Z',
  },
]
