# Resumo do pacote @repo/core

## O que é

Camada de negócio das transações, compartilhada pelas apps `apps/web` e `apps/transacoes`, organizada em Clean Architecture (portas e adaptadores):

- **domain** — `Transaction`, `Money`, `Month`, erros de domínio, `CATEGORIES`
- **application** — porta `TransactionRepository` e os casos de uso
- **infra** — `TransactionHttpRepository` (consome `/api/transacoes`), `FetchHttpClient`, mapper DTO ⇄ entidade
- **main** — factories com as instâncias prontas usadas pelos componentes

Detalhes em [README.md](./README.md) e [STRUCTURE.md](./STRUCTURE.md).

## Estado atual

- Os componentes das apps não fazem `fetch` para transações; usam as factories:
  `listTransactionsUseCase`, `listAllTransactionsUseCase`, `listLast5TransactionsUseCase`, `getBalanceUseCase`, `createTransactionUseCase`, `updateTransactionUseCase`, `deleteTransactionUseCase`.
- As rotas de API do `apps/web` continuam com o repositório Postgres próprio (`apps/web/src/app/api/_lib`); o core no client conversa com elas por HTTP.
- `TransactionHttpRepository.findById` ainda não está implementado (não há rota `GET /api/transacoes/:id`).
- Não há test runner configurado nem repositório em memória no pacote.

## Histórico de mudanças

### Refactor: apps passam a usar casos de uso

- A porta `TransactionRepository` e todos os casos de uso deixaram de receber `userId` — a API identifica o usuário pela sessão.
- `UpdateTransactionUseCase` e `DeleteTransactionUseCase` lançam `NotFoundError` quando a API responde 404.
- Novos casos de uso: `Last5TransactionsUseCase`, `ListAllTransactionsUseCase`.
- `TransactionHttpRepository` passou a implementar `getAll`, `create`, `update` e `remove`.
- `FetchHttpClient`: URL base corrigida, `Content-Type: application/json` em POST/PUT, `HttpError` em respostas não-OK, suporte a respostas sem corpo (204).
- `TransactionMapper.toDomain` converte o valor da API (`"+ R$ 1.234,56"`) em `Money`; `toDto` faz o caminho inverso.
- `Money.fromDecimal` lança `ValidationError` para entrada não numérica; novo `Money.format()`.
- Tipo `Paginated<T>` exportado para quem implementar a porta.
- `ListTransactionsUseCase` devolve `totalPages ≥ 1`, como a API.

### Criação

- Pacote criado com domain (`Transaction`, `Money`, `Month`, erros, categorias) e application (porta + casos de uso de criar, listar, atualizar, excluir e saldo).
