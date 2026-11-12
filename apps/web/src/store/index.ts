import { configureStore } from "@reduxjs/toolkit";
import { transactionsReducer } from "./transactions-slice";

// No Next.js (App Router) o store NÃO pode ser um singleton de módulo: no
// servidor esse módulo é compartilhado entre requests de usuários diferentes.
// Por isso exportamos uma *factory* e o StoreProvider cria uma instância por
// árvore de componentes.
export function makeStore() {
  return configureStore({
    reducer: {
      transactions: transactionsReducer,
    },
  });
}

// Tipos inferidos a partir do próprio store — não precisam ser mantidos à mão.
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
