# mfe-next — MFE do domínio Dashboard

Micro-frontend independente responsável pelo domínio de **Dashboard / Home**. Exibe o widget de boas-vindas e resumo da conta usando o componente `HomeWidget` do pacote `@repo/shared-components`.

Integrado ao shell via [single-spa](https://single-spa.js.org/). Ativo na rota `/mfe-next`.

## Stack

- React 18.2.0
- esbuild (bundler)
- single-spa-react
- `@repo/shared-components` (componente compartilhado)

## Estrutura

```
mfe-next/
├── src/
│   ├── index.tsx            # Ponto de entrada — exporta bootstrap, mount, unmount
│   └── shared-components.d.ts  # Declaração de tipos para o pacote compartilhado
├── dist/                    # Bundle gerado pelo build (não versionado)
├── build.js                 # Config do esbuild
├── cors-server.js           # Servidor local com CORS para dev cross-origin
├── deploy-to-shell.js       # Copia o bundle para apps/shell/vendor/
└── package.json
```

## Comandos

```bash
# Build do bundle
npm run build

# Build em modo watch + servidor CORS para dev
npm run dev

# Copiar bundle gerado para o shell
npm run deploy

# Apenas o servidor CORS (sem watch)
npm run start:cors
```

## Ciclo de vida (single-spa)

O `src/index.tsx` exporta as três funções obrigatórias do contrato single-spa:

```ts
bootstrap(props) // chamado uma vez antes do primeiro mount
mount(props)     // cria o elemento DOM e renderiza o React
unmount(props)   // desmonta o React e remove o elemento do DOM
```

As mesmas funções são expostas em `globalThis.mfeNext` para que o shell possa carregá-las via `<script>` clássico sem SystemJS.

## Build

O esbuild gera um bundle **IIFE** em `dist/mfe-next.js` com React incluído internamente. O arquivo é autocontido e não depende de nenhuma variável global do shell.

```bash
npm run build
# → dist/mfe-next.js
# → dist/mfe-next.js.map
```

## Deploy para o shell

```bash
npm run deploy
# Copia dist/mfe-next.js → apps/shell/vendor/mfe-next.js
```

## Componente compartilhado

O MFE usa `HomeWidget` de `packages/shared-components/src/index.tsx` via importação direta do source (sem build separado do pacote):

```ts
import HomeWidget from '../../../packages/shared-components/src/index.tsx'
```

O `HomeWidget` também pode ser usado pelo app `apps/web` para exibir o mesmo widget nas páginas Next.js, garantindo consistência visual entre o ambiente MFE e o app principal.
