import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  port: parseInt(process.env.RDS_PORT || "5432", 10),
  database: process.env.RDS_DB_NAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  // RDS_SSL=false permite rodar o build de produção contra o Postgres local (docker compose)
  ...(process.env.NODE_ENV !== "development" && process.env.RDS_SSL !== "false" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});
