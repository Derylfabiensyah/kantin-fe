import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useRoleStore, ROLE_CONFIGS, type UserRole } from '@/stores/useRoleStore'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { user } = useAuthStore().auth
  const { userName: fallbackName, userEmail: fallbackEmail, currentRole: fallbackRole } = useRoleStore()

  const userName = user?.nama || fallbackName || 'Staf Kantin'
  const userEmail = user?.email || fallbackEmail || ''
  const currentRole = (user?.currentRole || fallbackRole || 'admin') as UserRole
  const roleConfig = ROLE_CONFIGS[currentRole]

  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/40'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/shadcn.jpg' alt={userName} />
              <AvatarFallback className='bg-primary/10 text-primary font-semibold text-xs'>
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <p className='text-sm leading-none font-semibold text-foreground truncate max-w-[170px]' title={userName}>
                  {userName}
                </p>
                <Badge variant='outline' className={`text-[10px] px-1 py-0 h-4 ${roleConfig?.badgeColor}`}>
                  {roleConfig?.label.split(' ')[0]}
                </Badge>
              </div>
              <p className='text-xs leading-none text-muted-foreground truncate' title={userEmail}>
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
