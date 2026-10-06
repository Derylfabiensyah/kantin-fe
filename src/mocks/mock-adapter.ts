/**
 * Mock API Adapter untuk Axios pada kantin-fe
 * Mengintersep request saat VITE_USE_MOCK=true sehingga tim frontend bisa mengembangkan UI
 * tanpa perlu menunggu backend berjalan.
 */
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  MOCK_MENU,
  MOCK_KATEGORI,
  MOCK_SISWA,
  MOCK_KARTU_TAMU,
  MOCK_SETORAN_KAS,
  MOCK_KOREKSI_BENDAHARA,
  MOCK_TRANSAKSI_SESI_TUTUP,
  type MenuItemMock,
  type KartuSiswaMock,
  type KartuTamuMock,
  type SetoranKasTUMock,
  type MutasiKoreksiMock,
  type TransaksiSesiTutupMock,
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
  const setoranKasList: SetoranKasTUMock[] = JSON.parse(
    JSON.stringify(MOCK_SETORAN_KAS)
  )
  const koreksiList: MutasiKoreksiMock[] = JSON.parse(
    JSON.stringify(MOCK_KOREKSI_BENDAHARA)
  )
  const transaksiSesiTutupList: TransaksiSesiTutupMock[] = JSON.parse(
    JSON.stringify(MOCK_TRANSAKSI_SESI_TUTUP)
  )

  interface MockRiwayatItem {
    id: number
    menuId: number
    menuNama: string
    arah: 'MASUK' | 'KELUAR'
    jenis: string
    qty: number
    hargaBeliSatuan: number | null
    totalNilai: number | null
    hppSnapshot: number
    stokSetelah: number
    referensiTipe: string
    referensiId: string
    alasan: string | null
    mutasiAsalId: number | null
    sudahDibalik: number | null
    sisaDapatDibalik: number | null
    dapatDibalik: boolean
    aktorId: number
    waktu: string
  }

  const riwayatStokList: MockRiwayatItem[] = [
    {
      id: 1,
      menuId: 1,
      menuNama: 'Nasi Kuning Komplit',
      arah: 'MASUK',
      jenis: 'BARANG_MASUK',
      qty: 25,
      hargaBeliSatuan: 10000,
      totalNilai: 250000,
      hppSnapshot: 10000,
      stokSetelah: 25,
      referensiTipe: 'BARANG_MASUK',
      referensiId: 'BM-20261005-001',
      alasan: null,
      mutasiAsalId: null,
      sudahDibalik: 0,
      sisaDapatDibalik: 25,
      dapatDibalik: true,
      aktorId: 1,
      waktu: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 2,
      menuId: 2,
      menuNama: 'Es Teh Manis',
      arah: 'MASUK',
      jenis: 'BARANG_MASUK',
      qty: 50,
      hargaBeliSatuan: 2000,
      totalNilai: 100000,
      hppSnapshot: 2000,
      stokSetelah: 50,
      referensiTipe: 'BARANG_MASUK',
      referensiId: 'BM-20261005-002',
      alasan: null,
      mutasiAsalId: null,
      sudahDibalik: 0,
      sisaDapatDibalik: 50,
      dapatDibalik: true,
      aktorId: 1,
      waktu: new Date(Date.now() - 43200000).toISOString(),
    },
  ]

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
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
    }
  )

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
      const email = String(
        payload.email || payload.username || ''
      ).toLowerCase()
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
      let roleList = [
        'ROLE_ADMIN',
        'ROLE_PENGELOLA_KANTIN',
        'ROLE_PETUGAS_KANTIN',
        'ROLE_TU_SEKOLAH',
        'ROLE_BENDAHARA',
      ]
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
          if (!item)
            return { status: 404, data: { message: 'Menu tidak ditemukan' } }
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
        const nextId =
          menuList.length > 0 ? Math.max(...menuList.map((m) => m.id)) + 1 : 1
        const kat = kategoriList.find(
          (k) => k.id === Number(payload.kategoriId)
        )
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
        if (idx === -1)
          return { status: 404, data: { message: 'Menu tidak ditemukan' } }
        const kat = kategoriList.find(
          (k) => k.id === Number(payload.kategoriId)
        )
        menuList[idx] = {
          ...menuList[idx],
          nama: String(payload.nama || menuList[idx].nama),
          kategori_id: Number(payload.kategoriId) || menuList[idx].kategori_id,
          kategori_nama: kat ? kat.nama : menuList[idx].kategori_nama,
          harga_jual:
            payload.hargaJual !== undefined
              ? Number(payload.hargaJual)
              : menuList[idx].harga_jual,
          satuan: String(payload.satuan || menuList[idx].satuan),
          stok_minimum:
            payload.stokMinimum !== undefined
              ? Number(payload.stokMinimum)
              : menuList[idx].stok_minimum,
          foto_url:
            payload.fotoUrl !== undefined
              ? String(payload.fotoUrl || '')
              : menuList[idx].foto_url,
          is_active:
            payload.aktif !== undefined
              ? Boolean(payload.aktif)
              : menuList[idx].is_active,
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
        if (idx === -1)
          return { status: 404, data: { message: 'Menu tidak ditemukan' } }
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
          jumlahItem: menuList.filter(
            (m) => m.kategori_id === k.id && m.is_active
          ).length,
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
        const nextId =
          kategoriList.length > 0
            ? Math.max(...kategoriList.map((k) => k.id)) + 1
            : 1
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
        if (idx === -1)
          return { status: 404, data: { message: 'Kategori tidak ditemukan' } }
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
              jumlahItem: menuList.filter(
                (m) => m.kategori_id === targetId && m.is_active
              ).length,
            },
          },
        }
      }

      if (method === 'delete' && targetId) {
        // Pengecekan aturan bisnis: jika kategori masih digunakan menu aktif, tidak bisa dihapus
        const activeUsage = menuList.some(
          (m) => m.kategori_id === targetId && m.is_active
        )
        if (activeUsage) {
          return {
            status: 400,
            data: {
              code: 400,
              status: 'BAD_REQUEST',
              message:
                'Kategori ini masih digunakan oleh menu aktif. Nonaktifkan atau pindahkan menu terlebih dahulu sebelum menghapus kategori.',
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
        return {
          status: 400,
          data: { message: 'UID kartu tidak boleh kosong' },
        }
      }

      // Validasi 1: Kartu dikenal?
      const siswa = siswaList.find(
        (s) => s.uid.toUpperCase() === kartuUid.toUpperCase()
      )
      const kartuTamu = kartuTamuList.find(
        (k) => k.uid.toUpperCase() === kartuUid.toUpperCase()
      )

      if (!siswa && !kartuTamu) {
        return { status: 404, data: { message: 'Kartu tidak dikenal' } }
      }

      // Validasi 2: Kartu diblokir?
      if (siswa?.is_blocked || (kartuTamu && !kartuTamu.is_active)) {
        return {
          status: 400,
          data: {
            message: siswa
              ? 'Kartu diblokir, hubungi orang tua'
              : 'Kartu tamu diblokir',
          },
        }
      }

      // Hitung total belanja
      let totalBelanja = 0
      for (const cartItem of items) {
        const menuItem = menuList.find((m) => m.id === cartItem.menu_id)
        if (!menuItem) {
          return {
            status: 404,
            data: { message: `Menu ID ${cartItem.menu_id} tidak ditemukan` },
          }
        }

        // Validasi 4: Stok cukup?
        if (menuItem.stok < cartItem.qty) {
          return {
            status: 400,
            data: {
              message: `Stok ${menuItem.nama} tidak cukup (sisa ${menuItem.stok})`,
            },
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
          const sisaLimit = Math.max(
            0,
            siswa.limit_harian - siswa.belanja_hari_ini
          )
          return {
            status: 400,
            data: {
              message: `Melebihi limit harian (sisa Rp ${sisaLimit.toLocaleString('id-ID')})`,
            },
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
    if (
      (url.includes('/api/v1/tu/siswa') || url.includes('/api/tu/siswa')) &&
      method === 'get'
    ) {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: siswaList,
        },
      }
    }

    // --- 7. TU: Setoran Kas TU Harian ---
    // GET /api/v1/tu/setoran or /api/tu/setoran
    if (
      (url.includes('/api/v1/tu/setoran') || url.includes('/api/tu/setoran')) &&
      !url.includes('/konfirmasi') &&
      method === 'get'
    ) {
      const urlObj = new URL(url, 'http://localhost')
      const tanggalParam = urlObj.searchParams.get('tanggal')
      const petugasIdParam = urlObj.searchParams.get('petugasId')
      const statusParam = urlObj.searchParams.get('status')

      let filtered = [...setoranKasList]
      if (tanggalParam) {
        filtered = filtered.filter((s) => s.tanggal === tanggalParam)
      }
      if (petugasIdParam) {
        filtered = filtered.filter(
          (s) => s.petugas_id === Number(petugasIdParam)
        )
      }
      if (statusParam && statusParam !== 'ALL') {
        filtered = filtered.filter((s) => s.status === statusParam)
      }

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Daftar setoran kas TU berhasil diambil',
          data: filtered,
        },
      }
    }

    // POST /api/v1/tu/setoran/konfirmasi or /api/tu/setoran/konfirmasi or /api/v1/tu/setoran/:id/konfirmasi
    if (
      (url.includes('/api/v1/tu/setoran') || url.includes('/api/tu/setoran')) &&
      (url.includes('/konfirmasi') || method === 'post')
    ) {
      const idMatch = url.match(/\/setoran\/([^/]+)\/konfirmasi/)
      const targetId =
        (idMatch ? idMatch[1] : (payload.id as string)) ||
        (payload.setoran_id as string)
      const uangFisik = Number(payload.uang_fisik ?? payload.uangFisik) || 0
      const catatan = String(payload.catatan ?? payload.keterangan ?? '').trim()
      const bendaharaNama = String(
        payload.bendahara_nama ?? 'Siti Rahma (Bendahara)'
      )

      const setoranIdx = setoranKasList.findIndex((s) => s.id === targetId)
      if (setoranIdx === -1) {
        return {
          status: 404,
          data: {
            code: 404,
            status: 'NOT_FOUND',
            message: `Setoran kas dengan ID ${targetId} tidak ditemukan`,
          },
        }
      }

      const item = setoranKasList[setoranIdx]
      const selisih = uangFisik - item.total_sistem

      if (selisih !== 0 && !catatan) {
        return {
          status: 400,
          data: {
            code: 400,
            status: 'BAD_REQUEST',
            message:
              'Terdapat selisih kas fisik! Alasan / Berita acara selisih wajib diisi.',
          },
        }
      }

      setoranKasList[setoranIdx] = {
        ...item,
        uang_fisik: uangFisik,
        selisih,
        status: 'TERKONFIRMASI',
        catatan:
          catatan ||
          (selisih === 0
            ? 'Uang fisik pas sesuai total sistem'
            : `Selisih kas ${selisih < 0 ? 'kurang' : 'lebih'} Rp ${Math.abs(selisih).toLocaleString('id-ID')}`),
        bendahara_id: 10,
        bendahara_nama: bendaharaNama,
        konfirmasi_pada: new Date().toISOString(),
      }

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Setoran kas TU berhasil dikonfirmasi bendahara',
          data: setoranKasList[setoranIdx],
        },
      }
    }

    // --- 8. Saldo Query (Siswa & Kartu Tamu) ---
    // GET /api/saldo?subjekTipe=...&subjekId=...
    if (
      url.includes('/api/saldo') &&
      !url.includes('/api/saldo/topup') &&
      !url.includes('/api/saldo/koreksi') &&
      method === 'get'
    ) {
      const urlObj = new URL(url, 'http://localhost')
      const subjekTipe = urlObj.searchParams.get('subjekTipe') || 'SISWA'
      const subjekId = Number(urlObj.searchParams.get('subjekId'))

      if (subjekTipe === 'KARTU_TAMU') {
        const kt = kartuTamuList.find((k) => k.id === subjekId)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: {
              subjekTipe: 'KARTU_TAMU',
              subjekId,
              saldo: kt ? kt.saldo : 0,
              belanjaHariIni: 0,
              limitHarian: null,
              mutasiTerbaru: [],
            },
          },
        }
      } else {
        const siswa = siswaList.find((s) => s.siswa_id === subjekId)
        return {
          status: 200,
          data: {
            code: 200,
            status: 'SUCCESS',
            data: {
              subjekTipe: 'SISWA',
              subjekId,
              saldo: siswa ? siswa.saldo : 0,
              belanjaHariIni: siswa ? siswa.belanja_hari_ini : 0,
              limitHarian: siswa ? siswa.limit_harian : null,
              mutasiTerbaru: [],
            },
          },
        }
      }
    }

    // --- 9. Mutasi Koreksi Bendahara ---
    // GET /api/saldo/koreksi (Riwayat Mutasi Koreksi)
    if (
      (url.includes('/api/saldo/koreksi') ||
        url.includes('/api/v1/bendahara/koreksi')) &&
      method === 'get'
    ) {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Daftar riwayat mutasi koreksi bendahara berhasil dimuat',
          data: koreksiList,
        },
      }
    }

    // GET /api/transaksi/sesi-tutup or /api/v1/kasir/transaksi-lampau
    if (
      (url.includes('/api/transaksi/sesi-tutup') ||
        url.includes('/api/v1/kasir/transaksi-lampau')) &&
      method === 'get'
    ) {
      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          data: transaksiSesiTutupList,
        },
      }
    }

    // POST /api/saldo/koreksi (Eksekusi Koreksi Saldo / Pembalik Transaksi)
    if (url.includes('/api/saldo/koreksi') && method === 'post') {
      const subjekTipe =
        ((payload.subjekTipe || payload.subjek_tipe) as string) || 'SISWA'
      const subjekId = Number(payload.subjekId ?? payload.subjek_id)
      const arah = String(payload.arah || 'DEBIT').toUpperCase() as
        | 'DEBIT'
        | 'KREDIT'
      const nominal = Number(payload.nominal) || 0
      const alasan = String(payload.alasan || '').trim()
      const referensiId = String(
        payload.referensiId ||
          payload.referensi_id ||
          `BA-KOR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
      ).trim()
      const jenisKoreksi = String(
        payload.jenisKoreksi || payload.jenis_koreksi || 'PENYESUAIAN_AUDIT'
      ) as
        | 'SALAH_INPUT_TOPUP'
        | 'PEMBALIK_TRANSAKSI_KASIR'
        | 'PENYESUAIAN_AUDIT'
      const transaksiTerkaitId =
        payload.transaksiTerkaitId || payload.transaksi_terkait_id

      if (!subjekId || nominal <= 0) {
        return {
          status: 400,
          data: {
            code: 400,
            status: 'BAD_REQUEST',
            message: 'Subjek ID dan nominal koreksi valid (> 0) wajib diisi',
          },
        }
      }

      if (!alasan) {
        return {
          status: 400,
          data: {
            code: 400,
            status: 'BAD_REQUEST',
            message: 'Alasan koreksi audit wajib diisi (PRD §9.2 & §11.7)',
          },
        }
      }

      if (!referensiId) {
        return {
          status: 400,
          data: {
            code: 400,
            status: 'BAD_REQUEST',
            message:
              'Nomor Berita Acara / Referensi koreksi wajib diisi untuk integritas audit & idempotency',
          },
        }
      }

      let subjekNama: string
      let subjekInfo: string
      let saldoSebelum: number
      let saldoSetelah: number

      if (subjekTipe === 'SISWA') {
        const siswa = siswaList.find((s) => s.siswa_id === subjekId)
        if (!siswa) {
          return {
            status: 404,
            data: {
              code: 404,
              status: 'NOT_FOUND',
              message: 'Siswa tidak ditemukan',
            },
          }
        }
        subjekNama = siswa.nama
        subjekInfo = `${siswa.kelas} (NIS: ${siswa.nis})`
        saldoSebelum = siswa.saldo

        if (arah === 'DEBIT') {
          if (siswa.saldo < nominal) {
            return {
              status: 400,
              data: {
                code: 400,
                status: 'BAD_REQUEST',
                message: `Koreksi DEBIT ditolak: Saldo siswa saat ini (Rp ${siswa.saldo.toLocaleString('id-ID')}) tidak mencukupi untuk dikurangi Rp ${nominal.toLocaleString('id-ID')} (saldo tidak boleh minus)`,
              },
            }
          }
          siswa.saldo -= nominal
        } else {
          siswa.saldo += nominal
        }
        saldoSetelah = siswa.saldo
      } else {
        // KARTU_TAMU
        const kt = kartuTamuList.find((k) => k.id === subjekId)
        if (!kt) {
          return {
            status: 404,
            data: {
              code: 404,
              status: 'NOT_FOUND',
              message: 'Kartu tamu tidak ditemukan',
            },
          }
        }
        subjekNama = kt.label_pemegang || `Kartu ${kt.nomor_kartu}`
        subjekInfo = `Kartu: ${kt.nomor_kartu}`
        saldoSebelum = kt.saldo

        if (arah === 'DEBIT') {
          if (kt.saldo < nominal) {
            return {
              status: 400,
              data: {
                code: 400,
                status: 'BAD_REQUEST',
                message: `Koreksi DEBIT ditolak: Saldo kartu tamu saat ini (Rp ${kt.saldo.toLocaleString('id-ID')}) tidak mencukupi untuk dikurangi Rp ${nominal.toLocaleString('id-ID')}`,
              },
            }
          }
          kt.saldo -= nominal
        } else {
          kt.saldo += nominal
        }
        saldoSetelah = kt.saldo
      }

      // Tandai transaksi sesi tutup terkait jika ada
      if (transaksiTerkaitId) {
        const trIdx = transaksiSesiTutupList.findIndex(
          (t) => t.id === String(transaksiTerkaitId)
        )
        if (trIdx !== -1) {
          transaksiSesiTutupList[trIdx].status = 'DIKOREKSI'
          transaksiSesiTutupList[trIdx].koreksi_referensi_id = referensiId
        }
      }

      const newKoreksi: MutasiKoreksiMock = {
        id: `KOR-${Date.now()}`,
        referensi_id: referensiId,
        waktu: new Date().toISOString(),
        subjek_tipe: subjekTipe as 'SISWA' | 'KARTU_TAMU',
        subjek_id: subjekId,
        subjek_nama: subjekNama,
        subjek_info: subjekInfo,
        jenis_koreksi: jenisKoreksi,
        arah,
        nominal,
        saldo_sebelum: saldoSebelum,
        saldo_setelah: saldoSetelah,
        alasan,
        bendahara_id: 10,
        bendahara_nama: 'Siti Rahma (Bendahara)',
        transaksi_terkait_id: transaksiTerkaitId
          ? String(transaksiTerkaitId)
          : undefined,
      }

      koreksiList.unshift(newKoreksi)

      return {
        status: 200,
        data: {
          code: 200,
          status: 'SUCCESS',
          message: 'Mutasi koreksi bendahara berhasil dicatat di ledger saldo',
          data: {
            subjekTipe,
            subjekId,
            nominal,
            arah,
            saldoSebelum,
            saldoSetelah,
            referensiId,
            alasan,
            mutasi: newKoreksi,
          },
        },
      }
    }

    // Kartu Tamu Endpoints: /api/kartu-tamu and /api/v1/tu/kartu-tamu
    if (
      url.includes('/api/kartu-tamu') ||
      url.includes('/api/v1/tu/kartu-tamu')
    ) {
      // POST: Buat kartu baru
      if (method === 'post') {
        const nomor =
          (payload.nomorKartu as string) ||
          (payload.nomor_kartu as string) ||
          `KT-00${kartuTamuList.length + 1}`
        const uid =
          (payload.rfidUid as string) ||
          (payload.uid as string) ||
          `04KT${Date.now().toString().slice(-4)}`
        const catatan =
          (payload.catatan as string) ||
          (payload.label_pemegang as string) ||
          ''
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
    if (
      (url.includes('/api/saldo/topup') || url.includes('/api/v1/tu/topup')) &&
      method === 'post'
    ) {
      const subjekTipe = (payload.subjekTipe as string) || 'SISWA'
      const subjekId = Number(payload.subjekId ?? payload.siswa_id)
      const nominal = Number(payload.nominal) || 0
      const penyetor =
        (payload.penyetor as string) ||
        (payload.nama_penyetor as string) ||
        'Orang Tua / Wali'
      const petugasNama =
        (payload.petugas_nama as string) || 'Wibisana Bama (Petugas TU)'

      const now = new Date()
      const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '')
      const randomSeq = Math.floor(1000 + Math.random() * 9000)
      const referensiId =
        (payload.referensiId as string) || `TU-TOPUP-${dateCode}-${randomSeq}`

      if (!subjekId || nominal <= 0) {
        return {
          status: 400,
          data: { message: 'ID subjek dan nominal top-up valid wajib diisi' },
        }
      }

      if (!referensiId || referensiId.trim() === '') {
        return {
          status: 400,
          data: { message: 'Nomor referensi/bukti wajib diisi' },
        }
      }

      if (subjekTipe === 'SISWA') {
        const siswa = siswaList.find((s) => s.siswa_id === subjekId)
        if (!siswa) {
          return { status: 404, data: { message: 'Siswa tidak ditemukan' } }
        }

        if (siswa.is_blocked) {
          return {
            status: 400,
            data: { message: 'Top-up ditolak: Kartu siswa sedang diblokir' },
          }
        }

        const MAX_SALDO = 500000
        if (siswa.saldo + nominal > MAX_SALDO) {
          return {
            status: 400,
            data: {
              message: `Top-up ditolak: Saldo baru (Rp ${(
                siswa.saldo + nominal
              ).toLocaleString(
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
          return {
            status: 404,
            data: { message: 'Kartu tamu tidak ditemukan' },
          }
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

    // --- 8. Stok: Barang Masuk, Pembalik, dan Riwayat ---
    if (url.includes('/api/stok/barang-masuk-pembalik') && method === 'post') {
      const mutasiId = Number(payload.mutasiId)
      const targetMutasi = riwayatStokList.find((r) => r.id === mutasiId)
      if (!targetMutasi) {
        return {
          status: 404,
          data: { message: 'Data barang masuk tidak ditemukan' },
        }
      }

      const sisa = targetMutasi.sisaDapatDibalik ?? targetMutasi.qty
      const qtyBalik = payload.qty ? Math.min(sisa, Number(payload.qty)) : sisa
      if (qtyBalik <= 0 || qtyBalik > sisa) {
        return {
          status: 400,
          data: { message: 'Qty pembalik tidak valid atau melebihi sisa' },
        }
      }

      const alasan = String(payload.alasan || '').trim()
      if (!alasan) {
        return { status: 400, data: { message: 'Alasan pembalik wajib diisi' } }
      }

      const referensiId = String(
        payload.referensiId || `BMP-${Date.now()}`
      ).trim()

      const targetMenu = menuList.find((m) => m.id === targetMutasi.menuId)
      const stokSebelum = targetMenu ? targetMenu.stok : 0
      const stokSesudah = Math.max(0, stokSebelum - qtyBalik)
      if (targetMenu) {
        targetMenu.stok = stokSesudah
      }

      targetMutasi.sudahDibalik = (targetMutasi.sudahDibalik || 0) + qtyBalik
      targetMutasi.sisaDapatDibalik = sisa - qtyBalik
      targetMutasi.dapatDibalik = (targetMutasi.sisaDapatDibalik || 0) > 0

      const now = new Date()
      const newId =
        riwayatStokList.length > 0
          ? Math.max(...riwayatStokList.map((r) => r.id)) + 1
          : 1
      const mutasiPembalik: MockRiwayatItem = {
        id: newId,
        menuId: targetMutasi.menuId,
        menuNama: targetMutasi.menuNama,
        arah: 'KELUAR',
        jenis: 'BARANG_MASUK_PEMBALIK',
        qty: qtyBalik,
        hargaBeliSatuan: targetMutasi.hargaBeliSatuan,
        totalNilai: (targetMutasi.hargaBeliSatuan || 0) * qtyBalik,
        hppSnapshot: targetMutasi.hppSnapshot,
        stokSetelah: stokSesudah,
        referensiTipe: 'BARANG_MASUK_PEMBALIK',
        referensiId,
        alasan,
        mutasiAsalId: targetMutasi.id,
        sudahDibalik: null,
        sisaDapatDibalik: null,
        dapatDibalik: false,
        aktorId: 1,
        waktu: now.toISOString(),
      }
      riwayatStokList.unshift(mutasiPembalik)

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Barang masuk pembalik tercatat',
          data: {
            mutasiId: newId,
            menuId: targetMutasi.menuId,
            stokSebelum,
            stokSesudah,
            hppSebelum: targetMutasi.hppSnapshot,
            hppSesudah: targetMutasi.hppSnapshot,
            jenis: 'BARANG_MASUK_PEMBALIK',
            waktu: now.toISOString(),
          },
        },
      }
    }

    if (url.includes('/api/stok/barang-masuk') && method === 'post') {
      const menuId = Number(payload.menuId)
      const qty = Number(payload.qty) || 0
      const hargaBeli = Number(payload.hargaBeliPerUnit) || 0
      const referensiId = String(
        payload.referensiId || `BM-${Date.now()}`
      ).trim()

      if (!menuId || qty <= 0) {
        return { status: 400, data: { message: 'Menu ID dan Qty harus valid' } }
      }

      const targetMenu = menuList.find((m) => m.id === menuId)
      if (!targetMenu) {
        return { status: 404, data: { message: 'Menu tidak ditemukan' } }
      }

      const stokSebelum = targetMenu.stok
      const stokSesudah = stokSebelum + qty
      targetMenu.stok = stokSesudah

      const now = new Date()
      const newId =
        riwayatStokList.length > 0
          ? Math.max(...riwayatStokList.map((r) => r.id)) + 1
          : 1
      const itemMasuk: MockRiwayatItem = {
        id: newId,
        menuId,
        menuNama: targetMenu.nama,
        arah: 'MASUK',
        jenis: 'BARANG_MASUK',
        qty,
        hargaBeliSatuan: hargaBeli,
        totalNilai: qty * hargaBeli,
        hppSnapshot: hargaBeli,
        stokSetelah: stokSesudah,
        referensiTipe: 'BARANG_MASUK',
        referensiId,
        alasan: null,
        mutasiAsalId: null,
        sudahDibalik: 0,
        sisaDapatDibalik: qty,
        dapatDibalik: true,
        aktorId: 1,
        waktu: now.toISOString(),
      }
      riwayatStokList.unshift(itemMasuk)

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Barang masuk tercatat',
          data: {
            mutasiId: newId,
            menuId,
            stokSebelum,
            stokSesudah,
            hppSebelum: Math.round(targetMenu.harga_jual * 0.7),
            hppSesudah: hargaBeli,
            jenis: 'BARANG_MASUK',
            waktu: now.toISOString(),
          },
        },
      }
    }

    if (url.includes('/api/stok/opname-batch') && method === 'post') {
      const referensiId = String(
        payload.referensiId || `OPN-${Date.now()}`
      ).trim()
      const items =
        (payload.items as Array<{
          menuId: number
          qtyFisik: number
          alasan: string
          rusak?: boolean
        }>) || []

      const hasilItems: Array<{
        menuId: number
        stokSebelum: number
        stokFisik: number
        selisih: number
        jenis: string | null
        mutasiId: number | null
        stokSetelah: number
      }> = []

      let jumlahBerubah = 0
      let jumlahTanpaSelisih = 0
      const now = new Date()

      for (const it of items) {
        const targetMenu = menuList.find((m) => m.id === Number(it.menuId))
        const stokSebelum = targetMenu ? targetMenu.stok : 0
        const stokFisik = Number(it.qtyFisik) || 0
        const selisih = stokFisik - stokSebelum

        if (selisih === 0) {
          jumlahTanpaSelisih++
          hasilItems.push({
            menuId: Number(it.menuId),
            stokSebelum,
            stokFisik,
            selisih: 0,
            jenis: null,
            mutasiId: null,
            stokSetelah: stokSebelum,
          })
          continue
        }

        jumlahBerubah++
        const jenis =
          selisih < 0
            ? it.rusak
              ? 'BARANG_RUSAK'
              : 'OPNAME_KELUAR'
            : 'OPNAME_MASUK'

        const arah = selisih > 0 ? 'MASUK' : 'KELUAR'
        const stokSetelah = stokFisik
        if (targetMenu) {
          targetMenu.stok = stokSetelah
        }

        const newId =
          riwayatStokList.length > 0
            ? Math.max(...riwayatStokList.map((r) => r.id)) + 1
            : 1

        const itemMutasi: MockRiwayatItem = {
          id: newId,
          menuId: Number(it.menuId),
          menuNama: targetMenu ? targetMenu.nama : `Menu #${it.menuId}`,
          arah,
          jenis,
          qty: Math.abs(selisih),
          hargaBeliSatuan: targetMenu
            ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
            : 0,
          totalNilai:
            Math.abs(selisih) *
            (targetMenu
              ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
              : 0),
          hppSnapshot: targetMenu
            ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
            : 0,
          stokSetelah,
          referensiTipe: jenis,
          referensiId,
          alasan: it.alasan,
          mutasiAsalId: null,
          sudahDibalik: null,
          sisaDapatDibalik: null,
          dapatDibalik: false,
          aktorId: 1,
          waktu: now.toISOString(),
        }
        riwayatStokList.unshift(itemMutasi)

        hasilItems.push({
          menuId: Number(it.menuId),
          stokSebelum,
          stokFisik,
          selisih,
          jenis,
          mutasiId: newId,
          stokSetelah,
        })
      }

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Penyesuaian stok batch tercatat',
          data: {
            referensiId,
            jumlahBerubah,
            jumlahTanpaSelisih,
            items: hasilItems,
          },
        },
      }
    }

    if (
      url.includes('/api/stok/opname') &&
      !url.includes('/opname-batch') &&
      method === 'post'
    ) {
      const menuId = Number(payload.menuId)
      const qtyFisik = Number(payload.qtyFisik) || 0
      const alasan = String(payload.alasan || '').trim()
      const referensiId = String(
        payload.referensiId || `OPN-${Date.now()}`
      ).trim()

      const targetMenu = menuList.find((m) => m.id === menuId)
      const stokSebelum = targetMenu ? targetMenu.stok : 0
      const selisih = qtyFisik - stokSebelum

      if (targetMenu) {
        targetMenu.stok = qtyFisik
      }

      const jenis = selisih < 0 ? 'OPNAME_KELUAR' : 'OPNAME_MASUK'
      const arah = selisih > 0 ? 'MASUK' : 'KELUAR'
      const now = new Date()
      const newId =
        riwayatStokList.length > 0
          ? Math.max(...riwayatStokList.map((r) => r.id)) + 1
          : 1

      if (selisih !== 0) {
        const itemMutasi: MockRiwayatItem = {
          id: newId,
          menuId,
          menuNama: targetMenu ? targetMenu.nama : `Menu #${menuId}`,
          arah,
          jenis,
          qty: Math.abs(selisih),
          hargaBeliSatuan: targetMenu
            ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
            : 0,
          totalNilai:
            Math.abs(selisih) *
            (targetMenu
              ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
              : 0),
          hppSnapshot: targetMenu
            ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
            : 0,
          stokSetelah: qtyFisik,
          referensiTipe: jenis,
          referensiId,
          alasan,
          mutasiAsalId: null,
          sudahDibalik: null,
          sisaDapatDibalik: null,
          dapatDibalik: false,
          aktorId: 1,
          waktu: now.toISOString(),
        }
        riwayatStokList.unshift(itemMutasi)
      }

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Penyesuaian stok tercatat',
          data: {
            mutasiId: newId,
            menuId,
            stokSebelum,
            stokSesudah: qtyFisik,
            hppSebelum: targetMenu
              ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
              : 0,
            hppSesudah: targetMenu
              ? targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)
              : 0,
            jenis,
            waktu: now.toISOString(),
          },
        },
      }
    }

    if (url.includes('/api/stok/riwayat') && method === 'get') {
      const urlObj = new URL(url, 'http://localhost')
      const jenisParam = urlObj.searchParams.get('jenis')
      const menuIdParam = urlObj.searchParams.get('menuId')

      let filtered = [...riwayatStokList]
      if (jenisParam) {
        filtered = filtered.filter((r) => r.jenis === jenisParam)
      }
      if (menuIdParam) {
        filtered = filtered.filter((r) => r.menuId === Number(menuIdParam))
      }

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Riwayat mutasi stok berhasil dimuat',
          data: {
            items: filtered,
            total: filtered.length,
            halaman: 0,
            ukuran: 50,
            totalHalaman: 1,
          },
        },
      }
    }

    if (url.includes('/api/stok/menipis') && method === 'get') {
      const menipisList = menuList
        .filter((m) => m.stok <= m.stok_minimum)
        .map((m) => ({
          menuId: m.id,
          stok: m.stok,
          stokMinimum: m.stok_minimum,
          hpp: m.hpp || Math.round(m.harga_jual * 0.7),
          nilaiPersediaan: m.stok * (m.hpp || Math.round(m.harga_jual * 0.7)),
          menipis: true,
        }))

      return {
        status: 200,
        data: {
          code: 200,
          responseCode: 200,
          status: 'SUCCESS',
          message: 'Daftar stok menipis',
          data: menipisList,
        },
      }
    }

    const stokMenuMatch = url.match(/\/api\/stok\/(\d+)$/)
    if (stokMenuMatch && method === 'get') {
      const menuId = Number(stokMenuMatch[1])
      const targetMenu = menuList.find((m) => m.id === menuId)
      if (targetMenu) {
        return {
          status: 200,
          data: {
            code: 200,
            responseCode: 200,
            status: 'SUCCESS',
            message: 'Data stok menu',
            data: {
              menuId: targetMenu.id,
              stok: targetMenu.stok,
              stokMinimum: targetMenu.stok_minimum,
              hpp: targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7),
              nilaiPersediaan:
                targetMenu.stok *
                (targetMenu.hpp || Math.round(targetMenu.harga_jual * 0.7)),
              menipis: targetMenu.stok <= targetMenu.stok_minimum,
            },
          },
        }
      }
    }

    return null
  }
}
