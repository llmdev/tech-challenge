# mfe-transactions — MFE do domínio Transações

Micro-frontend independente responsável pelo domínio de **Transações**. Exibe o extrato com histórico de lançamentos e saldo calculado.

Integrado ao shell via [single-spa](https://single-spa.js.org/). Ativo na rota `/mfe-transacoes`.

## Stack

- React 18.2.0
- esbuild (bundler)
- single-spa-react

> Usa React 18 (não 19) para manter compatibilidade com o protocolo single-spa e com outros MFEs que possam compartilhar a instância do React no futuro.

## Estrutura

```
mfe-transactions/
├── src/
│   ├── index.tsx            # Ponto de entrada — exporta bootstrap, mount, unmount
│   └── TransactionsWidget.tsx  # Componente do domínio de transações
├── dist/                    # Bundle gerado pelo build (não versionado)
├── build.js                 # Config do esbuild
├── deploy-to-shell.js       # Copia o bundle para apps/shell/vendor/
└── package.json
```

## Comandos

```bash
# Build do bundle
npm run build

# Build em modo watch (rebuild automático ao salvar)
npm run dev

# Copiar bundle gerado para o shell
npm run deploy
```

## Ciclo de vida (single-spa)

O `src/index.tsx` exporta as três funções obrigatórias do contrato single-spa:

```ts
bootstrap(props) // chamado uma vez antes do primeiro mount
mount(props)     // cria o elemento DOM e renderiza o React
unmount(props)   // desmonta o React e remove o elemento do DOM
```

As mesmas funções são expostas em `globalThis.mfeTransactions` para que o shell possa carregá-las via `<script>` clássico sem SystemJS.

## Build

O esbuild gera um bundle **IIFE** em `dist/mfe-transactions.js` com React incluído internamente (sem `external`). Isso garante isolamento total: o MFE funciona independentemente do que estiver no shell ou em outros MFEs.

```bash
npm run build
# → dist/mfe-transactions.js
# → dist/mfe-transactions.js.map
```

## Deploy para o shell

```bash
npm run deploy
# Copia dist/mfe-transactions.js → apps/shell/vendor/mfe-transactions.js
```

Em produção, esse bundle seria publicado em um CDN. O shell referencia a URL do bundle no import map — cada MFE pode fazer deploy independentemente.
