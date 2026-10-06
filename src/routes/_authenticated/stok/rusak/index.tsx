import { createFileRoute } from '@tanstack/react-router'
import { StokOpnamePage } from '@/features/stok'

export const Route = createFileRoute('/_authenticated/stok/rusak/')({
  component: StokOpnamePage,
})
