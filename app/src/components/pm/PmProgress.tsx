import { cn } from '@/lib/utils'

interface PmProgressProps {
  value: number       // 0–100
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PmProgress({ value, className, showLabel, size = 'md' }: PmProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  const trackH = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }[size]

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-[var(--pm-surface-container-high)] overflow-hidden', trackH)}>
        <div
          className="h-full rounded-full pm-progress-fill transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-[var(--pm-on-surface-variant)] text-right pm-numeric">
          {clamped}%
        </p>
      )}
    </div>
  )
}
