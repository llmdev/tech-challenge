import { NextRequest, NextResponse } from "next/server";
import { create, getAll, groupByMonth } from "../_store";
import type { Transaction } from "../_store";

export function GET() {
  return NextResponse.json(groupByMonth(getAll()));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Omit<Transaction, "id">;
  const created = create(body);
  return NextResponse.json(created, { status: 201 });
}
