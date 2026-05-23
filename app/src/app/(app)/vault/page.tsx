'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Plus, Minus, Trophy } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { PmProgress } from '@/components/pm/PmProgress'
import { useGoals, useUpdateGoal } from '@/lib/hooks/useGoals'
import { formatBRL } from '@/lib/utils/format'

export default function VaultPage() {
  const { data: goals = [], isLoading } = useGoals()
  const { mutate: updateGoal }          = useUpdateGoal()
  const [contribution, setContribution] = useState(500)

  const totalSaved  = goals.reduce((s, g) => s + g.current_amount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">PinkMoney</h1>
        <Trophy size={22} className="text-[var(--pm-primary-container)]" />
      </div>

      {/* Mini rings de progresso */}
      {goals.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {goals.map(g => {
            const pct = Math.round((g.current_amount / g.target_amount) * 100)
            return (
              <div key={g.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="var(--pm-surface-container-high)" strokeWidth="5" />
                    <circle
                      cx="28" cy="28" r="22"
                      fill="none"
                      stroke="#FF4FA3"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[var(--pm-on-surface)]">{pct}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--pm-on-surface-variant)] text-center max-w-[56px] truncate">
                  {g.name}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Cards de metas */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />)}
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
              <GlassCard key={g.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{g.emoji ?? '⭐'}</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--pm-on-surface)]">{g.name}</p>
                      <p className="text-xs text-[var(--pm-on-surface-variant)]">
                        Próximo objetivo: manter o ritmo ✨
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--pm-primary-container)]/20 text-[var(--pm-primary-container)]">
                    {pct}%
                  </span>
                </div>
                <PmProgress value={pct} size="lg" />
                <div className="flex items-center justify-between text-xs">
                  <span className="pm-numeric text-[var(--pm-on-surface-variant)]">{formatBRL(g.current_amount)}</span>
                  <span className="pm-numeric text-[var(--pm-on-surface-variant)]">de {formatBRL(g.target_amount)}</span>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Contribuição mensal */}
      <GlassCard className="p-5 space-y-4">
        <p className="text-sm font-semibold text-[var(--pm-on-surface)] text-center">Ajustar Contribuição Mensal</p>
        <div className="text-center">
          <p className="pm-numeric text-3xl font-bold text-[var(--pm-on-surface)]">{formatBRL(contribution)}</p>
          <p className="text-xs text-[var(--pm-on-surface-variant)] mt-1">por mês</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setContribution(c => Math.max(50, c - 50))}
            className="w-12 h-12 rounded-full pm-glass border border-[var(--pm-outline-variant)] flex items-center justify-center"
          >
            <Minus size={18} className="text-[var(--pm-on-surface)]" />
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]">
            <div
              className="h-full rounded-full pm-progress-fill transition-all"
              style={{ width: `${Math.min(100, (contribution / 2000) * 100)}%` }}
            />
          </div>
          <button
            onClick={() => setContribution(c => Math.min(5000, c + 50))}
            className="w-12 h-12 rounded-full pm-btn-primary flex items-center justify-center"
          >
            <Plus size={18} />
          </button>
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-[var(--pm-on-surface)] mb-4">Badges de Conquista</p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { icon: '⭐', label: 'Estrela\nEconomizadora' },
            { icon: '🎯', label: 'Primeira\nMeta' },
            { icon: '💎', label: 'Mestre do\nBrilho' },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-2xl">
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
  )
}
