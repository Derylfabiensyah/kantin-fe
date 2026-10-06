import { z } from 'zod'
import type { SiswaNonaktifMock, SiblingMock } from '@/mocks/mock-data'

export type { SiswaNonaktifMock, SiblingMock }

// --- Types untuk Refund Siswa Keluar / Lulus (PRD §9.3 & §9.5) ---
export const refundOrangTuaSchema = z.object({
  siswaId: z.number().int().positive('ID siswa tidak valid'),
  nominal: z.number().int().positive('Nominal refund harus lebih dari 0'),
  metode: z.enum(['TUNAI', 'TRANSFER_BANK'], {
    message: 'Pilih metode refund (Tunai atau Transfer Bank)',
  }),
  namaPenerima: z
    .string()
    .trim()
    .min(3, 'Nama penerima minimal 3 karakter')
    .max(100, 'Nama penerima maksimal 100 karakter'),
  kontakPenerima: z
    .string()
    .trim()
    .min(8, 'Nomor kontak/telepon minimal 8 digit')
    .max(20, 'Nomor kontak/telepon maksimal 20 digit'),
  bank: z.string().optional(),
  noRekening: z.string().optional(),
  namaRekening: z.string().optional(),
  buktiUrl: z.string().optional(),
  catatan: z.string().trim().max(255, 'Catatan maksimal 255 karakter').optional(),
}).refine(
  (data) => {
    if (data.metode === 'TRANSFER_BANK') {
      return Boolean(data.bank && data.bank.trim().length > 0)
    }
    return true
  },
  {
    message: 'Nama bank wajib dipilih untuk transfer bank',
    path: ['bank'],
  }
).refine(
  (data) => {
    if (data.metode === 'TRANSFER_BANK') {
      return Boolean(data.noRekening && data.noRekening.trim().length >= 5)
    }
    return true
  },
  {
    message: 'Nomor rekening valid wajib diisi untuk transfer bank',
    path: ['noRekening'],
  }
).refine(
  (data) => {
    if (data.metode === 'TRANSFER_BANK') {
      return Boolean(data.namaRekening && data.namaRekening.trim().length >= 3)
    }
    return true
  },
  {
    message: 'Nama pemilik rekening wajib diisi untuk transfer bank',
    path: ['namaRekening'],
  }
)

export type RefundOrangTuaFormValues = z.infer<typeof refundOrangTuaSchema>

export const pindahSaldoSchema = z.object({
  siswaAsalId: z.number().int().positive('ID siswa asal tidak valid'),
  siswaTujuanId: z.number().int().positive('Pilih saudara kandung yang aktif'),
  nominal: z.number().int().positive('Nominal saldo yang dipindahkan harus lebih dari 0'),
  beritaAcara: z
    .string()
    .trim()
    .min(5, 'Berita acara/keterangan pemindahan minimal 5 karakter')
    .max(255, 'Berita acara maksimal 255 karakter'),
}).refine(
  (data) => data.siswaAsalId !== data.siswaTujuanId,
  {
    message: 'Siswa penerima tidak boleh sama dengan siswa asal',
    path: ['siswaTujuanId'],
  }
)

export type PindahSaldoFormValues = z.infer<typeof pindahSaldoSchema>

export interface RefundSlipData {
  type: 'REFUND_ORTU' | 'TRANSFER_SAUDARA'
  ref_no: string
  waktu: string
  petugas_nama: string
  siswa_asal: {
    siswa_id: number
    nis: string
    nama: string
    kelas_terakhir: string
    rfid_uid?: string
    status_kartu: 'DIBLOKIR_PERMANEN'
  }
  nominal: number
  metode?: 'TUNAI' | 'TRANSFER_BANK'
  nama_penerima?: string
  kontak_penerima?: string
  bank?: string
  nomor_rekening?: string
  nama_rekening?: string
  bukti_url?: string
  siswa_tujuan?: {
    siswa_id: number
    nis: string
    nama: string
    kelas: string
    saldo_awal: number
    saldo_akhir: number
    nominal_diterima: number
  }
  berita_acara?: string
}

// --- Types untuk Koreksi Bendahara (PRD §9.2) ---
export type SubjekTipe = 'SISWA' | 'KARTU_TAMU'
export type JenisKoreksi =
  | 'SALAH_INPUT_TOPUP'
  | 'PEMBALIK_TRANSAKSI_KASIR'
  | 'PENYESUAIAN_AUDIT'
export type ArahMutasi = 'DEBIT' | 'KREDIT'

export interface MutasiKoreksiItem {
  id: string | number
  referensi_id: string
  waktu: string
  subjek_tipe: SubjekTipe
  subjek_id: number
  subjek_nama: string
  subjek_info: string
  jenis_koreksi: JenisKoreksi
  arah: ArahMutasi
  nominal: number
  saldo_sebelum: number
  saldo_setelah: number
  alasan: string
  bendahara_id: number
  bendahara_nama: string
  transaksi_terkait_id?: string | number
  sesi_kasir_id?: number
}

export interface KoreksiSaldoPayload {
  subjekTipe: SubjekTipe
  subjekId: number
  arah: ArahMutasi
  nominal: number
  alasan: string
  referensiId: string
  jenisKoreksi?: JenisKoreksi
  transaksiTerkaitId?: string | number
}

export interface TransaksiSesiTutupItem {
  id: string
  waktu: string
  sesi_kasir_id: number
  titik_kasir: string
  petugas_kasir: string
  subjek_tipe: SubjekTipe
  subjek_id: number
  subjek_nama: string
  subjek_info: string
  total: number
  items: Array<{
    menu_id: number
    nama: string
    qty: number
    harga: number
    subtotal: number
  }>
  status: 'SELESAI' | 'DIKOREKSI'
  koreksi_referensi_id?: string
}
