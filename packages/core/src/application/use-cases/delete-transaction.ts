import type { TransactionRepository } from "../ports/transaction-repository";
import { NotFoundError } from "../../domain/errors";

/**
 * Caso de Uso: DeleteTransaction
 *
 * Remove uma transação existente.
 */
export class DeleteTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) {
      throw new NotFoundError(`Transação ${id} não encontrada`);
    }
  }
}
