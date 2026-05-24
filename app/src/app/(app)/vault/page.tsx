'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Bell, Plus, Minus } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { PmProgress } from '@/components/pm/PmProgress'
import { useGoals, useUpdateGoal } from '@/lib/hooks/useGoals'
import { formatBRL } from '@/lib/utils/format'

export default function VaultPage() {
  const { data: goals = [], isLoading } = useGoals()
  const { mutate: updateGoal }          = useUpdateGoal()
  const [contribution, setContribution] = useState(500)

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
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
        </button>
      </div>

      {/* ── Mini rings de progresso ── */}
      {goals.length > 0 && (
        <div className="flex gap-4 overflow-x-auto px-5 pb-1">
          {goals.map(g => {
            const pct = Math.round((g.current_amount / g.target_amount) * 100)
            return (
              <div key={g.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="var(--pm-surface-container-high)" strokeWidth="6" />
                    <circle
                      cx="32" cy="32" r="26"
                      fill="none"
                      stroke="#FF4FA3"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                      className="transition-all duration-500"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,79,163,0.6))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-[var(--pm-on-surface)]">{pct}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--pm-on-surface-variant)] text-center max-w-[60px] truncate">
                  {g.name}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Cards de metas ── */}
      <div className="px-5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-3">
            <p className="text-4xl">🎯</p>
            <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Nenhuma meta ainda</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)]">Crie sua primeira meta e comece a brilhar!</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {goals.map(g => {
              const pct = Math.round((g.current_amount / g.target_amount) * 100)
              return (
                <GlassCard key={g.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-xl">
                        {g.emoji ?? '⭐'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--pm-on-surface)]">{g.name}</p>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--pm-primary-container)]/20 text-[var(--pm-primary-container)]">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-xs text-[var(--pm-on-surface-variant)] mt-0.5">
                          Próximo objetivo: manter o ritmo ✨
                        </p>
                      </div>
                    </div>
                  </div>
                  <PmProgress value={pct} size="md" />
                  <div className="flex items-center justify-between text-xs text-[var(--pm-on-surface-variant)]">
                    <span className="pm-numeric">{formatBRL(g.current_amount)}</span>
                    <span className="pm-numeric">de {formatBRL(g.target_amount)}</span>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Contribuição Mensal ── */}
      <div className="px-5">
        <GlassCard className="p-5 space-y-4">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)] text-center">
            Ajustar Contribuição Mensal
          </p>
          <div className="text-center">
            <p className="pm-numeric text-3xl font-bold text-[var(--pm-on-surface)]">
              {formatBRL(contribution)}
            </p>
            <p className="text-xs text-[var(--pm-on-surface-variant)] mt-1 uppercase tracking-widest">
              Por Mês
            </p>
          </div>

          {/* Slider visual */}
          <div className="relative h-1.5 rounded-full bg-[var(--pm-surface-container-high)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full pm-progress-fill transition-all"
              style={{ width: `${Math.min(100, (contribution / 2000) * 100)}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--pm-primary-container)] shadow-[0_0_8px_rgba(255,79,163,0.6)] transition-all"
              style={{ left: `calc(${Math.min(100, (contribution / 2000) * 100)}% - 8px)` }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setContribution(c => Math.max(50, c - 50))}
              className="w-12 h-12 rounded-full pm-glass border border-[var(--pm-outline-variant)] flex items-center justify-center"
            >
              <Minus size={18} className="text-[var(--pm-on-surface)]" />
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setContribution(c => Math.min(5000, c + 50))}
              className="w-12 h-12 rounded-full pm-btn-primary flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* ── Badges de Conquista ── */}
      <div className="px-5">
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)] mb-4">✦ Badges de Conquista</p>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {[
              { icon: '⭐', label: 'Estrela\nEconomizadora' },
              { icon: '🎯', label: 'Primeira\nMeta'         },
              { icon: '💎', label: 'Mestre do\nBrilho'      },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-2xl border border-[var(--pm-outline-variant)]/60">
                  {b.icon}
                </div>
                <p className="text-[10px] text-[var(--pm-on-surface-variant)] text-center whitespace-pre-line">
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  )
}
