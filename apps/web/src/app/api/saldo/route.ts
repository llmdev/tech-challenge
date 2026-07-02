import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import { getAll, parseAmountValue } from "../_store";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const total = (await getAll(user.id)).reduce((acc, tx) => acc + parseAmountValue(tx.amount), 0);
  const formatted = total.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return NextResponse.json({ balance: `R$ ${formatted}` });
}
