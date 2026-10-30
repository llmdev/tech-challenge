import type { Transaction } from "../../domain/transaction";
import type { TransactionRepository } from "../ports/transaction-repository";

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Caso de Uso: ListTransactions
 *
 * Lista transações paginadas do usuário.
 */
export class ListTransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(input: {
    page?: number;
    pageSize?: number;
  }): Promise<{
    transactions: Transaction[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }> {
    // Normaliza paginação.
    const page = Math.max(1, Math.floor(input.page ?? 1) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Math.floor(input.pageSize ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE),
    );

    const result = await this.repository.getPaginated(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

    return {
      transactions: result.items,
      page,
      pageSize,
      total: result.total,
      totalPages,
    };
  }
}
