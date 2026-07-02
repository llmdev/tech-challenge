import type { MonthGroup, Transaction } from "./transaction.types";

const PT_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export class TransactionGrouper {
  groupByMonth(transactions: Transaction[]): MonthGroup[] {
    const sorted = [...transactions].sort(
      (a, b) => this.dateToSortValue(b.date) - this.dateToSortValue(a.date),
    );

    const map = new Map<string, Transaction[]>();
    for (const tx of sorted) {
      const key = this.dateToMonthKey(tx.date);
      const group = map.get(key) ?? [];
      group.push(tx);
      map.set(key, group);
    }

    return Array.from(map.entries()).map(([month, txs]) => ({
      month,
      transactions: txs.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)),
    }));
  }

  private dateToMonthKey(ddmmyyyy: string): string {
    const [, month, year] = ddmmyyyy.split("/");
    return `${PT_MONTHS[parseInt(month, 10) - 1]} ${year}`;
  }

  private dateToSortValue(ddmmyyyy: string): number {
    const [day, month, year] = ddmmyyyy.split("/");
    return parseInt(`${year}${month}${day}`, 10);
  }
}

export const transactionGrouper = new TransactionGrouper();
