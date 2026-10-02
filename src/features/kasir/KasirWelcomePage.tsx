import { useState, useEffect } from 'react'
import { Store, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'
import { formatRupiah } from '@/lib/formatters'

interface SesiData {
  sesi_id: number
  titik_kasir: string
  tanggal: string
  status: string
  total_transaksi: number
  total_bruto: number
  total_void: number
  total_bersih: number
}

export function KasirWelcomePage() {
  const [sesi, setSesi] = useState<SesiData | null>(null)

  useEffect(() => {
    apiClient
      .get('/api/v1/kasir/sesi')
      .then((res) => {
        setSesi(res.data?.data)
      })
      .catch(() => {})
  }, [])

  return (
    <div className='flex h-full w-full items-center justify-center p-6 bg-muted/20'>
      <Card className='max-w-2xl w-full shadow-lg border-primary/20'>
        <CardHeader className='text-center pb-2'>
          <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
            <Store className='h-8 w-8' />
          </div>
          <div className='flex items-center justify-center gap-2'>
            <Badge variant='outline' className='border-primary/30 text-primary'>
              POS Terminal
            </Badge>
            <Badge variant='secondary' className='bg-emerald-500/10 text-emerald-600'>
              Siap Digunakan
            </Badge>
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight mt-2'>
            Layar Kasir Kantin SKOOLIA
          </CardTitle>
          <CardDescription className='text-sm max-w-md mx-auto'>
            Sistem pembayaran 100% cashless dengan tap kartu RFID siswa dan Kartu Tamu.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6 pt-4'>
          {/* Ringkasan Sesi Hari Ini */}
          <div className='rounded-xl border bg-card p-4 space-y-3'>
            <div className='flex items-center justify-between text-sm border-b pb-2'>
              <span className='text-muted-foreground font-medium'>Status Sesi Hari Ini:</span>
              <span className='font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400'>
                <CheckCircle2 className='h-4 w-4' /> {sesi?.status || 'TERBUKA'}
              </span>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1'>
              <div>
                <p className='text-xs text-muted-foreground'>Titik Kasir</p>
                <p className='text-sm font-semibold truncate'>{sesi?.titik_kasir || 'Kasir 1'}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Total Transaksi</p>
                <p className='text-sm font-semibold'>{sesi?.total_transaksi || 0} Trx</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Total Penjualan Bersih</p>
                <p className='text-sm font-semibold text-primary'>
                  {formatRupiah(sesi?.total_bersih || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Info Status Pengerjaan Tim Frontend */}
          <div className='rounded-lg bg-primary/5 border border-primary/10 p-3 text-xs text-muted-foreground space-y-1.5'>
            <div className='flex items-center gap-1.5 font-semibold text-foreground'>
              <Sparkles className='h-3.5 w-3.5 text-primary' /> Status Implementasi Fitur:
            </div>
            <p>• <strong>Issue #01 (Selesai):</strong> Fondasi Project `satnaing/shadcn-admin`, Mock Layer, dan POS Layout.</p>
            <p>• <strong>Issue #03:</strong> Katalog Menu & Keranjang Belanja Kasir.</p>
            <p>• <strong>Issue #04:</strong> Integrasi RFID Reader USB & Beep Audio Synthesizer.</p>
            <p>• <strong>Issue #05:</strong> Riwayat Sesi Kasir, Void Transaksi & Tutup Kasir.</p>
          </div>

          {/* Aksi */}
          <div className='flex flex-col sm:flex-row items-center justify-end gap-3 pt-2'>
            <Button className='w-full sm:w-auto gap-2' disabled>
              <CreditCard className='h-4 w-4' />
              <span>Mulai Antrean Belanja</span>
              <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KasirWelcomePage
