"use client";

import { useRef } from "react";
import { Statement } from "@repo/statement";
import type { TransactionItemData } from "@repo/statement";
import { useAppSelector, useAppStore } from "@/store/hooks";
import { lastItemsHydrated, selectLastItems } from "@/store/transactions-slice";

// initialItems vem renderizado do servidor e é copiado para o store uma única vez.
// Depois disso o componente só LÊ do store: quando uma transação é criada, o
// thunk atualiza `lastItems` e este componente re-renderiza sozinho — sem
// event listeners nem fetch próprio.
export function StatementContent({
  className,
  initialItems,
}: {
  className?: string;
  initialItems: TransactionItemData[];
}) {
  // Hidratação no primeiro render (padrão recomendado pelo guia Redux + Next.js):
  // dispatch síncrono antes do useSelector, para o HTML do SSR já sair com os dados.
  const store = useAppStore();
  const hydrated = useRef(false);
  if (!hydrated.current) {
    store.dispatch(lastItemsHydrated(initialItems));
    hydrated.current = true;
  }

  const items = useAppSelector(selectLastItems);

  return <Statement items={items} className={className} description="5 últimos lançamentos" />;
}
