/**
 * Utility perhitungan HPP (Harga Pokok Penjualan) rata-rata tertimbang
 * dan simulasi dampak barang masuk & pembalik sesuai PRD §7.4 & HppService BE.
 */

export interface SimulasiHppMasukResult {
  stokSebelum: number
  stokSesudah: number
  hppSebelum: number
  hppSesudah: number
  selisihHpp: number
  totalNilaiSebelum: number
  totalNilaiSesudah: number
  totalBiayaMasuk: number
}

/**
 * Hitung HPP rata-rata tertimbang baru setelah barang masuk.
 *
 * Formula PRD §7.4:
 * HPP baru = (stokSekarang × HPP sekarang + qtyMasuk × hargaBeli) ÷ (stokSekarang + qtyMasuk)
 *
 * Aturan:
 * - Jika stokSekarang <= 0, HPP baru = hargaBeli.
 * - Dibulatkan ke rupiah terdekat (Math.round).
 */
export function hitungHppTertimbang(
  stokSekarang: number,
  hppSekarang: number,
  qtyMasuk: number,
  hargaBeli: number
): number {
  if (qtyMasuk <= 0) return hppSekarang
  if (stokSekarang <= 0) return Math.max(0, Math.round(hargaBeli))

  const totalStok = stokSekarang + qtyMasuk
  const nilaiLama = stokSekarang * hppSekarang
  const nilaiMasuk = qtyMasuk * hargaBeli

  const hppBaru = (nilaiLama + nilaiMasuk) / totalStok
  return Math.max(0, Math.round(hppBaru))
}

/**
 * Simulasi lengkap barang masuk
 */
export function simulasiBarangMasuk(
  stokSekarang: number,
  hppSekarang: number,
  qtyMasuk: number,
  hargaBeli: number
): SimulasiHppMasukResult {
  const stokSebelum = Math.max(0, stokSekarang)
  const hppSebelum = Math.max(0, hppSekarang)
  const safeQty = Math.max(0, qtyMasuk)
  const safeHarga = Math.max(0, hargaBeli)

  const hppSesudah = hitungHppTertimbang(
    stokSebelum,
    hppSebelum,
    safeQty,
    safeHarga
  )
  const stokSesudah = stokSebelum + safeQty
  const totalBiayaMasuk = safeQty * safeHarga

  return {
    stokSebelum,
    stokSesudah,
    hppSebelum,
    hppSesudah,
    selisihHpp: hppSesudah - hppSebelum,
    totalNilaiSebelum: stokSebelum * hppSebelum,
    totalNilaiSesudah: stokSesudah * hppSesudah,
    totalBiayaMasuk,
  }
}

/**
 * Hitung HPP rata-rata tertimbang setelah barang masuk dibalik (koreksi).
 *
 * Formula:
 * HPP baru = (stokSekarang × HPP sekarang − qtyBalik × hargaBeliAsal) ÷ (stokSekarang − qtyBalik)
 *
 * Aturan:
 * - Jika stokBaru <= 0 atau pembilang <= 0, HPP = 0.
 * - Dibulatkan ke rupiah terdekat (Math.round).
 */
export function hitungHppSetelahPembalik(
  stokSekarang: number,
  hppSekarang: number,
  qtyBalik: number,
  hargaBeliAsal: number
): number {
  if (qtyBalik <= 0) return hppSekarang
  const stokBaru = stokSekarang - qtyBalik
  if (stokBaru <= 0) return 0

  const nilaiLama = stokSekarang * hppSekarang
  const nilaiBalik = qtyBalik * hargaBeliAsal
  const nilaiBaru = nilaiLama - nilaiBalik

  if (nilaiBaru <= 0) return 0
  return Math.max(0, Math.round(nilaiBaru / stokBaru))
}
