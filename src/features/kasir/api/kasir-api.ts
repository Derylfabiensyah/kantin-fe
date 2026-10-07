import apiClient from '@/lib/api-client'

export interface TapItemPayload {
  menuId: number
  qty: number
}

export interface TapTransaksiRequest {
  rfidUid: string
  items: TapItemPayload[]
  idempotencyKey: string
  titikKasirId?: number
}

export interface TapBuyerInfo {
  tipe: 'SISWA' | 'KARTU_TAMU'
  subjekTipe?: 'SISWA' | 'KARTU_TAMU'
  nama: string
  kelas?: string | null
  nis?: string | null
  foto_url?: string | null
  fotoUrl?: string | null
  sisa_saldo: number
  saldoSisa?: number
  nomor_kartu?: string
  label_pemegang?: string
}

export interface TapTransaksiData {
  transaksi_id: number
  transaksiId?: number
  total: number
  waktu: string
  pembeli: TapBuyerInfo
}

export interface ApiErrorResponse {
  message: string
  kekurangan?: number
  code?: number
}

/**
 * Generate idempotency key unik (UUIDv4) untuk mencegah transaksi ganda (PRD §11.3)
 */
export function generateIdempotencyKey(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export const kasirApi = {
  /**
   * Eksekusi transaksi tap kartu RFID di kasir
   */
  async prosesTap(data: TapTransaksiRequest): Promise<TapTransaksiData> {
    const payload = {
      kartu_uid: data.rfidUid,
      rfidUid: data.rfidUid,
      items: data.items.map((it) => ({
        menu_id: it.menuId,
        menuId: it.menuId,
        qty: it.qty,
      })),
      idempotency_key: data.idempotencyKey,
      idempotencyKey: data.idempotencyKey,
      titikKasirId: data.titikKasirId || 1,
    }

    const res = await apiClient.post('/api/v1/kasir/transaksi', payload)
    return res.data?.data
  },

  /**
   * Batalkan (void) transaksi darurat jika wajah tidak cocok dengan pemilik kartu
   */
  async voidTransaksi(
    transaksiId: number,
    alasan = 'Wajah pembeli tidak cocok dengan foto kartu'
  ): Promise<void> {
    await apiClient.post(`/api/v1/kasir/transaksi/${transaksiId}/void`, {
      alasan,
    })
  },
}
