import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  port: parseInt(process.env.RDS_PORT || "5432", 10),
  database: process.env.RDS_DB_NAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  ...(process.env.NODE_ENV !== "development" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});
