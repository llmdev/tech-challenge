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

const transactionHttpRepository = /*#__PURE__*/ new TransactionHttpRepository(new FetchHttpClient());

export const listTransactionsUseCase = /*#__PURE__*/ new ListTransactionsUseCase(transactionHttpRepository);
export const listAllTransactionsUseCase = /*#__PURE__*/ new ListAllTransactionsUseCase(transactionHttpRepository);
export const listLast5TransactionsUseCase = /*#__PURE__*/ new Last5TransactionsUseCase(transactionHttpRepository);
export const getBalanceUseCase = /*#__PURE__*/ new GetBalanceUseCase(transactionHttpRepository);
export const createTransactionUseCase = /*#__PURE__*/ new CreateTransactionUseCase(transactionHttpRepository);
export const updateTransactionUseCase = /*#__PURE__*/ new UpdateTransactionUseCase(transactionHttpRepository);
export const deleteTransactionUseCase = /*#__PURE__*/ new DeleteTransactionUseCase(transactionHttpRepository);
