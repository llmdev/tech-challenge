import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import { withVercelToolbar } from "@vercel/toolbar/plugins/next";
import bundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NODE_ENV === "production";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
    incomingRequests: true,
  },
  compiler: {
    // remove console.log/info/debug do bundle de produção (mantém error e warn)
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    // preparado para quando o app passar a servir imagens via next/image
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@repo/icons", "@repo/core"],
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
    "@repo/core",
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

const withMfe = withMicrofrontends(nextConfig, { debug: !isProd });

// a Vercel Toolbar só é útil em desenvolvimento/preview
export default withBundleAnalyzer(isProd ? withMfe : withVercelToolbar()(withMfe));
