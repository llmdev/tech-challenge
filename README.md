# Tech Challenge — Design System Monorepo

Monorepo com design system de componentes compartilhados e aplicação web financeira. Construído com Next.js 15, React 19, Tailwind CSS e pnpm workspaces.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | ^15.3.1 | App web principal (App Router) |
| React | ^19.1.0 | UI |
| TypeScript | ^5.4.5 | Tipagem estática (strict mode) |
| Tailwind CSS | ^3.4.14 | Estilização via tokens de tema |
| Storybook | 8 + Vite | Documentação e testes visuais |
| pnpm workspaces | — | Gerenciamento do monorepo |
| Radix UI | — | Primitivos acessíveis (Dialog, Select) |
| class-variance-authority | — | Variantes de componentes |
| MSW | ^2.13.4 | Mock de API no browser |
| @number-flow/react | ^0.6.0 | Animação de valores numéricos |
| Biome | ^2.4.12 | Lint e formatação |
| @vercel/microfrontends | — | Proxy de roteamento multi-zone (desenvolvimento) |

## Estrutura do projeto

```
tech-challenge/
├── apps/
│   ├── web/                        # App host — zona principal (porta 3000)
│   │   ├── microfrontends.json     # Declaração de rotas entre zonas
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx        # Rota / (home)
│   │       │   └── components/     # Componentes de página (home)
│   │       ├── components/         # Componentes globais (ThemeToggle)
│   │       └── mocks/              # MSW handlers e tipos
│   ├── transacoes/                 # Microfrontend de transações (porta 3005)
│   │   └── src/app/transacoes/    # Rotas /transacoes e /transacoes/:path*
│   └── storybook/                  # Storybook 8 + Vite
│       └── src/stories/            # Stories de todos os pacotes
├── packages/
│   ├── balance-card/               # @repo/balance-card
│   ├── button/                     # @repo/button
│   ├── icons/                      # @repo/icons
│   ├── input/                      # @repo/input
│   ├── modal/                      # @repo/modal
│   ├── navbar/                     # @repo/navbar
│   ├── select/                     # @repo/select
│   ├── sidebar/                    # @repo/sidebar
│   ├── statement/                  # @repo/statement
│   └── theme/                      # @repo/theme
├── biome.json
├── package.json
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

## Rodando em desenvolvimento

O ambiente de desenvolvimento requer dois processos rodando em paralelo. Execute sempre a partir da raiz do repositório.

**Terminal 1 — inicia os apps Next.js:**

```bash
pnpm dev
```

**Terminal 2 — inicia o proxy de roteamento entre as zonas:**

```bash
pnpm proxy
```

Acesse a aplicação em `http://localhost:3010`. Sem o proxy, a navegação entre zonas não funciona (ex.: acessar `/transacoes` a partir do app `web`).

## Comandos

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia `apps/web` (porta 3000) e `apps/transacoes` (porta 3005) em paralelo |
| `pnpm proxy` | Inicia o proxy de microfrontends na porta 3010 — necessário para roteamento entre zonas |
| `pnpm storybook` | Apenas Storybook (localhost:6006) |
| `pnpm build` | Build completo (packages → apps) |
| `pnpm lint` | Lint + auto-fix com Biome |
| `pnpm lint:check` | Lint sem auto-fix |
| `pnpm format` | Formatação com Biome |

## Microfrontends (Next.js Multi Zones)

O projeto usa a estratégia de **Multi Zones** do Next.js: cada app é uma instância Next.js independente e um proxy unifica todas as rotas em um único endereço durante o desenvolvimento.

```
Usuário → proxy (:3010)
              ├── /                  → apps/web        (:3000)
              └── /transacoes/**     → apps/transacoes  (:3005)
```

O roteamento entre zonas é declarado em `apps/web/microfrontends.json` e consumido pelo `withMicrofrontends()` presente no `next.config.ts` de cada app. Em produção na Vercel, o proxy é substituído pela infraestrutura nativa de Multi Zones da plataforma.

