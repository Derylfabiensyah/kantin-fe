import React, { useState } from 'react'
import {
  CreditCard,
  User,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  X,
  Keyboard,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export interface ManualRfidModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScan: (uid: string) => void
  isProcessing?: boolean
}

interface QuickCardPreset {
  label: string
  uid: string
  keterangan: string
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary'
  icon: React.ReactNode
}

const PRESET_CARDS: QuickCardPreset[] = [
  {
    label: 'Cantika Kirana (Normal)',
    uid: '04D4E5F6A1',
    keterangan: 'Kelas X IPS 1 • Saldo Rp 65.000 (Siap Transaksi)',
    badgeVariant: 'secondary',
    icon: <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />,
  },
  {
    label: 'Budi Santoso (Blokir Item)',
    uid: '04A1B2C3D4',
    keterangan: 'Kelas X IPA 1 • Saldo Rp 45.000 (Nasi Uduk Diblokir Ortu)',
    badgeVariant: 'outline',
    icon: <User className='h-3.5 w-3.5 text-primary' />,
  },
  {
    label: 'Siti Rahmawati (Saldo Kurang)',
    uid: '04B2C3D4E5',
    keterangan: 'Kelas XI IPS 2 • Saldo Rp 5.000 (Test Saldo Kurang)',
    badgeVariant: 'outline',
    icon: <Wallet className='h-3.5 w-3.5 text-amber-500' />,
  },
  {
    label: 'Ahmad Fauzi (Kartu Diblokir)',
    uid: '04C3D4E5F6',
    keterangan: 'Kelas XII IPA 3 • Status Kartu Diblokir Permanen',
    badgeVariant: 'destructive',
    icon: <ShieldAlert className='h-3.5 w-3.5 text-destructive' />,
  },
  {
    label: 'Kartu Tamu SKOOLIA',
    uid: 'KT-04A991',
    keterangan: 'Kartu Tamu Umum • Saldo Rp 50.000',
    badgeVariant: 'secondary',
    icon: <CreditCard className='h-3.5 w-3.5 text-blue-500' />,
  },
]

export const ManualRfidModal: React.FC<ManualRfidModalProps> = ({
  open,
  onOpenChange,
  onScan,
  isProcessing = false,
}) => {
  const [uidInput, setUidInput] = useState('')

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = uidInput.trim()
    if (!trimmed) return
    onScan(trimmed)
    setUidInput('')
    onOpenChange(false)
  }

  const handleSelectPreset = (uid: string) => {
    onScan(uid)
    setUidInput('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md select-none'>
        <DialogHeader>
          <div className='flex items-center gap-2 text-primary'>
            <Keyboard className='h-5 w-5' />
            <DialogTitle className='text-base font-bold'>
              Input Manual UID Kartu RFID
            </DialogTitle>
          </div>
          <DialogDescription className='text-xs'>
            Gunakan form ini untuk simulasi tap kartu atau jika USB RFID Reader
            mengalami kendala koneksi perangkat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          {/* Input Manual UID */}
          <div className='space-y-1.5'>
            <label className='flex items-center justify-between text-xs font-semibold text-foreground'>
              <span>Nomor UID Kartu RFID:</span>
              <span className='text-[11px] font-normal text-muted-foreground'>
                Contoh: 04A1B2C3D4
              </span>
            </label>
            <div className='flex gap-2'>
              <Input
                value={uidInput}
                onChange={(e) => setUidInput(e.target.value.toUpperCase())}
                placeholder='Masukkan atau tempel UID...'
                disabled={isProcessing}
                autoFocus
                className='font-mono text-sm tracking-wider uppercase'
              />
              <Button
                type='submit'
                disabled={!uidInput.trim() || isProcessing}
                className='shrink-0 font-semibold'
              >
                Proses Tap
              </Button>
            </div>
          </div>

          {/* Quick Presets untuk Testing */}
          <div className='space-y-2 border-t pt-2'>
            <span className='text-xs font-semibold text-muted-foreground'>
              Pintasan Uji Coba Kartu (Siswa &amp; Tamu):
            </span>
            <div className='max-h-[220px] space-y-1.5 overflow-y-auto pr-1'>
              {PRESET_CARDS.map((card) => (
                <button
                  key={card.uid}
                  type='button'
                  disabled={isProcessing}
                  onClick={() => handleSelectPreset(card.uid)}
                  className='flex w-full touch-manipulation items-start justify-between gap-2 rounded-lg border bg-muted/30 p-2 text-left transition hover:border-primary/40 hover:bg-muted/70 disabled:opacity-50'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-1.5'>
                      {card.icon}
                      <span className='truncate text-xs font-bold text-foreground'>
                        {card.label}
                      </span>
                    </div>
                    <p className='mt-0.5 truncate text-[11px] text-muted-foreground'>
                      {card.keterangan}
                    </p>
                  </div>
                  <Badge
                    variant={card.badgeVariant || 'outline'}
                    className='shrink-0 font-mono text-[10px]'
                  >
                    {card.uid}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className='gap-2 pt-1 sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className='text-xs'
            >
              <X className='mr-1.5 h-3.5 w-3.5' />
              Tutup
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ManualRfidModal
