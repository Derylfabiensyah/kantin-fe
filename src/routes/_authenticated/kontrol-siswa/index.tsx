import { createFileRoute } from '@tanstack/react-router'
import { KontrolSiswaPage } from '@/features/kontrol-siswa'

export const Route = createFileRoute('/_authenticated/kontrol-siswa/')({
  component: KontrolSiswaPage,
})
