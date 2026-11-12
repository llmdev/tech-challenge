import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

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
