# Estrutura do @repo/core

```
packages/core/
├── src/
│   ├── index.ts                         # Exporta domain + application + factories
│   ├── domain/                          # Regras de negócio, sem dependências externas
│   │   ├── index.ts
│   │   ├── errors.ts                    # DomainError, ValidationError, NotFoundError, InsufficientFundsError
│   │   ├── money.ts                     # Value object Money (decimal.js)
│   │   ├── month.ts                     # Value object Month (dd/mm/aaaa → nome do mês)
│   │   ├── transaction.ts               # Entidade Transaction
│   │   └── category.ts                  # CATEGORIES
│   ├── application/                     # Casos de uso + portas
│   │   ├── index.ts
│   │   ├── ports/
│   │   │   ├── index.ts
│   │   │   ├── transaction-repository.ts  # Interface TransactionRepository
│   │   │   └── paginated.ts               # Tipo Paginated<T>
│   │   └── use-cases/
│   │       ├── index.ts
│   │       ├── create-transaction.ts
│   │       ├── update-transaction.ts
│   │       ├── delete-transaction.ts
│   │       ├── list-transactions.ts       # Paginado (+ DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
│   │       ├── list-all-transactions.ts   # Sem paginação
│   │       ├── last-5-transaction.ts      # 5 mais recentes
│   │       └── get-balance.ts
│   ├── infra/                           # Adaptadores (não exportados diretamente)
│   │   ├── adapters/
│   │   │   └── TransactionHttpRepository.ts  # Implementa a porta via API /api/transacoes
│   │   ├── http/
│   │   │   ├── HttpClient.ts               # Classe abstrata HttpClient + HttpError
│   │   │   ├── FetchHttpClient.ts          # Implementação com fetch
│   │   │   └── dtos/transaction-dto.ts     # Formato trafegado pela API
│   │   └── mappers/
│   │       └── transaction.mapper.ts       # DTO ⇄ entidade
│   └── main/
│       └── factories.ts                 # Composição: instâncias prontas dos casos de uso
├── package.json                         # exports: "." → src/index.ts
└── tsconfig.json
```

## Camadas e dependências

```
┌────────────────────────────────────────────┐
│ apps (componentes client)                  │  importam as instâncias de main/factories
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│ main/factories                             │  liga use cases ao TransactionHttpRepository
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│ application (use cases + portas)           │  depende só do domain e da interface
└────────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────┐
│ domain (Transaction, Money, Month, erros)  │  sem dependências de infra
└────────────────────────────────────────────┘

infra/ implementa application/ports e é usada apenas por main/
```

Fluxo de uma criação:

```
TransactionForm
  → Transaction.create(...)                    (valida no domínio)
  → createTransactionUseCase.execute(tx)
  → TransactionHttpRepository.create(tx)
  → TransactionMapper.toDto(tx)                ({ ..., amount: "+ R$ 1.234,56" })
  → FetchHttpClient.post("/api/transacoes")
  → rota do apps/web (Postgres)
  → TransactionMapper.toDomain(resposta)       (Transaction com Money)
```

## Exportações de `@repo/core`

- **Domain:** `Transaction`, `TransactionType`, `TransactionProps`, `TRANSACTION_TYPES`, `Money`, `Month`, `MONTH_NAMES`, `MonthName`, `CATEGORIES`, `Category`, `DomainError`, `ValidationError`, `NotFoundError`, `InsufficientFundsError`
- **Application:** `TransactionRepository`, `Paginated` (tipos), `CreateTransactionUseCase`, `UpdateTransactionUseCase`, `DeleteTransactionUseCase`, `ListTransactionsUseCase`, `ListAllTransactionsUseCase`, `Last5TransactionsUseCase`, `GetBalanceUseCase`, `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`
- **Factories:** `listTransactionsUseCase`, `listAllTransactionsUseCase`, `listLast5TransactionsUseCase`, `getBalanceUseCase`, `createTransactionUseCase`, `updateTransactionUseCase`, `deleteTransactionUseCase`
- **Infra:** `HttpError` (para tratar respostas não-OK da API)

`TransactionHttpRepository`, `FetchHttpClient` e `TransactionMapper` não são exportados — o acesso a eles é pelas factories.
