'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import {
  Search, TrendingUp, TrendingDown,
  X, Check, Trash2, Pencil, CreditCard, Wallet, Smartphone,
} from 'lucide-react'
import { GlassCard } from '@/components/pm/GlassCard'
import {
  useTransactions,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/lib/hooks/useTransactions'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCards } from '@/lib/hooks/useCards'
import { formatBRL, formatDate, groupByDate } from '@/lib/utils/format'
import type { TransactionWithCategory } from '@/types/database'

// ─── Types ────────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { val: 'all',     label: 'Todos' },
  { val: 'income',  label: 'Ent.'  },
  { val: 'expense', label: 'Saí.'  },
] as const

const PAYMENT_OPTS = [
  { value: 'card' as const, label: 'Card',  icon: CreditCard  },
  { value: 'pix'  as const, label: 'Pix',   icon: Smartphone  },
  { value: 'cash' as const, label: 'Cash',  icon: Wallet      },
]

interface EditForm {
  type:           'income' | 'expense'
  amount:         string
  description:    string
  category_id:    string
  card_id:        string
  date:           string
  payment_method: 'card' | 'pix' | 'cash'
  notes:          string
}

function toEditForm(t: TransactionWithCategory): EditForm {
  return {
    type:           t.type,
    amount:         String(t.amount),
    description:    t.description,
    category_id:    t.category_id   ?? '',
    card_id:        t.card_id       ?? '',
    date:           t.date,
    payment_method: t.payment_method,
    notes:          t.notes         ?? '',
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  // Seleção de transação para ações
  const [selected, setSelected]       = useState<TransactionWithCategory | null>(null)
  const [showActions, setShowActions] = useState(false)
  const [showEdit, setShowEdit]       = useState(false)
  const [showConfirmDel, setShowConfirmDel] = useState(false)

  // Form de edição
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving]     = useState(false)

  const { data: transactions = [], isLoading } = useTransactions(100)
  const { data: categories = [] }              = useCategories()
  const { data: cards = [] }                   = useCards()
  const { mutateAsync: updateTx }              = useUpdateTransaction()
  const { mutateAsync: deleteTx }              = useDeleteTransaction()

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.categories?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.type === filter
    return matchSearch && matchFilter
  })

  const groups  = groupByDate(filtered)
  const income  = filtered.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  // ── Ações ──────────────────────────────────────────────────────────────────

  function openActions(t: TransactionWithCategory) {
    setSelected(t)
    setShowActions(true)
  }

  function openEdit() {
    if (!selected) return
    setEditForm(toEditForm(selected))
    setShowActions(false)
    setShowEdit(true)
  }

  function openDelete() {
    setShowActions(false)
    setShowConfirmDel(true)
  }

  function closeAll() {
    setShowActions(false)
    setShowEdit(false)
    setShowConfirmDel(false)
    setSelected(null)
    setEditForm(null)
  }

  async function handleSave() {
    if (!selected || !editForm) return
    setSaving(true)
    try {
      await updateTx({
        id:             selected.id,
        type:           editForm.type,
        amount:         parseFloat(editForm.amount) || 0,
        description:    editForm.description,
        category_id:    editForm.category_id || null,
        card_id:        editForm.card_id     || null,
        date:           editForm.date,
        payment_method: editForm.payment_method,
        notes:          editForm.notes || null,
      })
      closeAll()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    await deleteTx(selected.id)
    closeAll()
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function formatAmountInput(val: string): string {
    // Mantém apenas dígitos e ponto/vírgula
    return val.replace(/[^\d.,]/g, '')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="px-5 pt-6 pb-4 space-y-4">

      {/* Header */}
      <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">Histórico</h1>

      {/* Busca */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl pm-glass border border-[var(--pm-outline-variant)]/60">
        <Search size={15} className="text-[var(--pm-outline)] flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar transação..."
          className="flex-1 bg-transparent text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X size={14} className="text-[var(--pm-outline)]" />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {FILTER_TABS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === val
                ? 'bg-[var(--pm-primary-container)] text-white shadow-[0_4px_16px_rgba(255,79,163,0.35)]'
                : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">✨</p>
          <p className="text-[var(--pm-on-surface-variant)] text-sm">Nenhuma transação encontrada</p>
          <p className="text-xs text-[var(--pm-on-surface-variant)]">
            Use o botão <span className="text-[var(--pm-primary)] font-semibold">+</span> na barra inferior para adicionar
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <p className="text-[10px] font-bold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2 px-1">
                {dateLabel}
              </p>
              <GlassCard className="divide-y divide-[var(--pm-outline-variant)]/40 overflow-hidden">
                {items.map(t => {
                  const isIncome = t.type === 'income'
                  return (
                    <button
                      key={t.id}
                      onClick={() => openActions(t)}
                      className="w-full flex items-center gap-3 p-4 text-left active:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-lg flex-shrink-0">
                        {t.categories?.icon ?? (isIncome ? '💰' : '💸')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--pm-on-surface)] truncate">
                          {t.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[var(--pm-on-surface-variant)]">
                            {formatDate(t.date)}
                          </span>
                          {t.categories && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--pm-primary-container)]/15 text-[var(--pm-primary)]">
                              {t.categories.icon} {t.categories.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`pm-numeric text-sm font-bold flex-shrink-0 ${
                        isIncome ? 'text-emerald-400' : 'text-[var(--pm-primary-container)]'
                      }`}>
                        {isIncome ? '+' : '-'}{formatBRL(t.amount)}
                      </p>
                    </button>
                  )
                })}
              </GlassCard>
            </div>
          ))}
        </div>
      )}

      {/* Espaço para sumário fixo */}
      <div className="h-20" />

      {/* Sumário fixo */}
      <div className="fixed bottom-[72px] left-0 right-0 px-5 z-40 max-w-md mx-auto">
        <GlassCard className="flex divide-x divide-[var(--pm-outline-variant)]/50 shadow-lg">
          <div className="flex-1 flex items-center gap-2 p-3">
            <TrendingUp size={15} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Entradas</p>
              <p className="pm-numeric text-sm font-bold text-emerald-400">{formatBRL(income)}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 p-3">
            <TrendingDown size={15} className="text-[var(--pm-primary-container)] flex-shrink-0" />
            <div>
              <p className="text-[9px] text-[var(--pm-on-surface-variant)] uppercase tracking-wide">Saídas</p>
              <p className="pm-numeric text-sm font-bold text-[var(--pm-primary-container)]">{formatBRL(expense)}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Bottom Sheet: Ações ─────────────────────────────────────────────── */}
      {showActions && selected && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAll} />
          <div className="relative w-full max-w-md mx-auto pm-glass rounded-t-3xl border-t border-[rgba(242,181,208,0.2)] overflow-hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--pm-outline-variant)]" />
            </div>

            {/* Cabeçalho da transação */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--pm-outline-variant)]/30">
              <div className="w-11 h-11 rounded-xl bg-[var(--pm-surface-container-high)] flex items-center justify-center text-xl flex-shrink-0">
                {selected.categories?.icon ?? (selected.type === 'income' ? '💰' : '💸')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--pm-on-surface)] truncate">
                  {selected.description}
                </p>
                <p className="text-[10px] text-[var(--pm-on-surface-variant)] mt-0.5">
                  {formatDate(selected.date)}
                  {selected.categories && ` · ${selected.categories.name}`}
                </p>
              </div>
              <p className={`pm-numeric text-base font-bold flex-shrink-0 ${
                selected.type === 'income' ? 'text-emerald-400' : 'text-[var(--pm-primary-container)]'
              }`}>
                {selected.type === 'income' ? '+' : '-'}{formatBRL(selected.amount)}
              </p>
            </div>

            {/* Opções */}
            <div className="px-5 py-3 space-y-2 pb-8">
              <button
                onClick={openEdit}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--pm-surface-container-high)] text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--pm-primary-container)]/20 flex items-center justify-center flex-shrink-0">
                  <Pencil size={16} className="text-[var(--pm-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--pm-on-surface)]">Editar transação</p>
                  <p className="text-[10px] text-[var(--pm-on-surface-variant)]">Corrigir valores, categoria ou data</p>
                </div>
              </button>

              <button
                onClick={openDelete}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--pm-error)]/10 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--pm-error)]/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={16} className="text-[var(--pm-error)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--pm-error)]">Excluir transação</p>
                  <p className="text-[10px] text-[var(--pm-on-surface-variant)]">Esta ação não pode ser desfeita</p>
                </div>
              </button>

              <button
                onClick={closeAll}
                className="w-full py-3 text-sm font-semibold text-[var(--pm-on-surface-variant)]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Sheet: Editar ─────────────────────────────────────────────── */}
      {showEdit && editForm && (
        <div className="fixed inset-0 z-50 flex items-end overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAll} />
          <div className="relative w-full max-w-md mx-auto pm-glass rounded-t-3xl border-t border-[rgba(242,181,208,0.2)] overflow-y-auto max-h-[92dvh]">
            {/* Handle */}
            <div className="sticky top-0 pm-glass z-10 flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[var(--pm-outline-variant)]" />
            </div>

            <div className="px-5 pb-10 space-y-5">
              {/* Título */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--pm-on-surface)]">Editar Transação</h3>
                <button onClick={closeAll}>
                  <X size={18} className="text-[var(--pm-on-surface-variant)]" />
                </button>
              </div>

              {/* Toggle tipo */}
              <div className="flex p-1 rounded-full bg-[var(--pm-surface-container-high)]">
                {(['expense', 'income'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setEditForm(f => f ? { ...f, type: t } : f)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
                      editForm.type === t
                        ? 'pm-btn-primary'
                        : 'text-[var(--pm-on-surface-variant)]'
                    }`}
                  >
                    {t === 'expense' ? 'Gasto' : 'Ganho'}
                  </button>
                ))}
              </div>

              {/* Valor */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                  Valor (R$)
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={editForm.amount}
                  onChange={e => setEditForm(f => f ? { ...f, amount: formatAmountInput(e.target.value) } : f)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] pm-numeric text-xl font-bold text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                />
              </div>

              {/* Descrição */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                  Descrição
                </p>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)}
                  placeholder="Ex: Sephora, iFood..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                />
              </div>

              {/* Categoria */}
              {categories.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                    Categoria
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setEditForm(f => f
                          ? { ...f, category_id: f.category_id === cat.id ? '' : cat.id }
                          : f
                        )}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          editForm.category_id === cat.id
                            ? 'bg-[var(--pm-primary-container)] text-white'
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

              {/* Data */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                  Data
                </p>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={e => setEditForm(f => f ? { ...f, date: e.target.value } : f)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Método de pagamento */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                  Método de Pagamento
                </p>
                <div className="flex gap-2">
                  {PAYMENT_OPTS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setEditForm(f => f ? { ...f, payment_method: value } : f)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        editForm.payment_method === value
                          ? 'bg-[var(--pm-primary-container)] text-white'
                          : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cartão (se pagamento = card) */}
              {editForm.payment_method === 'card' && cards.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                    Qual Cartão?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => setEditForm(f => f
                          ? { ...f, card_id: f.card_id === card.id ? '' : card.id }
                          : f
                        )}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                          editForm.card_id === card.id
                            ? 'bg-[var(--pm-primary-container)] text-white'
                            : 'bg-[var(--pm-surface-container-high)] text-[var(--pm-on-surface-variant)]'
                        }`}
                      >
                        <CreditCard size={12} />
                        {card.name}
                        {card.last_four && <span className="opacity-70">···{card.last_four}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--pm-on-surface-variant)] uppercase mb-2">
                  Notas
                </p>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm(f => f ? { ...f, notes: e.target.value } : f)}
                  placeholder="Observações opcionais..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors resize-none"
                />
              </div>

              {/* Salvar */}
              <button
                onClick={handleSave}
                disabled={saving || !editForm.description.trim() || !editForm.amount}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full pm-btn-primary font-bold text-sm disabled:opacity-50"
              >
                {saving ? 'Salvando...' : <><Check size={16} /> Salvar Alterações</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialog: Confirmar Exclusão ──────────────────────────────────────── */}
      {showConfirmDel && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAll} />
          <GlassCard className="relative w-full max-w-xs p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--pm-error)]/20 flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-[var(--pm-error)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--pm-on-surface)]">Excluir transação?</p>
              <p className="text-xs text-[var(--pm-on-surface-variant)] mt-1 leading-relaxed">
                <span className="font-semibold text-[var(--pm-on-surface)]">{selected.description}</span>
                {' '}({formatBRL(selected.amount)}) será removida permanentemente.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeAll}
                className="flex-1 py-3 rounded-xl pm-glass border border-[var(--pm-outline-variant)] text-sm font-semibold text-[var(--pm-on-surface)]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-[var(--pm-error-container)] text-[var(--pm-on-error-container)] text-sm font-bold"
              >
                Excluir
              </button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  )
}
