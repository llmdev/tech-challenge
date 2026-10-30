import { TransactionHttpRepository } from "../infra/adapters/TransactionHttpRepository";
import { FetchHttpClient } from "../infra/http/FetchHttpClient";
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetBalanceUseCase,
  Last5TransactionsUseCase,
  ListAllTransactionsUseCase,
  ListTransactionsUseCase,
  UpdateTransactionUseCase,
} from "../application/use-cases";

const transactionHttpRepository = new TransactionHttpRepository(new FetchHttpClient());

export const listTransactionsUseCase = new ListTransactionsUseCase(transactionHttpRepository);
export const listAllTransactionsUseCase = new ListAllTransactionsUseCase(transactionHttpRepository);
export const listLast5TransactionsUseCase = new Last5TransactionsUseCase(transactionHttpRepository);
export const getBalanceUseCase = new GetBalanceUseCase(transactionHttpRepository);
export const createTransactionUseCase = new CreateTransactionUseCase(transactionHttpRepository);
export const updateTransactionUseCase = new UpdateTransactionUseCase(transactionHttpRepository);
export const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionHttpRepository);
