import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { BreadcrumbNav } from '@/components/breadcrumb-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Badge } from '@/components/ui/badge'
import { useRoleStore } from '@/stores/useRoleStore'
import { School, Wifi } from 'lucide-react'

export interface BackofficeHeaderProps {
  className?: string
  fixed?: boolean
}

export function BackofficeHeader({ className, fixed = true }: BackofficeHeaderProps) {
  const { schoolName, moduleStatus } = useRoleStore()
  const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

  return (
    <Header fixed={fixed} className={cn('bg-background/95 backdrop-blur border-b border-border/40', className)}>
      {/* Breadcrumb navigasi otomatis sinkron rute */}
      <div className='flex items-center gap-2 overflow-hidden me-auto'>
        <BreadcrumbNav />
      </div>

      {/* Bagian Kanan: Sekolah, Status Modul, Search, Theme, Profil */}
      <div className='flex items-center gap-2 sm:gap-3 ms-auto'>
        {/* Nama Sekolah & Badge Status Modul */}
        <div className='hidden lg:flex items-center gap-2 bg-muted/50 border border-border/60 rounded-full px-3 py-1 text-xs'>
          <School className='size-3.5 text-primary shrink-0' />
          <span className='font-medium text-foreground truncate max-w-[180px]'>
            {schoolName}
          </span>
          <span className='h-3 w-px bg-border' />
          <div className='flex items-center gap-1.5'>
            <span className='relative flex size-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
              <span className='relative inline-flex size-2 rounded-full bg-emerald-500'></span>
            </span>
            <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
              {moduleStatus}
            </span>
          </div>
        </div>

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

        {/* Search Palette (Cmd+K) */}
        <Search />

        {/* Theme Switcher (Dark/Light mode) */}
        <ThemeSwitch />

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </Header>
  )
}

export default BackofficeHeader
