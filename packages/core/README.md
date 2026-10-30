# @repo/core

Camada de negócio (domain + application) da aplicação. Contém entidades, value objects, portas (interfaces) e casos de uso.

## Estrutura

### `/domain`

Entidades e value objects que concentram as regras de negócio:

- **`errors.ts`** — Exceções de domínio (`ValidationError`, `NotFoundError`, etc.)
- **`money.ts`** — Value object para operações monetárias sem erro de arredondamento
- **`transaction.ts`** — Entidade `Transaction` com invariantes de negócio
- **`category.ts`** — Categorias de transações permitidas

### `/application`

Casos de uso e portas (interfaces):

- **`ports/transaction-repository.ts`** — Interface `TransactionRepository` (contrato com persistência)
- **`use-cases/`** — Casos de uso:
  - `CreateTransactionUseCase`
  - `GetBalanceUseCase`
  - `ListTransactionsUseCase`
  - `UpdateTransactionUseCase`
  - `DeleteTransactionUseCase`

### `/testing`

Utilitários para testes:

- **`in-memory-transaction-repository.ts`** — Implementação em memória do repositório (sem banco)

## Uso

### Em outro app/package

```typescript
// Importar domínio
import { Transaction, Money, ValidationError } from "@repo/core/domain";

// Importar casos de uso
import { CreateTransactionUseCase, GetBalanceUseCase } from "@repo/core/application";

// Importar utilitários de teste
import { InMemoryTransactionRepository } from "@repo/core/testing";
```

### Exemplo: Criar uma transação

```typescript
const transaction = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário mensal",
  institution: "Banco Inter",
  date: new Date(),
  amount: Money.fromDecimal(5000),
});
```

## Dependências

- **`decimal.js`** — Precisão em operações monetárias

## Princípios

- ✅ **Clean Architecture** — Domínio isolado de infraestrutura
- ✅ **Injeção de Dependência** — Casos de uso recebem portas (interfaces)
- ✅ **Value Objects** — `Money` encapsula operações seguras
- ✅ **Entidades** — `Transaction` com identidade e invariantes
- ✅ **Testabilidade** — Fácil testar sem banco via `InMemoryTransactionRepository`
