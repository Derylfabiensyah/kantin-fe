import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X, ShoppingCart, Layers, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/stores/useCartStore'
import { formatRupiah } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { katalogApi } from '@/features/katalog/api/katalog-api'
import type { MenuItem, KategoriItem } from '@/features/katalog/types'
import CartSidebar from './components/CartSidebar'
import MenuGrid from './components/MenuGrid'

export const KasirPosPage: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [kategoris, setKategoris] = useState<KategoriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(
    null
  )
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const { addItem, getItemQty, totalItems, totalHarga } = useCartStore()

  // Muat data katalog menu & kategori
  const loadKatalogData = async () => {
    try {
      setLoading(true)
      const [menuData, kategoriData] = await Promise.all([
        katalogApi.getMenuList(undefined, true),
        katalogApi.getKategoriList(true),
      ])
      setMenus(menuData)
      setKategoris(kategoriData)
    } catch {
      toast.error('Gagal memuat katalog menu POS')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const [menuData, kategoriData] = await Promise.all([
          katalogApi.getMenuList(undefined, true),
          katalogApi.getKategoriList(true),
        ])
        if (isMounted) {
          setMenus(menuData)
          setKategoris(kategoriData)
          setLoading(false)
        }
      } catch {
        if (isMounted) {
          toast.error('Gagal memuat katalog menu POS')
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [])

  // Shortcut keyboard: tombol '/' untuk fokus input search, 'Escape' untuk bersihkan / blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (
        e.key === 'Escape' &&
        document.activeElement === searchInputRef.current
      ) {
        if (searchQuery) {
          setSearchQuery('')
        } else {
          searchInputRef.current?.blur()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  // Filter menu berdasarkan kategori & pencarian
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      // Hanya tampilkan menu yang berstatus aktif
      if (!item.aktif) return false

      // Filter kategori
      if (
        selectedKategoriId !== null &&
        item.kategoriId !== selectedKategoriId
      ) {
        return false
      }

      // Filter teks pencarian (case-insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchNama = item.nama.toLowerCase().includes(query)
        return matchNama
      }

      return true
    })
  }, [menus, selectedKategoriId, searchQuery])

  // Hitung jumlah item per kategori
  const kategoriCounts = useMemo(() => {
    const map = new Map<number, number>()
    menus.forEach((m) => {
      if (m.aktif && m.kategoriId) {
        map.set(m.kategoriId, (map.get(m.kategoriId) || 0) + 1)
      }
    })
    return map
  }, [menus])

  // Handler tambah menu ke keranjang
  const handleAddToCart = (menu: MenuItem) => {
    const res = addItem(menu)
    if (!res.success) {
      toast.warning(res.reason || 'Tidak dapat menambahkan menu')
    }
  }

  // Handler reset semua filter
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedKategoriId(null)
  }

  // Handler checkout / bayar
  const handleCheckout = () => {
    const count = totalItems()
    const nominal = totalHarga()
    if (count === 0) return
    toast.info(
      `Total belanja: ${formatRupiah(nominal)} (${count} item). Siap untuk tap kartu RFID.`
    )
  }

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedKategoriId !== null
  )

  return (
    <div className='flex h-full w-full overflow-hidden bg-background'>
      {/* Sisi Kiri: Katalog POS (Pencarian, Filter Kategori, Grid Menu) */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Top Control Bar: Search & Status */}
        <div className='flex flex-col gap-2.5 border-b bg-card/60 p-3 backdrop-blur-xs sm:p-4'>
          <div className='flex items-center gap-2'>
            {/* Input Pencarian dengan Shortcut '/' */}
            <div className='relative flex-1'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Cari menu makanan atau minuman... (Tekan "/" untuk mencari)'
                className='h-10 bg-background/80 pr-16 pl-9 text-sm shadow-2xs'
              />
              {searchQuery ? (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setSearchQuery('')}
                  className='absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  <X className='h-3.5 w-3.5' />
                </Button>
              ) : (
                <kbd className='pointer-events-none absolute top-1/2 right-2.5 hidden h-5 -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none sm:flex'>
                  /
                </kbd>
              )}
            </div>

            {/* Tombol Refresh Katalog */}
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={loadKatalogData}
              disabled={loading}
              className='h-10 w-10 shrink-0'
              title='Muat Ulang Menu'
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>

          {/* Filter Pills Kategori */}
          <div className='scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1'>
            <Button
              type='button'
              size='sm'
              variant={selectedKategoriId === null ? 'default' : 'outline'}
              onClick={() => setSelectedKategoriId(null)}
              className='h-8 shrink-0 touch-manipulation rounded-full px-3 text-xs font-semibold'
            >
              <Layers className='mr-1.5 h-3.5 w-3.5' />
              Semua Menu
              <Badge
                variant={selectedKategoriId === null ? 'secondary' : 'outline'}
                className='ml-1.5 h-4 px-1 text-[10px]'
              >
                {menus.filter((m) => m.aktif).length}
              </Badge>
            </Button>

            {kategoris.map((kat) => {
              const count = kategoriCounts.get(kat.id) || 0
              const isSelected = selectedKategoriId === kat.id

              return (
                <Button
                  key={kat.id}
                  type='button'
                  size='sm'
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedKategoriId(kat.id)}
                  className='h-8 shrink-0 touch-manipulation rounded-full px-3 text-xs font-semibold'
                >
                  {kat.nama}
                  <Badge
                    variant={isSelected ? 'secondary' : 'outline'}
                    className='ml-1.5 h-4 px-1 text-[10px]'
                  >
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Area Scrollable Katalog Menu */}
        <div className='flex-1 overflow-y-auto'>
          <MenuGrid
            menus={filteredMenus}
            loading={loading}
            getCartQty={getItemQty}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
            hasFilters={hasActiveFilters}
          />
        </div>

        {/* Floating Cart Trigger untuk Layar Mobile / Tablet Kecil (< lg) */}
        <div className='flex shrink-0 border-t bg-card p-3 shadow-lg lg:hidden'>
          <Button
            type='button'
            className='h-11 w-full justify-between font-bold'
            onClick={() => setMobileCartOpen(true)}
          >
            <div className='flex items-center gap-2'>
              <ShoppingCart className='h-4 w-4' />
              <span>Keranjang ({totalItems()} item)</span>
            </div>
            <span className='font-mono'>{formatRupiah(totalHarga())}</span>
          </Button>
        </div>
      </div>

      {/* Sisi Kanan: Panel Keranjang Belanja Desktop/Tablet Besar (>= lg) */}
      <div className='hidden h-full shrink-0 lg:flex'>
        <CartSidebar onCheckout={handleCheckout} />
      </div>

      {/* Mobile / Tablet Small Sheet Keranjang */}
      <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
        <SheetContent
          side='right'
          className='flex w-full flex-col p-0 sm:max-w-md'
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Keranjang Belanja Kasir</SheetTitle>
          </SheetHeader>
          <CartSidebar
            onCheckout={() => {
              setMobileCartOpen(false)
              handleCheckout()
            }}
            className='border-none'
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default KasirPosPage
