# Getting Started com @repo/core

## 5 Minutos para Começar

### 1. Instalar (já está no workspace)

```bash
# O pacote já está em packages/core
# Qualquer app pode importar:
```

### 2. Usar em seu app

```typescript
import { Transaction, Money } from "@repo/core/domain";
import { CreateTransactionUseCase } from "@repo/core/application";

// Criar transação
const tx = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário",
  institution: "Banco Inter",
  date: new Date(),
  amount: Money.fromDecimal(5000),
});

// Usar caso de uso
const useCase = new CreateTransactionUseCase(myRepository);
const created = await useCase.execute("user-id", tx);
```

## Casos de Uso Principais

### 1️⃣ CreateTransactionUseCase
Cria e persiste uma transação nova.

```typescript
const useCase = new CreateTransactionUseCase(repository);
const tx = await useCase.execute("user-id", transaction);
```

### 2️⃣ GetBalanceUseCase
Calcula o saldo (entradas - saídas).

```typescript
const useCase = new GetBalanceUseCase(repository);
const balance = await useCase.execute("user-id");
console.log(balance.toDecimal()); // 4750.50
```

### 3️⃣ ListTransactionsUseCase
Lista transações com paginação.

```typescript
const useCase = new ListTransactionsUseCase(repository);
const result = await useCase.execute({
  userId: "user-id",
  page: 1,
  pageSize: 10,
});

// result.transactions, result.total, result.totalPages
```

### 4️⃣ UpdateTransactionUseCase
Atualiza uma transação.

```typescript
const useCase = new UpdateTransactionUseCase(repository);
const updated = await useCase.execute("tx-id", "user-id", newTransaction);
```

### 5️⃣ DeleteTransactionUseCase
Remove uma transação.

```typescript
const useCase = new DeleteTransactionUseCase(repository);
await useCase.execute("tx-id", "user-id");
```

## Value Objects

### Money

```typescript
const price = Money.fromDecimal(99.99);
const discount = Money.fromDecimal(10);

const final = price.minus(discount);  // 89.99
const doubled = price.multiply(2);    // 199.98

console.log(final.toDecimal());        // 89.99
```

## Implementar seu Repositório

```typescript
import { TransactionRepository } from "@repo/core/application";
import { Transaction } from "@repo/core/domain";

export class MyRepository implements TransactionRepository {
  async getAll(userId: string): Promise<Transaction[]> {
    // Buscar do seu banco
    return db.query("SELECT * FROM transactions WHERE user_id = $1", [userId]);
  }

  async create(userId: string, tx: Transaction): Promise<Transaction> {
    // Persistir no banco
    return db.query("INSERT INTO transactions (...) VALUES (...) RETURNING *");
  }

  // ... implemente os outros métodos
}
```

## Testes

```typescript
import { InMemoryTransactionRepository } from "@repo/core/testing";
import { Transaction, Money } from "@repo/core/domain";

describe("meu teste", () => {
  it("deve criar transação", async () => {
    const repo = new InMemoryTransactionRepository();
    const useCase = new CreateTransactionUseCase(repo);

    const tx = Transaction.create({...});
    const result = await useCase.execute("user", tx);

    expect(result.id).toBeDefined();
  });
});
```

## Erros

```typescript
import { ValidationError, NotFoundError } from "@repo/core/domain";

try {
  Transaction.create({ amount: Money.zero() }); // ❌ Erro!
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validação falhou!");
  }
}

try {
  await deleteUseCase.execute("999", "user");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Transação não existe!");
  }
}
```

## Categorias Disponíveis

```typescript
import { CATEGORIES } from "@repo/core/domain";

CATEGORIES.forEach(cat => {
  console.log(cat.value);  // "pix", "conta", "salario", etc.
  console.log(cat.label);  // "PIX", "Conta", "Salário", etc.
});
```

---

**Pronto! Você está usando a camada de negócio reutilizável! 🎉**

Veja [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) para exemplos mais detalhados.
