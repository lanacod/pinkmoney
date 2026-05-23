'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, DollarSign, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/pm/GlassCard'
import { StarsBg } from '@/components/pm/StarsBg'

const cadastroSchema = z.object({
  full_name:        z.string().min(2, 'Nome muito curto'),
  email:            z.string().email('E-mail inválido'),
  password:         z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword:  z.string(),
  monthly_income:   z.string().min(1, 'Informe sua renda'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

type CadastroForm = z.infer<typeof cadastroSchema>

export default function CadastroPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd]     = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
  })

  async function onSubmit(data: CadastroForm) {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options: {
        data: {
          full_name:      data.full_name,
          monthly_income: parseFloat(data.monthly_income.replace(/\./g, '').replace(',', '.')),
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/bem-vinda')
  }

  return (
    <div className="relative min-h-dvh pm-bg-gradient flex flex-col items-center justify-center px-6 py-12">
      <StarsBg />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-white/10 pm-glass-bright flex items-center justify-center pm-glow-primary">
            <Sparkles size={36} className="text-[var(--pm-primary-container)]" />
          </div>
          <p className="text-lg font-bold text-[var(--pm-on-surface)]">PinkMoney</p>
        </div>

        <GlassCard className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">Crie sua conta</h1>
            <p className="text-sm text-[var(--pm-on-surface-variant)]">Junte-se ao brilho financeiro.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Nome */}
            <InputField icon={<User size={15} />} placeholder="Nome completo" error={errors.full_name?.message}>
              <input {...register('full_name')} type="text" placeholder="Nome completo" autoComplete="name" className="input-pm" />
            </InputField>

            {/* Email */}
            <InputField icon={<Mail size={15} />} placeholder="seu@email.com" error={errors.email?.message}>
              <input {...register('email')} type="email" placeholder="seu@email.com" autoComplete="email" className="input-pm" />
            </InputField>

            {/* Senha */}
            <InputField
              icon={<Lock size={15} />}
              error={errors.password?.message}
              action={
                <button type="button" onClick={() => setShowPwd(v => !v)} className="text-[var(--pm-outline)] hover:text-[var(--pm-primary)]">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            >
              <input {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="Senha" autoComplete="new-password" className="input-pm" />
            </InputField>

            {/* Confirmar Senha */}
            <InputField
              icon={<Lock size={15} />}
              error={errors.confirmPassword?.message}
              action={
                <button type="button" onClick={() => setShowConf(v => !v)} className="text-[var(--pm-outline)] hover:text-[var(--pm-primary)]">
                  {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            >
              <input {...register('confirmPassword')} type={showConf ? 'text' : 'password'} placeholder="Confirme sua senha" autoComplete="new-password" className="input-pm" />
            </InputField>

            {/* Renda mensal */}
            <InputField icon={<DollarSign size={15} />} error={errors.monthly_income?.message}>
              <input {...register('monthly_income')} type="text" inputMode="decimal" placeholder="Renda mensal" className="input-pm" />
            </InputField>

            {error && (
              <p className="text-sm text-[var(--pm-error)] text-center bg-[var(--pm-error-container)]/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full pm-btn-primary font-bold text-base disabled:opacity-60"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-sm text-[var(--pm-on-surface-variant)]">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[var(--pm-primary)] font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>

      {/* Inline style para input-pm (evita conflito de classe dinâmica) */}
      <style>{`
        .input-pm {
          width: 100%;
          background: transparent;
          color: var(--pm-on-surface);
          font-size: 0.875rem;
          outline: none;
        }
        .input-pm::placeholder { color: var(--pm-outline); }
      `}</style>
    </div>
  )
}

function InputField({ icon, children, error, action }: {
  icon: React.ReactNode
  children: React.ReactNode
  error?: string
  placeholder?: string
  action?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2.5 pl-3.5 pr-3 py-3 rounded-xl bg-[var(--pm-surface-container-high)] border border-[var(--pm-outline-variant)] focus-within:border-[var(--pm-primary-container)] focus-within:ring-2 focus-within:ring-[var(--pm-primary-container)]/30 transition-all">
        <span className="text-[var(--pm-outline)] flex-shrink-0">{icon}</span>
        <div className="flex-1">{children}</div>
        {action && <span className="flex-shrink-0">{action}</span>}
      </div>
      {error && <p className="text-xs text-[var(--pm-error)] pl-1">{error}</p>}
    </div>
  )
}