## Pacotes

Todos os pacotes ficam em `packages/@repo/*`, não possuem etapa de build e exportam o source `.tsx` diretamente. O app `web` os transpila via `transpilePackages` no `next.config.ts`.

| Pacote | Componentes exportados | Dependências principais |
|---|---|---|
| `@repo/theme` | `defaultThemePlugin`, `defaultTheme`, `defaultThemeVars`, `darkThemeVars` | tailwindcss |
| `@repo/icons` | `createIcon` + ícones SVG (User, Eye, Pencil, Trash, Search, Plus, Chevrons…) | — |
| `@repo/button` | `<Button>` — variantes: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` | Radix Slot, CVA |
| `@repo/input` | `<Input>` com `label`, variantes `default`, `outline`, `ghost` e tamanhos `sm`, `default`, `lg` | CVA |
| `@repo/select` | `<Select>` + primitivos Radix exportados individualmente | Radix Select, `@repo/icons` |
| `@repo/modal` | `<Modal>` baseado em Radix Dialog | Radix Dialog |
| `@repo/navbar` | `<Navbar>` com nome do usuário e slot de ações | `@repo/icons` |
| `@repo/sidebar` | `<Sidebar>` de navegação com itens ativos | — |
| `@repo/balance-card` | `<BalanceCard>` com saldo animado via `balanceValue` (NumberFlow) | `@repo/icons` |
| `@repo/statement` | `<Statement>` + `<TransactionItem>` para extrato | — |

### Tema

O `@repo/theme` define dois conjuntos de variáveis CSS HSL:

- **`defaultThemeVars`** — tema claro (paleta teal/verde-sálvia)
- **`darkThemeVars`** — tema escuro (injetado via classe `.dark` no `<html>`)

Tokens disponíveis como classes Tailwind: `bg-background`, `text-primary`, `bg-card`, `text-accent`, `text-destructive`, `border-border`, entre outros.

## Aplicação Web

### Rotas

| Rota | App | Componente principal | Descrição |
|---|---|---|---|
| `/` | `apps/web` | `HomeContent` | Saldo da conta + formulário de nova transação |
| `/transacoes` | `apps/transacoes` | `TransacoesContent` | Lista completa com busca, filtro e edição |

### Mock API (MSW)

Handlers em `apps/web/src/mocks/handlers.ts`. Dados persistidos no `localStorage`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/saldo` | Saldo calculado de todas as transações |
| `GET` | `/api/transacoes` | Transações agrupadas por mês (desc por ID) |
| `POST` | `/api/transacoes` | Criar nova transação |
| `PUT` | `/api/transacoes/:id` | Editar transação existente |
| `DELETE` | `/api/transacoes/:id` | Excluir transação |

## Padrões de código

### Componentes

- Um componente por pacote, toda a lógica em `src/index.tsx` — sem subpastas
- Sempre aceitar `className` e mesclá-la com `cn()` (clsx + tailwind-merge)
- Usar `React.forwardRef` quando o componente renderizar um elemento do DOM
- Novos ícones: usar a factory `createIcon` em `@repo/icons`, nunca inline SVG

### Estilização

- Somente Tailwind CSS com os tokens semânticos do `@repo/theme`
- Nunca valores hex/hsl fixos nos componentes
- Variantes via CVA quando houver múltiplas variações visuais
- Dark mode: classe `.dark` no `<html>`, sem lógica de tema nos componentes

### TypeScript

- Strict mode — sem `any` ou `@ts-ignore` sem comentário explicando o motivo
- Interfaces explícitas para todas as props de componentes
- PascalCase para componentes e interfaces, camelCase para props e variáveis

## Storybook

Stories em `apps/storybook/src/stories/`. Todo componente novo em `packages/` requer uma story correspondente cobrindo todas as variantes e estados relevantes.

```bash
pnpm storybook   # localhost:6006
```
