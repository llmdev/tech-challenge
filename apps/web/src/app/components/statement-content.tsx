"use client";

import { useCallback, useEffect, useState } from "react";
import { Statement } from "@repo/statement";
import type { TransactionItemData } from "@repo/statement";
import { type Transaction, listLast5TransactionsUseCase } from "@repo/core";

function toItemData(tx: Transaction): TransactionItemData {
  return {
    month: tx.month,
    description: tx.description,
    date: tx.date,
    amount: `${tx.isCredit() ? "+" : "-"} ${tx.amount.format()}`,
    type: tx.type,
  };
}

export function StatementContent({ className }: { className?: string }) {
  const [items, setItems] = useState<TransactionItemData[]>([]);

  const fetchTransactions = useCallback(async () => {
    const transactions = await listLast5TransactionsUseCase.execute();
    setItems(transactions.map(toItemData));
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
