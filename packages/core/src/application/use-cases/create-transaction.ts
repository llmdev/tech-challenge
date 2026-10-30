import type { Transaction } from "../../domain/transaction";
import type { TransactionRepository } from "../ports/transaction-repository";

/**
 * Caso de Uso: CreateTransaction
 *
 * Responsável por criar uma transação nova, persistindo via repositório.
 */
export class CreateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<Transaction> {
    return this.repository.create(transaction);
  }
}
