'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ArrowLeft, Pencil, Plus, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/pm/GlassCard'
import { PmProgress } from '@/components/pm/PmProgress'
import {
  useCategories,
  useCategorySpending,
  useCreateCategory,
  useUpdateCategory,
} from '@/lib/hooks/useCategories'
import { formatBRL } from '@/lib/utils/format'

const EMOJI_OPTIONS = [
  '🍔', '🛍️', '🚗', '💊', '💄', '✈️', '🎮', '📚',
  '🏠', '💸', '🌮', '☕', '🎵', '💅', '🐾', '🎓',
]

interface EditState {
  id: string | null
  name: string
  icon: string
  monthly_limit: string
}

export default function GerenciarCategoriasPage() {
  const router = useRouter()

  const { data: categories = [], isLoading } = useCategories()
  const { data: spending = [] }              = useCategorySpending()
  const { mutateAsync: createCat }           = useCreateCategory()
  const { mutateAsync: updateCat }           = useUpdateCategory()

  const [showForm, setShowForm] = useState(false)
  const [edit, setEdit]         = useState<EditState>({ id: null, name: '', icon: '📌', monthly_limit: '' })
  const [saving, setSaving]     = useState(false)

  function getSpending(catId: string) {
    return spending.find(s => s.category_id === catId)
  }

  function spendingPct(catId: string): number {
    const s   = getSpending(catId)
    const cat = categories.find(c => c.id === catId)
    if (!s || !s.total_spent) return 0
    const limit = cat?.monthly_limit
    if (!limit || limit <= 0) return 0
    return Math.min(100, Math.round((Number(s.total_spent) / limit) * 100))
  }

  function startEdit(cat: typeof categories[number]) {
    setEdit({
      id:            cat.id,
      name:          cat.name,
      icon:          cat.icon ?? '📌',
      monthly_limit: cat.monthly_limit ? String(cat.monthly_limit) : '',
    })
    setShowForm(true)
  }

  function startNew() {
    setEdit({ id: null, name: '', icon: '📌', monthly_limit: '' })
    setShowForm(true)
  }

  async function handleSave() {
    if (!edit.name.trim()) return
    setSaving(true)
    try {
      const limitVal = edit.monthly_limit
        ? parseFloat(edit.monthly_limit.replace(',', '.'))
        : null

      if (edit.id) {
        await updateCat({
          id:            edit.id,
          name:          edit.name,
          icon:          edit.icon,
          monthly_limit: limitVal,
        })
      } else {
        await createCat({
          name:          edit.name,
          icon:          edit.icon,
          monthly_limit: limitVal,
        })
      }
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh pm-bg-gradient pb-10">

      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full pm-glass flex items-center justify-center"
          >
            <ArrowLeft size={17} className="text-[var(--pm-on-surface)]" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[var(--pm-on-surface)]">Categorias</h1>
        <p className="text-sm text-[var(--pm-on-surface-variant)] mt-0.5">
          Gerencie seus limites mensais ✨
        </p>
      </div>

      {/* Lista */}
      <div className="px-5 space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--pm-surface-container-high)] animate-pulse" />
          ))
        ) : categories.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <p className="text-3xl">🌸</p>
            <p className="text-sm text-[var(--pm-on-surface)]">Nenhuma categoria ainda</p>
            <p className="text-xs text-[var(--pm-on-surface-variant)]">Crie categorias para organizar seus gastos</p>
          </GlassCard>
        ) : (
          categories.map(cat => {
            const s   = getSpending(cat.id)
            const pct = spendingPct(cat.id)
            const hasLimit = cat.monthly_limit && cat.monthly_limit > 0

            return (
              <GlassCard key={cat.id} className="px-4 pt-4 pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--pm-primary-container)]/20 flex items-center justify-center text-xl">
                      {cat.icon ?? '📌'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--pm-on-surface)]">{cat.name}</p>
                      <p className="text-[11px] text-[var(--pm-on-surface-variant)]">
                        {s && s.total_spent > 0
                          ? hasLimit
                            ? `${formatBRL(s.total_spent)} de ${formatBRL(cat.monthly_limit!)} — ${pct}%`
                            : `Gastos: ${formatBRL(s.total_spent)}`
                          : hasLimit
                            ? `Limite: ${formatBRL(cat.monthly_limit!)}`
                            : 'Sem limite definido'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startEdit(cat)}
                    className="w-8 h-8 rounded-full pm-glass flex items-center justify-center"
                  >
                    <Pencil size={13} className="text-[var(--pm-on-surface-variant)]" />
                  </button>
                </div>

                {hasLimit && (
                  <PmProgress value={pct} size="sm" />
                )}
              </GlassCard>
            )
          })
        )}
      </div>

      {/* Botão Nova Categoria */}
      <div className="px-5 mt-6">
        <button
          onClick={startNew}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full pm-btn-primary font-bold text-sm"
        >
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      {/* Modal / Bottom Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-md mx-auto pm-glass rounded-t-3xl p-6 space-y-5 border-t border-[rgba(242,181,208,0.2)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[var(--pm-outline-variant)]" />

            <div className="flex items-center justify-between pt-2">
              <h3 className="text-base font-bold text-[var(--pm-on-surface)]">
                {edit.id ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={18} className="text-[var(--pm-on-surface-variant)]" />
              </button>
            </div>

            {/* Emoji picker */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                Ícone
              </p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => setEdit(e => ({ ...e, icon: em }))}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      edit.icon === em
                        ? 'bg-[var(--pm-primary-container)] shadow-[0_0_12px_rgba(255,79,163,0.5)]'
                        : 'bg-[var(--pm-surface-container-high)]'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Nome */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-2">
                Nome
              </p>
              <input
                type="text"
                value={edit.name}
                onChange={e => setEdit(v => ({ ...v, name: e.target.value }))}
                placeholder="Ex: Looks, Alimentação, Viagens..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
              />
            </div>

            {/* Limite mensal */}
            <div>
              <p className="text-xs font-semibold text-[var(--pm-on-surface-variant)] uppercase tracking-widest mb-1">
                Limite Mensal (R$)
              </p>
              <p className="text-[10px] text-[var(--pm-on-surface-variant)] mb-2">
                Opcional — define quanto você pode gastar por mês nesta categoria
              </p>
              <input
                type="number"
                inputMode="decimal"
                value={edit.monthly_limit}
                onChange={e => setEdit(v => ({ ...v, monthly_limit: e.target.value }))}
                placeholder="0,00"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface-container-high)] text-sm text-[var(--pm-on-surface)] placeholder:text-[var(--pm-outline)] outline-none border border-[var(--pm-outline-variant)]/50 focus:border-[var(--pm-primary)] transition-colors"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !edit.name.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full pm-btn-primary font-bold text-sm disabled:opacity-50"
            >
              {saving ? 'Salvando...' : (
                <><Check size={16} /> {edit.id ? 'Salvar Alterações' : 'Criar Categoria'}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
