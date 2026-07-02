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
  plugins: [jwt()],
});
