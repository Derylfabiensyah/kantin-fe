import { createFileRoute } from '@tanstack/react-router'
import { TopupTunaiPage } from '@/features/tu'

export const Route = createFileRoute('/_authenticated/tu/topup/')({
  component: TopupTunaiPage,
})
