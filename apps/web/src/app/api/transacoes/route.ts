import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import { transactionGrouper } from "../_lib/transaction-grouper";
import { transactionRepository } from "../_lib/transaction.repository";
import type { PaginatedTransactions, TransactionInput } from "../_lib/transaction.types";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSizeParam = searchParams.get("pageSize");

  if (pageSizeParam === "all") {
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

  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(pageSizeParam) || DEFAULT_PAGE_SIZE),
  );

  const { transactions, total } = await transactionRepository.getPaginated(
    user.id,
    page,
    pageSize,
  );

  const response: PaginatedTransactions = {
    groups: transactionGrouper.groupByMonth(transactions),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const body = (await request.json()) as TransactionInput;
  const created = await transactionRepository.create(user.id, body);
  return NextResponse.json(created, { status: 201 });
}
