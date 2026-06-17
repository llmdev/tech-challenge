# Tech Challenge — Design System & Micro-Frontends

Monorepo de uma aplicação financeira desenvolvida como exercício de pós-graduação em front-end. Aplica conceitos de **design system compartilhado** e **micro-frontends por domínio** com single-spa.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | ^15.3.1 | App web principal (App Router) |
| React | ^19.1.0 | UI do app web |
| React | 18.2.0 | UI dos MFEs (compatibilidade single-spa) |
| TypeScript | ^5.4.5 | Tipagem estática (strict mode) |
| Tailwind CSS | ^3.4.14 | Estilização via tokens de tema |
| Storybook | 8 + Vite | Documentação e testes visuais |
| pnpm workspaces | — | Gerenciamento do monorepo |
| single-spa | ^5.10.4 | Orquestração de micro-frontends |
| esbuild | ^0.18.0 | Build dos bundles MFE |
| better-auth | ^1.6.14 | Autenticação com PostgreSQL |
| Radix UI | — | Primitivos acessíveis (Dialog, Select) |
| class-variance-authority | — | Variantes de componentes |
| @number-flow/react | ^0.6.0 | Animação de valores numéricos |
| Biome | ^2.4.12 | Lint e formatação |

## Estrutura do projeto

```
tech-challenge/
├── apps/
│   ├── web/              # Next.js 15 — host principal (auth + páginas protegidas)
│   ├── shell/            # Orquestrador single-spa dos micro-frontends
│   ├── mfe-next/         # MFE: domínio Dashboard / Home
│   ├── mfe-transactions/ # MFE: domínio Transações
│   └── storybook/        # Storybook 8 + Vite
├── packages/
│   ├── @repo/theme           # Plugin Tailwind com tokens de tema (light/dark)
│   ├── @repo/button          # Button (6 variantes, CVA)
│   ├── @repo/input           # Input com label e variantes
│   ├── @repo/select          # Select (Radix)
│   ├── @repo/modal           # Modal (Radix Dialog)
│   ├── @repo/navbar          # Navbar com nome do usuário
│   ├── @repo/sidebar         # Sidebar de navegação
│   ├── @repo/balance-card    # Card de saldo animado (NumberFlow)
│   ├── @repo/statement       # Lista de transações
│   ├── @repo/icons           # Ícones SVG (factory createIcon)
│   └── @repo/shared-components # Componentes compartilhados entre MFEs
├── docker-compose.yaml   # PostgreSQL 17 na porta 5433
├── biome.json
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Pré-requisitos

- Node.js >= 18
- pnpm >= 9
- Docker (para o PostgreSQL)

```bash
npm install -g pnpm
```

## Configuração inicial

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Subir o banco de dados

```bash
docker compose up -d
```

O PostgreSQL sobe na porta **5433** (mapeado para 5432 dentro do container).

### 3. Variáveis de ambiente

Crie o arquivo `apps/web/.env.local`:

```env
BETTER_AUTH_SECRET=<gere com: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/techchallenge
```

### 4. Rodar a migration do banco

```bash
cd apps/web
npx auth@latest migrate
```

Isso cria as tabelas `user`, `session`, `account` e `verification` usadas pelo better-auth. Deve ser executado **uma única vez** por ambiente.

## Comandos

Execute sempre a partir da raiz do repositório.

| Comando | Descrição |
|---|---|
| `pnpm web` | Apenas Next.js (`localhost:3000`) |
| `pnpm dev` | Next.js + Storybook em paralelo |
| `pnpm storybook` | Apenas Storybook (`localhost:6006`) |
| `pnpm build` | Build completo (packages → apps) |
| `pnpm lint` | Lint + auto-fix com Biome |
| `pnpm lint:check` | Lint sem auto-fix |
| `pnpm format` | Formatação com Biome |
| `pnpm typecheck:projects` | TypeScript strict em todos os workspaces |

## Arquitetura de Micro-Frontends

O projeto implementa o padrão **micro-frontend por domínio** com [single-spa](https://single-spa.js.org/). Cada domínio de negócio é um artefato independente com seu próprio bundle, ciclo de build e deploy.

### Diagrama geral

```
┌────────────────────────────────────────────┐
│                apps/shell                  │
│       (orquestrador — HTML + single-spa)   │
│                                            │
│  /mfe-next        →  vendor/mfe-next.js    │  ← domínio Dashboard
│  /mfe-transacoes  →  vendor/mfe-           │
│                       transactions.js      │  ← domínio Transações
└────────────────────────────────────────────┘

         apps/web (Next.js)
  → autenticação, layout, páginas protegidas
