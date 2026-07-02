import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import type { Transaction } from "../_store";
import { create, getAll, groupByMonth } from "../_store";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  return NextResponse.json(groupByMonth(await getAll(user.id)));
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const body = (await request.json()) as Omit<Transaction, "id">;
  const created = await create(user.id, body);
  return NextResponse.json(created, { status: 201 });
}
