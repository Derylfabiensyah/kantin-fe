import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group [&_div[data-content]]:w-full [&_[data-sonner-toast]]:border-0 [&_[data-sonner-toast]]:shadow-lg'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'transparent',
          '--success-border': 'transparent',
          '--error-border': 'transparent',
          '--warning-border': 'transparent',
          '--info-border': 'transparent',
        } as React.CSSProperties
      }
      toastOptions={{
        className: 'border-0 shadow-lg',
        classNames: {
          toast: 'border-0 shadow-lg',
          success: 'border-0',
          error: 'border-0',
          warning: 'border-0',
          info: 'border-0',
        },
      }}
      {...props}
    />
  )
}
