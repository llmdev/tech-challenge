import { Money } from "../../domain/money";
import type { TransactionRepository } from "../ports/transaction-repository";

/**
 * Caso de Uso: GetBalance
 *
 * Calcula o saldo do usuário: entradas - saídas.
 */
export class GetBalanceUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(): Promise<Money> {
    const transactions = await this.repository.getAll();
    let balance = Money.zero();
    for (const tx of transactions) {
      balance = balance.plus(tx.signedAmount());
    }
    return balance;
  }
}
