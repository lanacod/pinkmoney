'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Bell, Plus, ChevronRight, Wifi } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useTransactions, useMonthlyTotals } from '@/lib/hooks/useTransactions'
import { formatBRL, formatDate } from '@/lib/utils/format'

const MOCK_CARDS = [
  {
    id: '1',
    name: 'Pink Platinum',
    number: '•••• •••• •••• 4821',
    limit: 8500,
    available: 4250,
    color: 'from-[#b7046c] via-[#FF4FA3] to-[#ffb0cc]',
    flag: 'Visa',
  },
]

export default function CartoesPage() {
  const [activeCard, setActiveCard] = useState(0)
  const { data: transactions = [] } = useTransactions(10)
  const { data: monthly }           = useMonthlyTotals()

  const card = MOCK_CARDS[activeCard]
  const recentPurchases = transactions.filter(t => t.type === 'expense').slice(0, 5)

  return (
    <div className="pb-4 space-y-5">

      {/* ── App Header ── */}
      <div className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold text-[var(--pm-on-surface)]">PinkMoney</h1>
        <button className="relative w-9 h-9 rounded-full pm-glass flex items-center justify-center">
          <Bell size={16} className="text-[var(--pm-on-surface-variant)]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
        </button>
      </div>

      {/* ── Sub-header ── */}
      <div className="px-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--pm-on-surface)]">My Cards</h2>
          <p className="text-xs text-[var(--pm-on-surface-variant)] mt-0.5">
            {MOCK_CARDS.length} Cards Ativos
          </p>
        </div>
      </div>

      {/* ── Card Carousel ── */}
      <div className="px-5">
        <div className="overflow-x-auto flex gap-4 pb-2 -mx-1 px-1 snap-x snap-mandatory">
          {MOCK_CARDS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCard(i)}
              className="flex-shrink-0 w-full snap-center"
            >
              <div
                className={`relative rounded-3xl p-6 bg-gradient-to-br ${c.color} aspect-[1.7/1] flex flex-col justify-between shadow-[0_16px_40px_rgba(255,79,163,0.4)]`}
              >
                {/* Card top */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-semibold tracking-widest uppercase">
                      Multi Credit Bank
                    </p>
                    <p className="text-white text-sm font-bold mt-0.5">{c.name}</p>
                  </div>
                  <Wifi size={20} className="text-white/80 rotate-90" />
                </div>

                {/* Chip */}
                <div className="absolute top-14 left-6">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#ffd700] to-[#b8860b] opacity-90" />
                </div>

                {/* Card bottom */}
                <div className="flex items-end justify-between mt-8">
                  <div>
                    <p className="text-white/60 text-[9px] uppercase tracking-widest mb-0.5">
                      Limite Disponível
                    </p>
                    <p className="pm-numeric text-2xl font-bold text-white">
                      {formatBRL(c.available)}
                    </p>
                    <p className="text-white/50 text-[10px] mt-0.5">{c.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{c.flag}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dots */}
        {MOCK_CARDS.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {MOCK_CARDS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeCard
                    ? 'w-5 bg-[var(--pm-primary-container)]'
                    : 'w-1.5 bg-[var(--pm-surface-container-high)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Saldo Atual ── */}
      <div className="px-5">
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Saldo Atual</p>
            <ChevronRight size={16} className="text-[var(--pm-outline)]" />
          </div>

          <div>
            <p className="pm-numeric text-3xl font-bold text-[var(--pm-on-surface)]">
              {formatBRL(monthly?.total_expenses ?? card.limit - card.available)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-[var(--pm-surface-container-high)] px-3 py-2">
              <p className="text-[var(--pm-on-surface-variant)] mb-0.5">Crédito Utilizado</p>
              <p className="pm-numeric font-bold text-[var(--pm-primary-container)]">
                {formatBRL(card.limit - card.available)}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--pm-surface-container-high)] px-3 py-2">
              <p className="text-[var(--pm-on-surface-variant)] mb-0.5">Limite Total</p>
              <p className="pm-numeric font-bold text-[var(--pm-on-surface)]">
                {formatBRL(card.limit)}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-[var(--pm-on-surface-variant)] space-y-0.5">
            <div className="flex justify-between">
              <span>Último fechamento</span>
              <span className="font-semibold text-[var(--pm-on-surface)]">Out 28, 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Próx. vencimento</span>
              <span className="font-semibold text-[var(--pm-on-surface)]">Nov 08, 2024</span>
            </div>
          </div>

          {/* Barra de uso */}
          <div>
            <div className="flex justify-between text-[10px] text-[var(--pm-on-surface-variant)] mb-1.5">
              <span>Limite utilizado</span>
              <span>{Math.round(((card.limit - card.available) / card.limit) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--pm-surface-container-high)]">
              <div
                className="h-full rounded-full pm-progress-fill"
                style={{ width: `${((card.limit - card.available) / card.limit) * 100}%` }}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Ações rápidas ── */}
      <div className="px-5 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-3 rounded-2xl pm-glass border border-[var(--pm-outline-variant)]/60 text-xs font-bold text-[var(--pm-on-surface)]">
          <Plus size={14} className="text-[var(--pm-primary-container)]" />
          Adicionar Cartão
        </button>
        <button className="flex items-center justify-center gap-2 py-3 rounded-2xl pm-btn-primary text-xs font-bold">
          <Plus size={14} />
          Nova Compra
        </button>
      </div>

      {/* ── Compras Recentes ── */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--pm-on-surface)]">Compras Recentes</h3>
          <button className="text-[10px] text-[var(--pm-primary)] font-semibold flex items-center gap-0.5">
            Ver Tudo <ChevronRight size={10} />
          </button>
        </div>

        {recentPurchases.length === 0 ? (
          <GlassCard className="p-6 text-center space-y-2">
            <p className="text-2xl">💳</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)]">Nenhuma compra registrada ainda</p>
          </GlassCard>
        ) : (
          <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/40">
            {recentPurchases.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-lg flex-shrink-0">
                  {t.categories?.icon ?? '🛍️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--pm-on-surface)] truncate">
                    {t.description}
                  </p>
                  <p className="text-[10px] text-[var(--pm-on-surface-variant)]">
                    {formatDate(t.date)} · {t.categories?.name ?? 'Compra'}
                  </p>
                </div>
                <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)] flex-shrink-0">
                  -{formatBRL(t.amount)}
                </p>
              </div>
            ))}
          </GlassCard>
        )}
      </div>

    </div>
  )
}
