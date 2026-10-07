import { createFileRoute } from '@tanstack/react-router'
import { InventarisPage } from '@/features/stok'

export const Route = createFileRoute('/_authenticated/stok/inventaris/')({
  component: InventarisPage,
})
