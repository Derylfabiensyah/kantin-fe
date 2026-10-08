import { createFileRoute } from '@tanstack/react-router'
import { LaporanSaldoMengendapPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/saldo-mengendap/')({
  component: LaporanSaldoMengendapPage,
})
