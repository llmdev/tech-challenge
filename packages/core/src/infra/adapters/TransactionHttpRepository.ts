import { HttpClient, HttpError } from "../http/HttpClient";

import { TransactionRepository } from "../../application/ports";
import { Transaction } from "../../domain/transaction";
import type {
  Transaction as TransactionDto,
  TransactionsPaginatedResponse,
} from "../http/dtos/transaction-dto";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { Paginated } from "../../application/ports/paginated";

function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}

export class TransactionHttpRepository implements TransactionRepository {

  private readonly httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<Transaction[]> {
    const result = await this.httpClient.get<TransactionsPaginatedResponse>(`/api/transacoes/all`);
    return result.items.map(TransactionMapper.toDomain);
  }
  async getPaginated(page: number, pageSize: number): Promise<Paginated<Transaction>> {
    const result = await this.httpClient.get<TransactionsPaginatedResponse>(`/api/transacoes?page=${page}&pageSize=${pageSize}`);
    return {
      items: result.items.map(TransactionMapper.toDomain),
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    };
  }
  findById(id: string): Promise<Transaction | null> {
    throw new Error("Method not implemented.");
  }
  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.httpClient.post<TransactionDto>(
      `/api/transacoes`,
      TransactionMapper.toDto(transaction),
    );
    return TransactionMapper.toDomain(created);
  }
  async update(id: string, transaction: Transaction): Promise<Transaction | null> {
    try {
      const updated = await this.httpClient.put<TransactionDto>(
        `/api/transacoes/${id}`,
        TransactionMapper.toDto(transaction),
      );
      return TransactionMapper.toDomain(updated);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }
  async remove(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete<void>(`/api/transacoes/${id}`);
      return true;
    } catch (error) {
      if (isNotFound(error)) return false;
      throw error;
    }
  }
}
