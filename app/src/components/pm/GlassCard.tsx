import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  bright?: boolean
  glow?: boolean
}

export function GlassCard({ className, bright, glow, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        bright ? 'pm-glass-bright' : 'pm-glass',
        glow && 'pm-glow-primary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
