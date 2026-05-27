import { NextRequest, NextResponse } from "next/server";
import { remove, update } from "../../_store";
import type { Transaction } from "../../_store";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Omit<Transaction, "id">;
  const updated = update(id, body);
  if (!updated) return new NextResponse(null, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const removed = remove(id);
  if (!removed) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
