import { createFileRoute } from '@tanstack/react-router'
import { KasirLayout } from '@/layouts/KasirLayout'

export const Route = createFileRoute('/kasir')({
  component: KasirLayout,
})
