import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { oidcProvider } from "better-auth/plugins";
import { jwt } from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";

export const auth = betterAuth({
  database: new Pool({
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT || "5432"),
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    ...(process.env.NODE_ENV !== "development" && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
});
