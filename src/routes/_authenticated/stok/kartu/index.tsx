import { createFileRoute } from '@tanstack/react-router'
import { KartuStokPage } from '@/features/stok'

export const Route = createFileRoute('/_authenticated/stok/kartu/')({
  component: KartuStokPage,
})
