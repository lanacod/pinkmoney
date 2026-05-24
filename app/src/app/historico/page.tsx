'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Search, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { GlassCard } from '@/components/pm/GlassCard'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { formatBRL, formatDate, groupByDate } from '@/lib/utils/format'

const FILTER_TABS = [
  { val: 'all',     label: 'Todos'   },
  { val: 'income',  label: 'Ent.'    },
  { val: 'expense', label: 'Saí.'    },
] as const

export default function HistoricoPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const { data: transactions = [], isLoading } = useTransactions(100)

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.categories?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.type === filter
    return matchSearch && matchFilter
  })

  const groups  = groupByDate(filtered)
  const income  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="px-5 pt-6 pb-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">Histórico</h1>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl pm-glass border border-[var(--pm-outline-variant)]/60">
        <Search size={15} className="text-[var(--pm-outline)] flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar transação..."
          className="flex-1 bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {FILTER_TABS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === val
                ? 'bg-[var(--pm-primary-container)] text-white shadow-[0_4px_16px_rgba(255,79,163,0.35)]'
                : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">✨</p>
          <p className="text-[var(--pm-on-surface-variant)] text-sm">Nenhuma transação encontrada</p>
          <Link href="/nova-transacao" className="inline-block text-sm text-[var(--pm-primary)] font-semibold">
            Adicionar agora →
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <p className="text-[10px] font-bold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2 px-1">
                {dateLabel}
              </p>
              <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/40">
                {items.map(t => {
                  const isIncome = t.type === 'income'
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-lg flex-shrink-0">
                        {t.categories?.icon ?? (isIncome ? '💰' : '💸')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--pm-on-surface)] truncate">
                          {t.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[var(--pm-on-surface-variant)]">
                            {formatDate(t.date)}
                          </span>
                          {t.categories && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--pm-primary-container)]/15 text-[var(--pm-primary)]">
                              {t.categories.icon} {t.categories.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`pm-numeric text-sm font-bold flex-shrink-0 ${
                        isIncome ? 'text-emerald-400' : 'text-[var(--pm-primary-container)]'
                      }`}>
                        {isIncome ? '+' : '-'}{formatBRL(t.amount)}
                      </p>
                    </div>
                  )
                })}
              </GlassCard>
            </div>
          ))}
        </div>
      )}

      {/* Espaçamento para sumário fixo */}
      <div className="h-20" />

      {/* Sumário fixo no rodapé (acima da bottom nav) */}
      <div className="fixed bottom-[72px] left-0 right-0 px-5 z-40 max-w-md mx-auto">
        <GlassCard className="flex divide-x divide-[var(--pm-outline-variant)]/50 shadow-lg">
          <div className="flex-1 flex items-center gap-2 p-3">
            <TrendingUp size={15} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Entradas</p>
              <p className="pm-numeric text-sm font-bold text-emerald-400">{formatBRL(income)}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 p-3">
            <TrendingDown size={15} className="text-[var(--pm-primary-container)] flex-shrink-0" />
            <div>
              <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Saídas</p>
              <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)]">{formatBRL(expense)}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* FAB flutuante */}
      <Link
        href="/nova-transacao"
        className="fixed bottom-[140px] right-5 w-14 h-14 rounded-full pm-btn-primary flex items-center justify-center z-50 shadow-[0_8px_24px_rgba(255,79,163,0.5)]"
        aria-label="Nova transação"
      >
        <Plus size={24} strokeWidth={2.5} />
      </Link>

    </div>
  )
}
