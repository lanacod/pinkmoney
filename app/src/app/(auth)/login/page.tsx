'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/pm/GlassCard'
import { StarsBg } from '@/components/pm/StarsBg'

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    })

    if (error) {
      setError('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="relative min-h-dvh pm-bg-gradient flex flex-col items-center justify-center px-6 py-12">
      <StarsBg />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl pm-glass-bright flex items-center justify-center pm-glow-primary">
            <Sparkles size={32} className="text-[var(--pm-primary-container)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--pm-on-surface)] tracking-tight">
            PinkMoney
          </h1>
        </div>

        {/* Card de login */}
        <GlassCard className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[var(--pm-on-surface)]">
              Bem-vinda de volta, Star!
            </h2>
            <p className="text-sm text-[var(--pm-on-surface-variant)]">
              Entre na sua conta para gerenciar seu brilho financeiro.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* E-mail */}
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-outline)]" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] border border-[var(--pm-outline-variant)] focus:border-[var(--pm-primary-container)] focus:outline-none focus:ring-2 focus:ring-[var(--pm-primary-container)]/30 transition-all text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[var(--pm-error)]">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-[var(--pm-on-surface-variant)] uppercase">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-outline)]" />
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] border border-[var(--pm-outline-variant)] focus:border-[var(--pm-primary-container)] focus:outline-none focus:ring-2 focus:ring-[var(--pm-primary-container)]/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-outline)] hover:text-[var(--pm-primary)]"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--pm-error)]">{errors.password.message}</p>
              )}
            </div>

            {/* Lembrar / Esqueci */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--pm-on-surface-variant)] cursor-pointer">
                <input type="checkbox" className="rounded accent-[var(--pm-primary-container)]" />
                Lembrar de mim
              </label>
              <Link href="/esqueci-senha" className="text-[var(--pm-primary)] hover:underline text-xs">
                Esqueci minha senha
              </Link>
            </div>

            {/* Erro */}
            {error && (
              <p className="text-sm text-[var(--pm-error)] text-center bg-[var(--pm-error-container)]/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full pm-btn-primary font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>
        </GlassCard>

        {/* Link de cadastro */}
        <p className="text-center text-sm text-[var(--pm-on-surface-variant)]">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-[var(--pm-primary)] font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
