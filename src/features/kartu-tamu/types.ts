import type { KartuTamuMock } from '@/mocks/mock-data'

export interface KartuTamuBackendDto {
  id: number
  sekolahId?: number
  nomorKartu?: string
  nomor_kartu?: string
  rfidUid?: string | null
  uid?: string
  aktif?: boolean
  is_active?: boolean
  catatan?: string | null
  label_pemegang?: string
  saldo?: number
  dibuatOleh?: number
  dibuatPada?: string
  created_at?: string
  diubahOleh?: number | null
  diubahPada?: string | null
  last_used_at?: string
  status?: 'ACTIVE' | 'BLOCKED' | 'AVAILABLE'
}

/**
 * Normalisasi data kartu tamu dari response backend (camelCase)
 * atau mock data (snake_case) ke interface standar UI KartuTamuMock.
 */
export function mapBackendToKartuTamu(
  raw: KartuTamuBackendDto,
  currentSaldo?: number
): KartuTamuMock {
  const isActive = raw.aktif ?? raw.is_active ?? true
  const catatan = (raw.catatan ?? raw.label_pemegang ?? '').trim()

  let status: 'ACTIVE' | 'BLOCKED' | 'AVAILABLE'
  if (!isActive) {
    status = 'BLOCKED'
  } else if (catatan.length > 0) {
    status = 'ACTIVE'
  } else {
    status = 'AVAILABLE'
  }

  return {
    id: raw.id,
    nomor_kartu: raw.nomorKartu || raw.nomor_kartu || '',
    uid: raw.rfidUid || raw.uid || '',
    label_pemegang: catatan,
    saldo: raw.saldo ?? currentSaldo ?? 0,
    is_active: isActive,
    status: raw.status || status,
    created_at: raw.dibuatPada || raw.created_at || new Date().toISOString(),
    last_used_at: raw.diubahPada || raw.last_used_at,
  }
}
