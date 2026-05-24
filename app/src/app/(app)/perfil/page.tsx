'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { Bell, Shield, Bell as BellIcon, LogOut, ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useProfile } from '@/lib/hooks/useProfile'
import { getInitials } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'

export default function PerfilPage() {
  const router            = useRouter()
  const { data: profile } = useProfile()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const name     = profile?.full_name ?? 'Star'
  const initials = getInitials(name)

  return (
    <div className="pb-4 space-y-5">

      {/* ── App Header ── */}
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">✦</span>
          <span className="text-base font-bold text-[var(--pm-on-surface)] tracking-tight">PinkMoney</span>
        </div>
        <button className="relative w-9 h-9 rounded-full pm-glass flex items-center justify-center">
          <Bell size={16} className="text-[var(--pm-on-surface-variant)]" />
        </button>
      </div>

      {/* ── Avatar + Nome ── */}
      <div className="flex flex-col items-center gap-4 py-6 px-5">
        {/* Avatar com glow */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF4FA3 0%, #b7046c 100%)',
              boxShadow: '0 0 0 3px rgba(255,79,163,0.3), 0 0 0 6px rgba(255,79,163,0.15), 0 0 24px rgba(255,79,163,0.4)',
            }}
          >
            {initials}
          </div>
          {/* Badge online */}
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[var(--pm-bg)]" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">{name}</h1>
        </div>
      </div>

      {/* ── Configurações ── */}
      <div className="px-5 space-y-2">
        <p className="text-[10px] font-bold text-[var(--pm-on-surface-variant)] uppercase tracking-widest px-1">
          Configurações Gerais
        </p>

        <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/40 overflow-hidden">
          <SettingRow icon={Shield}    label="Segurança"      description="Privacidade e senha"      />
          <SettingRow icon={BellIcon}  label="Notificações"   description="Alertas e depósitos"      />
        </GlassCard>
      </div>

      {/* ── Sair ── */}
      <div className="px-5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl pm-glass border border-[var(--pm-error)]/30 text-[var(--pm-error)] font-semibold text-sm transition-all hover:border-[var(--pm-error)]/60"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>

      {/* ── Versão ── */}
      <p className="text-center text-[10px] text-[var(--pm-outline)] pb-2">
        v2.4.0 PinkPulse Edition
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
    <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-[var(--pm-primary-container)]/15 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[var(--pm-primary)]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--pm-on-surface)]">{label}</p>
        <p className="text-[11px] text-[var(--pm-on-surface-variant)] mt-0.5">{description}</p>
      </div>
      <ChevronRight size={15} className="text-[var(--pm-outline)] flex-shrink-0" />
    </button>
  )
}
