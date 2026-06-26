import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT || "5432"),
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    // ...(process.env.NODE_ENV !== "development" && {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // }),
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "meu-provedor-central", // Nome que você escolher
          // A URL da sua Zona Provedora:
          discoveryUrl:
            "http://localhost:3000/api/auth/.well-known/openid-configuration",
          clientId: "MopRaYeWMNWhSbTRMjAIAkvaYFuYshQO", // O ID que você gerou no Passo 5.1
          clientSecret: "RxgKOgsTxfbO51TJH0emotNaGDrfdbw5tQUW6qxn-Uk", // O Secret do Passo 5.1
          scopes: ["openid", "profile", "email"],
        },
      ],
    }),
  ],
});
