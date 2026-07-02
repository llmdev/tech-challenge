import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import { transactionGrouper } from "../_lib/transaction-grouper";
import { transactionRepository } from "../_lib/transaction.repository";
import type { TransactionInput } from "../_lib/transaction.types";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const transactions = await transactionRepository.getAll(user.id);
  return NextResponse.json(transactionGrouper.groupByMonth(transactions));
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
