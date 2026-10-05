import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn, School, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import type { UserRole } from '@/stores/useRoleStore'

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Masukkan email atau username staf.')
    .email('Format email tidak valid.'),
  password: z
    .string()
    .min(1, 'Masukkan kata sandi staf.')
    .min(6, 'Kata sandi minimal 6 karakter.'),
  sekolahId: z
    .string()
    .min(1, 'ID Sekolah wajib diisi.'),
})

type FormValues = z.infer<typeof formSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

interface LoginResponseData {
  token: string
  user: {
    id: number | string
    nama: string
    email: string
    currentRole?: UserRole
    roles: string[]
    sekolah?: {
      id: number
      nama: string
    }
  }
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@skoolia.id',
      password: 'password123',
      sekolahId: '10',
    },
  })

  const handleSelectPresetRole = (roleEmail: string, roleName: string) => {
    form.setValue('email', roleEmail)
    form.setValue('password', 'password123')
    form.setValue('sekolahId', '10')
    toast.info(`Akun simulasi ${roleName} dipilih`)
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      const response = await apiClient.post<{
        code: number
        status: string
        message: string
        data: LoginResponseData
      }>('/api/v1/auth/login', {
        email: data.email,
        password: data.password,
        sekolah_id: Number(data.sekolahId) || 10,
      })

      const resData = response.data?.data
      if (!resData || !resData.token) {
        throw new Error('Respon login tidak memuat token otentikasi')
      }

      const rawRole = (resData.user.currentRole || 'admin') as UserRole
      const authenticatedUser: AuthUser = {
        userId: resData.user.id,
        nama: resData.user.nama,
        email: resData.user.email,
        sekolahId: resData.user.sekolah?.id || Number(data.sekolahId) || 10,
        sekolahNama: resData.user.sekolah?.nama || 'SMA Negeri 1 SKOOLIA',
        roles: resData.user.roles || ['ROLE_ADMIN'],
        currentRole: rawRole,
      }

      // Simpan token dan data sesi
      auth.setAccessToken(resData.token)
      auth.setUser(authenticatedUser)

      toast.success(`Selamat datang, ${authenticatedUser.nama}!`, {
        description: `Peran aktif: ${rawRole.toUpperCase()} di ${authenticatedUser.sekolahNama}`,
      })

      // Tentukan rute navigasi tujuan berdasarkan role staf
      let targetPath = redirectTo || '/'
      if (!redirectTo) {
        if (rawRole === 'kasir') {
          targetPath = '/kasir'
        } else if (rawRole === 'tu') {
          targetPath = '/tu/topup'
        } else {
          targetPath = '/'
        }
      }

      navigate({ to: targetPath, replace: true })
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string }
      const errorMsg =
        errorObj.response?.data?.message ||
        errorObj.message ||
        'Gagal melakukan proses login staf'
      toast.error('Autentikasi Gagal', { description: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-3', className)}
          {...props}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs'>Email atau Username Staf</FormLabel>
                <FormControl>
                  <Input
                    placeholder='staf@skoolia.id'
                    autoComplete='username'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs'>Kata Sandi</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder='••••••••'
                    autoComplete='current-password'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sekolahId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs flex items-center gap-1'>
                  <School className='size-3.5 text-muted-foreground' />
                  ID Sekolah
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='10'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='mt-2 w-full font-medium' disabled={isLoading}>
            {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
            Masuk ke Sistem Kantin
          </Button>
        </form>
      </Form>

      {/* Preset Akun Cepat untuk Uji Coba Role */}
      <div className='pt-2 border-t border-border/60'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-2'>
          <ShieldCheck className='size-3.5 text-primary' />
          <span>Pilih Akun Cepat (Uji Coba RBAC):</span>
        </div>
        <div className='grid grid-cols-2 gap-1.5'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 text-xs justify-start px-2'
            disabled={isLoading}
            onClick={() => handleSelectPresetRole('admin@skoolia.id', 'Admin')}
          >
            Admin Sekolah
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 text-xs justify-start px-2'
            disabled={isLoading}
            onClick={() => handleSelectPresetRole('kasir@skoolia.id', 'Kasir POS')}
          >
            Petugas Kasir
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 text-xs justify-start px-2'
            disabled={isLoading}
            onClick={() => handleSelectPresetRole('tu@skoolia.id', 'Tata Usaha')}
          >
            Petugas TU
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 text-xs justify-start px-2'
            disabled={isLoading}
            onClick={() => handleSelectPresetRole('pengelola@skoolia.id', 'Pengelola')}
          >
            Pengelola Kantin
          </Button>
        </div>
      </div>
    </div>
  )
}
