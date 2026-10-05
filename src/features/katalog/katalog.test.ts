import { describe, it, expect } from 'vitest'
import {
  kategoriFormSchema,
  menuFormSchema,
} from './types'

describe('Katalog Kategori Zod Validation Schema', () => {
  it('berhasil memvalidasi nama kategori yang valid', () => {
    const validData = {
      nama: 'Makanan Ringan & Snack',
      urutan: 1,
    }
    const result = kategoriFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.nama).toBe('Makanan Ringan & Snack')
      expect(result.data.urutan).toBe(1)
    }
  })

  it('gagal jika nama kategori kosong', () => {
    const invalidData = {
      nama: '   ',
      urutan: 0,
    }
    const result = kategoriFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Nama kategori wajib diisi')
    }
  })

  it('gagal jika nama kategori melebihi 100 karakter', () => {
    const invalidData = {
      nama: 'A'.repeat(101),
      urutan: 0,
    }
    const result = kategoriFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Nama kategori maksimal 100 karakter')
    }
  })
})

describe('Katalog Menu Zod Validation Schema', () => {
  it('berhasil memvalidasi payload menu dengan harga jual integer rupiah', () => {
    const validData = {
      nama: 'Nasi Kuning Komplit',
      kategoriId: 1,
      hargaJual: 15000,
      satuan: 'PORSI',
      stokMinimum: 5,
      fotoUrl: 'https://images.unsplash.com/photo-1',
      aktif: true,
    }
    const result = menuFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hargaJual).toBe(15000)
      expect(Number.isInteger(result.data.hargaJual)).toBe(true)
      expect(result.data.satuan).toBe('PORSI')
    }
  })

  it('gagal jika harga jual bernilai float / bukan integer rupiah', () => {
    const invalidData = {
      nama: 'Nasi Kuning Komplit',
      kategoriId: 1,
      hargaJual: 15000.75, // float tidak diperbolehkan
      satuan: 'PORSI',
      stokMinimum: 5,
    }
    const result = menuFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Harga jual harus berupa bilangan bulat rupiah')
    }
  })

  it('gagal jika harga jual bernilai negatif', () => {
    const invalidData = {
      nama: 'Nasi Kuning',
      kategoriId: 1,
      hargaJual: -5000,
      satuan: 'PORSI',
    }
    const result = menuFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('gagal jika satuan tidak sesuai enum (PCS/PORSI/BOTOL)', () => {
    const invalidData = {
      nama: 'Jus Alpukat',
      kategoriId: 2,
      hargaJual: 8000,
      satuan: 'LITER', // tidak ada di enum
    }
    const result = menuFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('berhasil memvalidasi payload menu minimal dengan stokMinimum 0 dan aktif true', () => {
    const minimalData = {
      nama: 'Air Putih',
      kategoriId: 3,
      hargaJual: 3000,
      satuan: 'BOTOL',
      stokMinimum: 0,
      aktif: true,
    }
    const result = menuFormSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.stokMinimum).toBe(0)
      expect(result.data.aktif).toBe(true)
      expect(result.data.fotoUrl).toBeUndefined()
    }
  })
})
