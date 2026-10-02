import { createFileRoute } from '@tanstack/react-router'
import { KasirWelcomePage } from '@/features/kasir/KasirWelcomePage'

export const Route = createFileRoute('/kasir/')({
  component: KasirWelcomePage,
})
