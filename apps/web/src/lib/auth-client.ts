"use client";

import { createAuthClient } from "better-auth/react";

// biome-ignore lint/suspicious/noExplicitAny: TS2883 — o tipo inferido de authClient referencia InferUserUpdateCtx de better-auth,
// um tipo interno que não pode ser nomeado no modo strict. Isso é uma limitação conhecida dos tipos do better-auth.
const authClient = createAuthClient() as ReturnType<typeof createAuthClient>;

export const { signIn, signUp, signOut, useSession } = authClient;
export { authClient };
