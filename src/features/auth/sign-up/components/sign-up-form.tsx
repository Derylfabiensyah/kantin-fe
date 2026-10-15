import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { sleep, cn } from '@/lib/utils'
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

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Masukkan email Anda.' : 'Format email tidak valid.',
    }),
    password: z
      .string()
      .min(1, 'Masukkan kata sandi Anda.')
      .min(7, 'Kata sandi minimal 7 karakter.'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi Anda.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Membuat akun...',
      success: () => {
        setIsLoading(false)
        return `Akun berhasil dibuat untuk ${data.email}.`
      },
      error: 'Terjadi kesalahan saat membuat akun',
    })
  }

  return (
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
              <FormLabel className='text-xs'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='nama@contoh.com'
                  className='border-0 bg-background shadow-xs'
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
                  placeholder='Masukkan kata sandi'
                  className='border-0 bg-background shadow-xs'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs'>Konfirmasi Kata Sandi</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Masukkan ulang kata sandi'
                  className='border-0 bg-background shadow-xs'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2 border-0 shadow-xs' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <UserPlus />}
          Buat Akun
        </Button>
      </form>
    </Form>
  )
}
