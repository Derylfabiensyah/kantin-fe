import { useState, useMemo } from 'react'
import {
  Trash2,
  PlusCircle,
  AlertOctagon,
  TrendingDown,
  Calendar,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarangRusakModal } from './components/BarangRusakModal'
import { RiwayatOpnameTable } from './components/RiwayatOpnameTable'
import type { RiwayatStokItem } from './types'
import type { MenuItem } from '@/features/katalog/types'

interface BarangRusakPageProps {
  menuList: MenuItem[]
  riwayatList: RiwayatStokItem[]
  hppMap: Record<number, number>
  isLoading?: boolean
  onRefresh: () => void
}

export function BarangRusakPage({
  menuList,
  riwayatList,
  hppMap,
  isLoading = false,
  onRefresh,
}: BarangRusakPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Metrics specifically for BARANG_RUSAK
  const stats = useMemo(() => {
    const listRusak = riwayatList.filter((r) => r.jenis === 'BARANG_RUSAK')
    const totalUnit = listRusak.reduce((sum, r) => sum + r.qty, 0)
    const totalKerugian = listRusak.reduce((sum, r) => sum + (r.totalNilai || 0), 0)

    return {
      totalKejadian: listRusak.length,
      totalUnit,
      totalKerugian,
    }
  }, [riwayatList])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-xl border-0 bg-muted/60 dark:bg-muted/25 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Pencatatan Barang Rusak & Basi Harian
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Form pencatatan cepat kerugian bahan makanan/minuman yang rusak atau kedaluwarsa di luar jadwal audit stok opname.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs shadow-md shrink-0"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          Catat Barang Rusak Baru
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium">
              Frekuensi Kejadian Rusak
            </CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{stats.totalKejadian} kali</span>
              <AlertOctagon className="h-5 w-5 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total catatan mutasi BARANG_RUSAK
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium">
              Total Fisik Dibuang / Rusak
            </CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>{stats.totalUnit} unit</span>
              <Layers className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Akumulasi qty terbuang
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/70 dark:bg-muted/30 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium">
              Total Beban Kerugian Finansial
            </CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span className="text-destructive font-mono">
                Rp {stats.totalKerugian.toLocaleString('id-ID')}
              </span>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Beban kerugian HPP makanan rusak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Riwayat Log Kerugian Barang Rusak & Basi
          </h3>
        </div>

        <RiwayatOpnameTable
          riwayatList={riwayatList}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </div>

      {/* Modal */}
      <BarangRusakModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        menuList={menuList}
        hppMap={hppMap}
        onSuccess={onRefresh}
      />
    </div>
  )
}
