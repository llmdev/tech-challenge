import { auth } from "./auth";

export interface AuthenticatedUser {
  id: string;
}

// Usa o plugin jwt() do better-auth: troca o cookie de sessão por um JWT
// assinado e valida esse JWT via JWKS para extrair o id do usuário (claim `sub`).
export async function getAuthenticatedUser(headers: Headers): Promise<AuthenticatedUser | null> {
  try {
    const { token } = await auth.api.getToken({ headers });
    if (!token) {
      return null;
    }

    const { payload } = await auth.api.verifyJWT({ body: { token } });
    if (!payload?.sub) {
      return null;
    }

    return { id: payload.sub };
  } catch {
    return null;
  }
}
