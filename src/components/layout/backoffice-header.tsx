import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Badge } from '@/components/ui/badge'
import { Wifi } from 'lucide-react'

export interface BackofficeHeaderProps {
  className?: string
  fixed?: boolean
}

export function BackofficeHeader({ className, fixed = true }: BackofficeHeaderProps) {
  const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

  return (
    <Header fixed={fixed} className={cn('bg-background/95 backdrop-blur border-b border-sidebar-border/50', className)}>
      {/* Bagian Kanan: Search, Theme, Profil */}
      <div className='flex items-center gap-2 sm:gap-3 ms-auto'>
        {/* Badge Mock API jika aktif */}
        {isMock && (
          <Badge
            variant='outline'
            className='hidden sm:inline-flex text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
          >
            <Wifi className='size-2.5 mr-1 text-blue-500' />
            MOCK API
          </Badge>
        )}

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </Header>
  )
}

export default BackofficeHeader
