# Tech Challenge — Design System Monorepo

Monorepo de design system e aplicação web financeira construído com Next.js 15, React 19 e componentes compartilhados via pnpm workspaces.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | ^15.3.1 | App web principal |
| React | ^19.1.0 | UI |
| TypeScript | ^5.4.5 | Tipagem estática |
| Tailwind CSS | ^3.4.14 | Estilização |
| Storybook | React + Vite | Documentação de componentes |
| pnpm | — | Gerenciador de pacotes + workspaces |
| shadcn/ui (CVA) | — | Primitivos de componentes |

## Estrutura do projeto

```
tech-challenge/
├── apps/
│   ├── web/          # Aplicação Next.js
│   └── storybook/    # Documentação de componentes
├── packages/
│   ├── button/       # Componente Button
│   ├── navbar/       # Componente Navbar
│   ├── sidebar/      # Componente Sidebar
│   ├── balance-card/ # Componente BalanceCard
│   ├── transaction-form/ # Componente TransactionForm
│   ├── statement/    # Componente Statement
│   └── icons/        # Ícones compartilhados
├── package.json      # Scripts raiz
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Pré-requisitos

- Node.js >= 18
- pnpm >= 9

```bash
npm install -g pnpm
```

## Instalação

```bash
pnpm install
```

## Rodando localmente

### Aplicação web (Next.js)

```bash
pnpm web
# ou
pnpm --filter=web dev
```

Acesse: http://localhost:3000

### Storybook

```bash
pnpm storybook
# ou
pnpm --filter=storybook dev
```

### Todos os apps em paralelo

```bash
pnpm dev
```

## Build

```bash
# Build completo (packages → apps)
pnpm build
```

Os pacotes são compilados antes dos apps para garantir que as dependências locais estejam disponíveis.

## Pacotes (`packages/`)

Cada pacote é publicado com o escopo `@repo/*` e consumido pelo app web:

| Pacote | Exportação principal |
|---|---|
| `@repo/button` | `<Button>` com variantes CVA |
| `@repo/navbar` | `<Navbar>` com nome do usuário |
| `@repo/sidebar` | `<Sidebar>` de navegação |
| `@repo/balance-card` | `<BalanceCard>` com saldo da conta |
| `@repo/transaction-form` | `<TransactionForm>` para transações |
| `@repo/statement` | `<Statement>` de extrato |
| `@repo/icons` | Ícones SVG como componentes React |

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Roda todos os apps em paralelo |
| `pnpm web` | Roda apenas o app Next.js |
| `pnpm storybook` | Roda apenas o Storybook |
| `pnpm build` | Build completo do monorepo |
| `pnpm lint` | Lint em todos os pacotes |
