'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CreditCard, BarChart3, Vault } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home,       label: 'Home'  },
  { href: '/cartoes',   icon: CreditCard, label: 'Cards' },
  { href: '/stats',     icon: BarChart3,  label: 'Stats' },
  { href: '/vault',     icon: Vault,      label: 'Vault' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pm-glass border-t border-[rgba(242,181,208,0.12)] pm-safe-bottom">
      <div className="flex items-center justify-around px-4 pt-2 pb-2 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all',
                isActive
                  ? 'text-[var(--pm-primary-container)]'
                  : 'text-[var(--pm-on-surface-variant)]'
              )}
            >
              {isActive ? (
                <div className="flex items-center justify-center w-10 h-7 rounded-full bg-[var(--pm-primary-container)]/20">
                  <Icon size={20} className="drop-shadow-[0_0_6px_rgba(255,79,163,0.8)]" />
                </div>
              ) : (
                <Icon size={20} />
              )}
              <span className={cn(
                'text-[10px] font-semibold tracking-wide',
                isActive ? 'text-[var(--pm-primary-container)]' : 'text-[var(--pm-on-surface-variant)]'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
