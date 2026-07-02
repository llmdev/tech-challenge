import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/get-authenticated-user";
import type { Transaction } from "../../_store";
import { remove, update } from "../../_store";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Omit<Transaction, "id">;
  const updated = await update(id, user.id, body);
  if (!updated) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser(request.headers);
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { id } = await params;
  const removed = await remove(id, user.id);
  if (!removed) {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
