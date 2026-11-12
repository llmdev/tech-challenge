import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

// Únicas origens autorizadas a chamar a API. Em dev o app roda atrás do proxy
// do microfrontends (porta 3024) ou direto na porta 3000.
const ALLOWED_ORIGINS = new Set<string>([
  "https://tech-challenge-web.vercel.app",
  ...(isDev ? ["http://localhost:3024", "http://localhost:3000"] : []),
]);

const CORS_ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const CORS_ALLOWED_HEADERS = "Content-Type, Authorization";

function applyCorsHeaders(headers: Headers, origin: string) {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", CORS_ALLOWED_METHODS);
  headers.set("Access-Control-Allow-Headers", CORS_ALLOWED_HEADERS);
  headers.set("Access-Control-Max-Age", "86400");
}

/**
 * CORS da API: só aceita requests vindas de ALLOWED_ORIGINS.
 * Requests sem header Origin (navegação direta, chamadas server-side,
 * GET same-origin) seguem normalmente — CORS só se aplica a requests do browser.
 */
export function handleApiCors(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const isAllowed = origin !== null && ALLOWED_ORIGINS.has(origin);

  if (origin !== null && !isAllowed) {
    return new NextResponse(null, { status: 403, headers: { Vary: "Origin" } });
  }

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (origin !== null) {
      applyCorsHeaders(response.headers, origin);
    }
    response.headers.set("Vary", "Origin");
    return response;
  }

  const response = NextResponse.next();
  if (origin !== null) {
    applyCorsHeaders(response.headers, origin);
  }
  response.headers.set("Vary", "Origin");
  return response;
}

/**
 * CSP: apenas scripts servidos pela própria aplicação. Scripts inline
 * (hidratação do Next e o script de tema do layout) são liberados via nonce
 * gerado por request; 'strict-dynamic' propaga a confiança para os chunks
 * que esses scripts carregam.
 */
export function buildCsp(nonce: string): string {
  // Em dev: React precisa de eval para o debug/HMR e a Vercel Toolbar é carregada.
  const devScript = isDev ? " 'unsafe-eval'" : "";
  const devConnect = isDev ? " ws: https://vercel.live wss://ws-us3.pusher.com" : "";
  const devFrame = isDev ? " https://vercel.live" : "";
  const devImg = isDev ? " https://vercel.live https://vercel.com" : "";
  const devFont = isDev ? " https://vercel.live https://assets.vercel.com" : "";
  const devStyle = isDev ? " https://vercel.live" : "";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devScript}`,
    `style-src 'self' 'unsafe-inline'${devStyle}`,
    `img-src 'self' blob: data:${devImg}`,
    `font-src 'self'${devFont}`,
    `connect-src 'self'${devConnect}`,
    `frame-src 'self'${devFrame}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/**
 * Gera o nonce, repassa CSP + nonce nos headers da request (o Next lê o
 * header `content-security-policy` da request para aplicar o nonce nos
 * próprios scripts) e devolve a CSP no header da response.
 */
export function nextWithCsp(
  request: NextRequest,
  extraRequestHeaders: Record<string, string> = {},
): NextResponse {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);
  for (const [key, value] of Object.entries(extraRequestHeaders)) {
    requestHeaders.set(key, value);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}
