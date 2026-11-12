// Busca de dados no servidor (Server Components). Vai direto ao repositório
// Postgres — sem o round-trip HTTP que os client components fariam via /api —
// e devolve DTOs serializáveis para os client components.
import { cache } from "react";
import { headers } from "next/headers";
import { Money, TransactionMapper, type TransactionDto } from "@repo/core";
import { auth } from "@/lib/auth";
import { transactionRepository } from "@/app/api/_lib/transaction.repository";
import { toStatementItem } from "@/lib/statement-items";

// cache(): layout e página compartilham a mesma consulta de sessão no request
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

const getAllTransactions = cache(async (): Promise<TransactionDto[]> => {
  const session = await getSession();
  if (!session) {
    return [];
  }
  return transactionRepository.getAll(session.user.id);
});

export async function getBalance(): Promise<number> {
  const transactions = await getAllTransactions();
  return transactions
    .reduce((acc, dto) => acc.plus(TransactionMapper.toDomain(dto).signedAmount()), Money.zero())
    .toDecimal();
}

export async function getLastStatementItems() {
  const session = await getSession();
  if (!session) {
    return [];
  }
  const { transactions } = await transactionRepository.getPaginated(session.user.id, 1, 5);
  return transactions.map((dto) => toStatementItem(TransactionMapper.toDomain(dto)));
}
