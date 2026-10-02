import { Link, useRouterState } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const ROUTE_LABELS: Record<string, string> = {
  '': 'Dashboard',
  'menu': 'Katalog Menu',
  'kategori': 'Kategori Menu',
  'stok': 'Manajemen Stok',
  'masuk': 'Barang Masuk',
  'opname': 'Stok Opname',
  'kartu': 'Kartu Stok',
  'tu': 'Layanan TU',
  'topup': 'Top-up Tunai Siswa',
  'setoran': 'Setoran Kas TU',
  'kartu-tamu': 'Kartu Tamu',
  'saldo': 'Saldo Siswa',
  'refund': 'Refund Siswa Keluar',
  'kontrol-siswa': 'Kontrol Siswa (Ortu)',
  'laporan': 'Pusat Laporan',
  'rekonsiliasi': 'Rekonsiliasi Harian',
  'penjualan': 'Penjualan & Laba',
  'pengaturan': 'Pengaturan Kantin',
  'kasir': 'Kasir POS',
  'settings': 'Pengaturan Akun',
}

export function BreadcrumbNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  // Pisahkan path menjadi segmen bersih
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return (
      <Breadcrumb className='hidden md:flex'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className='flex items-center gap-1 font-medium'>
              <Home className='size-3.5 text-muted-foreground' />
              <span>Dashboard Ringkasan</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb className='hidden md:flex'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/' className='flex items-center gap-1 text-muted-foreground hover:text-foreground'>
              <Home className='size-3.5' />
              <span className='sr-only md:not-sr-only'>Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {segments.map((segment, index) => {
          const currentPath = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const label = ROUTE_LABELS[segment] || decodeURIComponent(segment)

          return (
            <span key={currentPath} className='inline-flex items-center gap-1.5'>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className='font-semibold text-foreground capitalize'>
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={currentPath as string as never}
                      className='text-muted-foreground hover:text-foreground capitalize'
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
