'use client'

import { useRouter } from 'next/navigation'

export default function BemVindaPage() {
  const router = useRouter()

  return (
    <div className="min-h-dvh pm-bg-gradient flex flex-col max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="text-sm font-bold text-[var(--pm-on-surface)] tracking-tight">PinkMoney</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--pm-primary-container)]/20 flex items-center justify-center">
          <span className="text-[var(--pm-primary-container)] text-xs font-bold">1/3</span>
        </div>
      </div>

      {/* Ilustração — Estrela Kawaii */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-[280px] aspect-square relative flex items-center justify-center">
          {/* Fundo gradiente circular */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3d1029] via-[#2B0A1B] to-[#1A000D] opacity-80" />

          {/* Estrelas decorativas ao redor */}
          <span className="absolute top-4 left-8 text-[var(--pm-primary)] text-xl animate-pulse">✦</span>
          <span className="absolute top-8 right-6 text-[var(--pm-tertiary)] text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
          <span className="absolute bottom-10 left-4 text-[var(--pm-primary-container)] text-xs animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
          <span className="absolute bottom-6 right-10 text-[var(--pm-primary)] text-lg animate-pulse" style={{ animationDelay: '0.3s' }}>✦</span>

          {/* Moedas decorativas */}
          <span className="absolute top-6 right-14 text-2xl">🪙</span>
          <span className="absolute bottom-8 left-10 text-xl">💎</span>

          {/* Estrela principal */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div
              className="w-36 h-36 flex items-center justify-center"
              style={{
                filter: 'drop-shadow(0 0 32px rgba(255,79,163,0.6)) drop-shadow(0 0 16px rgba(255,176,204,0.4))',
              }}
            >
              {/* Estrela SVG kawaii */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <radialGradient id="starGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#ff80bc" />
                    <stop offset="50%" stopColor="#FF4FA3" />
                    <stop offset="100%" stopColor="#b7046c" />
                  </radialGradient>
                  <radialGradient id="faceGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffcce4" />
                    <stop offset="100%" stopColor="#ff80bc" />
                  </radialGradient>
                </defs>
                {/* Corpo da estrela */}
                <polygon
                  points="100,15 120,75 185,75 133,112 153,175 100,140 47,175 67,112 15,75 80,75"
                  fill="url(#starGrad)"
                  stroke="rgba(255,176,204,0.5)"
                  strokeWidth="2"
                />
                {/* Brilho interno */}
                <polygon
                  points="100,30 115,72 158,72 124,96 137,140 100,117 63,140 76,96 42,72 85,72"
                  fill="url(#faceGrad)"
                  opacity="0.35"
                />
                {/* Olhos */}
                <ellipse cx="85" cy="95" rx="8" ry="9" fill="#3d0022" />
                <ellipse cx="115" cy="95" rx="8" ry="9" fill="#3d0022" />
                {/* Brilhos nos olhos */}
                <circle cx="89" cy="91" r="2.5" fill="white" opacity="0.9" />
                <circle cx="119" cy="91" r="2.5" fill="white" opacity="0.9" />
                {/* Bochechas */}
                <ellipse cx="77" cy="108" rx="10" ry="6" fill="#FF4FA3" opacity="0.5" />
                <ellipse cx="123" cy="108" rx="10" ry="6" fill="#FF4FA3" opacity="0.5" />
                {/* Boca sorrindo */}
                <path d="M 88 110 Q 100 122 112 110" stroke="#3d0022" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Texto */}
      <div className="px-8 text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-[var(--pm-on-surface)] leading-tight">
          Bem-vinda ao<br />PinkMoney
        </h1>
        <p className="text-sm text-[var(--pm-on-surface-variant)] leading-relaxed">
          Sua jornada financeira com muito<br />
          mais brilho e estilo começa aqui.
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        <span className="w-6 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-surface-container-high)]" />
      </div>

      {/* Botão */}
      <div className="px-6 mt-6 mb-12">
        <button
          onClick={() => router.push('/categorias')}
          className="w-full py-4 rounded-full pm-btn-primary font-bold text-base"
        >
          Continuar →
        </button>
      </div>

    </div>
  )
}
