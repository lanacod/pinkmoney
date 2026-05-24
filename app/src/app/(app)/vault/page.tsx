'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Bell, Plus, Minus, Star, X, Check } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { PmProgress } from '@/components/pm/PmProgress'
import { useGoals, useCreateGoal, useUpdateGoal } from '@/lib/hooks/useGoals'
import { formatBRL } from '@/lib/utils/format'

const EMOJI_OPTIONS = ['✈️', '💄', '🏠', '💻', '🚗', '📚', '🎮', '💍', '🎯', '🌴', '💰', '🎓']

interface GoalForm {
  name: string
  emoji: string
  target_amount: string
  monthly_contribution: string
}

export default function VaultPage() {
  const { data: goals = [], isLoading } = useGoals()
  const { mutateAsync: createGoal }     = useCreateGoal()
  const { mutateAsync: updateGoal }     = useUpdateGoal()

  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState<GoalForm>({
    name: '', emoji: '🎯', target_amount: '', monthly_contribution: '',
  })

  // Contribuição do primeiro goal (ou 0)
  const [localContrib, setLocalContrib] = useState<Record<string, number>>({})

  function getContrib(g: { id: string; monthly_contribution: number }) {
    return localContrib[g.id] ?? g.monthly_contribution
  }

  function openNew() {
    setEditId(null)
    setForm({ name: '', emoji: '🎯', target_amount: '', monthly_contribution: '' })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.target_amount) return
    setSaving(true)
    try {
      if (editId) {
        await updateGoal({
          id: editId,
          name: form.name,
          emoji: form.emoji,
          target_amount: parseFloat(form.target_amount.replace(',', '.')),
          monthly_contribution: form.monthly_contribution
            ? parseFloat(form.monthly_contribution.replace(',', '.'))
            : 0,
        })
      } else {
        await createGoal({
          name: form.name,
          emoji: form.emoji,
          target_amount: parseFloat(form.target_amount.replace(',', '.')),
          monthly_contribution: form.monthly_contribution
            ? parseFloat(form.monthly_contribution.replace(',', '.'))
            : 0,
        })
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function saveContrib(goalId: string, value: number) {
    setLocalContrib(prev => ({ ...prev, [goalId]: value }))
    await updateGoal({ id: goalId, monthly_contribution: value })
  }

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
            const pct = g.target_amount > 0
              ? Math.round((g.current_amount / g.target_amount) * 100)
              : 0
            return (
              <div key={g.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="var(--pm-surface-container-high)" strokeWidth="6" />
                    {pct > 0 && (
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
                    )}
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
            {[1, 2].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-3">
            <p className="text-4xl">🎯</p>
            <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Nenhuma meta ainda</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)]">
              Crie sua primeira meta e comece a brilhar!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {goals.map(g => {
              const pct = g.target_amount > 0
                ? Math.round((g.current_amount / g.target_amount) * 100)
                : 0
              const contrib = getContrib(g)
              return (
                <GlassCard key={g.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-xl">
                        {g.emoji ?? '🎯'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--pm-on-surface)]">{g.name}</p>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--pm-primary-container)]/20 text-[var(--pm-primary-container)]">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-xs text-[var(--pm-on-surface-variant)] mt-0.5">
                          {formatBRL(g.current_amount)} de {formatBRL(g.target_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <PmProgress value={pct} size="md" />

                  {/* Controle de contribuição mensal */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex-1">
                      <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-1">
                        Contribuição mensal
                      </p>
                      <p className="pm-numeric text-base font-bold text-[var(--pm-on-surface)]">
                        {formatBRL(contrib)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const next = Math.max(0, contrib - 50)
                          saveContrib(g.id, next)
                        }}
                        className="w-8 h-8 rounded-full pm-glass border border-[var(--pm-outline-variant)] flex items-center justify-center"
                      >
                        <Minus size={13} className="text-[var(--pm-on-surface)]" />
                      </button>
                      <button
                        onClick={() => {
                          const next = contrib + 50
                          saveContrib(g.id, next)
                        }}
                        className="w-8 h-8 rounded-full pm-btn-primary flex items-center justify-center"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Nova Meta ── */}
      <div className="px-5">
        <button
          onClick={openNew}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full pm-btn-primary font-bold text-sm"
        >
          <Plus size={18} />
          Nova Meta
        </button>
      </div>

      {/* ── Badges de Conquista ── */}
      <div className="px-5">
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)] mb-4">✦ Badges de Conquista</p>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {[
              { icon: '⭐', label: 'Estrela\nEconomizadora', earned: goals.length > 0 },
              { icon: '🎯', label: 'Primeira\nMeta',         earned: goals.length > 0 },
              { icon: '💎', label: 'Mestre do\nBrilho',      earned: goals.some(g => g.current_amount >= g.target_amount) },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border transition-all ${
                  b.earned
                    ? 'bg-[var(--pm-primary-container)]/20 border-[var(--pm-primary-container)]/40 shadow-[0_0_12px_rgba(255,79,163,0.2)]'
                    : 'bg-[var(--pm-surface-container-high)] border-[var(--pm-outline-variant)]/40 opacity-40'
                }`}>
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

      {/* ── Modal de Nova Meta ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md mx-auto pm-glass rounded-t-3xl p-6 space-y-5 border-t border-[rgba(242,181,208,0.2)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[var(--pm-outline-variant)]" />

            <div className="flex items-center justify-between pt-2">
              <h3 className="text-base font-bold text-[var(--pm-on-surface)]">
                {editId ? 'Editar Meta' : 'Nova Meta'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={18} className="text-[var(--pm-on-surface-variant)]" />
              </button>
            </div>

            {/* Emoji */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">Ícone</p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => setForm(f => ({ ...f, emoji: em }))}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      form.emoji === em
                        ? 'bg-[var(--pm-primary-container)] shadow-[0_0_12px_rgba(255,79,163,0.5)]'
                        : 'bg-[var(--pm-surface-container-high)]'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Nome */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">Nome</p>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Viagem para Tokyo, MacBook..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
              />
            </div>

            {/* Valor alvo + Contribuição */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                  Meta (R$)
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.target_amount}
                  onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))}
                  placeholder="0,00"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                  Contrib./mês
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.monthly_contribution}
                  onChange={e => setForm(f => ({ ...f, monthly_contribution: e.target.value }))}
                  placeholder="0,00"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || !form.target_amount}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full pm-btn-primary font-bold text-sm disabled:opacity-50"
            >
              {saving ? 'Salvando...' : (
                <><Check size={16} /> {editId ? 'Salvar Alterações' : 'Criar Meta'}</>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
