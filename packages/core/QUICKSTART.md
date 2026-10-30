# Quickstart — @repo/core nas apps

## 1. Habilitar o pacote na app

`package.json` da app:

```json
{
  "dependencies": {
    "@repo/core": "workspace:*"
  }
}
```

`next.config.ts`:

```typescript
transpilePackages: ["@repo/core", /* ... */],
```

Depois rode `pnpm install` na raiz do repositório.

## 2. Listar

```typescript
import { listTransactionsUseCase, listAllTransactionsUseCase } from "@repo/core";

// Paginado
const { transactions, page, total, totalPages } = await listTransactionsUseCase.execute({
  page: 1,
  pageSize: 10,
});

// Todas (ex.: gráficos)
const all = await listAllTransactionsUseCase.execute();
```

Também há `listLast5TransactionsUseCase.execute()` (extrato) e `getBalanceUseCase.execute()` (saldo como `Money`).

## 3. Criar

Monte a entidade com `Transaction.create` — ela valida os dados antes de qualquer requisição:

```typescript
import { Money, Transaction, createTransactionUseCase } from "@repo/core";

const transaction = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário",
  institution: "Banco Inter",
  date: "05/10/2026",                          // dd/mm/aaaa (ou Date)
  amount: Money.fromDecimal(valor.replace(",", ".")), // sempre positivo
});

await createTransactionUseCase.execute(transaction);
```

## 4. Editar

```typescript
import { updateTransactionUseCase } from "@repo/core";

await updateTransactionUseCase.execute(existente.id, transactionEditada);
```

## 5. Excluir

```typescript
import { NotFoundError, deleteTransactionUseCase } from "@repo/core";

try {
  await deleteTransactionUseCase.execute(id);
} catch (error) {
  if (!(error instanceof NotFoundError)) throw error; // já não existia
}
```

## Erros

| Erro | Quando |
|---|---|
| `ValidationError` | `Transaction.create` com dados inválidos; `Money.fromDecimal` com valor não numérico |
| `NotFoundError` | `update`/`delete` de uma transação que não existe (404 da API) |
| `HttpError` | qualquer outra resposta não-OK da API (tem `status`) |

Num formulário, basta exibir `error.message` — as mensagens de domínio já estão em português.

## Exibição

A entidade guarda o valor como `Money` positivo; o sinal vem do `type`:

```typescript
const label = `${tx.isCredit() ? "+" : "-"} ${tx.amount.format()}`; // "+ R$ 1.234,56"
const saldo = items.reduce((acc, tx) => acc + tx.signedAmount().toDecimal(), 0);
```

Pacotes presentacionais (`@repo/statement`, etc.) não dependem do core: a app converte a entidade nas props de exibição do componente.

## Testes

Ainda não há test runner configurado (ver `CLAUDE.md`). Para testar um caso de uso, implemente `TransactionRepository` com um fake em memória — veja o [INTEGRATION_GUIDE.md](../../INTEGRATION_GUIDE.md).
