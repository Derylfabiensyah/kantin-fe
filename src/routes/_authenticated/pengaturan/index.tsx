import { createFileRoute } from '@tanstack/react-router'
import { PengaturanKantinPage } from '@/features/pengaturan'

export const Route = createFileRoute('/_authenticated/pengaturan/')({
  component: PengaturanKantinPage,
})
