import { useMemo } from 'react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { useRoleStore } from '@/stores/useRoleStore'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { NavGroup } from '@/components/layout/nav-group'
import { TeamSwitcher } from '@/components/layout/team-switcher'

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { collapsible, variant } = useLayout()
  const { currentRole, schoolName, canteenName } = useRoleStore()

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

      <SidebarRail />
    </ShadcnSidebar>
  )
}

export default Sidebar
