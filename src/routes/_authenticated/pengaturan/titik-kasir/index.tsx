import { createFileRoute } from '@tanstack/react-router'
import { TitikKasirPage } from '@/features/pengaturan'

export const Route = createFileRoute(
  '/_authenticated/pengaturan/titik-kasir/'
)({
  component: TitikKasirPage,
})
