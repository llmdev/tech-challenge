import type { Pool } from "pg";
import { pool } from "@/lib/db";
import { type TransactionMapper, transactionMapper } from "./transaction.mapper";
import type { Transaction, TransactionInput, TransactionRow } from "./transaction.types";

const SELECT_FIELDS = `
  id, type, category, description, institution,
  to_char(date, 'DD/MM/YYYY') AS date, amount
`;

export interface ITransactionRepository {
  getAll(userId: string): Promise<Transaction[]>;
  findById(id: string, userId: string): Promise<Transaction | undefined>;
  create(userId: string, data: TransactionInput): Promise<Transaction>;
  update(id: string, userId: string, data: TransactionInput): Promise<Transaction | null>;
  remove(id: string, userId: string): Promise<boolean>;
}

// Todas as operações são sempre filtradas por user_id (o id do usuário
// autenticado, extraído do JWT do better-auth), garantindo que cada usuário
// só acesse suas próprias transações.
export class PostgresTransactionRepository implements ITransactionRepository {
  constructor(
    private readonly db: Pool,
    private readonly mapper: TransactionMapper,
  ) {}

  async getAll(userId: string): Promise<Transaction[]> {
    const { rows } = await this.db.query<TransactionRow>(
      `SELECT ${SELECT_FIELDS} FROM transacoes WHERE user_id = $1 ORDER BY date DESC, id DESC`,
      [userId],
    );
    return rows.map((row) => this.mapper.toDomain(row));
  }

  async findById(id: string, userId: string): Promise<Transaction | undefined> {
    if (!this.mapper.isValidId(id)) {
      return undefined;
    }
    const { rows } = await this.db.query<TransactionRow>(
      `SELECT ${SELECT_FIELDS} FROM transacoes WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return rows[0] ? this.mapper.toDomain(rows[0]) : undefined;
  }

  async create(userId: string, data: TransactionInput): Promise<Transaction> {
    const { rows } = await this.db.query<TransactionRow>(
      `INSERT INTO transacoes (user_id, type, category, description, institution, date, amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${SELECT_FIELDS}`,
      [
        userId,
        data.type,
        data.category,
        data.description,
        data.institution,
        this.mapper.parseDateToISO(data.date),
        Math.abs(this.mapper.parseAmountValue(data.amount)),
      ],
    );
    return this.mapper.toDomain(rows[0]);
  }

  async update(id: string, userId: string, data: TransactionInput): Promise<Transaction | null> {
    if (!this.mapper.isValidId(id)) {
      return null;
    }
    const { rows } = await this.db.query<TransactionRow>(
      `UPDATE transacoes
       SET type = $1, category = $2, description = $3, institution = $4, date = $5, amount = $6
       WHERE id = $7 AND user_id = $8
       RETURNING ${SELECT_FIELDS}`,
      [
        data.type,
        data.category,
        data.description,
        data.institution,
        this.mapper.parseDateToISO(data.date),
        Math.abs(this.mapper.parseAmountValue(data.amount)),
        id,
        userId,
      ],
    );
    return rows[0] ? this.mapper.toDomain(rows[0]) : null;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    if (!this.mapper.isValidId(id)) {
      return false;
    }
    const result = await this.db.query("DELETE FROM transacoes WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}

export const transactionRepository: ITransactionRepository = new PostgresTransactionRepository(
  pool,
  transactionMapper,
);
