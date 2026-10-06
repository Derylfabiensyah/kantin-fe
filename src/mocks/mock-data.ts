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
  limit_harian_enabled?: boolean
  belanja_hari_ini: number
  is_blocked: boolean
  blocked_items?: number[]
  blocked_categories?: number[]
  parent_name?: string
  parent_phone?: string
  parent_app_registered?: boolean
  catatan_kontrol?: string
  updated_at?: string
}

export interface SiblingMock {
  siswa_id: number
  nis: string
  nama: string
  kelas: string
  foto_url?: string
  saldo: number
  rfid_uid: string
  is_blocked: boolean
}

export interface SiswaNonaktifMock {
  siswa_id: number
  nis: string
  nama: string
  kelas_terakhir: string
  foto_url: string
  saldo: number
  status_siswa: 'LULUS' | 'PINDAH' | 'KELUAR'
  tanggal_nonaktif: string
  alasan_nonaktif: string
  rfid_uid: string
  is_card_blocked: boolean
  nama_ortu: string
  kontak_ortu: string
  no_rekening_ortu?: string
  bank_ortu?: string
  saudara_kandung?: SiblingMock[]
  is_refunded?: boolean
  refund_info?: {
    tipe: 'REFUND_ORTU' | 'TRANSFER_SAUDARA'
    metode?: 'TUNAI' | 'TRANSFER_BANK'
    nominal: number
    tanggal: string
    referensi_id: string
    keterangan: string
    bank?: string
    nomor_rekening?: string
    nama_rekening?: string
    bukti_url?: string
    saudara_tujuan_id?: number
    saudara_tujuan_nama?: string
  }
}

export interface KartuTamuMock {
  id: number
  nomor_kartu: string
  uid: string
  label_pemegang: string
  saldo: number
  is_active: boolean
  status: 'ACTIVE' | 'BLOCKED' | 'AVAILABLE'
  created_at: string
  last_used_at?: string
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
    limit_harian_enabled: true,
    belanja_hari_ini: 10000,
    is_blocked: false,
    blocked_items: [1], // Nasi Uduk Komplit
    blocked_categories: [],
    parent_name: 'Hendra Santoso',
    parent_phone: '0812-3456-7890',
    parent_app_registered: false, // Belum instal mobile app -> butuh kontrol admin
    catatan_kontrol: 'Permintaan via WA: Kurangi konsumsi nasi berlebihan.',
    updated_at: '2026-10-05T14:20:00Z',
  },
  {
    uid: '04B2C3D4E5',
    siswa_id: 102,
    nis: '2026002',
    nama: 'Siti Rahmawati',
    kelas: 'XI IPS 2',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    saldo: 5000,
    limit_harian: 25000,
    limit_harian_enabled: true,
    belanja_hari_ini: 0,
    is_blocked: false,
    blocked_items: [],
    blocked_categories: [3], // Minuman Dingin diblokir kategori
    parent_name: 'Rahmawati Ibu',
    parent_phone: '0813-9876-5432',
    parent_app_registered: false, // Belum instal mobile app -> butuh kontrol admin
    catatan_kontrol: 'Siswa batuk pilek kronis, larang semua minuman dingin.',
    updated_at: '2026-10-04T09:15:00Z',
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
    limit_harian_enabled: true,
    belanja_hari_ini: 0,
    is_blocked: true, // Untuk test validasi "Kartu diblokir"
    blocked_items: [],
    blocked_categories: [],
    parent_name: 'Fauzi Bapak',
    parent_phone: '0811-2233-4455',
    parent_app_registered: true, // Sudah instal mobile app
    updated_at: '2026-10-02T11:00:00Z',
  },
  {
    uid: '04D4E5F6A1',
    siswa_id: 104,
    nis: '2026004',
    nama: 'Cantika Kirana',
    kelas: 'X IPS 1',
    foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    saldo: 65000,
    limit_harian: 0,
    limit_harian_enabled: false, // Tanpa Limit
    belanja_hari_ini: 5000,
    is_blocked: false,
    blocked_items: [],
    blocked_categories: [],
    parent_name: 'Dewi Lestari',
    parent_phone: '0857-1234-5678',
    parent_app_registered: false, // Belum instal mobile app
    catatan_kontrol: 'Orang tua memperbolehkan belanja tanpa batasan nominal.',
    updated_at: '2026-10-06T08:00:00Z',
  },
  {
    uid: '04E5F6A1B2',
    siswa_id: 105,
    nis: '2026005',
    nama: 'Rizky Ramadhan',
    kelas: 'XI IPA 1',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    saldo: 75000,
    limit_harian: 20000,
    limit_harian_enabled: true,
    belanja_hari_ini: 15000,
    is_blocked: false,
    blocked_items: [3, 9], // Mie Goreng & Es Teh Manis
    blocked_categories: [],
    parent_name: 'Bambang Ramadhan',
    parent_phone: '0878-5544-3322',
    parent_app_registered: false, // Belum instal mobile app
    catatan_kontrol: 'Batasan jajan ketat maksimal Rp 20.000 / hari.',
    updated_at: '2026-10-05T16:45:00Z',
  },
]

