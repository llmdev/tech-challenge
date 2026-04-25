"use client";

import { useCallback, useEffect, useState } from "react";
import { Statement } from "@repo/statement";
import type { TransactionItemData } from "@repo/statement";
import type { MonthGroup } from "@/mocks/handlers";

export function StatementContent({ className }: { className?: string }) {
  const [items, setItems] = useState<TransactionItemData[]>([]);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch("/api/transacoes");
    const groups: MonthGroup[] = await res.json();

    const all = groups.flatMap((g) =>
      g.transactions.map((tx) => ({
        month: g.month,
        description: tx.description,
        date: tx.date,
        amount: tx.amount,
        type: tx.type,
      }))
    );

    setItems(all.slice(0, 5));
  }, []);

  useEffect(() => {
    fetchTransactions();

    window.addEventListener("transactionCreated", fetchTransactions);
    return () => {
      window.removeEventListener("transactionCreated", fetchTransactions);
    };
  }, [fetchTransactions]);

  return <Statement items={items} className={className} description="5 últimos lançamentos" />;
}
