# 📦 Pacote @repo/core - Criado com Sucesso!

## ✅ O que foi criado

Um novo pacote **`@repo/core`** em `packages/core` contendo a **camada principal de negócio** (domain + application) da aplicação, seguindo **Clean Architecture**.

## 📁 Estrutura

```
packages/core/
├── src/
│   ├── domain/
│   │   ├── errors.ts              — Exceções de domínio
│   │   ├── money.ts               — Value object para dinheiro (Decimal.js)
│   │   ├── transaction.ts         — Entidade Transaction
│   │   ├── category.ts            — Categorias de transações
│   │   └── index.ts               — Exportações
│   ├── application/
│   │   ├── ports/
│   │   │   └── transaction-repository.ts  — Interface do repositório
│   │   ├── use-cases/
│   │   │   ├── create-transaction.ts
│   │   │   ├── get-balance.ts
│   │   │   ├── list-transactions.ts
│   │   │   ├── update-transaction.ts
│   │   │   ├── delete-transaction.ts
│   │   │   └── index.ts            — Exportações
│   │   └── index.ts
│   └── testing/
│       └── in-memory-transaction-repository.ts  — Repositório para testes
├── package.json
├── tsconfig.json
├── README.md
├── EXAMPLE.md
└── STRUCTURE.md
```

## 🚀 Como Usar

### 1. Importar no seu app

```typescript
// Domain
import {
  Transaction,
  Money,
  ValidationError,
  type TransactionType,
  CATEGORIES,
} from "@repo/core/domain";

// Application
import {
  CreateTransactionUseCase,
  GetBalanceUseCase,
  type TransactionRepository,
} from "@repo/core/application";

// Testing
import { InMemoryTransactionRepository } from "@repo/core/testing";
```

### 2. Criar uma entidade

```typescript
const tx = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário",
  institution: "Banco Inter",
  date: new Date(),
  amount: Money.fromDecimal(5000),
});
```

### 3. Usar um caso de uso

```typescript
const repository = new MyRepository(); // sua implementação
const useCase = new CreateTransactionUseCase(repository);
const created = await useCase.execute("user-123", tx);
```

### 4. Implementar seu repositório

```typescript
import { TransactionRepository } from "@repo/core/application";
import type { Transaction } from "@repo/core/domain";

export class PgTransactionRepository implements TransactionRepository {
  async getAll(userId: string): Promise<Transaction[]> {
    // Buscar do Postgres
  }

  async create(userId: string, transaction: Transaction): Promise<Transaction> {
    // Inserir no Postgres
  }

  // ... outros métodos
}
```

## 📚 Conteúdo

### Domain Layer

| Arquivo | O que faz |
|---------|----------|
| `errors.ts` | DomainError, ValidationError, NotFoundError, InsufficientFundsError |
| `money.ts` | Value object para operações monetárias com Decimal.js |
| `transaction.ts` | Entidade Transaction com invariantes de negócio |
| `category.ts` | Categorias permitidas (PIX, Conta, Salário, etc.) |

### Application Layer

| Arquivo | O que faz |
|---------|----------|
| `ports/transaction-repository.ts` | Interface para persistência (banco/API) |
| `use-cases/create-transaction.ts` | Criar nova transação |
| `use-cases/get-balance.ts` | Calcular saldo (entradas - saídas) |
| `use-cases/list-transactions.ts` | Listar transações paginadas |
| `use-cases/update-transaction.ts` | Atualizar transação |
| `use-cases/delete-transaction.ts` | Remover transação |

### Testing Utilities

| Arquivo | O que faz |
|---------|----------|
| `testing/in-memory-transaction-repository.ts` | Repositório em memória para testes sem BD |

## 🎯 Princípios Aplicados

✅ **Clean Architecture** — Domínio isolado de frameworks e infraestrutura
✅ **Domain-Driven Design** — Entidades com lógica de negócio centralizada
✅ **Portas & Adaptadores** — Casos de uso dependem de interfaces
✅ **Injeção de Dependência** — Fácil trocar implementações
✅ **Testabilidade** — Repositório em memória para testes
✅ **Type Safety** — TypeScript strict mode
✅ **Precisão Monetária** — Money com Decimal.js

## 🔧 Dependências

- `decimal.js@10.6.0` — Operações monetárias sem erro de arredondamento

## 📖 Documentação

- **`README.md`** — Visão geral do pacote
- **`EXAMPLE.md`** — Exemplos de uso
- **`STRUCTURE.md`** — Estrutura detalhada
- **`INTEGRATION_GUIDE.md`** — Guia de integração com outros apps

## ✨ Próximos Passos

1. **Integrar com `apps/web`**
   ```json
   {
     "dependencies": {
       "@repo/core": "^0.0.1"
     }
   }
   ```

2. **Integrar com `apps/transacoes`**
   ```typescript
   import { CreateTransactionUseCase } from "@repo/core/application";
   ```

3. **Criar mais casos de uso conforme necessário**
   ```
   use-cases/
   ├── analyze-transactions.ts
   ├── export-statement.ts
   ├── categorize-transaction.ts
   └── ...
   ```

## ✅ Checklist

- ✅ Pacote criado em `packages/core/`
- ✅ Domain layer com entidades e value objects
- ✅ Application layer com casos de uso e portas
- ✅ Testing utilities com repositório em memória
- ✅ TypeScript validado (sem erros)
- ✅ package.json configurado com exports
- ✅ tsconfig.json configurado
- ✅ Documentação completa
- ✅ Pronto para ser usado em outros apps!

## 🎓 Exemplo de Uso Completo

```typescript
import {
  Transaction,
  Money,
  ValidationError,
} from "@repo/core/domain";
import {
  CreateTransactionUseCase,
  GetBalanceUseCase,
} from "@repo/core/application";
import { InMemoryTransactionRepository } from "@repo/core/testing";

// Setup
const repository = new InMemoryTransactionRepository();
const createUseCase = new CreateTransactionUseCase(repository);
const balanceUseCase = new GetBalanceUseCase(repository);

// Criar transações
const salary = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário",
  institution: "Banco Inter",
  date: new Date(),
  amount: Money.fromDecimal(5000),
});

const expense = Transaction.create({
  type: "debit",
  category: "compras",
  description: "Supermercado",
  institution: "Mercado X",
  date: new Date(),
  amount: Money.fromDecimal(250),
});

// Persistir
const created1 = await createUseCase.execute("user-123", salary);
const created2 = await createUseCase.execute("user-123", expense);

// Calcular saldo
const balance = await balanceUseCase.execute("user-123");
console.log(`Saldo: R$ ${balance.toDecimal()}`); // 4750
```

---

**Agora você tem uma camada de negócio reutilizável em todos os seus apps! 🎉**
