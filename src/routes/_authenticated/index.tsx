import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState().auth
    if (user?.currentRole === 'kasir') {
      throw redirect({
        to: '/kasir',
      })
    }
  },
  component: Dashboard,
})
