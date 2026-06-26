import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const myHeaders = await headers();
  const client = await auth.api.createOAuthClient({
    headers: myHeaders,
    body: {
      redirect_uris: ["http://localhost:3000"],
    },
  });
  console.log(client);

  return NextResponse.json(client);
}
