import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <AuthLayout>
      <Card className='w-full max-w-[390px] gap-5 border-0 bg-muted/60 dark:bg-muted/25 shadow-md py-8 px-6 sm:px-7'>
        <CardHeader className='pb-1 px-0'>
          <CardTitle className='text-xl font-bold tracking-tight'>
            Buat Akun Baru
          </CardTitle>
          <CardDescription className='text-xs leading-relaxed'>
            Masukkan email dan kata sandi untuk mendaftar akun baru. <br />
            Sudah memiliki akun?{' '}
            <Link
              to='/sign-in'
              className='underline hover:text-primary'
            >
              Masuk
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-1 px-0'>
          <SignUpForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
