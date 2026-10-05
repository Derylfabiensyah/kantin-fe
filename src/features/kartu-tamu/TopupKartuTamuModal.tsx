import { useState } from 'react'
import {
  Wallet,
  CreditCard,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
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
import { Badge } from '@/components/ui/badge'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { KartuTamuMock } from '@/mocks/mock-data'
import type { KartuTamuSlipData } from './KartuTamuSlipModal'

const PRESET_NOMINALS = [20000, 50000, 100000, 200000]
const MAX_SALDO_KARTU_TAMU = 500000

interface TopupKartuTamuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kartu: KartuTamuMock | null
  onTopupSuccess: (kartuId: number, saldoBaru: number) => void
  onShowSlip: (data: KartuTamuSlipData) => void
}

export function TopupKartuTamuModal({
  open,
  onOpenChange,
  kartu,
  onTopupSuccess,
  onShowSlip,
}: TopupKartuTamuModalProps) {
  const [nominal, setNominal] = useState('')
  const [namaPenyetor, setNamaPenyetor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setNominal('')
    setNamaPenyetor('')
    onOpenChange(false)
  }

  if (!kartu) return null

  const nominalNum = Number(nominal) || 0
  const saldoSaatIni = kartu.saldo
  const saldoBaru = saldoSaatIni + nominalNum
  const isExceedingLimit = saldoBaru > MAX_SALDO_KARTU_TAMU

  const isValidSubmit =
    nominalNum > 0 && !isExceedingLimit && namaPenyetor.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidSubmit) return

    setIsSubmitting(true)
    try {
      let saldoFinal = saldoBaru

      try {
        const res = await apiClient.post(`/api/v1/tu/kartu-tamu/${kartu.id}/topup`, {
          nominal: nominalNum,
          nama_penyetor: namaPenyetor.trim(),
        })
        saldoFinal = res.data?.data?.saldo_baru ?? saldoBaru
      } catch {
        // Fallback simulasi
      }

      const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const seq = Math.floor(1000 + Math.random() * 9000)

      onTopupSuccess(kartu.id, saldoFinal)
      toast.success(`Top-up Rp ${nominalNum.toLocaleString('id-ID')} berhasil!`, {
        description: `Saldo baru ${kartu.nomor_kartu}: Rp ${saldoFinal.toLocaleString('id-ID')}`,
      })

      onShowSlip({
        type: 'TOPUP',
        ref_no: `KT-TOPUP-${dateCode}-${seq}`,
        waktu: new Date().toISOString(),
        petugas_nama: 'Wibisana Bama (Petugas TU)',
        nomor_kartu: kartu.nomor_kartu,
        uid: kartu.uid,
        label_pemegang: kartu.label_pemegang,
        nominal: nominalNum,
        saldo_awal: saldoSaatIni,
        saldo_baru: saldoFinal,
        nama_penyetor: namaPenyetor.trim(),
      })

      handleClose()
    } catch {
      toast.error('Gagal melakukan top-up.')
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
              <Wallet className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div>
              <DialogTitle className='text-base font-bold'>
                Top-up Saldo Kartu Tamu
              </DialogTitle>
              <DialogDescription className='text-xs mt-0.5'>
                Pengisian saldo tunai untuk kartu pemegang
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Kartu Info */}
        <div className='flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800'>
          <div className='p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm'>
            <CreditCard className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <span className='font-bold font-mono text-slate-900 dark:text-slate-100'>
                {kartu.nomor_kartu}
              </span>
              <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-xs'>
                AKTIF
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground truncate'>
              {kartu.label_pemegang || '(Tanpa label pemegang)'}
            </p>
          </div>
          <div className='text-right shrink-0'>
            <p className='text-xs text-muted-foreground'>Saldo Saat Ini</p>
            <p className='font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono'>
              Rp {saldoSaatIni.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Preset Nominal */}
          <div className='space-y-2'>
            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              Pilihan Nominal Preset
            </Label>
            <div className='grid grid-cols-4 gap-2'>
              {PRESET_NOMINALS.map((preset) => (
                <Button
                  key={preset}
                  type='button'
                  variant={nominalNum === preset ? 'default' : 'outline'}
                  className={`h-11 text-xs font-semibold transition-all ${
                    nominalNum === preset
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                      : 'hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                  onClick={() => setNominal(preset.toString())}
                >
                  {(preset / 1000).toFixed(0)}rb
                </Button>
              ))}
            </div>
          </div>

          {/* Input Bebas */}
          <div className='space-y-2'>
            <Label
              htmlFor='kt-nominal'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Nominal (Rp)
            </Label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm'>
                Rp
              </span>
              <Input
                id='kt-nominal'
                type='number'
                min={1000}
                placeholder='Masukkan nominal...'
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className='pl-11 h-11 text-base font-mono font-bold'
              />
            </div>
          </div>

          {/* Nama Penyetor */}
          <div className='space-y-2'>
            <Label
              htmlFor='kt-penyetor'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Nama Penyetor
            </Label>
            <Input
              id='kt-penyetor'
              placeholder='Contoh: Pak Hartono, Ibu Kepala Sekolah'
              value={namaPenyetor}
              onChange={(e) => setNamaPenyetor(e.target.value)}
              className='h-11 text-sm'
              required
            />
          </div>

          {/* Kalkulasi & Validasi */}
          {nominalNum > 0 && (
            <div className='space-y-3'>
              <div className='p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-sm'>
                <p className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
                  Kalkulasi
                </p>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Saldo saat ini:</span>
                  <span className='font-mono font-medium'>
                    Rp {saldoSaatIni.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='flex justify-between text-emerald-600 font-medium'>
                  <span>Nominal (+):</span>
                  <span className='font-mono font-bold'>
                    Rp {nominalNum.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold'>
                  <span>Estimasi saldo baru:</span>
                  <span
                    className={`font-mono ${
                      isExceedingLimit
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    Rp {saldoBaru.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {isExceedingLimit && (
                <Alert variant='destructive' className='border-red-300 bg-red-50 dark:bg-red-950/40'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle className='text-xs font-bold uppercase'>
                    Melebihi Batas Maksimum!
                  </AlertTitle>
                  <AlertDescription className='text-xs'>
                    Batas saldo Kartu Tamu:{' '}
                    <strong>Rp {MAX_SALDO_KARTU_TAMU.toLocaleString('id-ID')}</strong>.
                    Kurangi nominal top-up.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

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
                  Proses Top-up
                  <ArrowRight className='h-3.5 w-3.5 ml-auto' />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
