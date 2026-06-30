import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
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

export default withVercelToolbar()(
  withMicrofrontends(nextConfig, { debug: true }),
);
