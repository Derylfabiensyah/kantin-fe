import { createFileRoute } from '@tanstack/react-router'
import { LaporanLabaKotorPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/laba-kotor/')({
  component: LaporanLabaKotorPage,
})
