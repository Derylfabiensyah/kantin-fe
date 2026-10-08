import { createFileRoute } from '@tanstack/react-router'
import { LaporanKerugianStokPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/kerugian-stok/')({
  component: LaporanKerugianStokPage,
})
