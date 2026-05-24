import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Card, InsertDTO, UpdateDTO } from '@/types/database'

export function useCards() {
  const supabase = createClient()

  return useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data ?? []) as Card[]
    },
  })
}

export function useCreateCard() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Card, Error, Omit<InsertDTO<'cards'>, 'user_id'>>({
    mutationFn: async (dto): Promise<Card> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticada')

      const { data, error } = await supabase
        .from('cards')
        .insert({ ...dto, user_id: user.id } as any)
        .select()
        .single()

      if (error) throw error
      return data as Card
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  })
}

export function useUpdateCard() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Card, Error, UpdateDTO<'cards'> & { id: string }>({
    mutationFn: async ({ id, ...dto }): Promise<Card> => {
      const { data, error } = await (supabase as any)
        .from('cards')
        .update(dto)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Card
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  })
}

export function useDeleteCard() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await (supabase as any)
        .from('cards')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  })
}
