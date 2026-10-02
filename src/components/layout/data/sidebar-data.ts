import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Tag,
  Boxes,
  Banknote,
  Receipt,
  CreditCard,
  ArrowLeftRight,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Store,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Wibisana Bama',
    email: 'wibisanabama@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'SKOOLIA Kantin',
      logo: Store,
      plan: 'Cashless Sekolah',
    },
  ],
  navGroups: [
    {
      title: 'Kasir & Ringkasan',
      items: [
        {
          title: 'Kasir POS (Layar Penuh)',
          url: '/kasir',
          icon: ShoppingCart,
        },
        {
          title: 'Dashboard Ringkasan',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Katalog & Inventaris',
      items: [
        {
          title: 'Katalog Menu',
          url: '/menu',
          icon: UtensilsCrossed,
        },
        {
          title: 'Kategori Menu',
          url: '/kategori',
          icon: Tag,
        },
        {
          title: 'Manajemen Stok',
          icon: Boxes,
          items: [
            {
              title: 'Barang Masuk',
              url: '/stok/masuk',
            },
            {
              title: 'Stok Opname',
              url: '/stok/opname',
            },
            {
              title: 'Kartu Stok',
              url: '/stok/kartu',
            },
          ],
        },
      ],
    },
    {
      title: 'Layanan TU & Kartu',
      items: [
        {
          title: 'Top-up Tunai Siswa',
          url: '/tu/topup',
          icon: Banknote,
        },
        {
          title: 'Setoran Kas TU',
          url: '/tu/setoran',
          icon: Receipt,
        },
        {
          title: 'Manajemen Kartu Tamu',
          url: '/kartu-tamu',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Saldo & Pengawasan',
      items: [
        {
          title: 'Refund Saldo Siswa',
          url: '/saldo/refund',
          icon: ArrowLeftRight,
        },
        {
          title: 'Kontrol Siswa (Ortu)',
          url: '/kontrol-siswa',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'Laporan & Pengaturan',
      items: [
        {
          title: 'Laporan Keuangan',
          icon: FileSpreadsheet,
          items: [
            {
              title: 'Rekonsiliasi Harian',
              url: '/laporan/rekonsiliasi',
            },
            {
              title: 'Penjualan & Laba',
              url: '/laporan/penjualan',
            },
            {
              title: 'Nilai Persediaan',
              url: '/laporan/stok',
            },
          ],
        },
        {
          title: 'Pengaturan Kantin',
          url: '/pengaturan',
          icon: Settings,
        },
      ],
    },
  ],
}
