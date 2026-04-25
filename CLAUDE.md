# Tech Challenge — Design System

Monorepo com uma biblioteca de componentes compartilhada (`packages/`) e dois apps (`apps/web`, `apps/storybook`).

## Comandos

```bash
pnpm dev          # web + storybook em paralelo
pnpm web          # Next.js dev (localhost:3000)
pnpm storybook    # Storybook (localhost:6006)
pnpm build        # packages primeiro, depois apps
pnpm lint         # tsc + next lint em todos os workspaces
```

Sempre execute os comandos pnpm a partir da raiz do repositório.

## Arquitetura

- `packages/@repo/*` — componentes presentacionais, sem etapa de build (source `.tsx` exportado diretamente)
- `packages/theme` — plugin Tailwind com tokens de tema (`defaultThemePlugin`, `defaultTheme`, `defaultThemeVars`, `darkThemeVars`)
- `apps/web` — app Next.js 15, transpila todos os pacotes `@repo/*` via `next.config.ts`
- `apps/storybook` — Storybook 8 + Vite, stories em `src/stories/`

## Padrões de Código

**Componentes**
- Um componente por pacote, toda a lógica em `src/index.tsx` — sem subpastas
- Estender `React.HTMLAttributes` quando o componente mapear para um único elemento HTML
- Sempre aceitar a prop `className` e mesclá-la com `cn()` (clsx + tailwind-merge)
- Usar `React.forwardRef` quando o componente renderizar um elemento do DOM


**Estilização**
- Somente Tailwind CSS — sem CSS modules ou estilos inline
- Tokens de tema centralizados em `@repo/theme` (`packages/theme/src/index.ts`):
  - `defaultThemePlugin` — plugin Tailwind que injeta as variáveis CSS em `:root` (light) e `.dark`
  - `defaultTheme` — extensão de cores/borderRadius para o `tailwind.config` consumir via `hsl(var(--token))`
  - `defaultThemeVars` / `darkThemeVars` — os valores HSL crus das variáveis, caso precisem ser reutilizados
- Usar sempre os tokens semânticos do tema via classes Tailwind (`bg-background`, `text-primary`, `border-border`, etc.) — nunca valores hex/hsl fixos nem variáveis CSS raw diretamente nos componentes
- Dark mode: controlado pela classe `.dark` no `<html>`, gerenciada pela aplicação — os componentes não precisam de lógica própria de tema
- Mesclar classes com o padrão `cn(clsx(...), twMerge(...))` — já configurado em todos os componentes
- Variantes via `class-variance-authority` (CVA) quando o componente tiver múltiplas variações visuais

**TypeScript**
- Strict mode ativado — sem `any`, sem `@ts-ignore` sem um comentário explicando o motivo
- Interfaces explícitas para todas as props de componentes
- PascalCase para componentes e interfaces, camelCase para props e variáveis

**Ícones**
- Adicionar novos ícones em `@repo/icons` usando a factory `createIcon` — nunca inline SVG em outros pacotes

**Storybook**
- Todo novo componente em `packages/` precisa de uma story correspondente em `apps/storybook/src/stories/`
- As stories devem cobrir todas as combinações de props relevantes (variantes, estados, casos extremos)

## Sem Testes por Enquanto

Não há test runner configurado. Testes visuais são feitos pelo Storybook. Antes de adicionar testes, configurar Vitest + `@testing-library/react` no workspace raiz.
