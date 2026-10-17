import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Boxes,
  FileSpreadsheet,
  Banknote,
  Store,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BackofficeHeader } from '@/components/layout/backoffice-header'
import { Main } from '@/components/layout/main'
import { MOCK_MENU } from '@/mocks/mock-data'

// Data tren penjualan 7 hari terakhir
const SALES_TREND_DATA = [
  { hari: 'Sen (26 Sep)', makanan: 1250000, minuman: 420000, snack: 180000, total: 1850000, transaksi: 124 },
  { hari: 'Sel (27 Sep)', makanan: 1420000, minuman: 480000, snack: 220000, total: 2120000, transaksi: 148 },
  { hari: 'Rab (28 Sep)', makanan: 1310000, minuman: 440000, snack: 190000, total: 1940000, transaksi: 135 },
  { hari: 'Kam (29 Sep)', makanan: 1580000, minuman: 530000, snack: 240000, total: 2350000, transaksi: 160 },
  { hari: 'Jum (30 Sep)', makanan: 1820000, minuman: 610000, snack: 250000, total: 2680000, transaksi: 185 },
  { hari: 'Sab (01 Okt)', makanan: 980000, minuman: 320000, snack: 150000, total: 1450000, transaksi: 92 },
  { hari: 'Hari Ini (02 Okt)', makanan: 1680000, minuman: 560000, snack: 245000, total: 2485000, transaksi: 168 },
]

// Data transaksi terbaru di sesi aktif
const RECENT_TRANSACTIONS = [
  {
    id: 'TRX-94821',
    waktu: '11:42:15',
    nama: 'Budi Santoso',
    identitas: 'Kelas X IPA 1 (NIS: 2026001)',
    tipe: 'Siswa',
    item: 'Nasi Uduk Komplit, Es Teh Manis',
    total: 16000,
    metode: 'RFID Tap',
    status: 'SUKSES',
  },
  {
    id: 'TRX-94820',
    waktu: '11:40:02',
    nama: 'Pak Budi Hartono',
    identitas: 'Kartu Tamu (KT-004)',
    tipe: 'Tamu/Guru',
    item: 'Nasi Goreng Ayam',
    total: 15000,
    metode: 'RFID Tap',
    status: 'SUKSES',
  },
  {
    id: 'TRX-94819',
    waktu: '11:38:44',
    nama: 'Ahmad Fauzi',
    identitas: 'Kelas XII IPA 3 (NIS: 2026003)',
    tipe: 'Siswa',
    item: 'Ayam Geprek Sambal Bawang, Air Mineral',
    total: 18000,
    metode: 'RFID Tap',
    status: 'SUKSES',
  },
  {
    id: 'TRX-94818',
    waktu: '11:35:10',
    nama: 'Dewi Anggraini',
    identitas: 'Kelas XI MIPA 2 (NIS: 2026005)',
    tipe: 'Siswa',
    item: 'Donat Gula Halus, Susu UHT Cokelat',
    total: 10000,
    metode: 'RFID Tap',
    status: 'SUKSES',
  },
  {
    id: 'TRX-94817',
    waktu: '11:31:28',
    nama: 'Rifki Pratama',
    identitas: 'Kelas X IPS 2 (NIS: 2026011)',
    tipe: 'Siswa',
    item: 'Roti Cokelat Keju',
    total: 5000,
    metode: 'RFID Tap',
    status: 'SUKSES',
  },
]

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

