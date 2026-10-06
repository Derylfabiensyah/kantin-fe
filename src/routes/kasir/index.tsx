import { createFileRoute } from '@tanstack/react-router'
import { KasirPosPage } from '@/features/kasir/KasirPosPage'

export const Route = createFileRoute('/kasir/')({
  component: KasirPosPage,
})
