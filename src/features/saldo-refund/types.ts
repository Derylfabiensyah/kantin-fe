import { z } from 'zod'
import type { SiswaNonaktifMock, SiblingMock } from '@/mocks/mock-data'

export type { SiswaNonaktifMock, SiblingMock }

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
