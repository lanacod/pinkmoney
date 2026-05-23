import { cn } from '@/lib/utils'

export function StarsBg({ className }: { className?: string }) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none pm-stars z-0', className)}
      aria-hidden="true"
    />
  )
}
