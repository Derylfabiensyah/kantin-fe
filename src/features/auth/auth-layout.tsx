type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-4 sm:p-8'>
      <div className='flex w-full flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  )
}
