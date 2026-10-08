import { createFileRoute } from '@tanstack/react-router'
import { LaporanPenjualanPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/penjualan/')({
  component: LaporanPenjualanPage,
})
