import { Printer, CheckCircle2, Building2, Calendar, UserCheck, CreditCard, Receipt, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface TopupSlipData {
  ref_no: string
  waktu: string
  petugas_nama: string
  nama_penyetor: string
  nominal: number
  saldo_awal: number
  saldo_baru: number
  siswa: {
    siswa_id: number
    nis: string
    nama: string
    kelas: string
    foto_url?: string
  }
}

interface PrintSlipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slipData: TopupSlipData | null
}

export function PrintSlipModal({ open, onOpenChange, slipData }: PrintSlipModalProps) {
  if (!slipData) return null

  const formattedDate = new Date(slipData.waktu).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md p-0 overflow-hidden sm:rounded-2xl border-slate-200 dark:border-slate-800'>
        {/* CSS terisolasi untuk cetak thermal print 80mm & PDF */}
        <style>{`
          @media print {
            @page {
              margin: 0;
              size: 80mm auto;
            }
            html, body {
              background: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            body * {
              visibility: hidden !important;
            }
            .printable-slip, .printable-slip * {
              visibility: visible !important;
            }
            .printable-slip {
              position: fixed !important;
              left: 50% !important;
              top: 0 !important;
              transform: translateX(-50%) !important;
              width: 76mm !important;
              padding: 8mm 2mm !important;
              font-family: 'Courier New', Courier, monospace !important;
              background: #ffffff !important;
              color: #000000 !important;
              box-shadow: none !important;
              border: none !important;
            }
            .printable-slip .print-dark-override {
              background: transparent !important;
              color: #000000 !important;
              border-color: #000000 !important;
            }
            .printable-slip .print-border-dashed {
              border-bottom: 1px dashed #000000 !important;
            }
            .printable-slip .print-border-double {
              border-bottom: 3px double #000000 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        {/* Modal Header */}
        <DialogHeader className='p-5 bg-emerald-600 text-white dark:bg-emerald-700 no-print'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-white/20 text-white rounded-full'>
                <CheckCircle2 className='h-6 w-6' />
              </div>
              <div>
                <DialogTitle className='text-lg font-bold text-white flex items-center gap-1.5'>
                  Top-up Tunai Berhasil!
                </DialogTitle>
                <p className='text-xs text-emerald-100 mt-0.5'>
                  Saldo siswa telah ditambahkan ke sistem
                </p>
              </div>
            </div>
            <Receipt className='h-8 w-8 text-emerald-200/50' />
          </div>
        </DialogHeader>

        {/* Outer Receipt Container (Screen & Print Wrapper) */}
        <div className='p-5 bg-slate-100 dark:bg-slate-950 no-print-bg flex justify-center'>
          {/* Authentic Printable Thermal Receipt Slip */}
          <div className='printable-slip w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs'>
            
            {/* Header Nota */}
            <div className='text-center space-y-1 pb-3 print-border-dashed border-b border-dashed border-slate-300'>
              <div className='flex items-center justify-center gap-1 font-bold text-sm tracking-tight text-slate-900 uppercase'>
                <Building2 className='h-4 w-4 text-emerald-600 no-print' />
                SKOOLIA CANTEEN
              </div>
              <p className='text-[10px] text-slate-600 uppercase font-semibold tracking-wider'>
                SLIP BUKTI SETOR TUNAI TU
              </p>
              
              {/* Nomor Referensi Unik */}
              <div className='pt-1.5'>
                <span className='text-[9px] text-slate-500 uppercase block font-sans'>Nomor Referensi Unik:</span>
                <span className='inline-block font-bold text-xs bg-slate-100 text-slate-900 px-2.5 py-1 rounded border border-slate-300 font-mono tracking-wide print-dark-override mt-0.5'>
                  {slipData.ref_no}
                </span>
              </div>
            </div>

            {/* Informasi Waktu & Petugas */}
            <div className='space-y-1.5 pt-1 text-[11px]'>
              <div className='flex justify-between items-center text-slate-700 print-dark-override'>
                <span className='flex items-center gap-1 text-slate-500'>
                  <Calendar className='h-3 w-3 no-print' /> Waktu Transaksi:
                </span>
                <span className='font-semibold text-slate-900'>{formattedDate}</span>
              </div>
              <div className='flex justify-between items-center text-slate-700 print-dark-override'>
                <span className='flex items-center gap-1 text-slate-500'>
                  <UserCheck className='h-3 w-3 no-print' /> Petugas Kasir TU:
                </span>
                <span className='font-medium text-slate-900 truncate max-w-[150px]'>
                  {slipData.petugas_nama}
                </span>
              </div>
              <div className='flex justify-between items-center text-slate-700 print-dark-override'>
                <span className='text-slate-500'>Nama Penyetor:</span>
                <span className='font-medium text-slate-900'>{slipData.nama_penyetor}</span>
              </div>
            </div>

            <div className='border-b border-dashed border-slate-300 my-2 print-border-dashed' />

            {/* Detail Siswa */}
            <div className='p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 print-dark-override'>
              <div className='text-[9px] text-slate-500 uppercase font-sans font-semibold'>
                Identitas Pemilik Saldo:
              </div>
              <div className='flex justify-between items-center font-bold text-slate-900 text-xs'>
                <span>Siswa:</span>
                <span className='text-right'>{slipData.siswa.nama}</span>
              </div>
              <div className='flex justify-between items-center text-slate-600 text-[11px] print-dark-override'>
                <span>NIS / Kelas:</span>
                <span>{slipData.siswa.nis} • {slipData.siswa.kelas}</span>
              </div>
            </div>

            <div className='border-b border-dashed border-slate-300 my-2 print-border-dashed' />

            {/* Breakdown Nominal & Saldo */}
            <div className='space-y-2 pt-1'>
              <div className='flex justify-between items-center text-slate-600 text-[11px] print-dark-override'>
                <span>Saldo Awal Siswa:</span>
                <span className='font-medium text-slate-800'>Rp {slipData.saldo_awal.toLocaleString('id-ID')}</span>
              </div>
              <div className='flex justify-between items-center font-bold text-emerald-700 text-xs print-dark-override'>
                <span>Nominal Setoran Tunai (+):</span>
                <span className='text-sm'>Rp {slipData.nominal.toLocaleString('id-ID')}</span>
              </div>
              
              <div className='border-t-2 border-slate-900 pt-2 flex justify-between items-center font-bold text-sm text-slate-900 print-border-double'>
                <span className='flex items-center gap-1'>
                  <CreditCard className='h-3.5 w-3.5 text-emerald-600 no-print' /> SALDO BARU:
                </span>
                <span className='text-base font-mono text-emerald-700 print-dark-override'>
                  Rp {slipData.saldo_baru.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Footer Slip & Barcode Simulation */}
            <div className='pt-3 text-center space-y-2 border-t border-dashed border-slate-300 print-border-dashed'>
              <div className='text-[10px] text-slate-600 font-sans leading-tight print-dark-override'>
                Simpan slip ini sebagai bukti pembayaran tunai sah di layanan Kasir TU Sekolah.
              </div>
              <div className='font-mono text-[9px] text-slate-400 font-bold tracking-widest pt-1 uppercase'>
                *** SKOOLIA CASHLESS CANTEEN ***
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer (Hidden when printing) */}
        <DialogFooter className='p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-row justify-between items-center gap-2 no-print'>
          <div className='text-[11px] text-muted-foreground flex items-center gap-1 hidden sm:flex'>
            <FileText className='h-3.5 w-3.5 text-slate-400' />
            Format Struk Thermal 80mm / PDF
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='text-xs h-9'
            >
              Selesai
            </Button>
            <Button
              type='button'
              onClick={handlePrint}
              className='text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-sm'
            >
              <Printer className='h-4 w-4' />
              Cetak Slip Nota
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
