'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Sparkles, CreditCard, Wallet, Smartphone } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useCreateTransaction } from '@/lib/hooks/useTransactions'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCards } from '@/lib/hooks/useCards'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  amount:         z.string().min(1),
  description:    z.string().min(1, 'Descrição obrigatória'),
  category_id:    z.string().optional(),
  card_id:        z.string().optional(),
  date:           z.string().min(1),
  payment_method: z.enum(['card', 'pix', 'cash']),
  notes:          z.string().optional(),
})
type FormData = z.infer<typeof schema>

const PAYMENT_OPTS = [
  { value: 'card' as const, label: 'Card',  icon: CreditCard  },
  { value: 'pix'  as const, label: 'Pix',   icon: Smartphone  },
  { value: 'cash' as const, label: 'Cash',  icon: Wallet      },
]

export default function NovaTransacaoPage() {
  const router = useRouter()
  const [type, setType]           = useState<'expense' | 'income'>('expense')
  const [rawAmount, setRawAmount] = useState('')

  const { data: categories = [] }   = useCategories()
  const { data: cards = [] }        = useCards()
  const { mutateAsync, isPending }  = useCreateTransaction()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date:           new Date().toISOString().split('T')[0],
      payment_method: 'pix',
    },
  })

  const selectedCategory = watch('category_id')
  const selectedPayment  = watch('payment_method')
  const selectedCard     = watch('card_id')
  const dateWatch        = watch('date')

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const num    = (parseInt(digits || '0', 10) / 100).toFixed(2)
    setRawAmount(digits)
    setValue('amount', num)
  }

  function displayAmount(): string {
    const val = parseInt(rawAmount || '0', 10) / 100
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  function formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00')
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long',
    }).format(d)
  }

  // Quando muda para pagamento em cartão, pré-seleciona o primeiro
  function handlePaymentChange(val: 'card' | 'pix' | 'cash') {
    setValue('payment_method', val)
    if (val !== 'card') {
      setValue('card_id', undefined)
    } else if (cards.length === 1) {
      setValue('card_id', cards[0].id)
    }
  }

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await mutateAsync({
      user_id:        user.id,
      type,
      amount:         parseFloat(data.amount),
      description:    data.description,
      category_id:    data.category_id   || null,
      card_id:        data.card_id       || null,
      date:           data.date,
      payment_method: data.payment_method,
      notes:          data.notes         || null,
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh pm-bg-gradient pb-10 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-6 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full pm-glass flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-[var(--pm-on-surface)]" />
        </button>
        <h1 className="text-base font-bold text-[var(--pm-on-surface)]">Nova Transação</h1>
        <div className="w-10 h-10 rounded-full pm-glass flex items-center justify-center">
          <Sparkles size={16} className="text-[var(--pm-primary-container)]" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-5 space-y-4">

        {/* ── Toggle Gasto / Ganho ── */}
        <div className="flex p-1 rounded-full bg-[var(--pm-surface-container-high)]">
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${
                type === t ? 'pm-btn-primary' : 'text-[var(--pm-on-surface-variant)]'
              }`}
            >
              {t === 'expense' ? 'Gasto' : 'Ganho'}
            </button>
          ))}
        </div>

        {/* ── Valor ── */}
        <GlassCard className="p-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-3">
            Quantia
          </p>
          <input
            type="tel"
            inputMode="numeric"
            value={displayAmount()}
            onChange={handleAmountChange}
            className="w-full bg-transparent text-center pm-numeric text-4xl font-bold text-[var(--pm-on-surface)] outline-none"
          />
          <input type="hidden" {...register('amount')} />
        </GlassCard>

        {/* ── Categoria ── */}
        {categories.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2 px-1">
              Categoria
            </p>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setValue('category_id', selectedCategory === cat.id ? undefined : cat.id)
                  }
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--pm-primary-container)] text-white shadow-[0_4px_12px_rgba(255,79,163,0.4)]'
                      : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                  }`}
                >
                  <span>{cat.icon ?? '📌'}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Descrição ── */}
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
            Descrição
          </p>
          <input
            {...register('description')}
            type="text"
            placeholder="Ex: Sephora, iFood, Mercado..."
            className="w-full bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none"
          />
          {errors.description && (
            <p className="text-xs text-[var(--pm-error)] mt-1">{errors.description.message}</p>
          )}
        </GlassCard>

        {/* ── Data ── */}
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
            Data
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <span className="text-sm text-[var(--pm-on-surface)] capitalize">
                {dateWatch ? formatDateLabel(dateWatch) : 'Hoje'}
              </span>
            </div>
            <div className="relative">
              <input
                {...register('date')}
                type="date"
                className="absolute opacity-0 w-24 h-8 cursor-pointer right-0"
                style={{ colorScheme: 'dark' }}
              />
              <span className="text-[var(--pm-on-surface-variant)] text-sm pointer-events-none">▾</span>
            </div>
          </div>
        </GlassCard>

        {/* ── Método de Pagamento ── */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2 px-1">
            Método de Pagamento
          </p>
          <div className="flex gap-2">
            {PAYMENT_OPTS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handlePaymentChange(value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  selectedPayment === value
                    ? 'bg-[var(--pm-primary-container)] text-white shadow-[0_4px_12px_rgba(255,79,163,0.35)]'
                    : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Selecionar Cartão (se payment_method = card e tem cartões) ── */}
        {selectedPayment === 'card' && cards.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2 px-1">
              Qual Cartão?
            </p>
            <div className="flex gap-2 flex-wrap">
              {cards.map(card => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() =>
                    setValue('card_id', selectedCard === card.id ? undefined : card.id)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCard === card.id
                      ? 'bg-[var(--pm-primary-container)] text-white'
                      : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                  }`}
                >
                  <CreditCard size={12} />
                  {card.name}
                  {card.last_four && (
                    <span className="opacity-70">···{card.last_four}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Notas ── */}
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
            Notas
          </p>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Observações opcionais..."
            className="w-full bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none resize-none"
          />
        </GlassCard>

        {/* ── Salvar ── */}
        <button
          type="submit"
          disabled={isPending || !rawAmount}
          className="w-full py-4 rounded-full pm-btn-primary font-bold text-base disabled:opacity-50 mt-2"
        >
          {isPending ? 'Salvando...' : 'Salvar Transação'}
        </button>

      </form>
    </div>
  )
}
