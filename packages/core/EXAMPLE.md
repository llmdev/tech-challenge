# Exemplo: componente usando @repo/core

Componente client que lista, cria e exclui transações sem nenhum `fetch` — tudo via casos de uso.

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Money,
  NotFoundError,
  Transaction,
  createTransactionUseCase,
  deleteTransactionUseCase,
  listTransactionsUseCase,
} from "@repo/core";

export function TransacoesExemplo() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { transactions } = await listTransactionsUseCase.execute({ page: 1, pageSize: 10 });
    setItems(transactions);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(descricao: string, valor: string) {
    setError(null);
    try {
      const transaction = Transaction.create({
        type: "debit",
        category: "outros",
        description: descricao,
        institution: "",
        date: "05/10/2026",
        amount: Money.fromDecimal(valor.replace(",", ".")),
      });
      await createTransactionUseCase.execute(transaction);
      await load();
    } catch (err) {
      // ValidationError (domínio) ou HttpError (API)
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTransactionUseCase.execute(id);
    } catch (err) {
      if (!(err instanceof NotFoundError)) throw err;
    } finally {
      await load();
    }
  }

  return (
    <ul>
      {items.map((tx) => (
        <li key={tx.id}>
          {tx.date} — {tx.description} — {tx.isCredit() ? "+" : "-"} {tx.amount.format()}
          <button onClick={() => handleDelete(tx.id)}>Excluir</button>
        </li>
      ))}
      {error && <li>{error}</li>}
    </ul>
  );
}
```

Implementações reais no repositório:

- `apps/transacoes/src/app/transacoes/components/transacoes-content.tsx` — lista paginada/"Todas" e exclusão
- `apps/transacoes/src/components/transaction-form.tsx` e `apps/web/src/app/components/transaction-form.tsx` — criação e edição
- `apps/web/src/app/components/statement-content.tsx` — últimas 5, convertidas para as props do `@repo/statement`
- `apps/web/src/app/components/home-content.tsx` — saldo
- `apps/web/src/app/components/graficos-content.tsx` — todas as transações para os gráficos

## Operações com Money

```typescript
const salario = Money.fromDecimal(5000);
const gasto = Money.fromDecimal("250.50");

salario.minus(gasto).toDecimal(); // 4749.5
salario.minus(gasto).format();    // "R$ 4.749,50"
gasto.greaterThan(salario);       // false
```
