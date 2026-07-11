import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins";
import { jwt } from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";
import { pool } from "./db";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
      accountLinking: {
          enabled: true, // Ensure this isn't false
          trustedProviders: ["google"], // Only auto-link verified providers
          requireLocalEmailVerified: false, // local password accounts have no verification flow, so this gate always blocks linking otherwise
      }
  },
  plugins: [jwt()],
});
