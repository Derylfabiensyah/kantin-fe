import React from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  Trash2,
  Calendar,
  User,
  Hash,
  Coins,
  Inbox,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatRupiah, formatNumber, formatDateTime } from '@/lib/formatters'
import type { RiwayatStokItem, JenisMutasiStok } from '../types'

interface KartuStokTimelineProps {
  items: RiwayatStokItem[]
  isLoading?: boolean
}

interface MutationMeta {
  label: string
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive'
  badgeClass: string
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
  sign: '+' | '-'
  isMasuk: boolean
}

function getMutationMeta(jenis: JenisMutasiStok): MutationMeta {
  switch (jenis) {
    case 'BARANG_MASUK':
      return {
        label: 'Barang Masuk (Restock)',
        badgeVariant: 'outline',
        badgeClass:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: ArrowDownLeft,
        iconClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
        sign: '+',
        isMasuk: true,
      }
    case 'BARANG_MASUK_PEMBALIK':
      return {
        label: 'Koreksi Pembalik',
        badgeVariant: 'outline',
        badgeClass:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: RotateCcw,
        iconClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
        sign: '-',
        isMasuk: false,
      }
    case 'PENJUALAN':
      return {
        label: 'Penjualan Kasir POS',
        badgeVariant: 'outline',
        badgeClass:
          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        icon: ShoppingCart,
        iconClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
        sign: '-',
        isMasuk: false,
      }
    case 'PENJUALAN_VOID':
      return {
        label: 'Pembatalan Transaksi (Void)',
        badgeVariant: 'outline',
        badgeClass:
          'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: RotateCcw,
        iconClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
        sign: '+',
        isMasuk: true,
      }
    case 'OPNAME_MASUK':
      return {
        label: 'Opname Fisik (Selisih Lebih)',
        badgeVariant: 'outline',
        badgeClass:
          'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
        icon: PlusCircle,
        iconClass: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
        sign: '+',
        isMasuk: true,
      }
    case 'OPNAME_KELUAR':
      return {
        label: 'Opname Fisik (Selisih Kurang)',
        badgeVariant: 'outline',
        badgeClass:
          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        icon: MinusCircle,
        iconClass: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
        sign: '-',
        isMasuk: false,
      }
    case 'BARANG_RUSAK':
      return {
        label: 'Barang Rusak / Basi',
        badgeVariant: 'destructive',
        badgeClass:
          'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
        icon: Trash2,
        iconClass: 'bg-red-500/10 text-red-600 border-red-500/30',
        sign: '-',
        isMasuk: false,
      }
    default:
      return {
        label: jenis,
        badgeVariant: 'secondary',
        badgeClass: 'bg-muted text-muted-foreground',
        icon: ArrowUpRight,
        iconClass: 'bg-muted text-muted-foreground border-border',
        sign: '-',
        isMasuk: false,
      }
  }
}

export function KartuStokTimeline({
  items,
  isLoading = false,
}: KartuStokTimelineProps) {
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center text-muted-foreground'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3' />
        <p className='text-sm'>Memuat linimasa mutasi kartu stok...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-12 text-center text-muted-foreground'>
          <Inbox className='h-12 w-12 text-muted-foreground/40 mb-3' />
          <h4 className='text-base font-semibold text-foreground'>
            Tidak Ada Mutasi Tercatat
          </h4>
          <p className='text-sm max-w-sm mt-1'>
            Belum ada pergerakan stok untuk menu dan rentang tanggal yang
            dipilih.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Sorting descending by time (terbaru di atas)
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime()
  )

  return (
    <div className='relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/70 space-y-6'>
      {sortedItems.map((item, index) => {
        const meta = getMutationMeta(item.jenis)
        const IconComponent = meta.icon
        const aktorDisplay = item.aktorNama || (item.aktorId ? `Aktor #${item.aktorId}` : 'Sistem')

        return (
          <div key={item.id ?? index} className='relative group'>
            {/* Dot / Icon marker on vertical line */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-110 ${meta.iconClass}`}
            >
              <IconComponent className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
            </div>

            {/* Card Content */}
            <Card className='transition-all duration-200 border-border/70 hover:border-border hover:shadow-md'>
              <CardContent className='p-4 sm:p-5'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 mb-3'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge
                      variant='outline'
                      className={`font-medium ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </Badge>
                    <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
                      <Hash className='h-3 w-3' />
                      <span className='font-mono font-medium text-foreground'>
                        {item.referensiId}
                      </span>
                    </span>
                  </div>

                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Calendar className='h-3.5 w-3.5' />
                    <span>{formatDateTime(item.waktu)}</span>
                  </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm'>
                  {/* Perubahan Qty */}
                  <div className='bg-muted/40 p-2.5 rounded-lg border'>
                    <span className='text-xs text-muted-foreground block mb-0.5'>
                      Perubahan Qty
                    </span>
                    <span
                      className={`text-base font-bold font-mono ${
                        meta.isMasuk
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {meta.sign}
                      {formatNumber(item.qty)} unit
                    </span>
                  </div>

                  {/* Saldo Berjalan */}
                  <div className='bg-muted/40 p-2.5 rounded-lg border'>
                    <span className='text-xs text-muted-foreground block mb-0.5'>
                      Saldo Akhir
                    </span>
                    <span className='text-base font-bold font-mono text-foreground'>
                      {formatNumber(item.stokSetelah)} unit
                    </span>
                  </div>

                  {/* Snapshot HPP */}
                  <div className='bg-muted/40 p-2.5 rounded-lg border'>
                    <span className='text-xs text-muted-foreground block mb-0.5'>
                      Snapshot HPP
                    </span>
                    <span className='text-sm font-semibold font-mono text-foreground'>
                      {formatRupiah(item.hppSnapshot)}
                    </span>
                  </div>

                  {/* Aktor */}
                  <div className='bg-muted/40 p-2.5 rounded-lg border'>
                    <span className='text-xs text-muted-foreground block mb-0.5'>
                      Dicatat Oleh
                    </span>
                    <span className='text-xs font-medium text-foreground flex items-center gap-1 truncate'>
                      <User className='h-3 w-3 text-muted-foreground shrink-0' />
                      <span className='truncate'>{aktorDisplay}</span>
                    </span>
                  </div>
                </div>

                {/* Harga Beli & Nilai Mutasi jika Barang Masuk */}
                {item.jenis === 'BARANG_MASUK' && item.hargaBeliSatuan && (
                  <div className='mt-3 pt-3 border-t flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                    <span className='inline-flex items-center gap-1'>
                      <Coins className='h-3.5 w-3.5 text-emerald-500' />
                      Harga Beli Satuan:{' '}
                      <strong className='text-foreground font-mono'>
                        {formatRupiah(item.hargaBeliSatuan)}
                      </strong>
                    </span>
                    {item.totalNilai && (
                      <span>
                        Total Faktur:{' '}
                        <strong className='text-foreground font-mono'>
                          {formatRupiah(item.totalNilai)}
                        </strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Alasan / Catatan jika ada */}
                {item.alasan && (
                  <div className='mt-3 pt-2.5 border-t text-xs'>
                    <span className='text-muted-foreground font-medium'>
                      Catatan / Alasan:{' '}
                    </span>
                    <span className='text-foreground italic'>
                      &ldquo;{item.alasan}&rdquo;
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
