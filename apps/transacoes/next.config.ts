import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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

export default withVercelToolbar()(
  withMicrofrontends(nextConfig, { debug: true }),
);
