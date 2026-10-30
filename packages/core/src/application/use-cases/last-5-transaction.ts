import type { Transaction } from "../../domain/transaction";
import type { TransactionRepository } from "../ports/transaction-repository";

class Last5TransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    const allTransactions = await this.repository.getPaginated(1, 5);
    return allTransactions.items;
  }
}

export { Last5TransactionsUseCase };