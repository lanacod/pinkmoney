'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Plus, BarChart3, Vault } from 'lucide-react'
import { cn } from '@/lib/utils'

// 2 abas à esquerda, FAB central, 2 abas à direita
const LEFT_ITEMS = [
  { href: '/dashboard', icon: Home,    label: 'Home'      },
  { href: '/historico', icon: History, label: 'Histórico' },
]

const RIGHT_ITEMS = [
  { href: '/stats', icon: BarChart3, label: 'Stats' },
  { href: '/vault', icon: Vault,     label: 'Vault' },
]

export function BottomNav() {
  const pathname = usePathname()

  function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    const isActive = pathname.startsWith(href)
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col items-center gap-1 flex-1 py-1.5 rounded-2xl transition-all',
          isActive ? 'text-[var(--pm-primary-container)]' : 'text-[var(--pm-on-surface-variant)]'
        )}
      >
        {isActive ? (
          <div className="flex items-center justify-center w-10 h-7 rounded-full bg-[var(--pm-primary-container)]/20">
            <Icon size={19} className="drop-shadow-[0_0_6px_rgba(255,79,163,0.8)]" />
          </div>
        ) : (
          <div className="h-7 flex items-center justify-center">
            <Icon size={19} />
          </div>
        )}
        <span className={cn(
          'text-[10px] font-semibold tracking-wide',
          isActive ? 'text-[var(--pm-primary-container)]' : 'text-[var(--pm-on-surface-variant)]'
        )}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pm-glass border-t border-[rgba(242,181,208,0.12)] pm-safe-bottom">
      <div className="flex items-center max-w-md mx-auto px-2 pt-1 pb-2">

        {/* Esquerda */}
        {LEFT_ITEMS.map(item => (
          <NavItem key={item.href} {...item} />
        ))}

        {/* FAB Central */}
        <div className="flex flex-col items-center flex-shrink-0 px-3">
          <Link
            href="/nova-transacao"
            aria-label="Nova transação"
            className="w-14 h-14 rounded-full pm-btn-primary flex items-center justify-center -mt-7 shadow-[0_4px_24px_rgba(255,79,163,0.55)]"
          >
            <Plus size={26} strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] font-semibold text-[var(--pm-on-surface-variant)] mt-1">
            Add
          </span>
        </div>

        {/* Direita */}
        {RIGHT_ITEMS.map(item => (
          <NavItem key={item.href} {...item} />
        ))}

      </div>
    </nav>
  )
}
