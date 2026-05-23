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
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  amount:         z.string().min(1),
  description:    z.string().min(1, 'Descrição obrigatória'),
  category_id:    z.string().optional(),
  date:           z.string().min(1),
  payment_method: z.enum(['card', 'pix', 'cash']),
  notes:          z.string().optional(),
})
type FormData = z.infer<typeof schema>

const PAYMENT_OPTS = [
  { value: 'card' as const, label: 'Card', icon: CreditCard },
  { value: 'pix'  as const, label: 'Pix',  icon: Smartphone },
  { value: 'cash' as const, label: 'Cash', icon: Wallet     },
]

export default function NovaTransacaoPage() {
  const router = useRouter()
  const [type, setType]           = useState<'expense' | 'income'>('expense')
  const [rawAmount, setRawAmount] = useState('')

  const { data: categories = [] }  = useCategories()
  const { mutateAsync, isPending } = useCreateTransaction()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date:           new Date().toISOString().split('T')[0],
      payment_method: 'pix',
    },
  })

  const selectedCategory = watch('category_id')
  const selectedPayment  = watch('payment_method')

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

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await mutateAsync({
      user_id:        user.id,
      type,
      amount:         parseFloat(data.amount),
      description:    data.description,
      category_id:    data.category_id || null,
      date:           data.date,
      payment_method: data.payment_method,
      notes:          data.notes || null,
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh pm-bg-gradient px-5 pt-6 pb-8 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full pm-glass flex items-center justify-center">
          <ArrowLeft size={18} className="text-[var(--pm-on-surface)]" />
        </button>
        <h1 className="text-base font-bold text-[var(--pm-on-surface)]">Nova Transação</h1>
        <div className="w-10 h-10 rounded-full pm-glass flex items-center justify-center">
          <Sparkles size={16} className="text-[var(--pm-primary-container)]" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Toggle Gasto / Ganho */}
        <div className="flex p-1 rounded-full bg-[var(--pm-surface-container-high)]">
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
                type === t ? 'pm-btn-primary' : 'text-[var(--pm-on-surface-variant)]'
              }`}
            >
              {t === 'expense' ? 'Gasto' : 'Ganho'}
            </button>
          ))}
        </div>

        {/* Valor */}
        <GlassCard className="p-6 text-center">
          <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-2">Quantia</p>
          <input
            type="tel"
            inputMode="numeric"
            value={displayAmount()}
            onChange={handleAmountChange}
            className="w-full bg-transparent text-center pm-numeric text-4xl font-bold text-[var(--pm-on-surface)] outline-none"
          />
          <input type="hidden" {...register('amount')} />
        </GlassCard>

        {/* Descrição */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-2">Descrição</p>
          <input
            {...register('description')}
            type="text"
            placeholder="Ex: Sephora, Mercado, iFood..."
            className="w-full bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none"
          />
          {errors.description && (
            <p className="text-xs text-[var(--pm-error)] mt-1">{errors.description.message}</p>
          )}
        </GlassCard>

        {/* Categoria */}
        {categories.length > 0 && (
          <GlassCard className="p-4">
            <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-3">Categoria</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue('category_id', cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--pm-primary-container)] text-white'
                      : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                  }`}
                >
                  <span>{cat.icon ?? '📌'}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Data */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-2">Data</p>
          <input
            {...register('date')}
            type="date"
            className="w-full bg-transparent text-sm text-[var(--pm-on-surface)] outline-none"
            style={{ colorScheme: 'dark' }}
          />
        </GlassCard>

        {/* Método de Pagamento */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-3">Método de Pagamento</p>
          <div className="flex gap-2">
            {PAYMENT_OPTS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('payment_method', value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedPayment === value
                    ? 'bg-[var(--pm-primary-container)] text-white'
                    : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Notas */}
        <GlassCard className="p-4">
          <p className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase mb-2">Notas</p>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Observações opcionais..."
            className="w-full bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none resize-none"
          />
        </GlassCard>

        <button
          type="submit"
          disabled={isPending || !rawAmount}
          className="w-full py-4 rounded-full pm-btn-primary font-bold text-base disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar Transação'}
        </button>

      </form>
    </div>
  )
}
