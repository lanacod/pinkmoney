import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { InsertDTO, MonthlySummary, TransactionWithCategory } from '@/types/database'

export function useTransactions(limit = 50) {
  const supabase = createClient()

  return useQuery<TransactionWithCategory[]>({
    queryKey: ['transactions', limit],
    queryFn: async (): Promise<TransactionWithCategory[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`*, categories(id, name, icon, color)`)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return (data ?? []) as TransactionWithCategory[]
    },
  })
}

export function useRecentTransactions(limit = 5) {
  const supabase = createClient()

  return useQuery<TransactionWithCategory[]>({
    queryKey: ['transactions', 'recent', limit],
    queryFn: async (): Promise<TransactionWithCategory[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`*, categories(id, name, icon, color)`)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return (data ?? []) as TransactionWithCategory[]
    },
  })
}

export function useMonthlyTotals() {
  const supabase = createClient()
  const now   = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return useQuery<Omit<MonthlySummary, 'user_id' | 'month'>>({
    queryKey: ['monthly-totals', month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*')
        .eq('month', month)
        .maybeSingle()

      if (error) throw error
      return (data as MonthlySummary | null) ?? {
        total_income: 0,
        total_expenses: 0,
        balance: 0,
      }
    },
  })
}

export function useCreateTransaction() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<any, Error, InsertDTO<'transactions'>>({
    mutationFn: async (dto) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(dto as any)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['monthly-totals'] })
      qc.invalidateQueries({ queryKey: ['category-spending'] })
    },
  })
}
