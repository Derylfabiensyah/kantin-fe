import { describe, it, expect } from 'vitest'
import {
  refundOrangTuaSchema,
  pindahSaldoSchema,
} from './types'

describe('Refund Saldo Orang Tua Zod Validation Schema', () => {
  it('berhasil memvalidasi payload refund tunai yang valid', () => {
    const validData = {
      siswaId: 201,
      nominal: 125000,
      metode: 'TUNAI' as const,
      namaPenerima: 'Hendra Santoso',
      kontakPenerima: '081234567890',
      catatan: 'Pengembalian tunai kelulusan',
    }
    const result = refundOrangTuaSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.nominal).toBe(125000)
      expect(result.data.metode).toBe('TUNAI')
    }
  })

  it('berhasil memvalidasi payload refund transfer bank lengkap', () => {
    const validData = {
      siswaId: 202,
      nominal: 85000,
      metode: 'TRANSFER_BANK' as const,
      namaPenerima: 'Rahmawati Ibu',
      kontakPenerima: '081398765432',
      bank: 'BCA',
      noRekening: '8830192831',
      namaRekening: 'Rahmawati',
      catatan: 'Transfer sisa saldo pindah sekolah',
    }
    const result = refundOrangTuaSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.metode).toBe('TRANSFER_BANK')
      expect(result.data.bank).toBe('BCA')
    }
  })

  it('gagal jika refund transfer bank tidak menyertakan nomor rekening', () => {
    const invalidData = {
      siswaId: 202,
      nominal: 85000,
      metode: 'TRANSFER_BANK' as const,
      namaPenerima: 'Rahmawati Ibu',
      kontakPenerima: '081398765432',
      bank: 'BCA',
      noRekening: '', // Kosong
      namaRekening: 'Rahmawati',
    }
    const result = refundOrangTuaSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('noRekening'))
      expect(issue).toBeDefined()
    }
  })

  it('gagal jika nominal refund bernilai 0 atau negatif', () => {
    const invalidData = {
      siswaId: 201,
      nominal: 0,
      metode: 'TUNAI' as const,
      namaPenerima: 'Hendra Santoso',
      kontakPenerima: '081234567890',
    }
    const result = refundOrangTuaSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Pindah Saldo Saudara Kandung Zod Validation Schema', () => {
  it('berhasil memvalidasi pemindahan saldo antar saudara yang berbeda', () => {
    const validData = {
      siswaAsalId: 201,
      siswaTujuanId: 101,
      nominal: 125000,
      beritaAcara: 'Pemindahan saldo kelulusan kakak ke adik kandung',
    }
    const result = pindahSaldoSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.siswaAsalId).toBe(201)
      expect(result.data.siswaTujuanId).toBe(101)
    }
  })

  it('gagal jika siswa tujuan sama dengan siswa asal', () => {
    const invalidData = {
      siswaAsalId: 101,
      siswaTujuanId: 101, // Sama
      nominal: 50000,
      beritaAcara: 'Transfer ke diri sendiri tidak valid',
    }
    const result = pindahSaldoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('siswaTujuanId'))
      expect(issue?.message).toContain('tidak boleh sama')
    }
  })

  it('gagal jika berita acara terlalu pendek', () => {
    const invalidData = {
      siswaAsalId: 201,
      siswaTujuanId: 101,
      nominal: 50000,
      beritaAcara: 'Trf', // < 5 karakter
    }
    const result = pindahSaldoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
