'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Bell, Plus, ChevronRight, Wifi, X, Check, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import { useCards, useCreateCard, useUpdateCard, useDeleteCard } from '@/lib/hooks/useCards'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { formatBRL, formatDate } from '@/lib/utils/format'
import type { Card } from '@/types/database'

const CARD_GRADIENTS = [
  'from-[#b7046c] via-[#FF4FA3] to-[#ffb0cc]',
  'from-[#4a0080] via-[#9c27b0] to-[#e040fb]',
  'from-[#1a237e] via-[#3949ab] to-[#7986cb]',
  'from-[#006064] via-[#00838f] to-[#4dd0e1]',
]

interface CardForm {
  name: string
  last_four: string
  available_limit: string
  current_balance: string
}

const EMPTY_FORM: CardForm = {
  name: '', last_four: '', available_limit: '', current_balance: '',
}

export default function CartoesPage() {
  const { data: cards = [], isLoading } = useCards()
  const { data: transactions = [] }     = useTransactions(20)
  const { mutateAsync: createCard }     = useCreateCard()
  const { mutateAsync: updateCard }     = useUpdateCard()
  const { mutateAsync: deleteCard }     = useDeleteCard()

  const [activeIdx, setActiveIdx]   = useState(0)
  const [showForm, setShowForm]     = useState(false)
  const [editCard, setEditCard]     = useState<Card | null>(null)
  const [form, setForm]             = useState<CardForm>(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const activeCard = cards[activeIdx] ?? null

  // Compras recentes do cartão ativo
  const recentPurchases = transactions
    .filter(t => t.type === 'expense' && (!activeCard || t.card_id === activeCard.id))
    .slice(0, 5)

  function openNew() {
    setEditCard(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(card: Card) {
    setEditCard(card)
    setForm({
      name:            card.name,
      last_four:       card.last_four ?? '',
      available_limit: String(card.available_limit),
      current_balance: String(card.current_balance),
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editCard) {
        await updateCard({
          id:              editCard.id,
          name:            form.name,
          last_four:       form.last_four || null,
          available_limit: parseFloat(form.available_limit || '0'),
          current_balance: parseFloat(form.current_balance || '0'),
        })
      } else {
        await createCard({
          name:            form.name,
          last_four:       form.last_four || null,
          available_limit: parseFloat(form.available_limit || '0'),
          current_balance: parseFloat(form.current_balance || '0'),
        })
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await deleteCard(id)
    setConfirmDelete(null)
    setActiveIdx(0)
  }

  // Formata número de cartão
  function formatLast4(val: string) {
    return val.replace(/\D/g, '').slice(0, 4)
  }

  return (
    <div className="pb-4 space-y-5">

      {/* ── App Header ── */}
      <div className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-xl font-bold text-[var(--pm-on-surface)]">PinkMoney</h1>
        <button className="relative w-9 h-9 rounded-full pm-glass flex items-center justify-center">
          <Bell size={16} className="text-[var(--pm-on-surface-variant)]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--pm-primary-container)]" />
        </button>
      </div>

      {/* ── Sub-header ── */}
      <div className="px-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--pm-on-surface)]">My Cards</h2>
          <p className="text-xs text-[var(--pm-on-surface-variant)] mt-0.5">
            {cards.length === 0
              ? 'Nenhum cartão cadastrado'
              : `${cards.length} cartão${cards.length > 1 ? 'ões' : ''} ativo${cards.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* ── Empty State ── */}
      {isLoading ? (
        <div className="px-5">
          <div className="h-48 rounded-3xl bg-[var(--pm-surface-container-high)] animate-pulse" />
        </div>
      ) : cards.length === 0 ? (
        <div className="px-5 space-y-4">
          <GlassCard className="p-8 text-center space-y-4">
            <div className="text-5xl">💳</div>
            <div>
              <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Nenhum cartão ainda</p>
              <p className="text-xs text-[var(--pm-on-surface-variant)] mt-1">
                Adicione seu cartão para acompanhar saldo e compras
              </p>
            </div>
            <button
              onClick={openNew}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full pm-btn-primary font-bold text-sm"
            >
              <Plus size={16} />
              Adicionar Cartão
            </button>
          </GlassCard>
        </div>
      ) : (
        <>
          {/* ── Card Carousel ── */}
          <div className="px-5">
            <div className="overflow-x-auto flex gap-4 pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {cards.map((card, i) => {
                const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length]
                const usedLimit = card.available_limit > 0
                  ? card.current_balance
                  : 0

                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveIdx(i)}
                    className="flex-shrink-0 w-full snap-center"
                  >
                    <div
                      className={`relative rounded-3xl p-6 bg-gradient-to-br ${gradient} flex flex-col justify-between shadow-[0_16px_40px_rgba(255,79,163,0.35)] ${
                        activeIdx === i ? 'ring-2 ring-white/30' : 'opacity-90'
                      }`}
                      style={{ aspectRatio: '1.7 / 1' }}
                    >
                      {/* Card top */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white/60 text-[9px] font-semibold tracking-widest uppercase">
                            PinkMoney
                          </p>
                          <p className="text-white text-sm font-bold mt-0.5">{card.name}</p>
                        </div>
                        <Wifi size={18} className="text-white/70 rotate-90" />
                      </div>

                      {/* Chip */}
                      <div className="mt-2">
                        <div className="w-9 h-6 rounded-md bg-gradient-to-br from-[#ffd700] to-[#b8860b] opacity-90" />
                      </div>

                      {/* Card bottom */}
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <p className="text-white/50 text-[8px] uppercase tracking-widest mb-0.5">
                            Limite Disponível
                          </p>
                          <p className="pm-numeric text-xl font-bold text-white">
                            {formatBRL(card.available_limit)}
                          </p>
                          <p className="text-white/40 text-[9px] mt-0.5">
                            {card.last_four ? `•••• •••• •••• ${card.last_four}` : 'Sem número'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); openEdit(card) }}
                            className="text-white/60 text-[9px] font-semibold underline"
                          >
                            editar
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmDelete(card.id) }}
                            className="text-white/40 text-[9px]"
                          >
                            remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Dots */}
            {cards.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIdx
                        ? 'w-5 bg-[var(--pm-primary-container)]'
                        : 'w-1.5 bg-[var(--pm-surface-container-high)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Saldo Atual do cartão ativo ── */}
          {activeCard && (
            <div className="px-5">
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Saldo Atual</p>
                  <ChevronRight size={16} className="text-[var(--pm-outline)]" />
                </div>

                <div>
                  <p className="pm-numeric text-3xl font-bold text-[var(--pm-on-surface)]">
                    {formatBRL(activeCard.current_balance)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[var(--pm-surface-container-high)] px-3 py-2">
                    <p className="text-[var(--pm-on-surface-variant)] mb-0.5">Limite Disponível</p>
                    <p className="pm-numeric font-bold text-emerald-400">
                      {formatBRL(activeCard.available_limit)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--pm-surface-container-high)] px-3 py-2">
                    <p className="text-[var(--pm-on-surface-variant)] mb-0.5">Saldo Devedor</p>
                    <p className="pm-numeric font-bold text-[var(--pm-primary-container)]">
                      {formatBRL(activeCard.current_balance)}
                    </p>
                  </div>
                </div>

                {activeCard.available_limit > 0 && (
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--pm-on-surface-variant)] mb-1.5">
                      <span>Limite utilizado</span>
                      <span>
                        {Math.min(100, Math.round((activeCard.current_balance / (activeCard.available_limit + activeCard.current_balance)) * 100))}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--pm-surface-container-high)]">
                      <div
                        className="h-full rounded-full pm-progress-fill"
                        style={{
                          width: `${Math.min(100, (activeCard.current_balance / (activeCard.available_limit + activeCard.current_balance)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* ── Adicionar novo cartão ── */}
          <div className="px-5">
            <button
              onClick={openNew}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl pm-glass border border-[var(--pm-outline-variant)]/60 text-sm font-bold text-[var(--pm-on-surface)]"
            >
              <Plus size={16} className="text-[var(--pm-primary-container)]" />
              Adicionar Cartão
            </button>
          </div>

          {/* ── Compras Recentes ── */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--pm-on-surface)]">Compras Recentes</h3>
            </div>

            {recentPurchases.length === 0 ? (
              <GlassCard className="p-6 text-center space-y-2">
                <p className="text-2xl">💳</p>
                <p className="text-xs text-[var(--pm-on-surface-variant)]">
                  Nenhuma compra registrada neste cartão
                </p>
              </GlassCard>
            ) : (
              <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/40">
                {recentPurchases.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-lg flex-shrink-0">
                      {t.categories?.icon ?? '🛍️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--pm-on-surface)] truncate">
                        {t.description}
                      </p>
                      <p className="text-[10px] text-[var(--pm-on-surface-variant)]">
                        {formatDate(t.date)} · {t.categories?.name ?? 'Compra'}
                      </p>
                    </div>
                    <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)] flex-shrink-0">
                      -{formatBRL(t.amount)}
                    </p>
                  </div>
                ))}
              </GlassCard>
            )}
          </div>
        </>
      )}

      {/* ── Modal: Adicionar / Editar Cartão ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md mx-auto pm-glass rounded-t-3xl p-6 space-y-5 border-t border-[rgba(242,181,208,0.2)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[var(--pm-outline-variant)]" />

            <div className="flex items-center justify-between pt-2">
              <h3 className="text-base font-bold text-[var(--pm-on-surface)]">
                {editCard ? 'Editar Cartão' : 'Novo Cartão'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={18} className="text-[var(--pm-on-surface-variant)]" />
              </button>
            </div>

            {/* Nome */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                Nome do Cartão
              </p>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Nubank, Itaú Gold, Bradesco..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
              />
            </div>

            {/* Últimos 4 dígitos */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                Últimos 4 Dígitos
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.last_four}
                onChange={e => setForm(f => ({ ...f, last_four: formatLast4(e.target.value) }))}
                placeholder="0000"
                className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors tracking-[0.3em]"
              />
            </div>

            {/* Limite + Saldo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                  Limite Disponível
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--pm-on-surface-variant)]">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={form.available_limit}
                    onChange={e => setForm(f => ({ ...f, available_limit: e.target.value }))}
                    placeholder="0,00"
                    min="0"
                    className="w-full pl-8 pr-3 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                  Saldo Atual
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--pm-on-surface-variant)]">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={form.current_balance}
                    onChange={e => setForm(f => ({ ...f, current_balance: e.target.value }))}
                    placeholder="0,00"
                    min="0"
                    className="w-full pl-8 pr-3 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full pm-btn-primary font-bold text-sm disabled:opacity-50"
            >
              {saving ? 'Salvando...' : (
                <><Check size={16} /> {editCard ? 'Salvar Alterações' : 'Adicionar Cartão'}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmação de remoção ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <GlassCard className="relative w-full max-w-xs p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--pm-error)]/20 flex items-center justify-center mx-auto">
              <Trash2 size={20} className="text-[var(--pm-error)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--pm-on-surface)]">Remover cartão?</p>
              <p className="text-xs text-[var(--pm-on-surface-variant)] mt-1">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl pm-glass border border-[var(--pm-outline-variant)] text-sm font-semibold text-[var(--pm-on-surface)]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-[var(--pm-error-container)] text-[var(--pm-on-error-container)] text-sm font-bold"
              >
                Remover
              </button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  )
}
