'use client'

export const dynamic = 'force-dynamic'

import { Bell, ArrowRight, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
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
    value: i === new Date().getDay()
      ? (monthly?.total_expenses ?? 0) * 0.15
      : Math.random() * 300 + 30,
  }))

  const donutData = spending.slice(0, 4).map(s => ({
    name: s.category_name,
    value: Number(s.total_spent),
  }))

  const topGoal = goals[0]

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

      {/* ── Greeting ── */}
      <div className="px-5">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--pm-on-surface-variant)] uppercase">
          Bem-vinda de volta
        </p>
        <h1 className="text-2xl font-extrabold text-[var(--pm-on-surface)] mt-0.5">
          Olá, {firstName}! ✨
        </h1>
      </div>

      {/* ── Saldo Atual ── */}
      <div className="px-5">
        <GlassCard glow className="p-5">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-1">
            Saldo Atual
          </p>
          <p className="pm-numeric text-4xl font-bold text-[var(--pm-on-surface)] mb-4 leading-none">
            {formatBRL(monthly?.balance ?? 0)}
          </p>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <TrendingUp size={13} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Entradas</p>
                <p className="pm-numeric text-sm font-bold text-emerald-400">
                  {formatBRL(monthly?.total_income ?? 0)}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <TrendingDown size={13} className="text-[var(--pm-primary-container)] flex-shrink-0" />
              <div>
                <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Saídas</p>
                <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)]">
                  {formatBRL(monthly?.total_expenses ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Gasto Semanal ── */}
      <div className="px-5">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Gasto Semanal</h2>
            <span className="text-[10px] text-emerald-400 font-semibold">+2% vs last week</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={16} barCategoryGap="30%">
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: 'var(--pm-on-surface-variant)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--pm-surface-container)',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v) => [formatBRL(Number(v ?? 0)), 'Gasto']}
                  cursor={false}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === new Date().getDay() ? '#FF4FA3' : 'rgba(255,79,163,0.22)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* ── Categorias ── */}
      {donutData.length > 0 && (
        <div className="px-5">
          <GlassCard className="p-5">
            <h2 className="text-sm font-semibold text-[var(--pm-on-surface)] mb-3">Categorias</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-[88px] h-[88px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={26}
                      outerRadius={40}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={PINK_SHADES[i % PINK_SHADES.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[var(--pm-on-surface)] text-center leading-tight">
                    65%<br/>
                    <span className="text-[var(--pm-on-surface-variant)]">estilo</span>
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {spending.slice(0, 4).map((s, i) => (
                  <div key={s.category_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: PINK_SHADES[i] }}
                      />
                      <span className="text-xs text-[var(--pm-on-surface-variant)]">
                        {s.category_name}
                      </span>
                    </div>
                    <span className="pm-numeric text-xs font-semibold text-[var(--pm-on-surface)]">
                      {formatBRL(s.total_spent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Meta em destaque ── */}
      {topGoal && (
        <div className="px-5">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Metas</h2>
              <span className="text-lg">⭐</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-lg flex-shrink-0">
                {topGoal.emoji ?? '✈️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--pm-on-surface)] truncate">{topGoal.name}</p>
                <p className="text-xs text-[var(--pm-on-surface-variant)]">
                  {formatBRL(topGoal.current_amount)} de {formatBRL(topGoal.target_amount)}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--pm-primary-container)]/20 text-[var(--pm-primary-container)] flex-shrink-0">
                {Math.round((topGoal.current_amount / topGoal.target_amount) * 100)}%
              </span>
            </div>
            <PmProgress value={(topGoal.current_amount / topGoal.target_amount) * 100} size="md" />
            <Link
              href="/vault"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[var(--pm-outline-variant)] text-xs font-bold text-[var(--pm-primary)]"
            >
              Gerenciar Metas <ArrowRight size={12} />
            </Link>
          </GlassCard>
        </div>
      )}

      {/* ── Recentes ── */}
      <div className="px-5">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--pm-on-surface)]">Recentes</h2>
            <Link
              href="/historico"
              className="flex items-center gap-1 text-[10px] text-[var(--pm-primary)] font-semibold"
            >
              Ver tudo <ArrowRight size={10} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <p className="text-2xl">✨</p>
              <p className="text-xs text-[var(--pm-on-surface-variant)]">Nenhuma transação ainda</p>
              <Link
                href="/nova-transacao"
                className="inline-block text-xs text-[var(--pm-primary)] font-semibold"
              >
                Adicionar primeira →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(t => <TransactionRow key={t.id} t={t} />)}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── Insight da Estrela ── */}
      <div className="px-5">
        <GlassCard bright className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles size={17} className="text-[var(--pm-primary-container)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--pm-primary)] mb-1">✨ Insights da Estrela</p>
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
      <p className={`pm-numeric text-sm font-bold flex-shrink-0 ${
        isIncome ? 'text-emerald-400' : 'text-[var(--pm-primary-container)]'
      }`}>
        {isIncome ? '+' : '-'}{formatBRL(t.amount)}
      </p>
    </div>
  )
}
