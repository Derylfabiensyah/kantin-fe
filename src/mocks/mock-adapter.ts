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
  responseCode?: number
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
  const kategoriList = [...MOCK_KATEGORI]
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
      const email = String(payload.email || payload.username || '').toLowerCase()
      const password = String(payload.password || '')

      if (password === 'salah' || password === 'wrong') {
        return {
          status: 401,
          data: {
            code: 401,
            status: 'UNAUTHORIZED',
            message: 'Email atau kata sandi tidak valid',
          },
        }
      }

      let detectedRole = 'admin'
      let roleList = ['ROLE_ADMIN', 'ROLE_PENGELOLA_KANTIN', 'ROLE_PETUGAS_KANTIN', 'ROLE_TU_SEKOLAH', 'ROLE_BENDAHARA']
      let namaStaf = 'Wibisana Bama (Admin)'

      if (email.includes('kasir')) {
        detectedRole = 'kasir'
        roleList = ['ROLE_PETUGAS_KANTIN']
        namaStaf = 'Ahmad Kasir (Petugas POS)'
      } else if (email.includes('pengelola')) {
        detectedRole = 'pengelola'
        roleList = ['ROLE_PENGELOLA_KANTIN']
        namaStaf = 'Deryl Fabiensyah (Pengelola)'
      } else if (email.includes('tu')) {
        detectedRole = 'tu'
        roleList = ['ROLE_TU_SEKOLAH']
        namaStaf = 'Andika Pratama (Petugas TU)'
      } else if (email.includes('bendahara')) {
        detectedRole = 'bendahara'
        roleList = ['ROLE_BENDAHARA']
        namaStaf = 'Siti Rahma (Bendahara)'
      }

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Login berhasil (Mock)',
          data: {
            token: `mock-jwt-token-skoolia-${detectedRole}-2026`,
            user: {
              id: 1,
              nama: namaStaf,
              email: email || 'wibisanabama@gmail.com',
              currentRole: detectedRole,
              roles: roleList,
              sekolah: {
                id: Number(payload.sekolah_id) || 10,
                nama: 'SMA Negeri 1 SKOOLIA',
              },
            },
          },
        },
      }
    }

    // --- 2. Katalog Menu (CRUD) ---
    if (url.includes('/katalog/menu')) {
      const idMatch = url.match(/\/katalog\/menu\/(\d+)/)
      const targetId = idMatch ? Number(idMatch[1]) : null

      if (method === 'get') {
        if (targetId) {
          const item = menuList.find((m) => m.id === targetId)
          if (!item) return { status: 404, data: { message: 'Menu tidak ditemukan' } }
          return {
            status: 200,
            data: {
              code: 200,
              status: 'SUCCESS',
              data: {
                id: item.id,
                kategoriId: item.kategori_id,
                nama: item.nama,
                hargaJual: item.harga_jual,
                satuan: item.satuan ? item.satuan.toUpperCase() : 'PCS',
                fotoUrl: item.foto_url || null,
                stokMinimum: item.stok_minimum,
                stokBerjalan: item.stok,
                aktif: item.is_active,
              },
            },
          }
        }

        // List menu
        const mappedList = menuList.map((m) => ({
          id: m.id,
          kategoriId: m.kategori_id,
          nama: m.nama,
          hargaJual: m.harga_jual,
          satuan: m.satuan ? m.satuan.toUpperCase() : 'PCS',
          fotoUrl: m.foto_url || null,
          stokMinimum: m.stok_minimum,
          stokBerjalan: m.stok,
          aktif: m.is_active,
        }))
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: mappedList,
          },
        }
      }

      if (method === 'post') {
        const nextId = menuList.length > 0 ? Math.max(...menuList.map((m) => m.id)) + 1 : 1
        const kat = kategoriList.find((k) => k.id === Number(payload.kategoriId))
        const newItem: MenuItemMock = {
          id: nextId,
          nama: String(payload.nama || ''),
          kategori_id: Number(payload.kategoriId) || 1,
          kategori_nama: kat ? kat.nama : 'Umum',
          harga_jual: Number(payload.hargaJual) || 0,
          satuan: String(payload.satuan || 'PCS'),
          stok: 0,
          stok_minimum: Number(payload.stokMinimum) || 0,
          foto_url: payload.fotoUrl ? String(payload.fotoUrl) : undefined,
          is_active: payload.aktif !== false,
          hpp: Math.round((Number(payload.hargaJual) || 0) * 0.7),
        }
        menuList.unshift(newItem)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Menu berhasil dibuat',
            data: {
              id: newItem.id,
              kategoriId: newItem.kategori_id,
              nama: newItem.nama,
              hargaJual: newItem.harga_jual,
              satuan: newItem.satuan,
              fotoUrl: newItem.foto_url || null,
              stokMinimum: newItem.stok_minimum,
              stokBerjalan: newItem.stok,
              aktif: newItem.is_active,
            },
          },
        }
      }

      if (method === 'put' && targetId) {
        const idx = menuList.findIndex((m) => m.id === targetId)
        if (idx === -1) return { status: 404, data: { message: 'Menu tidak ditemukan' } }
        const kat = kategoriList.find((k) => k.id === Number(payload.kategoriId))
        menuList[idx] = {
          ...menuList[idx],
          nama: String(payload.nama || menuList[idx].nama),
          kategori_id: Number(payload.kategoriId) || menuList[idx].kategori_id,
          kategori_nama: kat ? kat.nama : menuList[idx].kategori_nama,
          harga_jual: payload.hargaJual !== undefined ? Number(payload.hargaJual) : menuList[idx].harga_jual,
          satuan: String(payload.satuan || menuList[idx].satuan),
          stok_minimum: payload.stokMinimum !== undefined ? Number(payload.stokMinimum) : menuList[idx].stok_minimum,
          foto_url: payload.fotoUrl !== undefined ? String(payload.fotoUrl || '') : menuList[idx].foto_url,
          is_active: payload.aktif !== undefined ? Boolean(payload.aktif) : menuList[idx].is_active,
        }
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Menu berhasil diperbarui',
            data: {
              id: menuList[idx].id,
              kategoriId: menuList[idx].kategori_id,
              nama: menuList[idx].nama,
              hargaJual: menuList[idx].harga_jual,
              satuan: menuList[idx].satuan,
              fotoUrl: menuList[idx].foto_url || null,
              stokMinimum: menuList[idx].stok_minimum,
              stokBerjalan: menuList[idx].stok,
              aktif: menuList[idx].is_active,
            },
          },
        }
      }

      if (method === 'delete' && targetId) {
        const idx = menuList.findIndex((m) => m.id === targetId)
        if (idx === -1) return { status: 404, data: { message: 'Menu tidak ditemukan' } }
        // Soft delete
        menuList[idx].is_active = false
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Menu berhasil dinonaktifkan',
          },
        }
      }
    }

    // --- 3. Kategori Menu (CRUD) ---
    if (url.includes('/katalog/kategori')) {
      const idMatch = url.match(/\/katalog\/kategori\/(\d+)/)
      const targetId = idMatch ? Number(idMatch[1]) : null

      if (method === 'get') {
        const mappedKategori = kategoriList.map((k) => ({
          id: k.id,
          nama: k.nama,
          urutan: k.id,
          isActive: k.is_active,
          aktif: k.is_active,
          jumlahItem: menuList.filter((m) => m.kategori_id === k.id && m.is_active).length,
        }))
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: mappedKategori,
          },
        }
      }

      if (method === 'post') {
        const nextId = kategoriList.length > 0 ? Math.max(...kategoriList.map((k) => k.id)) + 1 : 1
        const newKat = {
          id: nextId,
          nama: String(payload.nama || ''),
          is_active: true,
          jumlah_item: 0,
        }
        kategoriList.push(newKat)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kategori berhasil dibuat',
            data: {
              id: newKat.id,
              nama: newKat.nama,
              urutan: Number(payload.urutan) || newKat.id,
              isActive: true,
              aktif: true,
              jumlahItem: 0,
            },
          },
        }
      }

      if (method === 'put' && targetId) {
        const idx = kategoriList.findIndex((k) => k.id === targetId)
        if (idx === -1) return { status: 404, data: { message: 'Kategori tidak ditemukan' } }
        kategoriList[idx] = {
          ...kategoriList[idx],
          nama: String(payload.nama || kategoriList[idx].nama),
        }
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kategori berhasil diperbarui',
            data: {
              id: kategoriList[idx].id,
              nama: kategoriList[idx].nama,
              urutan: Number(payload.urutan) || kategoriList[idx].id,
              isActive: kategoriList[idx].is_active,
              aktif: kategoriList[idx].is_active,
              jumlahItem: menuList.filter((m) => m.kategori_id === targetId && m.is_active).length,
            },
          },
        }
      }

      if (method === 'delete' && targetId) {
        // Pengecekan aturan bisnis: jika kategori masih digunakan menu aktif, tidak bisa dihapus
        const activeUsage = menuList.some((m) => m.kategori_id === targetId && m.is_active)
        if (activeUsage) {
          return {
            status: 400,
            data: {
              code: 400,
              status: 'BAD_REQUEST',
              message: 'Kategori ini masih digunakan oleh menu aktif. Nonaktifkan atau pindahkan menu terlebih dahulu sebelum menghapus kategori.',
            },
          }
        }
        const idx = kategoriList.findIndex((k) => k.id === targetId)
        if (idx !== -1) {
          kategoriList[idx].is_active = false
        }
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kategori berhasil dinonaktifkan',
          },
        }
      }
    }

    // --- Storage Upload File ---
    if (url.includes('/api/storage/upload') && method === 'post') {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Berkas berhasil diunggah',
          data: {
            path: 'sekolah-10/menu/upload-preview.jpg',
            url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            namaAsli: 'foto-produk.jpg',
            ukuran: 154200,
          },
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

    // --- 6. TU: Pencarian Siswa & Kartu Tamu (Backend-aligned /api/kartu-tamu) ---
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

    // Saldo Query: GET /api/saldo?subjekTipe=KARTU_TAMU&subjekId=...
    if (url.includes('/api/saldo') && !url.includes('/api/saldo/topup') && !url.includes('/api/saldo/koreksi') && method === 'get') {
      const urlObj = new URL(url, 'http://localhost')
      const subjekTipe = urlObj.searchParams.get('subjekTipe')
      const subjekId = Number(urlObj.searchParams.get('subjekId'))
      if (subjekTipe === 'KARTU_TAMU') {
        const kt = kartuTamuList.find((k) => k.id === subjekId)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: {
              saldo: kt ? kt.saldo : 0,
              belanjaHariIni: 0,
              limitHarian: null,
            },
          },
        }
      }
    }

    // Koreksi Saldo: POST /api/saldo/koreksi
    if (url.includes('/api/saldo/koreksi') && method === 'post') {
      const subjekTipe = (payload.subjekTipe as string) || 'KARTU_TAMU'
      const subjekId = Number(payload.subjekId)
      const arah = (payload.arah as string) || 'DEBIT'
      const nominal = Number(payload.nominal) || 0
      if (subjekTipe === 'KARTU_TAMU') {
        const kt = kartuTamuList.find((k) => k.id === subjekId)
        if (kt) {
          if (arah === 'DEBIT') {
            kt.saldo = Math.max(0, kt.saldo - nominal)
          } else {
            kt.saldo += nominal
          }
        }
      }
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Koreksi saldo berhasil',
          data: {
            subjekId,
            nominal,
            arah,
          },
        },
      }
    }

    // Kartu Tamu Endpoints: /api/kartu-tamu and /api/v1/tu/kartu-tamu
    if (url.includes('/api/kartu-tamu') || url.includes('/api/v1/tu/kartu-tamu')) {
      // POST: Buat kartu baru
      if (method === 'post') {
        const nomor = (payload.nomorKartu as string) || (payload.nomor_kartu as string) || `KT-00${kartuTamuList.length + 1}`
        const uid = (payload.rfidUid as string) || (payload.uid as string) || `04KT${Date.now().toString().slice(-4)}`
        const catatan = (payload.catatan as string) || (payload.label_pemegang as string) || ''
        const newCard: KartuTamuMock = {
          id: Date.now(),
          nomor_kartu: nomor,
          uid,
          label_pemegang: catatan,
          saldo: 0,
          is_active: true,
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
        }
        kartuTamuList.push(newCard)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kartu tamu berhasil dibuat',
            data: {
              ...newCard,
              nomorKartu: newCard.nomor_kartu,
              rfidUid: newCard.uid,
              catatan: newCard.label_pemegang,
              aktif: newCard.is_active,
              sekolahId: 10,
              dibuatOleh: 1,
              dibuatPada: newCard.created_at,
            },
          },
        }
      }

      // PUT: Update kartu / unblock
      if (method === 'put') {
        const match = url.match(/\/kartu-tamu\/(\d+)/)
        const id = match ? Number(match[1]) : 0
        const card = kartuTamuList.find((k) => k.id === id)
        if (card) {
          if (payload.aktif !== undefined) {
            card.is_active = Boolean(payload.aktif)
            card.status = payload.aktif ? 'AVAILABLE' : 'BLOCKED'
          }
          if (payload.catatan !== undefined) {
            card.label_pemegang = String(payload.catatan)
          }
          if (payload.nomorKartu) {
            card.nomor_kartu = String(payload.nomorKartu)
          }
          if (payload.rfidUid) {
            card.uid = String(payload.rfidUid)
          }
        }
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kartu tamu berhasil diperbarui',
            data: card,
          },
        }
      }

      // DELETE: Nonaktifkan / blokir kartu
      if (method === 'delete') {
        const match = url.match(/\/kartu-tamu\/(\d+)/)
        const id = match ? Number(match[1]) : 0
        const card = kartuTamuList.find((k) => k.id === id)
        if (card) {
          card.is_active = false
          card.status = 'BLOCKED'
        }
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            message: 'Kartu tamu berhasil dinonaktifkan',
            data: { aktif: false },
          },
        }
      }

      // GET: Ambil daftar kartu tamu
      if (method === 'get') {
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: kartuTamuList.map((k) => ({
              ...k,
              nomorKartu: k.nomor_kartu,
              rfidUid: k.uid,
              catatan: k.label_pemegang,
              aktif: k.is_active,
              sekolahId: 10,
              dibuatOleh: 1,
              dibuatPada: k.created_at,
            })),
          },
        }
      }
    }

    // --- 7. TU: Topup Tunai Saldo Siswa (Sesuai Backend SaldoController /api/saldo/topup) ---
    if ((url.includes('/api/saldo/topup') || url.includes('/api/v1/tu/topup')) && method === 'post') {
      const subjekTipe = (payload.subjekTipe as string) || 'SISWA'
      const subjekId = Number(payload.subjekId ?? payload.siswa_id)
      const nominal = Number(payload.nominal) || 0
      const penyetor = (payload.penyetor as string) || (payload.nama_penyetor as string) || 'Orang Tua / Wali'
      const petugasNama = (payload.petugas_nama as string) || 'Wibisana Bama (Petugas TU)'

      const now = new Date()
      const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randomSeq = Math.floor(1000 + Math.random() * 9000)
      const referensiId = (payload.referensiId as string) || `TU-TOPUP-${dateCode}-${randomSeq}`

      if (!subjekId || nominal <= 0) {
        return { status: 400, data: { message: 'ID subjek dan nominal top-up valid wajib diisi' } }
      }

      if (!referensiId || referensiId.trim() === '') {
        return { status: 400, data: { message: 'Nomor referensi/bukti wajib diisi' } }
      }

      if (subjekTipe === 'SISWA') {
        const siswa = siswaList.find((s) => s.siswa_id === subjekId)
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

        return {
          status: 200,
          data: {
            code: 200,
            responseCode: 200,
            status: 'SUCCESS',
            message: 'Top-up berhasil',
            data: {
              mutasi: {
                id: Date.now(),
                sekolahId: 10,
                subjekTipe: 'SISWA',
                subjekId: siswa.siswa_id,
                arah: 'KREDIT',
                jenis: 'TOPUP_TUNAI',
                nominal,
                saldoSetelah: saldoBaru,
                idempotencyKey: `TOPUP-TUNAI-${referensiId}`,
                referensiTipe: 'TOPUP',
                referensiId,
                keterangan: `Top-up tunai oleh ${penyetor}`,
                aktorId: 1,
                waktu: now.toISOString(),
                createdAt: now.toISOString(),
              },
              saldoSetelah: saldoBaru,
              idempotentReplay: false,
              // Backward compatibility fields for UI
              ref_no: referensiId,
              waktu: now.toISOString(),
              petugas_nama: petugasNama,
              nama_penyetor: penyetor,
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
      } else {
        // KARTU_TAMU
        const kartuTamu = kartuTamuList.find((k) => k.id === subjekId)
        if (!kartuTamu) {
          return { status: 404, data: { message: 'Kartu tamu tidak ditemukan' } }
        }
        kartuTamu.saldo += nominal

        return {
          status: 200,
          data: {
            code: 200,
            responseCode: 200,
            status: 'SUCCESS',
            message: 'Top-up kartu tamu berhasil',
            data: {
              mutasi: {
                id: Date.now(),
                sekolahId: 10,
                subjekTipe: 'KARTU_TAMU',
                subjekId: kartuTamu.id,
                arah: 'KREDIT',
                jenis: 'TOPUP_TUNAI',
                nominal,
                saldoSetelah: kartuTamu.saldo,
                idempotencyKey: `TOPUP-TUNAI-${referensiId}`,
                referensiTipe: 'TOPUP',
                referensiId,
                keterangan: `Top-up tunai kartu tamu oleh ${penyetor}`,
                aktorId: 1,
                waktu: now.toISOString(),
                createdAt: now.toISOString(),
              },
              saldoSetelah: kartuTamu.saldo,
              idempotentReplay: false,
            },
          },
        }
      }
    }

    return null
  }
}
