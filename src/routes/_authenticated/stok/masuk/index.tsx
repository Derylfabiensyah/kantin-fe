import { createFileRoute } from '@tanstack/react-router'
import { BarangMasukPage } from '@/features/stok'

export const Route = createFileRoute('/_authenticated/stok/masuk/')({
  component: BarangMasukPage,
})
