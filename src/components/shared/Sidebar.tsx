import { useMemo } from 'react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { useRoleStore, ROLE_CONFIGS, type UserRole } from '@/stores/useRoleStore'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserCheck } from 'lucide-react'

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { collapsible, variant } = useLayout()
  const { currentRole, setRole, userName, userEmail, schoolName, canteenName } = useRoleStore()

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
      <SidebarHeader className='border-b border-sidebar-border/50 pb-3'>
        <TeamSwitcher teams={teams} />

        {/* Role Selector Simulator untuk pengujian RBAC */}
        <div className='mt-1 px-2 group-data-[collapsible=icon]:hidden'>
          <div className='flex items-center justify-between mb-1 text-[11px] text-muted-foreground font-medium'>
            <span className='flex items-center gap-1'>
              <UserCheck className='size-3 text-primary' />
              <span>Simulasi Role RBAC:</span>
            </span>
            <Badge
              variant='outline'
              className={`text-[10px] px-1 py-0 h-4 ${ROLE_CONFIGS[currentRole]?.badgeColor}`}
            >
              {currentRole.toUpperCase()}
            </Badge>
          </div>
          <Select
            value={currentRole}
            onValueChange={(val) => setRole(val as UserRole)}
          >
            <SelectTrigger className='h-7 text-xs w-full bg-sidebar-accent/40 border-sidebar-border'>
              <SelectValue placeholder='Pilih Role' />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ROLE_CONFIGS).map((cfg) => (
                <SelectItem key={cfg.id} value={cfg.id} className='text-xs'>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{cfg.label}</span>
                    <span className='text-[10px] text-muted-foreground'>
                      {cfg.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
