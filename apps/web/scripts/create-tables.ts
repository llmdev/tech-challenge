import { pool } from "../src/lib/db";

// A tabela "user" já é criada e gerenciada pelo better-auth (packages/better-auth
// via `auth.ts`). Aqui criamos apenas a tabela de transações, relacionada a ela
// através de user_id -> user.id.
const CREATE_TRANSACOES_TABLE = `
  CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    institution TEXT NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes (user_id);
`;

async function main() {
  await pool.query(CREATE_TRANSACOES_TABLE);
  console.log("Tabela 'transacoes' criada/verificada com sucesso.");
  await pool.end();
}

main().catch((error) => {
  console.error("Falha ao criar tabelas:", error);
  process.exit(1);
});
