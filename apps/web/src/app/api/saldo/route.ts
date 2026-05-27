import { NextResponse } from "next/server";
import { getAll, parseAmountValue } from "../_store";

export function GET() {
  const total = getAll().reduce((acc, tx) => acc + parseAmountValue(tx.amount), 0);
  const formatted = total.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return NextResponse.json({ balance: `R$ ${formatted}` });
}
