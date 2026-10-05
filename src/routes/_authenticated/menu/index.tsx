import { createFileRoute } from '@tanstack/react-router'
import { MenuPage } from '@/features/katalog'

export const Route = createFileRoute('/_authenticated/menu/')({
  component: MenuPage,
})
