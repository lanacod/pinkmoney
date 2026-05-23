// ─── PinkMoney — Supabase Database Types ─────────────────────────────────────
// Auto-synced with supabase/migrations/001_initial_schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          monthly_income: number
          financial_score: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          monthly_income?: number
          financial_score?: number
          created_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          monthly_income?: number
          financial_score?: number
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color: string | null
          monthly_limit: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color?: string | null
          monthly_limit?: number | null
          created_at?: string
        }
        Update: {
          name?: string
          icon?: string | null
          color?: string | null
          monthly_limit?: number | null
        }
      }
      cards: {
        Row: {
          id: string
          user_id: string
          name: string
          last_four: string | null
          available_limit: number
          current_balance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          last_four?: string | null
          available_limit?: number
          current_balance?: number
          created_at?: string
        }
        Update: {
          name?: string
          last_four?: string | null
          available_limit?: number
          current_balance?: number
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          card_id: string | null
          type: 'income' | 'expense'
          amount: number
          description: string
          date: string
          payment_method: 'card' | 'pix' | 'cash'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          card_id?: string | null
          type: 'income' | 'expense'
          amount: number
          description: string
          date: string
          payment_method?: 'card' | 'pix' | 'cash'
          notes?: string | null
          created_at?: string
        }
        Update: {
          category_id?: string | null
          card_id?: string | null
          type?: 'income' | 'expense'
          amount?: number
          description?: string
          date?: string
          payment_method?: 'card' | 'pix' | 'cash'
          notes?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          emoji: string | null
          target_amount: number
          current_amount: number
          monthly_contribution: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          emoji?: string | null
          target_amount: number
          current_amount?: number
          monthly_contribution?: number
          created_at?: string
        }
        Update: {
          name?: string
          emoji?: string | null
          target_amount?: number
          current_amount?: number
          monthly_contribution?: number
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          condition: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          condition?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string | null
          condition?: string | null
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: never
      }
      // Views expostas como tabelas readonly (o .from() do Supabase busca em Tables)
      monthly_summary: {
        Row: {
          user_id: string
          month: string
          total_income: number
          total_expenses: number
          balance: number
        }
        Insert: never
        Update: never
      }
      category_spending: {
        Row: {
          user_id: string
          category_id: string
          category_name: string
          icon: string | null
          color: string | null
          total_spent: number
          monthly_limit: number | null
          percentage: number
        }
        Insert: never
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_financial_score: {
        Args: { p_user_id: string }
        Returns: number
      }
    }
  }
}

// ─── Helper types ───────────────────────────────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertDTO<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateDTO<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Convenient aliases
export type Profile     = Tables<'profiles'>
export type Category    = Tables<'categories'>
export type Card        = Tables<'cards'>
export type Transaction = Tables<'transactions'>
export type Goal        = Tables<'goals'>
export type Badge       = Tables<'badges'>
export type UserBadge   = Tables<'user_badges'>

export type TransactionWithCategory = Transaction & {
  categories: Pick<Category, 'id' | 'name' | 'icon' | 'color'> | null
}

export type MonthlySummary   = Tables<'monthly_summary'>
export type CategorySpending = Tables<'category_spending'>
