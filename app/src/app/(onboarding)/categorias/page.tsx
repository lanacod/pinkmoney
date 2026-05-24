'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const CATEGORY_OPTIONS = [
  { icon: '💄', label: 'Looks',      id: 'looks'      },
  { icon: '🍩', label: 'Doces',      id: 'doces'      },
  { icon: '🌟', label: 'Mimos',      id: 'mimos'      },
  { icon: '✈️', label: 'Viagens',    id: 'viagens'    },
  { icon: '🍔', label: 'Alimentação',id: 'alimentacao'},
  { icon: '🚗', label: 'Transporte', id: 'transporte' },
  { icon: '💊', label: 'Saúde',      id: 'saude'      },
  { icon: '🎮', label: 'Lazer',      id: 'lazer'      },
  { icon: '📚', label: 'Educação',   id: 'educacao'   },
  { icon: '🏠', label: 'Casa',       id: 'casa'       },
]

export default function CategoriasOnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(['looks', 'doces'])

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-dvh pm-bg-gradient flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="text-sm font-bold text-[var(--pm-on-surface)] tracking-tight">PinkMoney</span>
        </div>
        <button
          onClick={() => router.push('/objetivos')}
          className="w-8 h-8 rounded-full pm-glass flex items-center justify-center"
        >
          <X size={14} className="text-[var(--pm-on-surface-variant)]" />
        </button>
      </div>

      {/* Ilustração */}
      <div className="flex items-center justify-center px-6 py-6">
        <div className="relative w-[260px] h-[180px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3d1029] via-[#2B0A1B] to-[#1A000D] opacity-60" />

          {/* Decoração de estrelas */}
          <span className="absolute top-3 left-6 text-[var(--pm-primary)] text-sm animate-pulse">✦</span>
          <span className="absolute top-2 right-8 text-[var(--pm-tertiary)] text-xs animate-pulse" style={{ animationDelay: '0.7s' }}>✦</span>
          <span className="absolute bottom-4 right-4 text-[var(--pm-primary-container)] text-base animate-pulse" style={{ animationDelay: '0.3s' }}>✦</span>

          {/* Cards 3D mockup */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Card 1 */}
            <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-[#FF4FA3] to-[#b7046c] flex flex-col items-center justify-center gap-1 shadow-[0_8px_20px_rgba(255,79,163,0.5)] rotate-[-8deg] translate-y-2">
              <span className="text-xs font-bold text-white/70 tracking-wider">PinkMoney</span>
              <div className="w-10 h-6 rounded-md bg-gradient-to-br from-[#ffd700] to-[#b8860b] opacity-80" />
              <div className="flex items-center gap-0.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                <span className="w-4 h-4 rounded-full bg-red-400" />
              </div>
            </div>

            {/* Ícones flutuantes */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-xl shadow-md">
                💰
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--pm-primary-container)]/20 flex items-center justify-center text-lg">
                ⭐
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-[#50283b] to-[#280619] flex flex-col items-center justify-center gap-1 shadow-md rotate-[6deg] translate-y-1 border border-[var(--pm-outline-variant)]">
              <span className="text-[8px] font-bold text-[var(--pm-primary)] tracking-widest">TRACK</span>
              <span className="text-xl">📊</span>
              <span className="text-[8px] text-[var(--pm-on-surface-variant)] mt-1">SPENDING</span>
            </div>
          </div>
        </div>
      </div>

      {/* Texto */}
      <div className="px-8 text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-[var(--pm-on-surface)] leading-snug">
          Organize suas categorias
        </h1>
        <p className="text-sm text-[var(--pm-on-surface-variant)] leading-relaxed">
          Personalize seus gastos com brilho e<br />
          futura. Crie categorias que combinam<br />
          com seu estilo de vida Kawaii.
        </p>
      </div>

      {/* Grid de categorias */}
      <div className="px-6 mt-5 flex-1">
        <div className="grid grid-cols-3 gap-3">
          {CATEGORY_OPTIONS.map(cat => {
            const isSelected = selected.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[var(--pm-primary-container)]/25 border border-[var(--pm-primary-container)]/60 shadow-[0_0_12px_rgba(255,79,163,0.25)]'
                    : 'bg-[var(--pm-surface-container-high)] border border-transparent'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-[11px] font-semibold ${
                  isSelected ? 'text-[var(--pm-primary-container)]' : 'text-[var(--pm-on-surface-variant)]'
                }`}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
        <span className="w-6 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
      </div>

      {/* Botões */}
      <div className="px-6 mt-4 mb-10 space-y-3">
        <button
          onClick={() => router.push('/objetivos')}
          className="w-full py-4 rounded-full pm-btn-primary font-bold text-base"
        >
          Começar Brilho ✦
        </button>
        <button
          onClick={() => router.back()}
          className="w-full text-center text-xs font-semibold text-[var(--pm-on-surface-variant)] py-2"
        >
          VOLTAR
        </button>
      </div>

    </div>
  )
}
