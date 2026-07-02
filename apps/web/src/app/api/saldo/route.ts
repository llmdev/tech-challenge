import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import { transactionMapper } from "../_lib/transaction.mapper";
import { transactionRepository } from "../_lib/transaction.repository";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const transactions = await transactionRepository.getAll(user.id);
  const total = transactions.reduce(
    (acc, tx) => acc + transactionMapper.parseAmountValue(tx.amount),
    0,
  );
  const formatted = total.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return NextResponse.json({ balance: `R$ ${formatted}` });
}
