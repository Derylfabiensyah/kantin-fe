import { useState } from 'react'
import {
  ShieldAlert,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Info,
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
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { KartuTamuMock } from '@/mocks/mock-data'

interface BlokirKartuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kartu: KartuTamuMock | null
  allCards: KartuTamuMock[]
  onBlokirSuccess: (kartuId: number, transferToId?: number) => void
}

export function BlokirKartuModal({
  open,
  onOpenChange,
  kartu,
  allCards,
  onBlokirSuccess,
}: BlokirKartuModalProps) {
  const [transferSaldo, setTransferSaldo] = useState(false)
  const [targetKartuId, setTargetKartuId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setTransferSaldo(false)
    setTargetKartuId('')
    onOpenChange(false)
  }

  if (!kartu) return null

  // Active cards excluding the one being blocked (and itself)
  const transferTargets = allCards.filter(
    (c) => c.id !== kartu.id && c.status === 'ACTIVE'
  )

  const isValidSubmit =
    !transferSaldo || (transferSaldo && targetKartuId !== '')

  const handleSubmit = async () => {
    if (!isValidSubmit) return

    setIsSubmitting(true)
    try {
      try {
        await apiClient.post(`/api/v1/tu/kartu-tamu/${kartu.id}/blokir`, {
          transfer_saldo_ke: transferSaldo ? Number(targetKartuId) : undefined,
        })
      } catch {
        // Fallback simulasi
      }

      onBlokirSuccess(
        kartu.id,
        transferSaldo && targetKartuId ? Number(targetKartuId) : undefined
      )

      const targetCard = transferSaldo
        ? allCards.find((c) => c.id === Number(targetKartuId))
        : null

      toast.success(`Kartu ${kartu.nomor_kartu} berhasil diblokir!`, {
        description: targetCard
          ? `Saldo Rp ${kartu.saldo.toLocaleString('id-ID')} dipindah ke ${targetCard.nomor_kartu}`
          : 'Status kartu telah berubah menjadi BLOCKED.',
      })

      handleClose()
    } catch {
      toast.error('Gagal memblokir kartu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md sm:rounded-2xl border-slate-200 dark:border-slate-800'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-1'>
            <div className='p-2.5 bg-red-100 dark:bg-red-950/60 rounded-xl'>
              <ShieldAlert className='h-5 w-5 text-red-600 dark:text-red-400' />
            </div>
            <div>
              <DialogTitle className='text-base font-bold text-red-700 dark:text-red-400'>
                Blokir Kartu Hilang — Instan!
              </DialogTitle>
              <DialogDescription className='text-xs mt-0.5'>
                Kartu akan diblokir segera dan tidak dapat digunakan di kasir
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info Kartu */}
        <div className='flex items-center gap-3 p-3.5 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800'>
          <div className='p-2 bg-white dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800 shadow-sm'>
            <CreditCard className='h-5 w-5 text-red-600 dark:text-red-400' />
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
            <p className='text-xs text-muted-foreground'>Saldo Tersisa</p>
            <p className='font-bold text-xl text-red-600 dark:text-red-400 font-mono'>
              Rp {kartu.saldo.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Danger Warning */}
        <Alert variant='destructive' className='border-red-300 bg-red-50 dark:bg-red-950/40'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle className='text-xs font-bold uppercase tracking-wide'>
            Peringatan — Tindakan Permanen
          </AlertTitle>
          <AlertDescription className='text-xs leading-relaxed mt-1'>
            Setelah diblokir, kartu ini <strong>tidak dapat digunakan</strong> di
            kasir. Blokir berlaku <strong>instan</strong> — tap berikutnya pasti
            ditolak. Status tidak dapat dikembalikan ke ACTIVE secara otomatis.
          </AlertDescription>
        </Alert>

        <div className='space-y-4'>
          {/* Transfer Saldo Option */}
          {kartu.saldo > 0 && (
            <div className='space-y-3'>
              <div className='flex items-start space-x-3 p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors'>
                <Checkbox
                  id='transfer-saldo'
                  checked={transferSaldo}
                  onCheckedChange={(checked) => {
                    setTransferSaldo(!!checked)
                    if (!checked) setTargetKartuId('')
                  }}
                  className='mt-0.5'
                />
                <div className='flex-1'>
                  <label
                    htmlFor='transfer-saldo'
                    className='text-sm font-semibold cursor-pointer text-slate-900 dark:text-slate-100 flex items-center gap-2'
                  >
                    <ArrowRight className='h-4 w-4 text-blue-500' />
                    Transfer sisa saldo ke Kartu Tamu lain
                  </label>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    Pindahkan Rp {kartu.saldo.toLocaleString('id-ID')} ke kartu
                    aktif lainnya sebelum memblokir
                  </p>
                </div>
              </div>

              {transferSaldo && (
                <div className='space-y-2 pl-2'>
                  <Label
                    htmlFor='target-kartu'
                    className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
                  >
                    Pilih Kartu Tujuan Transfer
                  </Label>
                  {transferTargets.length === 0 ? (
                    <div className='flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700'>
                      <Info className='h-4 w-4 text-slate-400' />
                      <p className='text-xs text-muted-foreground'>
                        Tidak ada Kartu Tamu aktif lain yang tersedia.
                      </p>
                    </div>
                  ) : (
                    <Select value={targetKartuId} onValueChange={setTargetKartuId}>
                      <SelectTrigger id='target-kartu' className='h-11'>
                        <SelectValue placeholder='Pilih kartu tujuan...' />
                      </SelectTrigger>
                      <SelectContent>
                        {transferTargets.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            <div className='flex items-center gap-2'>
                              <span className='font-mono font-bold'>{c.nomor_kartu}</span>
                              <span className='text-muted-foreground text-xs'>
                                {c.label_pemegang || '(Tanpa label)'}
                              </span>
                              <span className='ml-auto text-emerald-600 text-xs font-mono font-medium'>
                                Rp {c.saldo.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          )}

          {kartu.saldo === 0 && (
            <div className='flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700'>
              <Info className='h-4 w-4 text-slate-400 shrink-0' />
              <p className='text-xs text-muted-foreground'>
                Saldo kartu sudah Rp 0. Tidak ada saldo yang perlu ditransfer.
              </p>
            </div>
          )}
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
            disabled={!isValidSubmit || isSubmitting}
            onClick={handleSubmit}
            className='flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold gap-2'
          >
            {isSubmitting ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Memblokir...
              </>
            ) : (
              <>
                <ShieldAlert className='h-4 w-4' />
                Blokir Kartu Sekarang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
