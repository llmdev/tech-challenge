import type { Transaction } from "../../domain/transaction";
import type { TransactionRepository } from "../ports/transaction-repository";

/**
 * Caso de Uso: ListAllTransactions
 *
 * Lista todas as transações do usuário, sem paginação.
 */
export class ListAllTransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.repository.getAll();
  }
}
