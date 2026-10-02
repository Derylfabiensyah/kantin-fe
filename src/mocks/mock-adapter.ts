/**
 * Mock API Adapter untuk Axios pada kantin-fe
 * Mengintersep request saat VITE_USE_MOCK=true sehingga tim frontend bisa mengembangkan UI
 * tanpa perlu menunggu backend berjalan.
 */

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import {
  MOCK_MENU,
  MOCK_KATEGORI,
  MOCK_SISWA,
  MOCK_KARTU_TAMU,
  type MenuItemMock,
  type KartuSiswaMock,
  type KartuTamuMock,
} from './mock-data'

export interface MockResponseData {
  code?: number
  status?: string
  message?: string
  data?: unknown
  kekurangan?: number
}

interface TransaksiCartItem {
  menu_id: number
  qty: number
}

interface TransaksiPayload {
  kartu_uid?: string
  items?: TransaksiCartItem[]
}

export function setupMockAdapter(axiosInstance: AxiosInstance) {
  // Simulasi state mutable di memori untuk pengujian
  const menuList: MenuItemMock[] = [...MOCK_MENU]
  const siswaList: KartuSiswaMock[] = [...MOCK_SISWA]
  const kartuTamuList: KartuTamuMock[] = [...MOCK_KARTU_TAMU]

  axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const url = config.url || ''
    const method = (config.method || 'get').toLowerCase()

    // Cek apakah request harus di-handle oleh mock
    const mockResponse = handleMockRequest(url, method, config.data)
    if (mockResponse) {
      // Buat custom adapter yang langsung resolve response mock
      config.adapter = async () => {
        // Simulasi latensi jaringan natural (100ms - 250ms)
        await new Promise((r) => setTimeout(r, 150))

        if (mockResponse.status >= 200 && mockResponse.status < 300) {
          return {
            data: mockResponse.data,
            status: mockResponse.status,
            statusText: 'OK',
            headers: {},
            config,
          } as AxiosResponse
        } else {
          const errMsg = mockResponse.data?.message || 'Mock Error'
          const error = new Error(errMsg) as Error & {
            response?: {
              data: MockResponseData
              status: number
              statusText: string
              headers: Record<string, string>
              config: InternalAxiosRequestConfig
            }
          }
          error.response = {
            data: mockResponse.data,
            status: mockResponse.status,
            statusText: 'Error',
            headers: {},
            config,
          }
          throw error
        }
      }
    }

    return config
  })

  function handleMockRequest(
    url: string,
    method: string,
    dataRaw: unknown
  ): { status: number; data: MockResponseData } | null {
    let payload: Record<string, unknown> = {}
    if (typeof dataRaw === 'string') {
      try {
        payload = JSON.parse(dataRaw) as Record<string, unknown>
      } catch {
        payload = {}
      }
    } else if (typeof dataRaw === 'object' && dataRaw !== null) {
      payload = dataRaw as Record<string, unknown>
    }

    // --- 1. Auth Login Staf ---
    if (url.includes('/api/v1/auth/login') && method === 'post') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Login berhasil (Mock)',
          data: {
            token: 'mock-jwt-token-skoolia-kantin-2026',
            user: {
              id: 1,
              nama: 'Wibisana Bama (Petugas)',
              email: 'wibisanabama@gmail.com',
              roles: ['ROLE_PETUGAS_KANTIN', 'ROLE_PENGELOLA_KANTIN', 'ROLE_BENDAHARA', 'ROLE_ADMIN'],
              sekolah: {
                id: 10,
                nama: 'SMA Negeri 1 SKOOLIA',
              },
            },
          },
        },
      }
    }

    // --- 2. Katalog Menu ---
    if (url.includes('/api/v1/katalog/menu') && method === 'get') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: menuList,
        },
      }
    }

    // --- 3. Kategori Menu ---
    if (url.includes('/api/v1/katalog/kategori') && method === 'get') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: MOCK_KATEGORI,
        },
      }
    }

    // --- 4. Kasir: Transaksi Tap Kartu (Validasi 6 Tahap) ---
    if (url.includes('/api/v1/kasir/transaksi') && method === 'post') {
      const trxPayload = payload as TransaksiPayload
      const kartuUid = trxPayload.kartu_uid || ''
      const items = trxPayload.items || []

      if (!kartuUid) {
        return { status: 400, data: { message: 'UID kartu tidak boleh kosong' } }
      }

      // Validasi 1: Kartu dikenal?
      const siswa = siswaList.find((s) => s.uid.toUpperCase() === kartuUid.toUpperCase())
      const kartuTamu = kartuTamuList.find((k) => k.uid.toUpperCase() === kartuUid.toUpperCase())

      if (!siswa && !kartuTamu) {
        return { status: 404, data: { message: 'Kartu tidak dikenal' } }
      }

      // Validasi 2: Kartu diblokir?
      if (siswa?.is_blocked || (kartuTamu && !kartuTamu.is_active)) {
        return {
          status: 400,
          data: { message: siswa ? 'Kartu diblokir, hubungi orang tua' : 'Kartu tamu diblokir' },
        }
      }

      // Hitung total belanja
      let totalBelanja = 0
      for (const cartItem of items) {
        const menuItem = menuList.find((m) => m.id === cartItem.menu_id)
        if (!menuItem) {
          return { status: 404, data: { message: `Menu ID ${cartItem.menu_id} tidak ditemukan` } }
        }

        // Validasi 4: Stok cukup?
        if (menuItem.stok < cartItem.qty) {
          return {
            status: 400,
            data: { message: `Stok ${menuItem.nama} tidak cukup (sisa ${menuItem.stok})` },
          }
        }

        // Validasi 3: Item diblokir ortu?
        if (siswa?.blocked_items?.includes(menuItem.id)) {
          return {
            status: 400,
            data: { message: `Item ${menuItem.nama} diblokir oleh orang tua` },
          }
        }

        totalBelanja += menuItem.harga_jual * cartItem.qty
      }

      // Validasi 5: Limit harian (hanya untuk siswa)
      if (siswa && siswa.limit_harian > 0) {
        if (siswa.belanja_hari_ini + totalBelanja > siswa.limit_harian) {
          const sisaLimit = Math.max(0, siswa.limit_harian - siswa.belanja_hari_ini)
          return {
            status: 400,
            data: { message: `Melebihi limit harian (sisa Rp ${sisaLimit.toLocaleString('id-ID')})` },
          }
        }
      }

      // Validasi 6: Saldo cukup?
      const saldoSaatIni = siswa ? siswa.saldo : kartuTamu!.saldo
      if (saldoSaatIni < totalBelanja) {
        const kurang = totalBelanja - saldoSaatIni
        return {
          status: 400,
          data: {
            message: `Saldo kurang Rp ${kurang.toLocaleString('id-ID')}`,
            kekurangan: kurang,
          },
        }
      }

      // Sukses: potong saldo & kurangi stok
      if (siswa) {
        siswa.saldo -= totalBelanja
        siswa.belanja_hari_ini += totalBelanja
      } else if (kartuTamu) {
        kartuTamu.saldo -= totalBelanja
      }

      for (const cartItem of items) {
        const menuItem = menuList.find((m) => m.id === cartItem.menu_id)
        if (menuItem) {
          menuItem.stok -= cartItem.qty
        }
      }

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Transaksi berhasil',
          data: {
            transaksi_id: Date.now(),
            total: totalBelanja,
            waktu: new Date().toISOString(),
            pembeli: siswa
              ? {
                  tipe: 'SISWA',
                  nama: siswa.nama,
                  kelas: siswa.kelas,
                  nis: siswa.nis,
                  foto_url: siswa.foto_url,
                  sisa_saldo: siswa.saldo,
                }
              : {
                  tipe: 'KARTU_TAMU',
                  nomor_kartu: kartuTamu!.nomor_kartu,
                  label_pemegang: kartuTamu!.label_pemegang,
                  sisa_saldo: kartuTamu!.saldo,
                },
          },
        },
      }
    }

    // --- 5. Kasir: Sesi Kasir Aktif ---
    if (url.includes('/api/v1/kasir/sesi') && method === 'get') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: {
            sesi_id: 101,
            titik_kasir: 'Kasir 1 - Kantin Utama',
            tanggal: new Date().toISOString().split('T')[0],
            status: 'TERBUKA',
            total_transaksi: 14,
            total_bruto: 185000,
            total_void: 12000,
            total_bersih: 173000,
          },
        },
      }
    }

    // --- 6. TU: Pencarian Siswa & Kartu Tamu ---
    if (url.includes('/api/v1/tu/siswa') && method === 'get') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: siswaList,
        },
      }
    }

    if (url.includes('/api/v1/tu/kartu-tamu') && method === 'get') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: kartuTamuList,
        },
      }
    }

    // --- 7. TU: Topup Tunai Saldo Siswa ---
    if (url.includes('/api/v1/tu/topup') && method === 'post') {
      const siswaId = Number(payload.siswa_id)
      const nominal = Number(payload.nominal) || 0
      const namaPenyetor = (payload.nama_penyetor as string) || 'Orang Tua / Wali'
      const petugasNama = (payload.petugas_nama as string) || 'Wibisana Bama (Petugas TU)'

      if (!siswaId || nominal <= 0) {
        return { status: 400, data: { message: 'Siswa dan nominal top-up valid wajib diisi' } }
      }

      const siswa = siswaList.find((s) => s.siswa_id === siswaId)
      if (!siswa) {
        return { status: 404, data: { message: 'Siswa tidak ditemukan' } }
      }

      if (siswa.is_blocked) {
        return { status: 400, data: { message: 'Top-up ditolak: Kartu siswa sedang diblokir' } }
      }

      const MAX_SALDO = 500000
      if (siswa.saldo + nominal > MAX_SALDO) {
        return {
          status: 400,
          data: {
            message: `Top-up ditolak: Saldo baru (Rp ${(siswa.saldo + nominal).toLocaleString(
              'id-ID'
            )}) melebihi batas saldo maksimal sekolah (Rp ${MAX_SALDO.toLocaleString('id-ID')})`,
          },
        }
      }

      const saldoAwal = siswa.saldo
      siswa.saldo += nominal
      const saldoBaru = siswa.saldo

      const now = new Date()
      const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randomSeq = Math.floor(1000 + Math.random() * 9000)
      const refNo = `TU-TOPUP-${dateCode}-${randomSeq}`

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Top-up tunai berhasil',
          data: {
            ref_no: refNo,
            waktu: now.toISOString(),
            petugas_nama: petugasNama,
            nama_penyetor: namaPenyetor,
            nominal,
            saldo_awal: saldoAwal,
            saldo_baru: saldoBaru,
            siswa: {
              siswa_id: siswa.siswa_id,
              nis: siswa.nis,
              nama: siswa.nama,
              kelas: siswa.kelas,
              foto_url: siswa.foto_url,
            },
          },
        },
      }
    }

    return null
  }
}
