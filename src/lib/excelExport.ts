/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility Ekspor Data ke Format Microsoft Excel (.xlsx)
 * Modul Laporan SKOOLIA Kantin
 *
 * Menggunakan library 'xlsx' (SheetJS) untuk mengekspor tabel laporan,
 * mutasi, dan ringkasan keuangan secara rapi dengan auto-width kolom.
 */

import * as XLSX from 'xlsx'

export interface ExcelColumn<T = any> {
  header: string
  key?: keyof T | string
  formatter?: (val: unknown, row: T) => string | number | boolean | null | undefined
  width?: number
}

export interface ExportTableOptions<T = any> {
  filename: string
  sheetName?: string
  title?: string
  metadata?: Record<string, string | number | undefined | null>
  columns: ExcelColumn<T>[]
  data: T[]
}

export interface SheetConfig<T = any> {
  sheetName: string
  title?: string
  metadata?: Record<string, string | number | undefined | null>
  columns: ExcelColumn<T>[]
  data: T[]
}

export interface MultiSheetExportOptions {
  filename: string
  sheets: SheetConfig<any>[]
}

/**
 * Membersihkan nama file dari karakter ilegal
 */
function sanitizeFilename(filename: string): string {
  const clean = filename.replace(/[\\/:*?"<>|]/g, '_').trim()
  return clean.endsWith('.xlsx') ? clean : `${clean}.xlsx`
}

/**
 * Membangun worksheet dari tabel data
 */
function buildWorksheet<T>(config: {
  title?: string
  metadata?: Record<string, string | number | undefined | null>
  columns: ExcelColumn<T>[]
  data: T[]
}): XLSX.WorkSheet {
  const rows: (string | number | boolean | null | undefined)[][] = []

  // Judul Laporan jika ada
  if (config.title) {
    rows.push([config.title])
    rows.push([]) // baris kosong
  }

  // Metadata / Info Tambahan (mis. Periode, Sekolah, Dicetak Pada)
  if (config.metadata) {
    for (const [key, value] of Object.entries(config.metadata)) {
      if (value !== undefined && value !== null) {
        rows.push([key, value])
      }
    }
    rows.push([]) // baris kosong pemisah
  }

  // Header Kolom
  const headerRow = config.columns.map((c) => c.header)
  rows.push(headerRow)

  // Data Baris
  for (const item of config.data) {
    const rowValues = config.columns.map((col) => {
      let val: unknown = undefined
      if (col.key) {
        val = (item as Record<string, unknown>)[col.key as string]
      }
      if (col.formatter) {
        return col.formatter(val, item)
      }
      if (val === undefined || val === null) {
        return ''
      }
      return val as string | number | boolean
    })
    rows.push(rowValues)
  }

  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Hitung lebar kolom otomatis (Auto column widths)
  const colWidths = config.columns.map((col, _colIdx) => {
    let maxLen = col.header.length

    // Cari nilai terpanjang pada kolom ini
    for (const item of config.data) {
      let val: unknown = undefined
      if (col.key) val = (item as Record<string, unknown>)[col.key as string]
      if (col.formatter) val = col.formatter(val, item)
      const strVal = val !== undefined && val !== null ? String(val) : ''
      if (strVal.length > maxLen) {
        maxLen = strVal.length
      }
    }

    return {
      wch: col.width ? col.width : Math.min(Math.max(maxLen + 4, 12), 45),
    }
  })

  ws['!cols'] = colWidths
  return ws
}

/**
 * Menyimpan workbook ke file dan memicu download browser, serta mengembalikan workbook & byte array
 */
function triggerDownload(workbook: XLSX.WorkBook, fullFilename: string) {
  let buffer: Uint8Array | undefined
  try {
    buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  } catch {
    // fallback jika environment tidak mendukung
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      XLSX.writeFile(workbook, fullFilename, {
        bookType: 'xlsx',
        compression: true,
      })
    } catch {
      // Jika di lingkungan test browser yang memblokir dialog unduh
    }
  }

  return {
    workbook,
    filename: fullFilename,
    buffer,
  }
}

/**
 * Mengekspor satu tabel data ke file Excel (.xlsx)
 */
export function exportTableToExcel<T = any>(
  options: ExportTableOptions<T>
) {
  const wb = XLSX.utils.book_new()
  const sheetName = options.sheetName || 'Laporan'
  const ws = buildWorksheet({
    title: options.title,
    metadata: options.metadata,
    columns: options.columns,
    data: options.data,
  })

  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31)) // Sheet name max 31 chars
  const finalFilename = sanitizeFilename(options.filename)
  return triggerDownload(wb, finalFilename)
}

/**
 * Mengekspor beberapa sheet sekaligus ke dalam satu file Excel (.xlsx)
 */
export function exportMultiSheetExcel(options: MultiSheetExportOptions) {
  const wb = XLSX.utils.book_new()

  for (const sheet of options.sheets) {
    const ws = buildWorksheet({
      title: sheet.title,
      metadata: sheet.metadata,
      columns: sheet.columns,
      data: sheet.data,
    })
    const sheetName = (sheet.sheetName || 'Sheet').substring(0, 31)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  }

  const finalFilename = sanitizeFilename(options.filename)
  return triggerDownload(wb, finalFilename)
}

/**
 * Mengekspor data mentah (Array of Arrays) ke Excel
 */
export function exportRawDataToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const wb = XLSX.utils.book_new()
  const aoa = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Lebar kolom
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 4, 14) }))

  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31))
  const finalFilename = sanitizeFilename(filename)
  return triggerDownload(wb, finalFilename)
}
