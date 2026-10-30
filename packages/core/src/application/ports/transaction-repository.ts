import type { Transaction } from "../../domain/transaction";
import type { Paginated } from "./paginated";

/**
 * Porta: TransactionRepository
 *
 * Interface que define os contatos entre a aplicação e a persistência.
 * Pode ser implementada por Postgres, SQLite, memória, etc.
 *
 * As operações já são escopadas ao usuário autenticado (a implementação HTTP
 * delega isso à sessão da API), por isso não recebem `userId`.
 */
export interface TransactionRepository {
  getAll(): Promise<Transaction[]>;
  getPaginated(page: number, pageSize: number): Promise<Paginated<Transaction>>;
  findById(id: string): Promise<Transaction | null>;
  create(transaction: Transaction): Promise<Transaction>;
  update(id: string, transaction: Transaction): Promise<Transaction | null>;
  remove(id: string): Promise<boolean>;
}
