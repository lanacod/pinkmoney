'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { Shield, Bell, LogOut, ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useProfile } from '@/lib/hooks/useProfile'
import { getInitials } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'

export default function PerfilPage() {
  const router         = useRouter()
  const { data: profile } = useProfile()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const name     = profile?.full_name ?? 'Star'
  const initials = getInitials(name)

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">

      {/* Avatar + Nome */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full pm-glass-bright pm-glow-primary flex items-center justify-center text-3xl font-bold text-[var(--pm-primary-container)]">
          {initials}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--pm-on-surface)]">{name}</h1>
        </div>
      </div>

      {/* Configurações */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[var(--pm-on-surface-variant)] uppercase tracking-widest px-1">
          Configurações Gerais
        </p>

        <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/50">
          <SettingRow icon={Shield} label="Segurança" description="Privacidade e senha" />
          <SettingRow icon={Bell}   label="Notificações" description="Alertas e depósitos" />
        </GlassCard>
      </div>

      {/* Sair */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl pm-glass border border-[var(--pm-outline-variant)] text-[var(--pm-error)] font-semibold text-sm"
      >
        <LogOut size={16} />
        Sair da Conta
      </button>

      <p className="text-center text-[10px] text-[var(--pm-outline)] pb-2">
        v.1.0.0 PinkPulse Edition
      </p>

    </div>
  )
}

function SettingRow({ icon: Icon, label, description }: {
  icon: React.ElementType
  label: string
  description: string
}) {
  return (
    <button className="w-full flex items-center gap-3 p-4 text-left">
      <div className="w-9 h-9 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[var(--pm-primary)]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--pm-on-surface)]">{label}</p>
        <p className="text-xs text-[var(--pm-on-surface-variant)]">{description}</p>
      </div>
      <ChevronRight size={16} className="text-[var(--pm-outline)]" />
    </button>
  )
}
