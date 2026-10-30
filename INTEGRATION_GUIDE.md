# Guia de Integração: @repo/core

## Quick Start

### 1. Importar do core

```typescript
// Domain: entidades e value objects
import {
  Transaction,
  Money,
  ValidationError,
  NotFoundError,
  type TransactionType,
  CATEGORIES,
} from "@repo/core/domain";

// Application: casos de uso e portas
import {
  CreateTransactionUseCase,
  GetBalanceUseCase,
  ListTransactionsUseCase,
  DeleteTransactionUseCase,
  UpdateTransactionUseCase,
  type TransactionRepository,
} from "@repo/core/application";

// Testing: utilitários para testes
import { InMemoryTransactionRepository } from "@repo/core/testing";
```

### 2. Criar uma entidade

```typescript
const transaction = Transaction.create({
  type: "debit",
  category: "compras",
  description: "Supermercado",
  institution: "Mercado X",
  date: new Date(),
  amount: Money.fromDecimal(250.50),
});
```

### 3. Usar um caso de uso

```typescript
// Implementar seu repositório
class MyRepository implements TransactionRepository {
  // ... implementação
}

const repository = new MyRepository();
const createUseCase = new CreateTransactionUseCase(repository);

const created = await createUseCase.execute("user-123", transaction);
console.log(`ID gerado: ${created.id}`);
```

## Casos de Uso Disponíveis

### CreateTransactionUseCase

Cria uma transação nova e a persiste.

```typescript
const useCase = new CreateTransactionUseCase(repository);
const transaction = await useCase.execute("user-id", newTransaction);
```

### GetBalanceUseCase

Calcula o saldo do usuário (entradas - saídas).

```typescript
const useCase = new GetBalanceUseCase(repository);
const balance = await useCase.execute("user-id");
console.log(`Saldo: R$ ${balance.toDecimal()}`);
```

### ListTransactionsUseCase

Lista transações com paginação.

```typescript
const useCase = new ListTransactionsUseCase(repository);
const result = await useCase.execute({
  userId: "user-id",
  page: 1,
  pageSize: 10,
});

console.log(`Total: ${result.total}`);
console.log(`Página: ${result.page} de ${result.totalPages}`);
result.transactions.forEach(tx => console.log(tx.description));
```

### UpdateTransactionUseCase

Atualiza uma transação existente.

```typescript
const useCase = new UpdateTransactionUseCase(repository);
const updated = await useCase.execute(
  "tx-id",
  "user-id",
  updatedTransaction
);
```

### DeleteTransactionUseCase

Remove uma transação.

```typescript
const useCase = new DeleteTransactionUseCase(repository);
await useCase.execute("tx-id", "user-id");
```

## Implementar o Repositório

Para usar em produção, você precisa implementar `TransactionRepository`:

```typescript
import {
  TransactionRepository,
  type Transaction,
} from "@repo/core/application";

export class PgTransactionRepository implements TransactionRepository {
  constructor(private db: Pool) {}

  async getAll(userId: string): Promise<Transaction[]> {
    // Buscar do Postgres
    const rows = await this.db.query("SELECT * FROM transactions WHERE user_id = $1", [userId]);
    return rows.map(row => Transaction.restore(row.id, { ... }));
  }

  async create(userId: string, tx: Transaction): Promise<Transaction> {
    // Inserir no Postgres
    const result = await this.db.query(
      "INSERT INTO transactions (...) VALUES (...) RETURNING *",
      [...]
    );
    return Transaction.restore(result.rows[0].id, { ... });
  }

  // ... outros métodos
}
```

## Testes

Use `InMemoryTransactionRepository` para testes sem banco:

```typescript
import { InMemoryTransactionRepository } from "@repo/core/testing";

describe("meu caso de uso", () => {
  it("cria transação", async () => {
    const repository = new InMemoryTransactionRepository();
    const useCase = new CreateTransactionUseCase(repository);

    const tx = Transaction.create({ ... });
    const created = await useCase.execute("user-1", tx);

    expect(created.id).toBeDefined();
  });
});
```

## Value Objects

### Money

Operações monetárias seguras sem erro de arredondamento:

```typescript
const a = Money.fromDecimal(100.10);
const b = Money.fromDecimal(50.05);

const sum = a.plus(b);       // 150.15
const diff = a.minus(b);     // 50.05
const mult = a.multiply(2);  // 200.20
const div = a.divide(2);     // 50.05

const positive = Money.fromDecimal(-100).negate(); // 100

if (a.greaterThan(b)) { /* ... */ }
if (a.equals(b)) { /* ... */ }

console.log(a.toDecimal()); // 100.1
```

## Erros Esperados

Os casos de uso lançam exceções de domínio:

```typescript
import { ValidationError, NotFoundError } from "@repo/core/domain";

try {
  const tx = Transaction.create({ amount: Money.zero() });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validação falhou:", error.message);
  }
}

try {
  await deleteUseCase.execute("999", "user-1");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Transação não encontrada");
  }
}
```
