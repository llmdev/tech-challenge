import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/button",
    "@repo/icons",
    "@repo/navbar",
    "@repo/sidebar",
    "@repo/balance-card",
    "@repo/transaction-form",
    "@repo/statement",
  ],
};

export default nextConfig;
