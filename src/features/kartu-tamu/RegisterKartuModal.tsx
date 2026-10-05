import { useState } from 'react'
import {
  CreditCard,
  Radio,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  UserPlus,
  Wifi,
  Hash,
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
import { Badge } from '@/components/ui/badge'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { KartuTamuMock } from '@/mocks/mock-data'
import type { KartuTamuSlipData } from './KartuTamuSlipModal'
import { mapBackendToKartuTamu } from './types'

interface RegisterKartuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingCards: KartuTamuMock[]
  onRegistered: (newCard: KartuTamuMock) => void
  onShowSlip: (data: KartuTamuSlipData) => void
}

function generateNextNomorKartu(existingCards: KartuTamuMock[]): string {
  // Find the highest KT-xxx number and increment
  const numbers = existingCards
    .map((c) => {
      const match = c.nomor_kartu.match(/^KT-(\d+)$/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((n) => n > 0)
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
  return `KT-${String(next).padStart(3, '0')}`
}

function generateSimulatedUID(): string {
  const hex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  return `04${hex()}${hex()}${hex()}${hex()}`
}

export function RegisterKartuModal({
  open,
  onOpenChange,
  existingCards,
  onRegistered,
  onShowSlip,
}: RegisterKartuModalProps) {
  const [labelPemegang, setLabelPemegang] = useState('')
  const [detectedUid, setDetectedUid] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextNomor = generateNextNomorKartu(existingCards)

  const handleSimulateTap = () => {
    setIsScanning(true)
    // Simulate RFID reader detection delay (300ms)
    setTimeout(() => {
      const uid = generateSimulatedUID()
      setDetectedUid(uid)
      setIsScanning(false)
    }, 700)
  }

  const handleReset = () => {
    setDetectedUid(null)
    setLabelPemegang('')
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    if (!detectedUid) return

    setIsSubmitting(true)
    try {
      let newCard: KartuTamuMock | null = null

      try {
        const res = await apiClient
          .post('/api/kartu-tamu', {
            nomorKartu: nextNomor,
            rfidUid: detectedUid,
            catatan: labelPemegang.trim() || undefined,
            aktif: true,
          })
          .catch(() =>
            apiClient.post('/api/v1/tu/kartu-tamu/register', {
              uid: detectedUid,
              label_pemegang: labelPemegang.trim(),
            })
          )

        if (res.data?.data) {
          newCard = mapBackendToKartuTamu(res.data.data, 0)
        }
      } catch {
        // Fallback: simulate frontend
        const now = new Date()
        const id = existingCards.length + 1
        newCard = {
          id,
          nomor_kartu: nextNomor,
          uid: detectedUid,
          label_pemegang: labelPemegang.trim(),
          saldo: 0,
          is_active: true,
          status: 'ACTIVE',
          created_at: now.toISOString(),
        }
      }

      if (newCard) {
        const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const seq = Math.floor(1000 + Math.random() * 9000)

        onRegistered(newCard)
        toast.success(`Kartu ${newCard.nomor_kartu} berhasil didaftarkan!`)

        onShowSlip({
          type: 'REGISTER',
          ref_no: `KT-REG-${dateCode}-${seq}`,
          waktu: new Date().toISOString(),
          petugas_nama: 'Wibisana Bama (Petugas TU)',
          nomor_kartu: newCard.nomor_kartu,
          uid: newCard.uid,
          label_pemegang: newCard.label_pemegang,
        })

        handleClose()
      }
    } catch {
      toast.error('Gagal mendaftarkan kartu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md sm:rounded-2xl border-slate-200 dark:border-slate-800'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-1'>
            <div className='p-2.5 bg-blue-100 dark:bg-blue-950/60 rounded-xl'>
              <UserPlus className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <DialogTitle className='text-base font-bold'>
                Daftarkan Kartu Tamu Baru
              </DialogTitle>
              <DialogDescription className='text-xs mt-0.5'>
                Tap kartu RFID kosong pada reader TU untuk mendaftarkan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-5'>
          {/* Nomor Kartu Preview */}
          <div className='flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800'>
            <div className='flex items-center gap-2'>
              <Hash className='h-4 w-4 text-blue-600' />
              <span className='text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide'>
                Nomor Kartu Berikutnya
              </span>
            </div>
            <Badge className='font-mono text-base font-bold px-3 py-1 bg-blue-600 hover:bg-blue-600 text-white shadow'>
              {nextNomor}
            </Badge>
          </div>

          {/* RFID Scan Area */}
          <div className='space-y-3'>
            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              Tap Kartu RFID pada Reader
            </Label>
            <div
              className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                detectedUid
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                  : isScanning
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30 animate-pulse'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
              }`}
              onClick={!detectedUid ? handleSimulateTap : undefined}
            >
              {isScanning ? (
                <>
                  <Wifi className='h-12 w-12 text-blue-500 animate-pulse mb-3' />
                  <p className='text-sm font-semibold text-blue-600'>Mendeteksi kartu...</p>
                  <p className='text-xs text-blue-500 mt-1'>Tempelkan kartu RFID</p>
                </>
              ) : detectedUid ? (
                <>
                  <CheckCircle2 className='h-10 w-10 text-emerald-600 mb-2' />
                  <p className='text-sm font-bold text-emerald-700 dark:text-emerald-400'>
                    Kartu Terdeteksi!
                  </p>
                  <code className='text-xs font-mono bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg mt-2 border border-emerald-200 dark:border-emerald-800'>
                    UID: {detectedUid}
                  </code>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReset()
                    }}
                    className='mt-3 text-xs text-slate-500 hover:text-slate-700 underline'
                  >
                    Tap ulang kartu lain
                  </button>
                </>
              ) : (
                <>
                  <div className='relative mb-3'>
                    <CreditCard className='h-12 w-12 text-slate-400' />
                    <Radio className='h-5 w-5 text-blue-500 absolute -top-1 -right-1 animate-pulse' />
                  </div>
                  <p className='text-sm font-semibold text-slate-600 dark:text-slate-400'>
                    Klik untuk Simulasi Tap RFID
                  </p>
                  <p className='text-xs text-slate-400 mt-1 text-center'>
                    (Pada sistem nyata: tap kartu fisik ke reader)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Label Pemegang */}
          <div className='space-y-2'>
            <Label
              htmlFor='label-pemegang'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Label Pemegang{' '}
              <span className='text-muted-foreground/60 normal-case font-normal'>(opsional)</span>
            </Label>
            <div className='relative'>
              <Sparkles className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                id='label-pemegang'
                placeholder='Contoh: Pak Budi Guru, Tamu Seminar, Ibu Ratna TU'
                value={labelPemegang}
                onChange={(e) => setLabelPemegang(e.target.value)}
                className='pl-9 h-11 text-sm'
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              Label bisa diubah nanti. Kosongkan jika kartu belum dipinjamkan.
            </p>
          </div>
        </div>

        <DialogFooter className='gap-2 mt-2'>
          <Button variant='outline' onClick={handleClose} className='flex-1 sm:flex-none'>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!detectedUid || isSubmitting}
            className='flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2'
          >
            {isSubmitting ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Mendaftarkan...
              </>
            ) : (
              <>
                <CheckCircle2 className='h-4 w-4' />
                Daftarkan Kartu {nextNomor}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
