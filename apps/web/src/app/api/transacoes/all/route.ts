import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import { transactionGrouper } from "../../_lib/transaction-grouper";
import { transactionRepository } from "../../_lib/transaction.repository";
import type { PaginatedTransactions } from "../../_lib/transaction.types";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const transactions = await transactionRepository.getAll(user.id);
  const response: PaginatedTransactions = {
    groups: transactionGrouper.groupByMonth(transactions),
    page: 1,
    pageSize: transactions.length,
    total: transactions.length,
    totalPages: 1,
  };
  return NextResponse.json(response);
}
