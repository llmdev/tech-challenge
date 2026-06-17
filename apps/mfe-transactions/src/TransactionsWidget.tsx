import React, { useEffect, useState } from 'react'

interface Transaction {
  id: string
  type: 'entrada' | 'saida'
  description: string
  amount: number
  date: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'entrada', description: 'Salário', amount: 5000, date: '2025-06-01' },
  { id: '2', type: 'saida', description: 'Aluguel', amount: 1500, date: '2025-06-05' },
  { id: '3', type: 'saida', description: 'Supermercado', amount: 350.9, date: '2025-06-10' },
  { id: '4', type: 'entrada', description: 'Freelance', amount: 1200, date: '2025-06-15' },
  { id: '5', type: 'saida', description: 'Internet', amount: 120, date: '2025-06-18' },
]

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function TransactionsWidget() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Simula carregamento assíncrono do domínio de transações
    const timer = setTimeout(() => setTransactions(MOCK_TRANSACTIONS), 300)
    return () => clearTimeout(timer)
  }, [])

  const balance = transactions.reduce(
    (acc, t) => (t.type === 'entrada' ? acc + t.amount : acc - t.amount),
    0,
  )

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          MFE · Domínio de Transações
        </span>
      </div>

      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#111827' }}>
        Extrato
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
        Saldo atual: <strong style={{ color: balance >= 0 ? '#059669' : '#dc2626' }}>{formatCurrency(balance)}</strong>
      </p>

      {transactions.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando…</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transactions.map(t => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 8,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: '#111827' }}>{t.description}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span style={{ fontWeight: 600, fontSize: 15, color: t.type === 'entrada' ? '#059669' : '#dc2626' }}>
                {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 20, fontSize: 11, color: '#d1d5db', textAlign: 'right' }}>
        Micro-frontend independente · single-spa
      </p>
    </div>
  )
}
