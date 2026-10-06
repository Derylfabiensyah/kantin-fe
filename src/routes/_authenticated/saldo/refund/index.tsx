import { createFileRoute } from '@tanstack/react-router'
import { RefundSiswaKeluarPage } from '@/features/saldo-refund'

export const Route = createFileRoute('/_authenticated/saldo/refund/')({
  component: RefundSiswaKeluarPage,
})
