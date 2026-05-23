// Formata valores em BRL
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

// Formata data no padrão pt-BR
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateStr + 'T12:00:00'))
}

// Agrupa transações por data
export function groupByDate<T extends { date: string }>(items: T[]) {
  const today    = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const groups: Record<string, T[]> = {}

  for (const item of items) {
    let label = formatDate(item.date)
    if (item.date === today)     label = 'Hoje'
    if (item.date === yesterday) label = 'Ontem'
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  }

  return Object.entries(groups)
}

// Iniciais do nome
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
