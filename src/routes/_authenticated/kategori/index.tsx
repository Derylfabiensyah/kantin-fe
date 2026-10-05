import { createFileRoute } from '@tanstack/react-router'
import { KategoriPage } from '@/features/katalog'

export const Route = createFileRoute('/_authenticated/kategori/')({
  component: KategoriPage,
})
