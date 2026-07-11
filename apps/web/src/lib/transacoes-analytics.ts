import type { Transaction } from "@/app/api/_lib/transaction.types";

const PT_MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const CATEGORY_LABELS: Record<string, string> = {
  salario: "Salário",
  pix: "PIX",
  receita: "Receita",
  transf: "Transferência",
  fatura: "Fatura",
  boleto: "Boleto",
  conta: "Conta",
  outros: "Outros",
};

// Ordem fixa (mesma do formulário de transações) — os índices viram slots de
// cor categórica, nunca reordenados por valor.
export const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

export function parseAmount(amount: string): number {
  const num = parseFloat(
    amount.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", "."),
  );
  return Number.isNaN(num) ? 0 : Math.abs(num);
}

function dateKey(ddmmyyyy: string): string {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
}

function monthKey(ddmmyyyy: string): string {
  const [, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  return `${PT_MONTHS_SHORT[parseInt(month, 10) - 1]}/${year.slice(2)}`;
}

export interface MonthlyTotals {
  key: string;
  label: string;
  entradas: number;
  saidas: number;
}

export function monthlyEntradasSaidas(
  transactions: Transaction[],
  monthsBack = 6,
): MonthlyTotals[] {
  const byMonth = new Map<string, MonthlyTotals>();

  for (const tx of transactions) {
    const key = monthKey(tx.date);
    const entry = byMonth.get(key) ?? { key, label: monthLabel(key), entradas: 0, saidas: 0 };
    const value = parseAmount(tx.amount);
    if (tx.type === "credit") {
      entry.entradas += value;
    } else {
      entry.saidas += value;
    }
    byMonth.set(key, entry);
  }

  return Array.from(byMonth.values())
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .slice(-monthsBack);
}

export interface CategoryTotal {
  category: string;
  label: string;
  total: number;
}

export function gastosPorCategoria(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "debit") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + parseAmount(tx.amount));
  }

  return CATEGORY_ORDER.filter((category) => totals.has(category)).map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    total: totals.get(category) ?? 0,
  }));
}

export interface InstitutionTotal {
  institution: string;
  total: number;
}

export function movimentacaoPorInstituicao(
  transactions: Transaction[],
  limit = 6,
): InstitutionTotal[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    const institution = tx.institution.trim() || "Não informado";
    totals.set(institution, (totals.get(institution) ?? 0) + parseAmount(tx.amount));
  }

  const sorted = Array.from(totals.entries())
    .map(([institution, total]) => ({ institution, total }))
    .sort((a, b) => b.total - a.total);

  if (sorted.length <= limit) {
    return sorted;
  }

  const top = sorted.slice(0, limit - 1);
  const rest = sorted.slice(limit - 1).reduce((sum, item) => sum + item.total, 0);
  return [...top, { institution: "Outros", total: rest }];
}

export interface BalancePoint {
  key: string;
  label: string;
  saldo: number;
}

export function saldoAcumulado(transactions: Transaction[]): BalancePoint[] {
  const byDate = new Map<string, number>();

  for (const tx of transactions) {
    const key = dateKey(tx.date);
    const value = parseAmount(tx.amount) * (tx.type === "credit" ? 1 : -1);
    byDate.set(key, (byDate.get(key) ?? 0) + value);
  }

  const sortedKeys = Array.from(byDate.keys()).sort();
  let running = 0;
  return sortedKeys.map((key) => {
    running += byDate.get(key) ?? 0;
    const [year, month, day] = key.split("-");
    return { key, label: `${day}/${month}/${year.slice(2)}`, saldo: running };
  });
}

export interface SummaryTotals {
  entradas: number;
  saidas: number;
  saldo: number;
}

export function summaryTotals(transactions: Transaction[]): SummaryTotals {
  let entradas = 0;
  let saidas = 0;
  for (const tx of transactions) {
    const value = parseAmount(tx.amount);
    if (tx.type === "credit") {
      entradas += value;
    } else {
      saidas += value;
    }
  }
  return { entradas, saidas, saldo: entradas - saidas };
}
