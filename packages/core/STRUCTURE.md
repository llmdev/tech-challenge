@repo/core
├── src/
│   ├── index.ts                          # Exporta domain + application
│   ├── domain/
│   │   ├── index.ts                      # Exporta todas as entidades
│   │   ├── errors.ts                     # DomainError, ValidationError, NotFoundError
│   │   ├── money.ts                      # Value object para operações monetárias
│   │   ├── transaction.ts                # Entidade Transaction
│   │   └── category.ts                   # Categorias permitidas
│   ├── application/
│   │   ├── index.ts                      # Exporta portas + casos de uso
│   │   ├── ports/
│   │   │   ├── index.ts
│   │   │   └── transaction-repository.ts # Interface do repositório
│   │   └── use-cases/
│   │       ├── index.ts                  # Exporta todos os casos
│   │       ├── create-transaction.ts
│   │       ├── get-balance.ts
│   │       ├── list-transactions.ts
│   │       ├── update-transaction.ts
│   │       └── delete-transaction.ts
│   └── testing/
│       ├── index.ts
│       └── in-memory-transaction-repository.ts # Repositório para testes
├── package.json
├── tsconfig.json
├── README.md                             # Documentação principal
└── EXAMPLE.md                            # Exemplos de uso

## Exportações

### @repo/core/domain
- Transaction, TransactionType, TransactionProps
- Money
- ValidationError, NotFoundError, DomainError, InsufficientFundsError
- CATEGORIES, Category

### @repo/core/application
- TransactionRepository (interface)
- CreateTransactionUseCase
- GetBalanceUseCase
- ListTransactionsUseCase
- UpdateTransactionUseCase
- DeleteTransactionUseCase
- DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE

### @repo/core/testing
- InMemoryTransactionRepository

## Arquitetura

```
┌─────────────────────────────────────────┐
│          Componentes (React)            │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      @repo/adapters (HTTP, DTO)        │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    @repo/core (Use Cases & Ports)      │
│  CreateTransactionUseCase               │
│  TransactionRepository (interface)      │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Implementações (BD, API)            │
│  PgTransactionRepository                │
│  HttpTransactionRepository              │
└─────────────────────────────────────────┘
```

## Princípios

✅ **Domain-Driven Design** — Entidades e value objects com lógica de negócio
✅ **Clean Architecture** — Domínio isolado de detalhes de infra
✅ **Portas & Adaptadores** — Casos de uso dependem de interfaces
✅ **Testabilidade** — Implementação em memória para testes
✅ **Precisão Monetária** — Money usa Decimal.js
✅ **Imutabilidade** — Value objects são imutáveis
