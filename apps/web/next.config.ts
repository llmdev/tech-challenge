import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
