export interface TransaksiTopupDetail {
  id: string | number
  waktu: string
  subjek_tipe: 'SISWA' | 'KARTU_TAMU'
  subjek_nama: string
  subjek_info: string
  nominal: number
  penyetor: string
  referensi_id: string
}

export interface SetoranKasItem {
  id: string
  tanggal: string
  petugas_id: number
  petugas_nama: string
  petugas_nip?: string
  total_transaksi: number
  total_topup_siswa: number
  total_topup_kartu_tamu: number
  total_sistem: number
  uang_fisik: number | null
  selisih: number | null
  status: 'MENUNGGU_KONFIRMASI' | 'TERKONFIRMASI'
  catatan?: string
  bendahara_id?: number | null
  bendahara_nama?: string | null
  konfirmasi_pada?: string | null
  rincian_transaksi: TransaksiTopupDetail[]
}

export interface KonfirmasiSetoranPayload {
  id: string
  uang_fisik: number
  catatan?: string
  bendahara_nama?: string
}
