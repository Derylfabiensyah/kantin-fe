import { useState } from 'react'
import {
  ArrowLeftRight,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  User,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { KartuTamuMock } from '@/mocks/mock-data'
import type { KartuTamuSlipData } from './KartuTamuSlipModal'

interface RefundKartuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kartu: KartuTamuMock | null
  onRefundSuccess: (kartuId: number) => void
  onShowSlip: (data: KartuTamuSlipData) => void
}

export function RefundKartuModal({
  open,
  onOpenChange,
  kartu,
  onRefundSuccess,
  onShowSlip,
}: RefundKartuModalProps) {
  const [namaPenerima, setNamaPenerima] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setNamaPenerima('')
    onOpenChange(false)
  }

  if (!kartu) return null

  const isValidSubmit = namaPenerima.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidSubmit) return

    setIsSubmitting(true)
    try {
      try {
        await apiClient.post(`/api/v1/tu/kartu-tamu/${kartu.id}/refund`, {
          nama_penerima: namaPenerima.trim(),
        })
      } catch {
        // Fallback simulasi
      }

      const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const seq = Math.floor(1000 + Math.random() * 9000)

      onRefundSuccess(kartu.id)
      toast.success(`Kartu ${kartu.nomor_kartu} berhasil dikembalikan!`, {
        description: `Refund Rp ${kartu.saldo.toLocaleString('id-ID')} kepada ${namaPenerima.trim()}`,
      })

      onShowSlip({
        type: 'REFUND',
        ref_no: `KT-REFUND-${dateCode}-${seq}`,
        waktu: new Date().toISOString(),
        petugas_nama: 'Wibisana Bama (Petugas TU)',
        nomor_kartu: kartu.nomor_kartu,
        uid: kartu.uid,
        label_pemegang: kartu.label_pemegang,
        saldo_direfund: kartu.saldo,
        nama_penerima: namaPenerima.trim(),
      })

      handleClose()
    } catch {
      toast.error('Gagal memproses pengembalian kartu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md sm:rounded-2xl border-slate-200 dark:border-slate-800'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-1'>
            <div className='p-2.5 bg-amber-100 dark:bg-amber-950/60 rounded-xl'>
              <ArrowLeftRight className='h-5 w-5 text-amber-600 dark:text-amber-400' />
            </div>
            <div>
              <DialogTitle className='text-base font-bold'>
                Pengembalian Kartu & Refund Tunai
              </DialogTitle>
              <DialogDescription className='text-xs mt-0.5'>
                Sisa saldo akan di-refund tunai kepada pemegang
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info Kartu */}
        <div className='flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800'>
          <div className='p-2 bg-white dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800 shadow-sm'>
            <CreditCard className='h-5 w-5 text-amber-600 dark:text-amber-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-bold font-mono text-slate-900 dark:text-slate-100'>
              {kartu.nomor_kartu}
            </p>
            <p className='text-xs text-muted-foreground truncate'>
              {kartu.label_pemegang || '(Tanpa label pemegang)'}
            </p>
          </div>
          <div className='text-right shrink-0'>
            <p className='text-xs text-muted-foreground'>Saldo yang di-refund</p>
            <p className='font-bold text-xl text-amber-600 dark:text-amber-400 font-mono'>
              Rp {kartu.saldo.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Warning */}
        <Alert className='border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'>
          <AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-400' />
          <AlertDescription className='text-xs leading-relaxed'>
            <strong>Perhatian:</strong> Setelah dikonfirmasi —
            <ul className='mt-1.5 space-y-0.5 list-disc list-inside'>
              <li>
                Saldo <strong>Rp {kartu.saldo.toLocaleString('id-ID')}</strong> di-refund tunai
              </li>
              <li>Saldo kartu direset menjadi Rp 0</li>
              <li>Label pemegang dikosongkan (kartu siap pakai ulang)</li>
              <li>Status kartu berubah menjadi <strong>AVAILABLE</strong></li>
            </ul>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nama Penerima */}
          <div className='space-y-2'>
            <Label
              htmlFor='nama-penerima'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Nama Penerima Refund
            </Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                id='nama-penerima'
                placeholder='Contoh: Pak Hartono (Guru Fisika)'
                value={namaPenerima}
                onChange={(e) => setNamaPenerima(e.target.value)}
                className='pl-9 h-11 text-sm'
                required
              />
            </div>
          </div>

          <DialogFooter className='gap-2 pt-1'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1 sm:flex-none'
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={!isValidSubmit || isSubmitting}
              className='flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2'
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className='h-4 w-4 animate-spin' />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className='h-4 w-4' />
                  Konfirmasi Refund & Kembalikan Kartu
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
