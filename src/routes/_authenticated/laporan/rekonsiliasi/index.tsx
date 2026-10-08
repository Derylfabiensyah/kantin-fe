import { createFileRoute } from '@tanstack/react-router'
import { LaporanRekonsiliasiPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/rekonsiliasi/')({
  component: LaporanRekonsiliasiPage,
})
