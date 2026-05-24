'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GOAL_OPTIONS = [
  { id: 'viagem',     icon: '✈️', label: 'Viagem',      desc: 'Realiza o sonho de viajar'       },
  { id: 'mimos',      icon: '💄', label: 'Mimos',       desc: 'Produtos de beleza e cuidados'   },
  { id: 'emergencia', icon: '🛡️', label: 'Emergência',  desc: 'Reserva de segurança'            },
  { id: 'tecnologia', icon: '💻', label: 'Tecnologia',  desc: 'Gadgets e equipamentos'          },
  { id: 'casa',       icon: '🏠', label: 'Minha Casa',  desc: 'Realização do lar dos sonhos'    },
  { id: 'educacao',   icon: '📚', label: 'Educação',    desc: 'Cursos e crescimento pessoal'    },
]

export default function ObjetivosOnboardingPage() {
  const router = useRouter()
  const [step, setStep]         = useState<'viagem' | 'mimos'>('viagem')
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function handleNext() {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh pm-bg-gradient flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="text-sm font-bold text-[var(--pm-on-surface)] tracking-tight">PinkMoney</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--pm-primary-container)]/20 flex items-center justify-center">
          <span className="text-[var(--pm-primary-container)] text-xs font-bold">3/3</span>
        </div>
      </div>

      {/* Ilustração — Porquinho */}
      <div className="flex items-center justify-center px-6 py-4">
        <div className="relative w-[260px] h-[180px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3d1029] via-[#2B0A1B] to-[#1A000D] opacity-60" />

          {/* Estrelas */}
          <span className="absolute top-3 left-6 text-[var(--pm-primary)] text-sm animate-pulse">✦</span>
          <span className="absolute top-2 right-8 text-[var(--pm-tertiary)] text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
          <span className="absolute bottom-4 left-10 text-[var(--pm-primary-container)] text-xs animate-pulse" style={{ animationDelay: '1s' }}>✦</span>

          {/* Moedas em volta */}
          <span className="absolute top-6 right-12 text-2xl">🪙</span>
          <span className="absolute bottom-6 left-8 text-xl">🪙</span>
          <span className="absolute bottom-4 right-6 text-2xl">🪙</span>

          {/* Porquinho SVG */}
          <div
            className="relative z-10 w-28 h-28 flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 24px rgba(255,79,163,0.5))',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <radialGradient id="pigGrad" cx="45%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffb3d1" />
                  <stop offset="50%" stopColor="#FF4FA3" />
                  <stop offset="100%" stopColor="#b7046c" />
                </radialGradient>
                <radialGradient id="snoutGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffc8de" />
                  <stop offset="100%" stopColor="#ff80bc" />
                </radialGradient>
              </defs>

              {/* Corpo */}
              <ellipse cx="100" cy="120" rx="65" ry="58" fill="url(#pigGrad)" />

              {/* Cabeça */}
              <ellipse cx="100" cy="80" rx="52" ry="48" fill="url(#pigGrad)" />

              {/* Orelhas */}
              <ellipse cx="60" cy="45" rx="18" ry="22" fill="url(#pigGrad)" />
              <ellipse cx="60" cy="45" rx="11" ry="14" fill="#ffcce4" opacity="0.7" />
              <ellipse cx="140" cy="45" rx="18" ry="22" fill="url(#pigGrad)" />
              <ellipse cx="140" cy="45" rx="11" ry="14" fill="#ffcce4" opacity="0.7" />

              {/* Olhos */}
              <ellipse cx="85" cy="75" rx="7" ry="8" fill="#3d0022" />
              <ellipse cx="115" cy="75" rx="7" ry="8" fill="#3d0022" />
              <circle cx="88" cy="72" r="2" fill="white" opacity="0.9" />
              <circle cx="118" cy="72" r="2" fill="white" opacity="0.9" />

              {/* Focinho */}
              <ellipse cx="100" cy="95" rx="20" ry="14" fill="url(#snoutGrad)" />
              <ellipse cx="93" cy="95" rx="5" ry="4" fill="#3d0022" opacity="0.5" />
              <ellipse cx="107" cy="95" rx="5" ry="4" fill="#3d0022" opacity="0.5" />

              {/* Bochechas */}
              <ellipse cx="72" cy="88" rx="10" ry="7" fill="#FF4FA3" opacity="0.4" />
              <ellipse cx="128" cy="88" rx="10" ry="7" fill="#FF4FA3" opacity="0.4" />

              {/* Fenda de moeda no topo */}
              <rect x="88" y="52" width="24" height="5" rx="2.5" fill="#3d0022" opacity="0.6" />

              {/* Pernas */}
              <ellipse cx="72" cy="168" rx="18" ry="12" fill="url(#pigGrad)" />
              <ellipse cx="128" cy="168" rx="18" ry="12" fill="url(#pigGrad)" />

              {/* Rabinho */}
              <path d="M 165 115 Q 185 100 175 85 Q 165 70 178 60" stroke="url(#pigGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Texto */}
      <div className="px-8 text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-[var(--pm-on-surface)] leading-snug">
          Defina seus objetivos<br />financeiros
        </h1>
        <p className="text-sm text-[var(--pm-on-surface-variant)] leading-relaxed">
          Dê um propósito para cada centavo e<br />
          veja seu porquinho estrela brilhar!
        </p>
      </div>

      {/* Step indicators */}
      <div className="px-6 mt-5 flex gap-2">
        {(['viagem', 'mimos'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              step === s
                ? 'bg-[var(--pm-primary-container)] text-white shadow-[0_4px_12px_rgba(255,79,163,0.4)]'
                : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
            }`}
          >
            {s === 'viagem' ? 'PASSO 02' : 'QUASE LÁ!'}
          </button>
        ))}
      </div>

      {/* Grid de objetivos */}
      <div className="px-6 mt-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {GOAL_OPTIONS.map(goal => {
            const isSelected = selected.includes(goal.id)
            return (
              <button
                key={goal.id}
                onClick={() => toggle(goal.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                  isSelected
                    ? 'bg-[var(--pm-primary-container)]/20 border border-[var(--pm-primary-container)]/50 shadow-[0_0_10px_rgba(255,79,163,0.2)]'
                    : 'bg-[var(--pm-surface-container-high)] border border-transparent'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{goal.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${
                    isSelected ? 'text-[var(--pm-primary-container)]' : 'text-[var(--pm-on-surface)]'
                  }`}>
                    {goal.label}
                  </p>
                  <p className="text-[10px] text-[var(--pm-on-surface-variant)] leading-tight mt-0.5 truncate">
                    {goal.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
        <span className="w-6 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
      </div>

      {/* Botões */}
      <div className="px-6 mt-4 mb-10 space-y-3">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full pm-btn-primary font-bold text-base"
        >
          Próximo ✦
        </button>
        <button
          onClick={() => router.back()}
          className="w-full text-center text-xs font-semibold text-[var(--pm-on-surface-variant)] py-2"
        >
          PULAR INTRODUÇÃO
        </button>
      </div>

    </div>
  )
}
