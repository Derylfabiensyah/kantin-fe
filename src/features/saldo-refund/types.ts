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
