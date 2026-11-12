"use client";

import { useCallback, useEffect, useState } from "react";
import { Statement } from "@repo/statement";
import type { TransactionItemData } from "@repo/statement";
import { listLast5TransactionsUseCase } from "@repo/core";
import { toStatementItem } from "@/lib/statement-items";

// initialItems vem renderizado do servidor; o cliente só refaz a busca
// quando uma transação é criada.
export function StatementContent({
  className,
  initialItems,
}: {
  className?: string;
  initialItems: TransactionItemData[];
}) {
  const [items, setItems] = useState<TransactionItemData[]>(initialItems);

  const fetchTransactions = useCallback(async () => {
    const transactions = await listLast5TransactionsUseCase.execute();
    setItems(transactions.map(toStatementItem));
  }, []);

  useEffect(() => {
    window.addEventListener("transactionCreated", fetchTransactions);
    return () => {
      window.removeEventListener("transactionCreated", fetchTransactions);
    };
  }, [fetchTransactions]);

  return <Statement items={items} className={className} description="5 últimos lançamentos" />;
}
