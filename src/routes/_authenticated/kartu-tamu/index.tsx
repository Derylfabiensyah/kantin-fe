import { createFileRoute } from '@tanstack/react-router'
import { KartuTamuPage } from '@/features/kartu-tamu'

export const Route = createFileRoute('/_authenticated/kartu-tamu/')({
  component: KartuTamuPage,
})
