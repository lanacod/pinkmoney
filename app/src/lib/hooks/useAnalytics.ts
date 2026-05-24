import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Transaction, MonthlySummary } from '@/types/database'

// ── Gastos da semana atual agrupados por dia (Dom–Sáb) ────────────────────────
export type DailySpending = {
  day: string       // 'Dom' | 'Seg' | ... | 'Sáb'
  dayIndex: number  // 0=Dom … 6=Sáb
  expense: number
  income: number
}

export function useWeeklySpending() {
  const supabase = createClient()

  return useQuery<DailySpending[]>({
    queryKey: ['weekly-spending'],
    queryFn: async (): Promise<DailySpending[]> => {
      // Intervalo da semana atual (domingo a sábado)
      const today = new Date()
      const dayOfWeek = today.getDay() // 0=Dom
      const sunday = new Date(today)
      sunday.setDate(today.getDate() - dayOfWeek)
      sunday.setHours(0, 0, 0, 0)

      const saturday = new Date(sunday)
      saturday.setDate(sunday.getDate() + 6)
      saturday.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .gte('date', sunday.toISOString().split('T')[0])
        .lte('date', saturday.toISOString().split('T')[0])

      if (error) throw error

      const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      const buckets: DailySpending[] = DAYS.map((day, i) => ({
        day,
        dayIndex: i,
        expense: 0,
        income: 0,
      }))

      for (const t of (data ?? []) as Pick<Transaction, 'amount' | 'type' | 'date'>[]) {
        // date é string 'YYYY-MM-DD' — interpreta como UTC+0 noon para evitar off-by-one
        const d = new Date(t.date + 'T12:00:00Z')
        const idx = d.getUTCDay()
        if (t.type === 'expense') buckets[idx].expense += Number(t.amount)
        else                       buckets[idx].income  += Number(t.amount)
      }

      return buckets
    },
  })
}

// ── Histórico mensal (últimos N meses) para o gráfico de área ─────────────────
export type MonthlyPoint = {
  month: string   // 'Jan', 'Fev', ...
  label: string   // 'Jan/25'
  income: number
  expense: number
  balance: number
}

export function useMonthlyHistory(months = 6) {
  const supabase = createClient()

  return useQuery<MonthlyPoint[]>({
    queryKey: ['monthly-history', months],
    queryFn: async (): Promise<MonthlyPoint[]> => {
      const PT_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                         'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

      // Gera lista dos últimos N meses no formato 'YYYY-MM'
      const now = new Date()
      const monthKeys: string[] = []
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        monthKeys.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        )
      }

      const { data, error } = await supabase
        .from('monthly_summary')
        .select('month, total_income, total_expenses, balance')
        .in('month', monthKeys)

      if (error) throw error

      type SummaryRow = Pick<MonthlySummary, 'month' | 'total_income' | 'total_expenses' | 'balance'>
      const rows = (data ?? []) as unknown as SummaryRow[]
      const byMonth = new Map(rows.map(r => [r.month, r]))

      return monthKeys.map(key => {
        const [year, mon] = key.split('-')
        const idx = parseInt(mon, 10) - 1
        const row = byMonth.get(key)
        return {
          month:   PT_MONTHS[idx],
          label:   `${PT_MONTHS[idx]}/${year.slice(2)}`,
          income:  row ? Number(row.total_income)   : 0,
          expense: row ? Number(row.total_expenses)  : 0,
          balance: row ? Number(row.balance)         : 0,
        }
      })
    },
  })
}