```

O shell monitora a URL e chama `mount()` / `unmount()` de cada MFE conforme a rota muda. Os bundles são carregados **lazily** na primeira ativação e cacheados pelo browser nas navegações seguintes.

### Domínios registrados

| MFE | Pasta | Rota ativa | Responsabilidade |
|-----|-------|------------|-----------------|
| `mfe-next` | `apps/mfe-next/` | `/mfe-next` | Dashboard, widget de saldo e resumo |
| `mfe-transactions` | `apps/mfe-transactions/` | `/mfe-transacoes` | Extrato e histórico de transações |

### Contrato de ciclo de vida (single-spa)

Cada MFE exporta exatamente três funções:

```ts
export function bootstrap(props) { /* inicialização única — chamada uma vez */ }
export function mount(props)     { /* renderiza o componente React no DOM */ }
export function unmount(props)   { /* desmonta e remove o elemento do DOM */ }
```

Essas funções também são expostas em `globalThis` para que o shell consiga carregá-las via `<script>` clássico:

```ts
globalThis.mfeTransactions = { bootstrap, mount, unmount }
```

### Build e deploy dos MFEs

Cada MFE usa esbuild para gerar um bundle **IIFE autocontido** (inclui React internamente):

```bash
# MFE Dashboard
cd apps/mfe-next
npm run build    # gera dist/mfe-next.js
npm run deploy   # copia para apps/shell/vendor/mfe-next.js

# MFE Transações
cd apps/mfe-transactions
npm run build    # gera dist/mfe-transactions.js
npm run deploy   # copia para apps/shell/vendor/mfe-transactions.js
```

Os bundles em `apps/shell/vendor/` são servidos pelo shell. Em produção, cada bundle pode ser publicado independentemente em um CDN sem coordenação entre times.

### Rodando o shell

```bash
cd apps/shell
npx serve .
# Navegue para /mfe-next (Dashboard) ou /mfe-transacoes (Transações)
```

### Componentes compartilhados entre MFEs

O pacote `packages/@repo/shared-components` exporta componentes que podem ser usados por mais de um MFE. Os MFEs importam diretamente do source TypeScript — não há etapa de build separada para este pacote.

## Autenticação

O app `apps/web` usa [better-auth](https://better-auth.com/) com PostgreSQL.

| Aspecto | Detalhe |
|---------|---------|
| Handler da API | `GET/POST /api/auth/[...all]` (automático via `toNextJsHandler`) |
| Middleware | Protege todas as rotas exceto `/login`, `/api/*` e assets do Next.js |
| Verificação | `getSessionCookie()` no edge — sem query ao banco no middleware |
| Sessão | Cookie httpOnly gerado pelo better-auth após login bem-sucedido |

Fluxo de autenticação:

```
Usuário sem sessão → redireciona /login
  → POST /api/auth/sign-in  (login)
  → POST /api/auth/sign-up  (cadastro)
  → cookie de sessão criado
  → redirecionado para /
```

## Aplicação Web (`apps/web`)

### Rotas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/login` | Pública | Login e cadastro de conta |
| `/` | Protegida | Saldo da conta + formulário de nova transação |
| `/transacoes` | Protegida | Lista completa com busca, filtro e edição |
| `/mfe-next` | Protegida | Página que incorpora o MFE de Dashboard |

### API Routes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET/POST` | `/api/auth/[...all]` | Handler do better-auth |
| `GET` | `/api/saldo` | Saldo calculado |
| `GET/POST` | `/api/transacoes` | Listar / criar transações |
| `PUT/DELETE` | `/api/transacoes/:id` | Editar / excluir transação |

## Design System (`packages/`)

Todos os pacotes em `packages/@repo/*` exportam source `.tsx` diretamente — sem etapa de build. O Next.js os transpila via `transpilePackages` no `next.config.ts`.

| Pacote | Descrição |
|--------|-----------|
| `@repo/theme` | Plugin Tailwind com tokens HSL (light + dark) |
| `@repo/icons` | Ícones SVG via factory `createIcon` |
| `@repo/button` | Button com variantes: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` |
| `@repo/input` | Input com label, variantes e tamanhos |
| `@repo/select` | Select acessível (Radix UI) |
| `@repo/modal` | Modal (Radix Dialog) |
| `@repo/navbar` | Navbar com nome do usuário logado |
| `@repo/sidebar` | Sidebar de navegação com itens ativos |
| `@repo/balance-card` | Card de saldo com animação numérica (NumberFlow) |
| `@repo/statement` | Lista de transações agrupadas por mês |

### Tema

O `@repo/theme` define dois conjuntos de variáveis CSS HSL:

- **`defaultThemeVars`** — tema claro (paleta teal/verde-sálvia)
- **`darkThemeVars`** — tema escuro (injetado via classe `.dark` no `<html>`)

Tokens disponíveis como classes Tailwind: `bg-background`, `text-primary`, `bg-card`, `text-accent`, `text-destructive`, `border-border`, entre outros. Nunca use valores hex/hsl fixos nos componentes.

## Padrões de código

### Componentes

- Um componente por pacote, toda a lógica em `src/index.tsx` — sem subpastas
- Sempre aceitar `className` e mesclá-la com `cn()` (clsx + tailwind-merge)
- Usar `React.forwardRef` quando o componente renderizar um elemento do DOM
- Novos ícones: usar a factory `createIcon` em `@repo/icons`, nunca inline SVG

### TypeScript

- Strict mode ativado — sem `any` ou `@ts-ignore` sem comentário explicando o motivo
- Interfaces explícitas para todas as props de componentes
- PascalCase para componentes e interfaces, camelCase para props e variáveis

## Storybook

Stories em `apps/storybook/src/stories/`. Todo componente novo em `packages/` requer uma story correspondente cobrindo todas as variantes e estados relevantes.

```bash
pnpm storybook   # localhost:6006
```
