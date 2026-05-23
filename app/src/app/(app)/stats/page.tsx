'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useProfile } from '@/lib/hooks/useProfile'
import { useMonthlyTotals } from '@/lib/hooks/useTransactions'
import { useCategorySpending } from '@/lib/hooks/useCategories'
import { formatBRL } from '@/lib/utils/format'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
const PINK_SHADES = ['#FF4FA3', '#ff80bc', '#ffb0cc', '#e03590']

// Score visual circular
function ScoreGauge({ score }: { score: number }) {
  const pct  = score / 850
  const r    = 44
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--pm-surface-container-high)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b7046c" />
            <stop offset="100%" stopColor="#FF4FA3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="pm-numeric text-2xl font-bold text-[var(--pm-on-surface)]">{score}</p>
        <p className="text-[10px] text-[var(--pm-on-surface-variant)]">Fabuloso</p>
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [period, setPeriod] = useState<'6m' | '1y'>('6m')

  const { data: profile }       = useProfile()
  const { data: monthly }       = useMonthlyTotals()
  const { data: spending = [] } = useCategorySpending()

  const score = profile?.financial_score ?? 750

  // Dados do gráfico de área (mock histórico)
  const areaData = MONTHS.map((m, i) => ({
    month: m,
    income:  (monthly?.total_income  ?? 5000) * (0.8 + Math.random() * 0.4),
    expense: (monthly?.total_expenses ?? 3000) * (0.7 + Math.random() * 0.6),
  }))

  const donutData = spending.slice(0, 4).map(s => ({
    name: s.category_name,
    value: Number(s.total_spent),
  }))
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">

      <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">Estatísticas</h1>
      <p className="text-xs text-[var(--pm-on-surface-variant)] -mt-3">Sua vida financeira com muito mais brilho ✨</p>

      {/* Score Financeiro */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} className="text-[var(--pm-primary-container)]" />
          <p className="text-xs font-bold tracking-widest text-[var(--pm-on-surface-variant)] uppercase">Score Financeiro</p>
        </div>
        <ScoreGauge score={score} />
        <p className="text-center text-xs text-[var(--pm-on-surface-variant)] mt-3">
          {score >= 800
            ? 'Você está economizando como uma rainha! 👑'
            : score >= 700
            ? 'Ótimo desempenho, continue brilhando! ⭐'
            : 'Vamos melhorar juntas! Registre mais transações 🌸'}
        </p>
      </GlassCard>

      {/* Totais do mês */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <p className="text-[10px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Entradas (Mês)</p>
          </div>
          <p className="pm-numeric text-lg font-bold text-emerald-400">{formatBRL(monthly?.total_income ?? 0)}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={14} className="text-[var(--pm-primary-container)]" />
            <p className="text-[10px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Saídas (Mês)</p>
          </div>
          <p className="pm-numeric text-lg font-bold text-[var(--pm-primary-container)]">{formatBRL(monthly?.total_expenses ?? 0)}</p>
        </GlassCard>
      </div>

      {/* Atividade mensal — gráfico de área */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Atividade Mensal</p>
          <div className="flex gap-1">
            {(['6m', '1y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  period === p
                    ? 'bg-[var(--pm-primary-container)] text-white'
                    : 'text-[var(--pm-on-surface-variant)]'
                }`}
              >
                {p === '6m' ? '6 MESES' : '1 ANO'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF4FA3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4FA3" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--pm-on-surface-variant)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--pm-surface-container)', border: 'none', borderRadius: 12, fontSize: 11 }}
                formatter={(v, name) => [formatBRL(Number(v ?? 0)), name === 'income' ? 'Entrada' : 'Saída']}
              />
              <Area type="monotone" dataKey="income"  stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)"  />
              <Area type="monotone" dataKey="expense" stroke="#FF4FA3" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Gráfico de Pizza */}
      {donutData.length > 0 && (
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)] mb-4">✨ Gráfico de Pizza</p>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={36} outerRadius={56} dataKey="value" strokeWidth={0}>
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={PINK_SHADES[i % PINK_SHADES.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="pm-numeric text-xs font-bold text-[var(--pm-on-surface)]">
                  {formatBRL(donutTotal)}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {donutData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: PINK_SHADES[i] }} />
                    <span className="text-xs text-[var(--pm-on-surface-variant)]">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--pm-on-surface)]">
                    {donutTotal > 0 ? Math.round((d.value / donutTotal) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Tendências */}
      {spending.length > 0 && (
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-[var(--pm-on-surface)] mb-4">Tendência de Gastos</p>
          <div className="space-y-3">
            {spending.slice(0, 4).map((s, i) => (
              <div key={s.category_id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-sm">
                    {s.icon ?? '📌'}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--pm-on-surface)]">{s.category_name}</p>
                    <p className="text-[10px] text-[var(--pm-on-surface-variant)]">{formatBRL(s.total_spent)}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${i % 2 === 0 ? 'text-[var(--pm-primary-container)]' : 'text-emerald-400'}`}>
                  {i % 2 === 0 ? '+' : '-'}{(Math.random() * 15).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

    </div>
  )
}
