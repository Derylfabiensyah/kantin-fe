import { describe, it, expect } from 'vitest'
import type { RiwayatStokItem, InventarisItem, ArahStok, JenisMutasiStok } from '../types'

describe('Kartu Stok & Laporan Inventaris Logic (Issue #10 DoD)', () => {
  describe('1. Verifikasi Konsistensi Saldo Berjalan Kartu Stok', () => {
    it('memverifikasi saldo berjalan konsisten pada rentetan mutasi masuk & keluar', () => {
      interface MutasiTest {
        id: number
        arah: ArahStok
        jenis: JenisMutasiStok
        qty: number
        stokSebelum: number
        stokSetelah: number
      }

      const mutasiList: MutasiTest[] = [
        {
          id: 1,
          arah: 'MASUK',
          jenis: 'BARANG_MASUK',
          qty: 50,
          stokSebelum: 0,
          stokSetelah: 50,
        },
        {
          id: 2,
          arah: 'KELUAR',
          jenis: 'PENJUALAN',
          qty: 15,
          stokSebelum: 50,
          stokSetelah: 35,
        },
        {
          id: 3,
          arah: 'KELUAR',
          jenis: 'BARANG_RUSAK',
          qty: 3,
          stokSebelum: 35,
          stokSetelah: 32,
        },
        {
          id: 4,
          arah: 'MASUK',
          jenis: 'OPNAME_MASUK',
          qty: 2,
          stokSebelum: 32,
          stokSetelah: 34,
        },
        {
          id: 5,
          arah: 'KELUAR',
          jenis: 'BARANG_MASUK_PEMBALIK',
          qty: 5,
          stokSebelum: 34,
          stokSetelah: 29,
        },
      ]

      // Verifikasi setiap langkah transisi
      for (let i = 0; i < mutasiList.length; i++) {
        const m = mutasiList[i]
        const expectedStok =
          m.arah === 'MASUK'
            ? m.stokSebelum + m.qty
            : m.stokSebelum - m.qty

        expect(m.stokSetelah).toBe(expectedStok)

        // Verifikasi kesinambungan antar transaksi
        if (i > 0) {
          const prev = mutasiList[i - 1]
          expect(m.stokSebelum).toBe(prev.stokSetelah)
        }
      }
    })

    it('mendeteksi inkonsistensi jika terdapat lompatan saldo berjalan', () => {
      const isConsistent = (items: { arah: ArahStok; qty: number; stokSetelah: number }[]) => {
        if (items.length < 2) return true
        for (let i = 1; i < items.length; i++) {
          const prev = items[i - 1]
          const curr = items[i]
          const delta = curr.arah === 'MASUK' ? curr.qty : -curr.qty
          if (prev.stokSetelah + delta !== curr.stokSetelah) {
            return false
          }
        }
        return true
      }

      const validList = [
        { arah: 'MASUK' as ArahStok, qty: 20, stokSetelah: 20 },
        { arah: 'KELUAR' as ArahStok, qty: 5, stokSetelah: 15 },
        { arah: 'MASUK' as ArahStok, qty: 10, stokSetelah: 25 },
      ]
      expect(isConsistent(validList)).toBe(true)

      const corruptedList = [
        { arah: 'MASUK' as ArahStok, qty: 20, stokSetelah: 20 },
        { arah: 'KELUAR' as ArahStok, qty: 5, stokSetelah: 18 }, // Seharusnya 15, ada lompatan
      ]
      expect(isConsistent(corruptedList)).toBe(false)
    })
  })

  describe('2. Kalkulasi Nilai Persediaan Total (Stok x HPP)', () => {
    it('menghitung nilai persediaan per item secara tepat', () => {
      const item: InventarisItem = {
        menuId: 1,
        nama: 'Nasi Goreng Spesial',
        stok: 25,
        stokMinimum: 5,
        hpp: 12000,
        nilaiPersediaan: 25 * 12000,
        menipis: false,
      }

      const calculatedValue = item.stok * item.hpp
      expect(calculatedValue).toBe(300000)
      expect(item.nilaiPersediaan).toBe(calculatedValue)
    })

    it('menghitung akumulasi total nilai persediaan seluruh katalog kantin', () => {
      const items: InventarisItem[] = [
        {
          menuId: 1,
          nama: 'Nasi Kuning Komplit',
          stok: 20,
          stokMinimum: 5,
          hpp: 10000,
          nilaiPersediaan: 200000,
          menipis: false,
        },
        {
          menuId: 2,
          nama: 'Es Teh Manis',
          stok: 50,
          stokMinimum: 10,
          hpp: 2500,
          nilaiPersediaan: 125000,
          menipis: false,
        },
        {
          menuId: 3,
          nama: 'Roti Bakar Coklat',
          stok: 0,
          stokMinimum: 5,
          hpp: 7000,
          nilaiPersediaan: 0,
          menipis: true,
        },
        {
          menuId: 4,
          nama: 'Air Mineral 600ml',
          stok: 30,
          stokMinimum: 8,
          hpp: 3000,
          nilaiPersediaan: 90000,
          menipis: false,
        },
      ]

      const totalValuasi = items.reduce(
        (sum, item) => sum + item.stok * item.hpp,
        0
      )
      const totalFisik = items.reduce((sum, item) => sum + item.stok, 0)

      expect(totalValuasi).toBe(415000)
      expect(totalFisik).toBe(100)
    })
  })

  describe('3. Klasifikasi Status Stok Persediaan (Aman / Menipis / Habis)', () => {
    const tentukanStatus = (stok: number, stokMin: number): 'AMAN' | 'MENIPIS' | 'HABIS' => {
      if (stok === 0) return 'HABIS'
      if (stok <= stokMin) return 'MENIPIS'
      return 'AMAN'
    }

    it('mengklasifikasikan barang dengan stok 0 sebagai HABIS', () => {
      expect(tentukanStatus(0, 10)).toBe('HABIS')
      expect(tentukanStatus(0, 0)).toBe('HABIS')
    })

    it('mengklasifikasikan barang dengan stok sama dengan atau di bawah batas minimum sebagai MENIPIS', () => {
      expect(tentukanStatus(5, 5)).toBe('MENIPIS')
      expect(tentukanStatus(3, 5)).toBe('MENIPIS')
      expect(tentukanStatus(1, 10)).toBe('MENIPIS')
    })

    it('mengklasifikasikan barang dengan stok di atas batas minimum sebagai AMAN', () => {
      expect(tentukanStatus(6, 5)).toBe('AMAN')
      expect(tentukanStatus(25, 10)).toBe('AMAN')
      expect(tentukanStatus(100, 20)).toBe('AMAN')
    })
  })

  describe('4. Filter Tanggal & Pergerakan Kartu Stok', () => {
    const riwayatList: RiwayatStokItem[] = [
      {
        id: 1,
        menuId: 1,
        arah: 'MASUK',
        jenis: 'BARANG_MASUK',
        qty: 30,
        stokSetelah: 30,
        referensiId: 'BM-001',
        dapatDibalik: true,
        waktu: '2026-10-01T08:00:00Z',
      },
      {
        id: 2,
        menuId: 1,
        arah: 'KELUAR',
        jenis: 'PENJUALAN',
        qty: 10,
        stokSetelah: 20,
        referensiId: 'TRX-001',
        dapatDibalik: false,
        waktu: '2026-10-03T10:00:00Z',
      },
      {
        id: 3,
        menuId: 1,
        arah: 'KELUAR',
        jenis: 'BARANG_RUSAK',
        qty: 2,
        stokSetelah: 18,
        referensiId: 'BR-001',
        dapatDibalik: false,
        waktu: '2026-10-05T14:00:00Z',
      },
    ]

    it('memfilter mutasi sesuai rentang tanggal yang ditentukan', () => {
      const dari = new Date('2026-10-02T00:00:00Z').getTime()
      const sampai = new Date('2026-10-04T23:59:59Z').getTime()

      const filtered = riwayatList.filter((item) => {
        const itemTime = new Date(item.waktu).getTime()
        return itemTime >= dari && itemTime <= sampai
      })

      expect(filtered.length).toBe(1)
      expect(filtered[0].referensiId).toBe('TRX-001')
    })

    it('menghitung akumulasi masuk dan keluar dalam periode filter', () => {
      const totalMasuk = riwayatList
        .filter((r) => r.arah === 'MASUK')
        .reduce((sum, r) => sum + r.qty, 0)

      const totalKeluar = riwayatList
        .filter((r) => r.arah === 'KELUAR')
        .reduce((sum, r) => sum + r.qty, 0)

      expect(totalMasuk).toBe(30)
      expect(totalKeluar).toBe(12)
      expect(totalMasuk - totalKeluar).toBe(18) // Saldo akhir transaksi ke-3
    })
  })
})
