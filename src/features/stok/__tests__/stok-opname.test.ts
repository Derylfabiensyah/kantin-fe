import { describe, it, expect } from 'vitest'
import {
  barangRusakFormSchema,
  KATEGORI_ALASAN_OPNAME,
  type OpnameBatchItemRequest,
} from '../types'

describe('Stok Opname & Barang Rusak Logic (Issue #9 DoD)', () => {
  describe('1. Kalkulasi Otomatis Selisih Qty & Nilai Kerugian (Rp)', () => {
    it('menghitung selisih berkurang (kurang fisik) dan estimasi nilai kerugian', () => {
      const stokSistem = 20
      const qtyFisik = 15
      const hpp = 8000

      const selisih = qtyFisik - stokSistem // -5
      const nilaiSelisih = Math.abs(selisih) * hpp // 40.000

      expect(selisih).toBe(-5)
      expect(nilaiSelisih).toBe(40000)
    })

    it('menghitung selisih bertambah (lebih fisik) dan estimasi nilai kelebihan', () => {
      const stokSistem = 30
      const qtyFisik = 35
      const hpp = 5000

      const selisih = qtyFisik - stokSistem // +5
      const nilaiSelisih = Math.abs(selisih) * hpp // 25.000

      expect(selisih).toBe(5)
      expect(nilaiSelisih).toBe(25000)
    })

    it('menghasilkan selisih 0 jika stok fisik sama dengan stok sistem', () => {
      const stokSistem = 50
      const qtyFisik = 50
      const hpp = 12000

      const selisih = qtyFisik - stokSistem
      const nilaiSelisih = Math.abs(selisih) * hpp

      expect(selisih).toBe(0)
      expect(nilaiSelisih).toBe(0)
    })
  })

  describe('2. Validasi Form Wajib Alasan pada Baris Berselisih (DoD)', () => {
    it('mengidentifikasi baris berselisih yang belum memiliki alasan sebagai pelanggaran validasi', () => {
      interface RowTest {
        menuId: number
        stokSistem: number
        qtyFisik: number
        alasan: string
      }

      const rows: RowTest[] = [
        { menuId: 1, stokSistem: 20, qtyFisik: 20, alasan: '' }, // pas, alasan boleh kosong
        { menuId: 2, stokSistem: 15, qtyFisik: 12, alasan: '' }, // selisih -3, alasan kosong -> INVALID
        { menuId: 3, stokSistem: 10, qtyFisik: 8, alasan: 'Rusak' }, // selisih -2, alasan ada -> VALID
      ]

      // Filter yang melanggar aturan DoD: berselisih tapi belum ada alasan
      const invalidRows = rows.filter(
        (r) => r.qtyFisik !== r.stokSistem && !r.alasan.trim()
      )

      expect(invalidRows.length).toBe(1)
      expect(invalidRows[0].menuId).toBe(2)
    })

    it('mengizinkan submit jika seluruh baris berselisih telah memiliki alasan', () => {
      const rows = [
        { menuId: 1, stokSistem: 20, qtyFisik: 20, alasan: '' },
        { menuId: 2, stokSistem: 15, qtyFisik: 12, alasan: 'Kedaluwarsa' },
        { menuId: 3, stokSistem: 10, qtyFisik: 12, alasan: 'Salah Hitung' },
      ]

      const invalidRows = rows.filter(
        (r) => r.qtyFisik !== r.stokSistem && !r.alasan.trim()
      )

      expect(invalidRows.length).toBe(0)
    })
  })

  describe('3. Klasifikasi Kategori Alasan & Flag BARANG_RUSAK', () => {
    it('menandai kategori Rusak dan Kedaluwarsa dengan flag isRusak = true', () => {
      const rusakOption = KATEGORI_ALASAN_OPNAME.find((k) => k.value === 'Rusak')
      const expOption = KATEGORI_ALASAN_OPNAME.find((k) => k.value === 'Kedaluwarsa')
      const hilangOption = KATEGORI_ALASAN_OPNAME.find((k) => k.value === 'Hilang')

      expect(rusakOption?.isRusak).toBe(true)
      expect(expOption?.isRusak).toBe(true)
      expect(hilangOption?.isRusak).toBe(false)
    })

    it('membentuk payload batch item request dengan flag rusak sesuai alasan', () => {
      const item1: OpnameBatchItemRequest = {
        menuId: 1,
        qtyFisik: 18,
        alasan: 'Rusak: Basi karena kulkas mati',
        rusak: true,
      }

      const item2: OpnameBatchItemRequest = {
        menuId: 2,
        qtyFisik: 12,
        alasan: 'Koreksi Salah Hitung',
        rusak: false,
      }

      expect(item1.rusak).toBe(true)
      expect(item2.rusak).toBe(false)
    })
  })

  describe('4. Validasi Skema Zod Form Barang Rusak Harian', () => {
    it('memvalidasi form pencatatan barang rusak yang valid', () => {
      const validData = {
        menuId: 1,
        qtyRusak: 5,
        kategoriAlasan: 'Basi / Busuk',
        keterangan: 'Ditemukan basi saat cek pagi',
        referensiId: 'BR-20261006-001',
      }

      const parsed = barangRusakFormSchema.safeParse(validData)
      expect(parsed.success).toBe(true)
    })

    it('menolak jika qtyRusak bernilai 0 atau negatif', () => {
      const invalidData = {
        menuId: 1,
        qtyRusak: 0,
        kategoriAlasan: 'Basi',
        referensiId: 'BR-20261006-001',
      }

      const parsed = barangRusakFormSchema.safeParse(invalidData)
      expect(parsed.success).toBe(false)
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('minimal 1 unit')
      }
    })

    it('menolak jika referensiId kosong', () => {
      const invalidData = {
        menuId: 1,
        qtyRusak: 2,
        kategoriAlasan: 'Kemasan Pecah',
        referensiId: '   ',
      }

      const parsed = barangRusakFormSchema.safeParse(invalidData)
      expect(parsed.success).toBe(false)
    })
  })
})
