import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/transacoes",
  transpilePackages: [
    "@repo/button",
    "@repo/icons",
    "@repo/input",
    "@repo/modal",
    "@repo/navbar",
    "@repo/select",
    "@repo/sidebar",
  ],
};

export default nextConfig;
