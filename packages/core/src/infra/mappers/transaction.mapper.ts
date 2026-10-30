import { Money } from "../../domain/money";
import { Transaction, type TransactionType } from "../../domain/transaction";
import type {
  Transaction as TransactionDto,
  TransactionInput,
} from "../http/dtos/transaction-dto";

// A API trafega o valor como "+ R$ 1.234,56" / "- R$ 1.234,56".
function parseAmount(amount: string): Money {
  const digits = amount.replace(/[^0-9,]/g, "").replace(",", ".");
  return Money.fromDecimal(digits);
}

export const TransactionMapper = {
  toDomain(dto: TransactionDto): Transaction {
    return Transaction.restore(dto.id, {
      type: dto.type as TransactionType,
      category: dto.category,
      description: dto.description,
      institution: dto.institution,
      date: dto.date,
      amount: parseAmount(dto.amount),
    })
  },

  toDto(transaction: Transaction): TransactionInput {
    return {
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      institution: transaction.institution,
      date: transaction.date,
      amount: `${transaction.isCredit() ? "+" : "-"} ${transaction.amount.format()}`,
    }
  },
}
