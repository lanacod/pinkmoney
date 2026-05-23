import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Category, CategorySpending, InsertDTO, UpdateDTO } from '@/types/database'

export function useCategories() {
  const supabase = createClient()

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return (data ?? []) as Category[]
    },
  })
}

export function useCategorySpending() {
  const supabase = createClient()

  return useQuery<CategorySpending[]>({
    queryKey: ['category-spending'],
    queryFn: async (): Promise<CategorySpending[]> => {
      const { data, error } = await supabase
        .from('category_spending')
        .select('*')
        .order('total_spent', { ascending: false })

      if (error) throw error
      return (data ?? []) as CategorySpending[]
    },
  })
}

export function useCreateCategory() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Category, Error, Omit<InsertDTO<'categories'>, 'user_id'>>({
    mutationFn: async (dto): Promise<Category> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticada')

      const { data, error } = await supabase
        .from('categories')
        .insert({ ...dto, user_id: user.id } as any)
        .select()
        .single()

      if (error) throw error
      return data as Category
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation<Category, Error, UpdateDTO<'categories'> & { id: string }>({
    mutationFn: async ({ id, ...dto }): Promise<Category> => {
      // cast necessário: TS 5.9 rejeita `any` em parâmetros `never` de views
      const { data, error } = await (supabase as any)
        .from('categories')
        .update(dto)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Category
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
