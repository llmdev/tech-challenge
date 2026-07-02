import { pool } from "@/lib/db";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string; // "DD/MM/YYYY"
  amount: string; // "+ R$ X,XX" ou "- R$ X,XX"
}

export interface MonthGroup {
  month: string;
  transactions: Transaction[];
}

interface TransacaoRow {
  id: number;
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string; // já formatada como "DD/MM/YYYY" pelo to_char() na query
  amount: string; // numeric vem como string do node-postgres, sempre positivo
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function parseAmountValue(amount: string): number {
  const sign = amount.includes("+") ? 1 : -1;
  const num = parseFloat(
    amount
      .replace(/[^0-9,.]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
  return sign * (Number.isNaN(num) ? 0 : num);
}

function formatAmount(value: number, type: "credit" | "debit"): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${type === "credit" ? "+" : "-"} R$ ${formatted}`;
}

function parseDateToISO(ddmmyyyy: string): string {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
}

function rowToTransaction(row: TransacaoRow): Transaction {
  return {
    id: String(row.id),
    type: row.type,
    category: row.category,
    description: row.description,
    institution: row.institution,
    date: row.date,
    amount: formatAmount(parseFloat(row.amount), row.type),
  };
}

const PT_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function dateToMonthKey(ddmmyyyy: string): string {
  const parts = ddmmyyyy.split("/");
  const month = PT_MONTHS[parseInt(parts[1], 10) - 1];
  return `${month} ${parts[2]}`;
}

function dateToSortValue(ddmmyyyy: string): number {
  const parts = ddmmyyyy.split("/");
  return parseInt(`${parts[2]}${parts[1]}${parts[0]}`, 10);
}

export function groupByMonth(transactions: Transaction[]): MonthGroup[] {
  const sorted = [...transactions].sort(
    (a, b) => dateToSortValue(b.date) - dateToSortValue(a.date),
  );

  const map = new Map<string, Transaction[]>();
  for (const tx of sorted) {
    const key = dateToMonthKey(tx.date);
    if (!map.has(key)) map.set(key, []);
    // biome-ignore lint/style/noNonNullAssertion: just set above
    map.get(key)!.push(tx);
  }

  return Array.from(map.entries()).map(([month, txs]) => ({
    month,
    transactions: txs.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)),
  }));
}

// ── Store API ────────────────────────────────────────────────────────────────
// Todas as operações são sempre filtradas por user_id (o id do usuário
// autenticado, extraído do JWT do better-auth), garantindo que cada usuário
// só acesse suas próprias transações.

const SELECT_FIELDS = `
  id, type, category, description, institution,
  to_char(date, 'DD/MM/YYYY') AS date, amount
`;

export async function getAll(userId: string): Promise<Transaction[]> {
  const { rows } = await pool.query<TransacaoRow>(
    `SELECT ${SELECT_FIELDS} FROM transacoes WHERE user_id = $1 ORDER BY date DESC, id DESC`,
    [userId],
  );
  return rows.map(rowToTransaction);
}

function isValidId(id: string): boolean {
  return /^\d+$/.test(id);
}

export async function findById(id: string, userId: string): Promise<Transaction | undefined> {
  if (!isValidId(id)) {
    return undefined;
  }
  const { rows } = await pool.query<TransacaoRow>(
    `SELECT ${SELECT_FIELDS} FROM transacoes WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return rows[0] ? rowToTransaction(rows[0]) : undefined;
}

export async function create(userId: string, data: Omit<Transaction, "id">): Promise<Transaction> {
  const { rows } = await pool.query<TransacaoRow>(
    `INSERT INTO transacoes (user_id, type, category, description, institution, date, amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${SELECT_FIELDS}`,
    [
      userId,
      data.type,
      data.category,
      data.description,
      data.institution,
      parseDateToISO(data.date),
      Math.abs(parseAmountValue(data.amount)),
    ],
  );
  return rowToTransaction(rows[0]);
}

export async function update(
  id: string,
  userId: string,
  data: Omit<Transaction, "id">,
): Promise<Transaction | null> {
  if (!isValidId(id)) {
    return null;
  }
  const { rows } = await pool.query<TransacaoRow>(
    `UPDATE transacoes
     SET type = $1, category = $2, description = $3, institution = $4, date = $5, amount = $6
     WHERE id = $7 AND user_id = $8
     RETURNING ${SELECT_FIELDS}`,
    [
      data.type,
      data.category,
      data.description,
      data.institution,
      parseDateToISO(data.date),
      Math.abs(parseAmountValue(data.amount)),
      id,
      userId,
    ],
  );
  return rows[0] ? rowToTransaction(rows[0]) : null;
}

export async function remove(id: string, userId: string): Promise<boolean> {
  if (!isValidId(id)) {
    return false;
  }
  const result = await pool.query("DELETE FROM transacoes WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  return (result.rowCount ?? 0) > 0;
}
