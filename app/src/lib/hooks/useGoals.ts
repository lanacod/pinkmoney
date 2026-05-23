import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Goal, InsertDTO, UpdateDTO } from '@/types/database'

export function useGoals() {
  const supabase = createClient()

  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async (): Promise<Goal[]> => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []) as Goal[]
    },
  })
}

export function useCreateGoal() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Goal, Error, Omit<InsertDTO<'goals'>, 'user_id'>>({
    mutationFn: async (dto): Promise<Goal> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticada')

      const { data, error } = await supabase
        .from('goals')
        .insert({ ...dto, user_id: user.id } as any)
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useUpdateGoal() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Goal, Error, UpdateDTO<'goals'> & { id: string }>({
    mutationFn: async ({ id, ...dto }): Promise<Goal> => {
      const { data, error } = await (supabase as any)
        .from('goals')
        .update(dto)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}