export const MOCK_SISWA_NONAKTIF: SiswaNonaktifMock[] = [
  {
    siswa_id: 201,
    nis: '2023015',
    nama: 'Raditya Pratama',
    kelas_terakhir: 'XII IPA 1 (Lulus 2026)',
    foto_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    saldo: 125000,
    status_siswa: 'LULUS',
    tanggal_nonaktif: '2026-06-25',
    alasan_nonaktif: 'Lulus Tahun Ajaran 2025/2026',
    rfid_uid: '04RD01A9',
    is_card_blocked: false, // Kartu lama belum diblokir, wajib diblokir otomatis saat refund
    nama_ortu: 'Hendra Santoso',
    kontak_ortu: '0812-3456-7890',
    bank_ortu: 'BCA',
    no_rekening_ortu: '8830192831',
    saudara_kandung: [
      {
        siswa_id: 101,
        nis: '2026001',
        nama: 'Budi Santoso',
        kelas: 'X IPA 1',
        foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        saldo: 45000,
        rfid_uid: '04A1B2C3D4',
        is_blocked: false,
      },
    ],
    is_refunded: false,
  },
  {
    siswa_id: 202,
    nis: '2024088',
    nama: 'Nadya Putri',
    kelas_terakhir: 'XI IPS 1 (Pindah Sekolah)',
    foto_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    saldo: 85000,
    status_siswa: 'PINDAH',
    tanggal_nonaktif: '2026-09-12',
    alasan_nonaktif: 'Pindah Domisili ke SMAN 2 Surabaya',
    rfid_uid: '04ND02B8',
    is_card_blocked: false,
    nama_ortu: 'Rahmawati Ibu',
    kontak_ortu: '0813-9876-5432',
    bank_ortu: 'BRI',
    no_rekening_ortu: '012901004928503',
    saudara_kandung: [
      {
        siswa_id: 102,
        nis: '2026002',
        nama: 'Siti Rahmawati',
        kelas: 'XI IPS 2',
        foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        saldo: 5000,
        rfid_uid: '04B2C3D4E5',
        is_blocked: false,
      },
    ],
    is_refunded: false,
  },
  {
    siswa_id: 203,
    nis: '2023042',
    nama: 'Kevin Sanjaya',
    kelas_terakhir: 'XII IPA 2 (Lulus 2026)',
    foto_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    saldo: 210000,
    status_siswa: 'LULUS',
    tanggal_nonaktif: '2026-06-25',
    alasan_nonaktif: 'Lulus Tahun Ajaran 2025/2026',
    rfid_uid: '04KV03C7',
    is_card_blocked: false,
    nama_ortu: 'Sanjaya Putra',
    kontak_ortu: '0812-1122-3344',
    bank_ortu: 'MANDIRI',
    no_rekening_ortu: '1420019283741',
    saudara_kandung: [], // Tanpa saudara kandung aktif di sekolah ini -> opsi refund ke ortu
    is_refunded: false,
  },
  {
    siswa_id: 204,
    nis: '2025102',
    nama: 'Dimas Anggara',
    kelas_terakhir: 'X IPS 3 (Keluar)',
    foto_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    saldo: 35000,
    status_siswa: 'KELUAR',
    tanggal_nonaktif: '2026-08-19',
    alasan_nonaktif: 'Pengunduran Diri Siswa',
    rfid_uid: '04DM04D6',
    is_card_blocked: false,
    nama_ortu: 'Linda Sari',
    kontak_ortu: '0815-6677-8899',
    bank_ortu: 'BNI',
    no_rekening_ortu: '0982341234',
    saudara_kandung: [],
    is_refunded: false,
  },
  {
    siswa_id: 205,
    nis: '2023099',
    nama: 'Cantika Dewi',
    kelas_terakhir: 'XII IPS 3 (Lulus 2026)',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    saldo: 0,
    status_siswa: 'LULUS',
    tanggal_nonaktif: '2026-06-25',
    alasan_nonaktif: 'Lulus Tahun Ajaran 2025/2026',
    rfid_uid: '04CD05E5',
    is_card_blocked: true, // Sudah diblokir
    nama_ortu: 'Hendra Saputra',
    kontak_ortu: '0812-8877-6655',
    is_refunded: true,
    refund_info: {
      tipe: 'REFUND_ORTU',
      metode: 'TRANSFER_BANK',
      nominal: 150000,
      tanggal: '2026-07-01T10:30:00Z',
      referensi_id: 'REFUND-LULUS-20260701-1002',
      keterangan: 'Refund sisa saldo kelulusan via transfer BCA',
      bank: 'BCA',
      nomor_rekening: '5220192831',
      nama_rekening: 'Hendra Saputra',
    },
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
    status: 'ACTIVE',
    created_at: '2026-10-01T08:00:00Z',
    last_used_at: '2026-10-04T12:30:00Z',
  },
  {
    id: 2,
    nomor_kartu: 'KT-002',
    uid: '04KT02B2',
    label_pemegang: 'Ibu Ratna (Staf TU)',
    saldo: 50000,
    is_active: true,
    status: 'ACTIVE',
    created_at: '2026-10-01T08:30:00Z',
    last_used_at: '2026-10-05T08:10:00Z',
  },
  {
    id: 3,
    nomor_kartu: 'KT-003',
    uid: '04KT03C3',
    label_pemegang: 'Tamu Seminar Pengawas',
    saldo: 20000,
    is_active: true,
    status: 'ACTIVE',
    created_at: '2026-10-02T09:00:00Z',
    last_used_at: '2026-10-02T13:45:00Z',
  },
  {
    id: 4,
    nomor_kartu: 'KT-004',
    uid: '04KT04D4',
    label_pemegang: 'Pak Bambang (Satpam)',
    saldo: 0,
    is_active: false,
    status: 'BLOCKED',
    created_at: '2026-10-01T09:00:00Z',
    last_used_at: '2026-10-03T11:00:00Z',
  },
  {
    id: 5,
    nomor_kartu: 'KT-005',
    uid: '04KT05E5',
    label_pemegang: '',
    saldo: 0,
    is_active: false,
    status: 'AVAILABLE',
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 6,
    nomor_kartu: 'KT-006',
    uid: '04KT06F6',
    label_pemegang: 'Ibu Sari (Kepala TU)',
    saldo: 100000,
    is_active: true,
    status: 'ACTIVE',
    created_at: '2026-10-03T07:30:00Z',
    last_used_at: '2026-10-05T07:55:00Z',
  },
]
