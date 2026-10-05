import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='max-w-md w-full gap-4 shadow-sm border-border/70'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl font-bold tracking-tight'>
            Masuk Staf Kantin
          </CardTitle>
          <CardDescription className='text-xs'>
            Gunakan akun staf terdaftar pada portal SKOOLIA untuk mengakses terminal kasir POS atau panel backoffice pengelola.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-2'>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default SignIn
