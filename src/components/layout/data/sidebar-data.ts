import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Tag,
  Boxes,
  Banknote,
  Receipt,
  ReceiptText,
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
    name: 'Deryl Fabiensyah',
    email: 'derylfabiensyah@skoolia.id',
    avatar: '/avatars/shadcn.jpg',
    role: 'Pengelola Kantin',
    schoolName: 'SMA Negeri 1 SKOOLIA',
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
      roles: ['admin', 'pengelola', 'kasir', 'tu', 'bendahara'],
      items: [
        {
          title: 'Dashboard Ringkasan',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Kasir POS (Layar Penuh)',
          url: '/kasir',
          icon: ShoppingCart,
          badge: 'POS',
          roles: ['admin', 'kasir', 'pengelola'],
        },
      ],
    },
    {
      title: 'Katalog & Inventaris',
      roles: ['admin', 'pengelola'],
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
              title: 'Barang Masuk (Restock)',
              url: '/stok/masuk',
            },
            {
              title: 'Stok Opname & Rusak',
              url: '/stok/opname',
            },
            {
              title: 'Kartu Stok Mutasi',
              url: '/stok/kartu',
            },
            {
              title: 'Laporan Inventaris',
              url: '/stok/inventaris',
            },
          ],
        },
      ],
    },
    {
      title: 'Layanan TU & Kartu',
      roles: ['admin', 'tu', 'bendahara'],
      items: [
        {
          title: 'Top-up Tunai Siswa',
          url: '/tu/topup',
          icon: Banknote,
        },
        {
          title: 'Setoran Kas TU Harian',
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
      roles: ['admin', 'bendahara'],
      items: [
        {
          title: 'Mutasi Koreksi Bendahara',
          url: '/saldo/koreksi',
          icon: ReceiptText,
        },
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
      roles: ['admin', 'bendahara', 'pengelola'],
      items: [
        {
          title: 'Pusat Laporan Keuangan',
          icon: FileSpreadsheet,
          roles: ['admin', 'bendahara', 'pengelola'],
          items: [
            {
              title: 'Rekonsiliasi Harian',
              url: '/laporan/rekonsiliasi',
            },
            {
              title: 'Penjualan & Laba Kotor',
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
          roles: ['admin'],
        },
      ],
    },
  ],
}
