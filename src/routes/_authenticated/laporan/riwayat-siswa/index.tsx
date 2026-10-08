import { createFileRoute } from '@tanstack/react-router'
import { LaporanRiwayatSiswaPage } from '@/features/laporan'

export const Route = createFileRoute('/_authenticated/laporan/riwayat-siswa/')({
  component: LaporanRiwayatSiswaPage,
})
