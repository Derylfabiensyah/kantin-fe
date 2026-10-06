import { z } from 'zod'

export type ArahStok = 'MASUK' | 'KELUAR'

export type JenisMutasiStok =
  | 'BARANG_MASUK'
  | 'BARANG_MASUK_PEMBALIK'
  | 'PENJUALAN'
  | 'PENJUALAN_VOID'
  | 'OPNAME_MASUK'
  | 'OPNAME_KELUAR'

export interface RiwayatStokItem {
  id: number
  menuId: number
  menuNama?: string | null
  arah: ArahStok
  jenis: JenisMutasiStok
  qty: number
  hargaBeliSatuan?: number | null
  totalNilai?: number | null
  hppSnapshot?: number | null
  stokSetelah: number
  referensiTipe?: string | null
  referensiId: string
  alasan?: string | null
  mutasiAsalId?: number | null
  sudahDibalik?: number | null
  sisaDapatDibalik?: number | null
  dapatDibalik: boolean
  aktorId?: number | null
  waktu: string
}

export interface HalamanResponse<T> {
  items: T[]
  total: number
  halaman: number
  ukuran: number
  totalHalaman: number
}

export interface StokResponse {
  menuId: number
  stok: number
  stokMinimum: number
  hpp: number
  nilaiPersediaan: number
  menipis: boolean
}

export interface HasilMutasiStok {
  mutasiId: number
  menuId: number
  stokSebelum: number
  stokSesudah: number
  hppSebelum: number
  hppSesudah: number
  jenis: JenisMutasiStok
  waktu: string
}

export interface BarangMasukSingleRequest {
  menuId: number
  qty: number
  hargaBeliPerUnit: number
  referensiId: string
}

export interface BarangMasukPembalikRequest {
  mutasiId: number
  qty?: number | null
  alasan: string
  referensiId: string
}

export interface RestockItemRow {
  rowId: string
  menuId: number | ''
  qty: number
  hargaBeliPerUnit: number
  // Snapshot data menu saat ini
  stokSekarang: number
  hppSekarang: number
}

export interface BarangMasukFormValues {
  tanggal: string
  referensiId: string
  namaPemasok?: string
  notaFotoUrl?: string
  items: {
    menuId: number
    qty: number
    hargaBeliPerUnit: number
  }[]
}

// Zod schemas
export const restockItemSchema = z.object({
  menuId: z.number().min(1, 'Menu wajib dipilih'),
  qty: z.number().int('Qty harus bilangan bulat').min(1, 'Qty minimal 1 unit'),
  hargaBeliPerUnit: z
    .number()
    .int('Harga beli harus bilangan bulat')
    .min(0, 'Harga beli tidak boleh negatif'),
})

export const barangMasukFormSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal pembelian wajib diisi'),
  referensiId: z
    .string()
    .trim()
    .min(1, 'Nomor bukti/faktur wajib diisi')
    .max(60, 'Nomor bukti maksimal 60 karakter'),
  namaPemasok: z
    .string()
    .trim()
    .max(100, 'Nama pemasok maksimal 100 karakter')
    .optional(),
  notaFotoUrl: z.string().optional(),
  items: z
    .array(restockItemSchema)
    .min(1, 'Minimal harus ada 1 barang yang dicatat'),
})

export const barangMasukPembalikSchema = z.object({
  mutasiId: z.number().min(1, 'ID mutasi tidak valid'),
  qty: z
    .number()
    .int('Qty harus bilangan bulat')
    .min(1, 'Qty pembalik minimal 1')
    .optional()
    .nullable(),
  alasan: z
    .string()
    .trim()
    .min(3, 'Alasan pembalik wajib diisi (minimal 3 karakter)')
    .max(255, 'Alasan maksimal 255 karakter'),
  referensiId: z
    .string()
    .trim()
    .min(1, 'Nomor bukti pembalik wajib diisi')
    .max(60, 'Nomor bukti maksimal 60 karakter'),
})

export type BarangMasukPembalikFormValues = z.infer<
  typeof barangMasukPembalikSchema
>
