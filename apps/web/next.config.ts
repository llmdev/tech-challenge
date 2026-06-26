import type { NextConfig } from "next";

const TRANSACOES_URL =
  process.env.TRANSACOES_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
    incomingRequests: true,
  },
  serverExternalPackages: [
    "better-auth",
    "better-sqlite3",
    "@better-auth/kysely-adapter",
    "@better-auth/core",
    "kysely",
  ],
  transpilePackages: [
    "@repo/button",
    "@repo/icons",
    "@repo/input",
    "@repo/modal",
    "@repo/navbar",
    "@repo/select",
    "@repo/sidebar",
    "@repo/balance-card",
    "@repo/statement",
  ],
  async rewrites() {
    return [
      {
        source: "/transacoes",
        destination: `${TRANSACOES_URL}/transacoes`,
      },
      {
        source: "/transacoes/:path*",
        destination: `${TRANSACOES_URL}/transacoes/:path*`,
      },
    ];
  },
};

export default nextConfig;
