import { useMemo } from 'react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { useRoleStore } from '@/stores/useRoleStore'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { collapsible, variant } = useLayout()
  const { currentRole, userName, userEmail, schoolName, canteenName } = useRoleStore()

  // Filter navigasi sidebar dinamis sesuai role yang sedang aktif
  const filteredNavGroups = useMemo(() => {
    return sidebarData.navGroups
      .filter((group) => {
        if (!group.roles || group.roles.length === 0) return true
        if (currentRole === 'admin') return true
        return group.roles.includes(currentRole)
      })
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!item.roles || item.roles.length === 0) return true
          if (currentRole === 'admin') return true
          return item.roles.includes(currentRole)
        }),
      }))
  }, [currentRole])

  const user = {
    name: userName || sidebarData.user.name,
    email: userEmail || sidebarData.user.email,
    avatar: sidebarData.user.avatar,
  }

  const teams = [
    {
      name: canteenName || 'SKOOLIA Kantin',
      logo: sidebarData.teams[0].logo,
      plan: schoolName || 'Cashless Sekolah',
    },
  ]

  return (
    <ShadcnSidebar collapsible={collapsible} variant={variant} className={className}>
      <SidebarHeader className='border-b border-sidebar-border/50'>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter className='border-t border-sidebar-border/50 pt-2'>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  )
}

export default Sidebar
