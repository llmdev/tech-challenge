"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";

// Disponibiliza o store para toda a árvore abaixo dele via Context.
// O lazy initializer do useState garante uma única instância por montagem
// (e uma por request no servidor).
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
