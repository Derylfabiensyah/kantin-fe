import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import {
  exportTableToExcel,
  exportMultiSheetExcel,
  exportRawDataToExcel,
} from './excelExport'

describe('excelExport utility', () => {
  it('berhasil memformat dan mengekspor single table ke workbook', () => {
    const data = [
      { id: 1, nama: 'Nasi Goreng', harga: 15000, qty: 10 },
      { id: 2, nama: 'Es Teh Manis', harga: 4000, qty: 25 },
    ]

    const result = exportTableToExcel({
      filename: 'laporan-penjualan-test',
      sheetName: 'Penjualan',
      title: 'Laporan Penjualan Harian Kantin',
      metadata: {
        Tanggal: '2026-10-08',
        Kantin: 'Kantin Sehat SKOOLIA',
      },
      columns: [
        { header: 'No', key: 'id' },
        { header: 'Menu Makanan/Minuman', key: 'nama' },
        {
          header: 'Harga Satuan',
          key: 'harga',
          formatter: (v) => `Rp ${Number(v).toLocaleString('id-ID')}`,
        },
        { header: 'Jumlah Terjual', key: 'qty' },
      ],
      data,
    })

    expect(result).toBeDefined()
    expect(result.filename).toBe('laporan-penjualan-test.xlsx')
    expect(result.workbook).toBeDefined()
    expect(result.workbook.SheetNames).toContain('Penjualan')

    const ws = result.workbook.Sheets['Penjualan']
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][]
    expect((rows[0] as unknown[])[0]).toBe('Laporan Penjualan Harian Kantin')
    expect((rows[2] as unknown[])[0]).toBe('Tanggal')
    expect((rows[2] as unknown[])[1]).toBe('2026-10-08')
  })

  it('berhasil mengekspor multi sheet ke dalam satu workbook', () => {
    const result = exportMultiSheetExcel({
      filename: 'laporan-multi-sheet',
      sheets: [
        {
          sheetName: 'Ringkasan',
          columns: [
            { header: 'Pos', key: 'pos' },
            { header: 'Nominal', key: 'nominal' },
          ],
          data: [
            { pos: 'Top-up Masuk', nominal: 500000 },
            { pos: 'Penjualan Bersih', nominal: 350000 },
          ],
        },
        {
          sheetName: 'Detail',
          columns: [
            { header: 'ID', key: 'id' },
            { header: 'Keterangan', key: 'ket' },
          ],
          data: [{ id: 101, ket: 'Tap Kasir POS' }],
        },
      ],
    })

    expect(result).toBeDefined()
    expect(result.filename).toBe('laporan-multi-sheet.xlsx')
    expect(result.workbook.SheetNames).toEqual(['Ringkasan', 'Detail'])
  })

  it('berhasil mengekspor raw array of arrays', () => {
    const headers = ['Kode', 'Item', 'Nilai']
    const rows = [
      ['A1', 'Bakso', 12000],
      ['B2', 'Soto', 15000],
    ]

    const result = exportRawDataToExcel(
      'laporan-raw.xlsx',
      'Data Mentah',
      headers,
      rows
    )
    expect(result).toBeDefined()
    expect(result.filename).toBe('laporan-raw.xlsx')
    expect(result.workbook.SheetNames).toContain('Data Mentah')
  })
})
