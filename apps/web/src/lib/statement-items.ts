import type { Transaction } from "@repo/core";
import type { TransactionItemData } from "@repo/statement";

// Compartilhado entre servidor (render inicial) e cliente (refetch)
export function toStatementItem(tx: Transaction): TransactionItemData {
  return {
    month: tx.month,
    description: tx.description,
    date: tx.date,
    amount: `${tx.isCredit() ? "+" : "-"} ${tx.amount.format()}`,
    type: tx.type,
  };
}