export function DashboardPage() {
  // Data menu stok
  const menuItems = MOCK_MENU

  // Item dengan stok menipis (stok <= stok_minimum)
  const lowStockItems = useMemo(() => {
    return menuItems.filter((item) => item.stok <= item.stok_minimum)
  }, [menuItems])

  // Hitung metrik hari ini
  const todaySales = 2485000
  const todayTransactions = 168
  const todayItemsSold = 214
  const avgPerTransaction = Math.round(todaySales / todayTransactions)

  return (
    <>
      {/* Top Header Shell dengan breadcrumb, sekolah, modul status, search & profil */}
      <BackofficeHeader />

      <Main className='space-y-6 pb-12'>
        {/* ===== 4 Kartu Metrik Utama ===== */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Penjualan Hari Ini */}
          <Card className='border-0 bg-muted/70 dark:bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Penjualan Hari Ini
              </CardTitle>
              <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Banknote className='size-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold tracking-tight text-foreground'>
                {formatRupiah(todaySales)}
              </div>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground mt-1'>
                <span className='inline-flex items-center text-emerald-600 font-semibold'>
                  <TrendingUp className='size-3.5 mr-0.5' /> +18.4%
                </span>
                <span>vs kemarin ({todayItemsSold} item)</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Total Transaksi Hari Ini */}
          <Card className='border-0 bg-muted/70 dark:bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Transaksi Hari Ini
              </CardTitle>
              <div className='flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400'>
                <ShoppingCart className='size-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold tracking-tight text-foreground'>
                {todayTransactions} <span className='text-base font-normal text-muted-foreground'>Trx</span>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground mt-1'>
                <span className='font-medium text-foreground'>Rata-rata: {formatRupiah(avgPerTransaction)}</span>
                <span>/ siswa</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Status Rekonsiliasi Kas */}
          <Card className='border-0 bg-muted/70 dark:bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Status Rekonsiliasi Kas
              </CardTitle>
              <div className='flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600'>
                <Scale className='size-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <span className='text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400'>
                  SEIMBANG (Rp 0)
                </span>
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Kas fisik TU cocok dengan sistem
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Alert Status Stok Menipis */}
          <Card className='border-0 bg-muted/70 dark:bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Peringatan Stok Barang
              </CardTitle>
              <div className='flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                <AlertTriangle className='size-5' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold tracking-tight text-foreground'>
                  {lowStockItems.length}
                </span>
                <span className='text-xs text-muted-foreground'>
                  item perlu restock
                </span>
              </div>
              <p className='text-xs text-amber-600 dark:text-amber-400 font-medium mt-1'>
                {menuItems.filter(i => i.stok === 0).length} Habis &bull; {menuItems.filter(i => i.stok > 0 && i.stok <= i.stok_minimum).length} Menipis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Grid Konten Tengah: Grafik Penjualan 7 Hari & Alert Stok Menipis ===== */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
          {/* Kolom Kiri: Tren Penjualan 7 Hari Terakhir (Recharts) */}
          <Card className='col-span-1 lg:col-span-4 border-0 bg-muted/70 dark:bg-muted/30'>
            <CardHeader>
              <div>
                <CardTitle className='text-base font-semibold'>
                  Tren Penjualan 7 Hari Terakhir
                </CardTitle>
                <CardDescription className='text-xs mt-0.5'>
                  Grafik omset harian kasir kantin dalam Rupiah (Rp) per kategori
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className='ps-2 pe-4 pt-2'>
              <div className='h-[320px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={SALES_TREND_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' className='stroke-border/50' vertical={false} />
                    <XAxis
                      dataKey='hari'
                      stroke='#888888'
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888888'
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rp ${(value / 1000).toLocaleString('id-ID')}k`}
                    />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const total = payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
                          return (
                            <div className='rounded-lg border bg-popover p-2.5 text-xs'>
                              <p className='font-semibold text-foreground mb-1.5'>{label}</p>
                              {payload.map((entry) => (
                                <div key={entry.name} className='flex items-center justify-between gap-4 py-0.5'>
                                  <span className='capitalize text-muted-foreground flex items-center gap-1.5'>
                                    <span className='size-2 rounded-full' style={{ backgroundColor: entry.color }} />
                                    {entry.name}:
                                  </span>
                                  <span className='font-mono font-medium text-foreground'>
                                    {formatRupiah(Number(entry.value))}
                                  </span>
                                </div>
                              ))}
                              <div className='mt-1.5 pt-1.5 border-t border-border flex items-center justify-between gap-4 font-bold text-foreground'>
                                <span>Total Omset:</span>
                                <span className='font-mono text-primary'>{formatRupiah(total)}</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend
                      verticalAlign='top'
                      align='right'
                      iconType='circle'
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Bar dataKey='makanan' name='Makanan' stackId='a' fill='#3b82f6' radius={[0, 0, 0, 0]} />
                    <Bar dataKey='minuman' name='Minuman' stackId='a' fill='#06b6d4' radius={[0, 0, 0, 0]} />
                    <Bar dataKey='snack' name='Snack' stackId='a' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Kolom Kanan: Stok Menipis */}
          <Card className='col-span-1 lg:col-span-3 border-0 bg-muted/70 dark:bg-muted/30 flex flex-col'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <AlertTriangle className='size-4 text-amber-500' />
                <span>Stok Menipis</span>
              </CardTitle>
              <CardDescription className='text-xs mt-0.5'>
                Item dengan stok kurang dari atau sama dengan batas minimum sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='text-xs'>
                      <TableHead>Menu</TableHead>
                      <TableHead className='text-center'>Sisa / Min</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className='h-28 text-center text-xs text-muted-foreground'>
                          <CheckCircle2 className='size-6 text-emerald-500 mx-auto mb-1 opacity-70' />
                          Semua stok menu dalam kondisi aman di atas batas minimum.
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStockItems.map((item) => {
                        const isOut = item.stok === 0
                        return (
                          <TableRow key={item.id} className='text-xs'>
                            <TableCell className='font-medium'>
                              <div className='flex flex-col'>
                                <span className='text-foreground font-semibold'>{item.nama}</span>
                                <span className='text-[10px] text-muted-foreground'>{item.kategori_nama}</span>
                              </div>
                            </TableCell>
                            <TableCell className='text-center font-mono'>
                              <span className={isOut ? 'text-destructive font-bold' : 'text-amber-600 font-bold'}>
                                {item.stok}
                              </span>
                              <span className='text-muted-foreground'> / {item.stok_minimum} {item.satuan}</span>
                            </TableCell>
                            <TableCell className='text-center'>
                              {isOut ? (
                                <Badge variant='destructive' className='text-[10px] px-1.5 py-0 uppercase border-0'>
                                  HABIS
                                </Badge>
                              ) : (
                                <Badge variant='outline' className='text-[10px] px-1.5 py-0 border-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 uppercase'>
                                  MENIPIS
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== Baris Bawah: Transaksi Terakhir & Pintasan Cepat ===== */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
          {/* Transaksi Kasir Terkini */}
          <Card className='col-span-1 lg:col-span-5 border-border/60'>
            <CardHeader className='flex flex-row items-center justify-between pb-3'>
              <div>
                <CardTitle className='text-base font-semibold'>
                  Aktivitas Transaksi Kasir Terakhir
                </CardTitle>
                <CardDescription className='text-xs mt-0.5'>
                  Pencatatan real-time pembelian siswa & tamu via reader RFID USB
                </CardDescription>
              </div>
              <Badge variant='outline' className='text-xs font-mono bg-emerald-500/5 text-emerald-600 border-emerald-500/30'>
                <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5' />
                Sesi Kasir Aktif
              </Badge>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='text-xs'>
                      <TableHead>Waktu & ID</TableHead>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Item Menu</TableHead>
                      <TableHead className='text-right'>Total Belanja</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_TRANSACTIONS.map((trx) => (
                      <TableRow key={trx.id} className='text-xs'>
                        <TableCell>
                          <div className='font-mono font-medium text-foreground'>{trx.waktu}</div>
                          <div className='text-[10px] text-muted-foreground font-mono'>{trx.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className='font-semibold text-foreground'>{trx.nama}</div>
                          <div className='text-[10px] text-muted-foreground'>{trx.identitas}</div>
                        </TableCell>
                        <TableCell className='text-muted-foreground max-w-[220px] truncate'>
                          {trx.item}
                        </TableCell>
                        <TableCell className='text-right font-mono font-bold text-foreground'>
                          {formatRupiah(trx.total)}
                        </TableCell>
                        <TableCell className='text-center'>
                          <Badge variant='outline' className='text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-1.5 py-0'>
                            {trx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pintasan Aksi Cepat (Quick Shortcuts) */}
          <Card className='col-span-1 lg:col-span-2 border-border/60 flex flex-col justify-between'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold flex items-center gap-1.5'>
                <Sparkles className='size-4 text-primary' />
                <span>Pintasan Operasional</span>
              </CardTitle>
              <CardDescription className='text-xs mt-0.5'>
                Akses instan modul kunci SKOOLIA
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2.5 flex-1'>
              <Button asChild variant='outline' className='w-full justify-start text-xs h-10 border-border/70 hover:bg-primary/5 hover:border-primary/40'>
                <Link to='/kasir' className='flex items-center gap-2.5'>
                  <div className='size-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0'>
                    <Store className='size-3.5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold leading-tight'>Kasir POS Fullscreen</div>
                    <div className='text-[10px] text-muted-foreground'>Layar transaksi tap RFID</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant='outline' className='w-full justify-start text-xs h-10 border-border/70 hover:bg-primary/5 hover:border-primary/40'>
                <Link to={'/stok/masuk' as string as never} className='flex items-center gap-2.5'>
                  <div className='size-6 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0'>
                    <Boxes className='size-3.5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold leading-tight'>Barang Masuk</div>
                    <div className='text-[10px] text-muted-foreground'>Input nota & rata-rata HPP</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant='outline' className='w-full justify-start text-xs h-10 border-border/70 hover:bg-primary/5 hover:border-primary/40'>
                <Link to={'/tu/topup' as string as never} className='flex items-center gap-2.5'>
                  <div className='size-6 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0'>
                    <Banknote className='size-3.5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold leading-tight'>Top-up Tunai Siswa</div>
                    <div className='text-[10px] text-muted-foreground'>Loket TU & cetak slip nota</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant='outline' className='w-full justify-start text-xs h-10 border-border/70 hover:bg-primary/5 hover:border-primary/40'>
                <Link to={'/laporan/rekonsiliasi' as string as never} className='flex items-center gap-2.5'>
                  <div className='size-6 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0'>
                    <FileSpreadsheet className='size-3.5' />
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold leading-tight'>Rekonsiliasi Saldo Harian</div>
                    <div className='text-[10px] text-muted-foreground'>Audit invariant & ekspor Excel</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

export default DashboardPage
