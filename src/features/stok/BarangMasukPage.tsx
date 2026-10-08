import { useState, useEffect } from 'react'
import {
  PlusCircle,
  History,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatNumber } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { katalogApi } from '@/features/katalog/api/katalog-api'
import type { MenuItem } from '@/features/katalog/types'
import { stokApi } from './api/stok-api'
import { BarangMasukForm } from './components/BarangMasukForm'
import { RiwayatStokTable } from './components/RiwayatStokTable'
import type { RiwayatStokItem, StokResponse, JenisMutasiStok } from './types'

export function BarangMasukPage() {
  const [activeTab, setActiveTab] = useState('form')
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [stokMenipis, setStokMenipis] = useState<StokResponse[]>([])
  const [riwayatItems, setRiwayatItems] = useState<RiwayatStokItem[]>([])
  const [totalRiwayat, setTotalRiwayat] = useState(0)
  const [loadingMenus, setLoadingMenus] = useState(true)
  const [loadingRiwayat, setLoadingRiwayat] = useState(false)

  // Filter riwayat
  const [selectedJenis, setSelectedJenis] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 20

  // Load menu katalog untuk dropdown
  const loadMenus = async () => {
    try {
      setLoadingMenus(true)
      const [menuData, menipisData] = await Promise.all([
        katalogApi.getMenuList(undefined, true),
        stokApi.getStokMenipis().catch(() => []),
      ])
      setMenus(menuData)
      setStokMenipis(menipisData)
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error.message || 'Gagal memuat katalog menu')
    } finally {
      setLoadingMenus(false)
    }
  }

  // Load riwayat mutasi stok
  const loadRiwayat = async (page = currentPage, jenis = selectedJenis) => {
    try {
      setLoadingRiwayat(true)
      const res = await stokApi.getRiwayatStok({
        halaman: page,
        ukuran: pageSize,
        jenis: jenis === 'all' ? undefined : (jenis as JenisMutasiStok),
      })
      setRiwayatItems(res.items || [])
      setTotalRiwayat(res.total || 0)
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error.message || 'Gagal memuat riwayat mutasi stok')
    } finally {
      setLoadingRiwayat(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const [menuData, menipisData, riwayatData] = await Promise.all([
          katalogApi.getMenuList(undefined, true),
          stokApi.getStokMenipis().catch(() => []),
          stokApi
            .getRiwayatStok({ halaman: 0, ukuran: pageSize })
            .catch(() => ({
              items: [],
              total: 0,
              halaman: 0,
              ukuran: pageSize,
              totalHalaman: 0,
            })),
        ])
        if (isMounted) {
          setMenus(menuData)
          setStokMenipis(menipisData)
          setRiwayatItems(riwayatData.items || [])
          setTotalRiwayat(riwayatData.total || 0)
          setLoadingMenus(false)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          toast.error(error.message || 'Gagal memuat data stok awal')
          setLoadingMenus(false)
        }
      }
    }
    void init()
    return () => {
      isMounted = false
    }
  }, [])

  const handleJenisFilterChange = (jenis: string) => {
    setSelectedJenis(jenis)
    setCurrentPage(0)
    void loadRiwayat(0, jenis)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    void loadRiwayat(newPage, selectedJenis)
  }

  const handleRestockSuccess = () => {
    // Refresh menus (untuk stok terbaru) dan riwayat
    void loadMenus()
    void loadRiwayat(0, selectedJenis)
    setActiveTab('riwayat')
  }

  return (
    <>
      {/* Top Header */}
      <Header fixed>
        <Search showKbd={false} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Page Title */}
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Pencatatan Barang Masuk (Restock)
          </h1>
          <p className='mt-1 text-xs text-muted-foreground'>
            Catat pembelian stok dari pemasok/supplier, simulasi otomatis HPP
            rata-rata tertimbang (PRD §7.4), dan koreksi entri pembalik.
          </p>
        </div>

        {/* Ringkasan Status Header Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Card className='border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md'>
            <CardContent className='p-4'>
              <p className='text-xs font-medium text-muted-foreground'>
                Menu Aktif di Katalog
              </p>
              <h3 className='mt-0.5 text-xl font-bold text-foreground'>
                {loadingMenus ? '...' : formatNumber(menus.length)} Menu
              </h3>
            </CardContent>
          </Card>

          <Card className='border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md'>
            <CardContent className='p-4'>
              <p className='text-xs font-medium text-muted-foreground'>
                Total Riwayat Mutasi
              </p>
              <h3 className='mt-0.5 text-xl font-bold text-foreground'>
                {formatNumber(totalRiwayat)} Transaksi
              </h3>
            </CardContent>
          </Card>

          <Card className='border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md'>
            <CardContent className='p-4'>
              <p className='text-xs font-medium text-muted-foreground'>
                Peringatan Stok Menipis
              </p>
              <h3 className='mt-0.5 text-xl font-bold text-amber-500'>
                {stokMenipis.length > 0 ? (
                  <span>{stokMenipis.length} Menu</span>
                ) : (
                  'Semua Aman'
                )}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Formulir Restock & Riwayat */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-4'
        >
          <TabsList className='grid w-full grid-cols-2 sm:w-[420px]'>
            <TabsTrigger
              value='form'
              className='flex items-center gap-1.5 text-xs'
            >
              <PlusCircle className='h-3.5 w-3.5' />
              Formulir Barang Masuk
            </TabsTrigger>
            <TabsTrigger
              value='riwayat'
              className='flex items-center gap-1.5 text-xs'
            >
              <History className='h-3.5 w-3.5' />
              Riwayat & Pembalik
            </TabsTrigger>
          </TabsList>

          <TabsContent value='form' className='space-y-4'>
            <BarangMasukForm menus={menus} onSuccess={handleRestockSuccess} />
          </TabsContent>

          <TabsContent value='riwayat' className='space-y-4'>
            <RiwayatStokTable
              items={riwayatItems}
              loading={loadingRiwayat}
              onRefresh={() => loadRiwayat(currentPage, selectedJenis)}
              totalCount={totalRiwayat}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              selectedJenis={selectedJenis}
              onJenisChange={handleJenisFilterChange}
            />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
