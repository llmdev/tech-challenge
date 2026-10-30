# Guia de Integração: @repo/core

Para o uso do dia a dia nos componentes (listar, criar, editar, excluir), veja o [QUICKSTART](packages/core/QUICKSTART.md). Este guia cobre o que está por trás: o contrato com a API, como implementar outro repositório e como testar casos de uso.

## Visão geral

```
componente client
  → instância de @repo/core (main/factories)
  → caso de uso (application)
  → TransactionRepository (porta)
  → TransactionHttpRepository (infra) → FetchHttpClient → /api/transacoes
```

Tudo é importado da raiz `@repo/core`.

## A porta `TransactionRepository`

```typescript
import type { Paginated, Transaction, TransactionRepository } from "@repo/core";

interface TransactionRepository {
  getAll(): Promise<Transaction[]>;
  getPaginated(page: number, pageSize: number): Promise<Paginated<Transaction>>;
  findById(id: string): Promise<Transaction | null>;
  create(transaction: Transaction): Promise<Transaction>;
  update(id: string, transaction: Transaction): Promise<Transaction | null>; // null = não encontrada
  remove(id: string): Promise<boolean>;                                    // false = não encontrada
}

interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

As operações não recebem `userId`: o repositório já atua no escopo do usuário autenticado (no HTTP, via sessão/cookie da API). Os casos de uso convertem `null`/`false` em `NotFoundError`.

## Contrato HTTP usado pelo `TransactionHttpRepository`

| Método da porta | Requisição | Observações |
|---|---|---|
| `getAll()` | `GET /api/transacoes/all` | resposta `{ items, page, pageSize, total, totalPages }` |
| `getPaginated(p, s)` | `GET /api/transacoes?page=p&pageSize=s` | mesma forma de resposta |
| `create(tx)` | `POST /api/transacoes` | corpo = DTO sem `id`; resposta = DTO criado |
| `update(id, tx)` | `PUT /api/transacoes/:id` | 404 → `null` |
| `remove(id)` | `DELETE /api/transacoes/:id` | 204 → `true`; 404 → `false` |
| `findById(id)` | — | ainda não implementado (não há rota) |

DTO trafegado:

```json
{
  "id": "42",
  "type": "credit",
  "category": "salario",
  "description": "Salário",
  "institution": "Banco Inter",
  "date": "05/10/2026",
  "amount": "+ R$ 5.000,00"
}
```

O `TransactionMapper` converte `amount` para `Money` positivo (`toDomain`) e de volta para `"± R$ x.xxx,xx"` (`toDto`), que é o formato que a rota espera ao gravar.

Respostas não-OK, exceto os 404 tratados acima, viram `HttpError` (com `status`). `FetchHttpClient` aceita uma `baseUrl` opcional (padrão `""`, ou seja, URLs relativas — por isso as factories servem para o client).

## Implementar outro repositório

Qualquer persistência pode ser plugada nos casos de uso implementando a porta:

```typescript
import {
  CreateTransactionUseCase,
  Money,
  Transaction,
  type Paginated,
  type TransactionRepository,
} from "@repo/core";

export class LocalStorageTransactionRepository implements TransactionRepository {
  async getAll(): Promise<Transaction[]> { /* ... */ }
  async getPaginated(page: number, pageSize: number): Promise<Paginated<Transaction>> { /* ... */ }
  async findById(id: string): Promise<Transaction | null> { /* ... */ }
  async create(transaction: Transaction): Promise<Transaction> {
    const id = crypto.randomUUID();
    // persistir...
    return Transaction.restore(id, {
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      institution: transaction.institution,
      date: transaction.date,
      amount: transaction.amount,
    });
  }
  async update(id: string, transaction: Transaction): Promise<Transaction | null> { /* ... */ }
  async remove(id: string): Promise<boolean> { /* ... */ }
}

const createTransaction = new CreateTransactionUseCase(new LocalStorageTransactionRepository());
```

Pontos de atenção:

- Uma transação vinda de `Transaction.create` não tem `id` (acessar `tx.id` lança erro). Quem atribui o `id` é a persistência, devolvendo `Transaction.restore(id, ...)`.
- Use `Transaction.restore` ao ler dados existentes: ele não reaplica as regras de criação.
- Para trocar o repositório usado pelas apps, altere a composição em `packages/core/src/main/factories.ts`.

## Testar casos de uso

Ainda não há test runner configurado (o `CLAUDE.md` pede Vitest + `@testing-library/react` no workspace raiz antes de adicionar testes) e o pacote não traz repositório em memória. Quando houver, o caminho é um fake da porta:

```typescript
import {
  DeleteTransactionUseCase,
  NotFoundError,
  type TransactionRepository,
} from "@repo/core";

const repository: TransactionRepository = {
  getAll: async () => [],
  getPaginated: async (page, pageSize) => ({ items: [], page, pageSize, total: 0, totalPages: 1 }),
  findById: async () => null,
  create: async (tx) => tx,
  update: async () => null,
  remove: async () => false,
};

await expect(new DeleteTransactionUseCase(repository).execute("999")).rejects.toBeInstanceOf(NotFoundError);
```

## Componentes presentacionais

Pacotes de UI (`packages/@repo/*`, como `@repo/statement`) não dependem do core: recebem props de exibição. A app converte a entidade, por exemplo:

```typescript
import type { TransactionItemData } from "@repo/statement";
import type { Transaction } from "@repo/core";

function toItemData(tx: Transaction): TransactionItemData {
  return {
    month: tx.month,
    description: tx.description,
    date: tx.date,
    amount: `${tx.isCredit() ? "+" : "-"} ${tx.amount.format()}`,
    type: tx.type,
  };
}
```
