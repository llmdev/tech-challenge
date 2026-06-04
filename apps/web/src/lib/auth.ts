import { betterAuth } from "better-auth";
import path from "node:path";

// biome-ignore lint/suspicious/noExplicitAny: Usando require para evitar TS4023 com o tipo de namespace BetterSqlite3.Database
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require("better-sqlite3");

export const auth = betterAuth({
  database: new Database(path.join(process.cwd(), "auth.db")),
  emailAndPassword: {
    enabled: true,
  },
});
