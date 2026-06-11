import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Impede o webpack de tentar fazer bundle de módulos nativos do servidor (better-auth + deps)
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
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
      '@repo': path.resolve(__dirname, '..', '..', 'packages'),
    };
    return config;
  },
};

export default nextConfig;
