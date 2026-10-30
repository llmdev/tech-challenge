# @repo/core

Camada de negócio das transações: entidades, value objects, portas (interfaces), casos de uso e o adaptador HTTP que as apps usam no client.

As apps (`apps/web`, `apps/transacoes`) **não fazem `fetch` para transações**: os componentes chamam os casos de uso exportados por este pacote.

## Uso nas apps

```typescript
import {
  Money,
  Transaction,
  NotFoundError,
  createTransactionUseCase,
  listTransactionsUseCase,
} from "@repo/core";

const { transactions, totalPages } = await listTransactionsUseCase.execute({ page: 1, pageSize: 10 });

const nova = Transaction.create({
  type: "debit",
  category: "conta",
  description: "Conta de luz",
  institution: "Banco Inter",
  date: "05/10/2026",
  amount: Money.fromDecimal("189.90"),
});
await createTransactionUseCase.execute(nova);
```

Tudo é importado da raiz `@repo/core` — não existem subpaths (`@repo/core/domain` etc.).

Para habilitar numa app: adicione `"@repo/core": "workspace:*"` às dependências e `"@repo/core"` ao `transpilePackages` do `next.config.ts` (o pacote é exportado como source `.ts`, sem build).

## Casos de uso prontos (`main/factories.ts`)

Instâncias já ligadas ao `TransactionHttpRepository`. As operações são escopadas ao usuário da sessão pela API, por isso nenhuma recebe `userId`.

| Instância | Chamada | Retorno |
|---|---|---|
| `listTransactionsUseCase` | `execute({ page?, pageSize? })` | `{ transactions, page, pageSize, total, totalPages }` |
| `listAllTransactionsUseCase` | `execute()` | `Transaction[]` (sem paginação) |
| `listLast5TransactionsUseCase` | `execute()` | `Transaction[]` (5 mais recentes) |
| `getBalanceUseCase` | `execute()` | `Money` (entradas − saídas) |
| `createTransactionUseCase` | `execute(transaction)` | `Transaction` persistida |
| `updateTransactionUseCase` | `execute(id, transaction)` | `Transaction`; lança `NotFoundError` |
| `deleteTransactionUseCase` | `execute(id)` | `void`; lança `NotFoundError` |

`listTransactionsUseCase` normaliza a paginação: `page ≥ 1`, `pageSize` entre 1 e `MAX_PAGE_SIZE` (100), padrão `DEFAULT_PAGE_SIZE` (10), `totalPages ≥ 1`.

As factories usam URLs relativas (`/api/transacoes...`), então são para **componentes client**. As rotas de API do `apps/web` continuam usando o repositório Postgres próprio.

## Domínio

- **`Transaction`** — `Transaction.create(props)` valida as invariantes (tipo `credit`/`debit`, valor > 0, data `dd/mm/aaaa` válida, descrição obrigatória); `Transaction.restore(id, props)` reconstrói dados já persistidos. Expõe `id`, `type`, `category`, `description`, `institution`, `date` (`dd/mm/aaaa`), `amount` (`Money`, sempre positivo), `month` (nome em português), `isCredit()` e `signedAmount()`.
- **`Money`** — valores monetários com `decimal.js`. `fromDecimal` lança `ValidationError` para entrada inválida; `format()` devolve `"R$ 1.234,56"` (sem sinal — o sinal vem do `type` da transação).
- **`Month`** — mês de uma data `dd/mm/aaaa` (`fromString`, `fromDate`, `name`, `number`).
- **Erros** — `DomainError`, `ValidationError`, `NotFoundError`, `InsufficientFundsError`.
- **`CATEGORIES`** — lista de categorias de referência. A entidade não valida `category`.

## Documentação

- [QUICKSTART.md](./QUICKSTART.md) — receitas para listar, criar, editar e excluir num componente
- [EXAMPLE.md](./EXAMPLE.md) — componente React completo
- [STRUCTURE.md](./STRUCTURE.md) — estrutura de pastas e camadas
- [INTEGRATION_GUIDE.md](../../INTEGRATION_GUIDE.md) — implementar outro repositório, contrato HTTP, testes
- [CREATION_SUMMARY.md](./CREATION_SUMMARY.md) — resumo do pacote e histórico de mudanças

## Dependências

- `decimal.js` — precisão em operações monetárias
