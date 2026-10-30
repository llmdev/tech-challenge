import type { Transaction } from "../../domain/transaction";
import type { TransactionRepository } from "../ports/transaction-repository";
import { NotFoundError } from "../../domain/errors";

/**
 * Caso de Uso: UpdateTransaction
 *
 * Atualiza uma transação existente.
 */
export class UpdateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string, transaction: Transaction): Promise<Transaction> {
    const updated = await this.repository.update(id, transaction);
    if (!updated) {
      throw new NotFoundError(`Transação ${id} não encontrada`);
    }
    return updated;
  }
}
