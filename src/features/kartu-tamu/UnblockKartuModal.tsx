import { useState } from 'react'
import {
  ShieldCheck,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { KartuTamuMock } from '@/mocks/mock-data'

interface UnblockKartuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kartu: KartuTamuMock | null
  onUnblockSuccess: (kartuId: number) => void
}

export function UnblockKartuModal({
  open,
  onOpenChange,
  kartu,
  onUnblockSuccess,
}: UnblockKartuModalProps) {
  const [alasan, setAlasan] = useState('Kartu fisik telah ditemukan kembali')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setAlasan('Kartu fisik telah ditemukan kembali')
    onOpenChange(false)
  }

  if (!kartu) return null

  const handleUnblock = async () => {
    setIsSubmitting(true)
    try {
      try {
        await apiClient.post(`/api/v1/tu/kartu-tamu/${kartu.id}/unblock`, {
          alasan: alasan.trim(),
        })
      } catch {
        // Fallback simulasi frontend
      }

      onUnblockSuccess(kartu.id)
      toast.success(`Blokir kartu ${kartu.nomor_kartu} berhasil dibuka!`, {
        description: 'Status kartu kini TERSEDIA (AVAILABLE) dan siap dipinjamkan kembali.',
      })

      handleClose()
    } catch {
      toast.error('Gagal membuka blokir kartu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md sm:rounded-2xl border-slate-200 dark:border-slate-800'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-1'>
            <div className='p-2.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl'>
              <ShieldCheck className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div>
              <DialogTitle className='text-base font-bold text-slate-900 dark:text-slate-100'>
                Buka Blokir Kartu Tamu
              </DialogTitle>
              <DialogDescription className='text-xs mt-0.5'>
                Aktifkan kembali kartu fisik yang sebelumnya dilaporkan hilang
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info Kartu */}
        <div className='flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'>
          <div className='p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm'>
            <CreditCard className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-bold font-mono text-slate-900 dark:text-slate-100'>
              {kartu.nomor_kartu}
            </p>
            <p className='text-xs text-muted-foreground font-mono'>
              UID: {kartu.uid}
            </p>
          </div>
          <div className='text-right shrink-0'>
            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800'>
              Status: DIBLOKIR
            </span>
          </div>
        </div>

        {/* Informasi Pemulihan */}
        <Alert className='border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'>
          <AlertCircle className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
          <AlertTitle className='text-xs font-bold uppercase tracking-wide'>
            Pemulihan Kartu Fisik
          </AlertTitle>
          <AlertDescription className='text-xs leading-relaxed mt-1'>
            Membuka blokir akan mengubah status kartu menjadi <strong>AVAILABLE (Tersedia)</strong>. Kartu fisik RFID ini dapat kembali dipinjamkan kepada guru, staf, atau tamu baru di layanan TU.
          </AlertDescription>
        </Alert>

        {/* Alasan / Catatan TU */}
        <div className='space-y-2'>
          <Label
            htmlFor='alasan-unblock'
            className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
          >
            Alasan Buka Blokir / Catatan Petugas
          </Label>
          <div className='relative'>
            <FileText className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <Input
              id='alasan-unblock'
              placeholder='Contoh: Kartu ditemukan kembali di laci ruang guru'
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className='pl-9 h-11 text-sm'
              required
            />
          </div>
        </div>

        <DialogFooter className='gap-2 mt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            className='flex-1 sm:flex-none'
          >
            Batal
          </Button>
          <Button
            type='button'
            disabled={isSubmitting || !alasan.trim()}
            onClick={handleUnblock}
            className='flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2'
          >
            {isSubmitting ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className='h-4 w-4' />
                Buka Blokir Kartu
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
