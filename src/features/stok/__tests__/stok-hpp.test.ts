import { describe, it, expect } from 'vitest'
import { barangMasukFormSchema, barangMasukPembalikSchema } from '../types'
import {
  hitungHppTertimbang,
  simulasiBarangMasuk,
  hitungHppSetelahPembalik,
} from '../utils/hpp-calculator'

describe('HPP Rata-rata Tertimbang Calculation (PRD §7.4)', () => {
  it('menghasilkan harga beli jika stok awal bernilai 0', () => {
    // Stok sekarang 0, beli 10 @ Rp 5.000 -> HPP baru = Rp 5.000
    const hppBaru = hitungHppTertimbang(0, 0, 10, 5000)
    expect(hppBaru).toBe(5000)
  })

  it('menghitung rata-rata tertimbang secara akurat dan membulatkan ke rupiah terdekat', () => {
    // Stok sekarang 10 @ Rp 4.000 (nilai Rp 40.000)
    // Masuk 10 @ Rp 6.000 (nilai Rp 60.000)
    // Total stok = 20, Total nilai = Rp 100.000 -> HPP baru = Rp 5.000
    const hppBaru = hitungHppTertimbang(10, 4000, 10, 6000)
    expect(hppBaru).toBe(5000)
  })

  it('membulatkan desimal secara HALF_UP ke rupiah terdekat', () => {
    // Stok 10 @ Rp 1.000 (10.000) + Masuk 3 @ Rp 1.500 (4.500)
    // Total = 14.500 / 13 = 1115.384... -> dibulatkan jadi 1115
    const hppBaru = hitungHppTertimbang(10, 1000, 3, 1500)
    expect(hppBaru).toBe(1115)
  })

  it('mengembalikan HPP saat ini bila qty masuk <= 0', () => {
    const hppBaru = hitungHppTertimbang(10, 5000, 0, 6000)
    expect(hppBaru).toBe(5000)
  })

  it('melakukan simulasi barang masuk dengan informasi selisih lengkap', () => {
    const res = simulasiBarangMasuk(10, 4000, 10, 6000)
    expect(res.stokSebelum).toBe(10)
    expect(res.stokSesudah).toBe(20)
    expect(res.hppSebelum).toBe(4000)
    expect(res.hppSesudah).toBe(5000)
    expect(res.selisihHpp).toBe(1000)
    expect(res.totalBiayaMasuk).toBe(60000)
  })
})

describe('HPP Setelah Barang Masuk Pembalik (Koreksi)', () => {
  it('mengembalikan HPP sebelumnya saat membatalkan mutasi masuk', () => {
    // Misal stok 20 @ Rp 5.000 (nilai Rp 100.000)
    // Dibalik 10 unit dengan harga beli asal Rp 6.000 (nilai Rp 60.000)
    // Sisa stok 10, Sisa nilai = Rp 40.000 -> HPP baru = Rp 4.000
    const hppBaru = hitungHppSetelahPembalik(20, 5000, 10, 6000)
    expect(hppBaru).toBe(4000)
  })

  it('menghasilkan 0 jika seluruh stok habis dibalik', () => {
    const hppBaru = hitungHppSetelahPembalik(10, 5000, 10, 5000)
    expect(hppBaru).toBe(0)
  })
})

describe('Validasi Zod Form Barang Masuk & Pembalik', () => {
  it('berhasil memvalidasi form barang masuk yang benar', () => {
    const valid = {
      tanggal: '2026-10-06',
      referensiId: 'BM-20261006-0001',
      namaPemasok: 'PT Sumber Pangan Sejahtera',
      items: [
        {
          menuId: 1,
          qty: 20,
          hargaBeliPerUnit: 4000,
        },
      ],
    }
    const result = barangMasukFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('gagal jika form barang masuk tanpa item barang', () => {
    const invalid = {
      tanggal: '2026-10-06',
      referensiId: 'BM-001',
      items: [],
    }
    const result = barangMasukFormSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('berhasil memvalidasi form pembalik dengan alasan wajib', () => {
    const valid = {
      mutasiId: 12,
      qty: 5,
      alasan: 'Salah input jumlah stok saat penerimaan',
      referensiId: 'BMP-20261006-0001',
    }
    const result = barangMasukPembalikSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('gagal memvalidasi form pembalik jika alasan kosong', () => {
    const invalid = {
      mutasiId: 12,
      qty: 5,
      alasan: '  ',
      referensiId: 'BMP-20261006-0001',
    }
    const result = barangMasukPembalikSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})
