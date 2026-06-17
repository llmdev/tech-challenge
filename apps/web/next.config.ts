import type { NextConfig } from "next";

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
};

export default nextConfig;
