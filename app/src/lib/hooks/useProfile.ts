import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UpdateDTO } from '@/types/database'

// Recalcula o score financeiro via RPC e persiste no perfil
export function useRefreshScore() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<number, Error, void>({
    mutationFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticada')

      const { data, error } = await (supabase as any)
        .rpc('calculate_financial_score', { p_user_id: user.id })

      if (error) throw error
      return data as number
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export function useProfile() {
  const supabase = createClient()

  return useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile | null> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data as Profile
    },
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Profile, Error, UpdateDTO<'profiles'>>({
    mutationFn: async (dto): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticada')

      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(dto)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Profile
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}
