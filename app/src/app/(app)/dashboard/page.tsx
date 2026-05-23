'use client'

export const dynamic = 'force-dynamic'

import { Bell, Sparkles, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { GlassCard } from '@/components/pm/GlassCard'
import { PmProgress } from '@/components/pm/PmProgress'
import { useProfile } from '@/lib/hooks/useProfile'
import { useRecentTransactions, useMonthlyTotals } from '@/lib/hooks/useTransactions'
import { useCategorySpending } from '@/lib/hooks/useCategories'
import { useGoals } from '@/lib/hooks/useGoals'
import { formatBRL, formatDate } from '@/lib/utils/format'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from 'recharts'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const PINK_SHADES = ['#FF4FA3', '#ff80bc', '#ffb0cc', '#e03590', '#b7046c']

export default function DashboardPage() {
  const { data: profile }       = useProfile()
  const { data: monthly }       = useMonthlyTotals()
  const { data: recent = [] }   = useRecentTransactions(5)
  const { data: spending = [] } = useCategorySpending()
  const { data: goals = [] }    = useGoals()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Star'
  const score     = profile?.financial_score ?? 750

  const weeklyData = DAYS.map((day, i) => ({
    day,
    value: i === new Date().getDay() ? (monthly?.total_expenses ?? 0) * 0.15 : Math.random() * 300 + 30,
  }))

  const donutData = spending.slice(0, 4).map(s => ({
    name: s.category_name,
    value: Number(s.total_spent),
  }))

  const topGoal = goals[0]

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full pm-glass-bright flex items-center justify-center text-lg">🌸</div>
          <div>
            <p className="text-xs text-[var(--pm-on-surface-variant)] font-medium tracking-wide uppercase">Bem-vinda de volta</p>
            <h1 className="text-xl font-bold text-[var(--pm-on-surface)]">Olá, {firstName}! ✨</h1>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full pm-glass flex items-center justify-center">
          <Bell size={18} className="text-[var(--pm-on-surface-variant)]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--pm-primary-container)]" />
        </button>
      </div>

      {/* Saldo */}
      <GlassCard glow className="p-5">
        <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-1">Saldo Atual</p>
        <p className="pm-numeric text-4xl font-bold text-[var(--pm-on-surface)] mb-4">
          {formatBRL(monthly?.balance ?? 0)}
        </p>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <div>
              <p className="text-[10px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Entrada</p>
              <p className="pm-numeric text-sm font-bold text-emerald-400">{formatBRL(monthly?.total_income ?? 0)}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <TrendingDown size={14} className="text-[var(--pm-primary-container)]" />
            <div>
              <p className="text-[10px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Saída</p>
              <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)]">{formatBRL(monthly?.total_expenses ?? 0)}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Gráfico Semanal */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Gasto Semanal</h2>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barSize={18}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--pm-on-surface-variant)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--pm-surface-container)', border: 'none', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [formatBRL(Number(v ?? 0)), 'Gasto']}
                cursor={false}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <Cell key={i} fill={i === new Date().getDay() ? '#FF4FA3' : 'rgba(255,79,163,0.25)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Categorias */}
      {donutData.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold text-[var(--pm-on-surface)] mb-3">Categorias</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={PINK_SHADES[i % PINK_SHADES.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {spending.slice(0, 4).map((s, i) => (
                <div key={s.category_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: PINK_SHADES[i] }} />
                    <span className="text-xs text-[var(--pm-on-surface-variant)]">{s.category_name}</span>
                  </div>
                  <span className="pm-numeric text-xs font-semibold text-[var(--pm-on-surface)]">{formatBRL(s.total_spent)}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Meta em destaque */}
      {topGoal && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Meta em destaque</h2>
            <Link href="/vault" className="flex items-center gap-1 text-[10px] text-[var(--pm-primary)] font-semibold">
              Ver todas <ArrowRight size={10} />
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{topGoal.emoji ?? '⭐'}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--pm-on-surface)]">{topGoal.name}</p>
              <p className="text-xs text-[var(--pm-on-surface-variant)]">
                {formatBRL(topGoal.current_amount)} de {formatBRL(topGoal.target_amount)}
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--pm-primary-container)]/20 text-[var(--pm-primary-container)]">
              {Math.round((topGoal.current_amount / topGoal.target_amount) * 100)}%
            </span>
          </div>
          <PmProgress value={(topGoal.current_amount / topGoal.target_amount) * 100} size="md" />
        </GlassCard>
      )}

      {/* Recentes */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Recentes</h2>
          <Link href="/historico" className="flex items-center gap-1 text-[10px] text-[var(--pm-primary)] font-semibold">
            Ver tudo <ArrowRight size={10} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-2xl">✨</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)]">Nenhuma transação ainda</p>
            <Link href="/nova-transacao" className="inline-block text-xs text-[var(--pm-primary)] font-semibold">
              Adicionar primeira →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(t => (
              <TransactionRow key={t.id} t={t} />
            ))}
          </div>
        )}
      </GlassCard>

      {/* Insight da Estrela */}
      <GlassCard bright className="p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-[var(--pm-primary-container)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[var(--pm-primary)] mb-1">✨ Insight da Estrela</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)] leading-relaxed">
              {score >= 800
                ? 'Seu score financeiro está excelente! Continue assim para conquistar o badge Mestre do Brilho 💎'
                : score >= 700
                ? 'Você está indo bem! Reduza gastos em uma categoria para aumentar seu score ⭐'
                : 'Registre suas transações diariamente para entender seus padrões e melhorar seu score 🌸'}
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  )
}

function TransactionRow({ t }: { t: any }) {
  const isIncome = t.type === 'income'
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-base flex-shrink-0">
        {t.categories?.icon ?? (isIncome ? '💰' : '💸')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--pm-on-surface)] truncate">{t.description}</p>
        <p className="text-[10px] text-[var(--pm-on-surface-variant)]">
          {formatDate(t.date)} · {t.categories?.name ?? 'Sem categoria'}
        </p>
      </div>
      <p className={`pm-numeric text-sm font-bold flex-shrink-0 ${isIncome ? 'text-emerald-400' : 'text-[var(--pm-primary-container)]'}`}>
        {isIncome ? '+' : '-'}{formatBRL(t.amount)}
      </p>
    </div>
  )
}
