# shell — Orquestrador de Micro-Frontends

Shell estático que orquestra os micro-frontends por domínio usando [single-spa](https://single-spa.js.org/). É o ponto de entrada da arquitetura MFE: monitora a URL e chama `mount()` / `unmount()` de cada MFE conforme a rota muda.

## Como funciona

```
Usuário navega para /mfe-transacoes
         ↓
single-spa detecta mudança de rota
         ↓
Bundle ainda não carregado?
  → injeta <script src="/vendor/mfe-transactions.js">
  → bundle expõe globalThis.mfeTransactions
         ↓
single-spa chama bootstrap() → mount()
         ↓
MFE renderiza dentro de <div id="root">
         ↓
Usuário navega para /mfe-next
  → single-spa chama unmount() no mfe-transactions
  → single-spa chama mount() no mfe-next (bundle já em cache)
```

## Estrutura

```
shell/
├── index.html          # HTML principal — carrega single-spa e define o import map
├── root-config.js      # Registra os MFEs e inicia o single-spa
└── vendor/
    ├── single-spa-shim.js       # Shim local do single-spa
    ├── mfe-next.js              # Bundle do MFE Dashboard (gerado por apps/mfe-next)
    ├── mfe-next.js.map
    ├── mfe-transactions.js      # Bundle do MFE Transações (gerado por apps/mfe-transactions)
    └── mfe-transactions.js.map
```

## MFEs registrados

| Nome | Bundle | Rota ativa | Domínio |
|------|--------|------------|---------|
| `mfe-next` | `/vendor/mfe-next.js` | `/mfe-next` | Dashboard / Home |
| `mfe-transactions` | `/vendor/mfe-transactions.js` | `/mfe-transacoes` | Transações |

## Rodando localmente

```bash
# A partir da pasta apps/shell
npx serve .

# Ou com uma porta específica
npx serve . -l 9000
```

Acesse `http://localhost:9000` (ou a porta indicada pelo serve).

> Os bundles em `vendor/` precisam estar gerados antes de rodar o shell.
> Veja os comandos `npm run build` e `npm run deploy` em cada app MFE.

## Adicionando um novo MFE

1. Crie o app em `apps/mfe-<dominio>/` seguindo o padrão de `mfe-transactions`
2. Gere o bundle e copie para `vendor/` com `npm run deploy`
3. Adicione a entrada no import map em `index.html`:
   ```json
   "mfe-<dominio>": "/vendor/mfe-<dominio>.js"
   ```
4. Registre a aplicação em `root-config.js`:
   ```js
   registerApplication({
     name: 'mfe-<dominio>',
     app: () => { /* carrega globalThis.mfe<Dominio> */ },
     activeWhen: pathPrefix('/mfe-<dominio>'),
   });
   ```

## Contrato com os MFEs

O shell não conhece o código interno de nenhum MFE. A única interface é o objeto de ciclo de vida exposto em `globalThis`:

```ts
globalThis.mfe<Nome> = {
  bootstrap: (props) => Promise<void>,
  mount:     (props) => Promise<void>,
  unmount:   (props) => Promise<void>,
}
```

Isso permite que cada MFE seja desenvolvido, buildado e deployado de forma completamente independente.
