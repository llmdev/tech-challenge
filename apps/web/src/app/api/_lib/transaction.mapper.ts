import type { Transaction, TransactionRow } from "./transaction.types";

export class TransactionMapper {
  toDomain(row: TransactionRow): Transaction {
    return {
      id: String(row.id),
      type: row.type,
      category: row.category,
      description: row.description,
      institution: row.institution,
      date: row.date,
      amount: this.formatAmount(parseFloat(row.amount), row.type),
    };
  }

  parseAmountValue(amount: string): number {
    const sign = amount.includes("+") ? 1 : -1;
    const num = parseFloat(
      amount
        .replace(/[^0-9,.]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );
    return sign * (Number.isNaN(num) ? 0 : num);
  }

  formatAmount(value: number, type: "credit" | "debit"): string {
    const formatted = value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${type === "credit" ? "+" : "-"} R$ ${formatted}`;
  }

  parseDateToISO(ddmmyyyy: string): string {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  }

  isValidId(id: string): boolean {
    return /^\d+$/.test(id);
  }
}

export const transactionMapper = new TransactionMapper();
