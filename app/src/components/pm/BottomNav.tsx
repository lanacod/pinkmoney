'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CreditCard, BarChart3, Vault, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home,        label: 'Home'  },
  { href: '/cartoes',   icon: CreditCard,  label: 'Cards' },
  { href: '/stats',     icon: BarChart3,   label: 'Stats' },
  { href: '/vault',     icon: Vault,       label: 'Vault' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pm-glass border-t border-[rgba(242,181,208,0.15)] pm-safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-md mx-auto relative">
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          // Slot do meio = FAB de nova transação
          const isMiddle = i === 1

          return (
            <>
              {isMiddle && <FabButton key="fab" />}
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors',
                  isActive
                    ? 'text-[var(--pm-primary-container)]'
                    : 'text-[var(--pm-on-surface-variant)]'
                )}
              >
                <Icon
                  size={22}
                  className={cn(isActive && 'drop-shadow-[0_0_6px_rgba(255,79,163,0.8)]')}
                />
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--pm-primary-container)]" />
                )}
              </Link>
            </>
          )
        })}
      </div>
    </nav>
  )
}

function FabButton() {
  return (
    <Link
      href="/nova-transacao"
      className="pm-btn-primary flex items-center justify-center w-14 h-14 rounded-full -mt-6 shadow-lg z-10"
      aria-label="Nova transação"
    >
      <Plus size={26} strokeWidth={2.5} />
    </Link>
  )
}
