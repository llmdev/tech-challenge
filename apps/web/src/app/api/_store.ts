// Store em memória — persiste enquanto o processo do servidor estiver rodando.
// Equivalente ao mock que era feito via MSW (com localStorage no browser).

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

const SEED: Transaction[] = [
  { id: "1",  type: "credit", category: "receita",  description: "Depósito recebido",     institution: "Banco Inter",       date: "21/11/2024", amount: "+ R$ 1.500,00" },
  { id: "2",  type: "debit",  category: "transf",   description: "Transferência enviada", institution: "João Silva",        date: "18/11/2024", amount: "- R$ 500,00"   },
  { id: "3",  type: "debit",  category: "fatura",   description: "Pagamento de fatura",   institution: "Cartão Nubank",     date: "15/11/2024", amount: "- R$ 890,00"   },
  { id: "4",  type: "credit", category: "pix",      description: "Pix recebido",          institution: "Maria Oliveira",    date: "10/11/2024", amount: "+ R$ 250,00"   },
  { id: "5",  type: "debit",  category: "conta",    description: "Conta de luz",          institution: "CEMIG",             date: "05/10/2024", amount: "- R$ 89,50"    },
  { id: "6",  type: "debit",  category: "transf",   description: "Transferência enviada", institution: "Carlos Mendes",     date: "03/10/2024", amount: "- R$ 300,00"   },
  { id: "7",  type: "credit", category: "salario",  description: "Salário",               institution: "Empresa XYZ Ltda.", date: "01/10/2024", amount: "+ R$ 5.000,00" },
  { id: "8",  type: "debit",  category: "boleto",   description: "Pagamento de boleto",   institution: "COPASA",            date: "28/09/2024", amount: "- R$ 45,00"    },
  { id: "9",  type: "credit", category: "pix",      description: "Pix recebido",          institution: "Ana Paula",         date: "20/09/2024", amount: "+ R$ 180,00"   },
  { id: "10", type: "debit",  category: "transf",   description: "Transferência enviada", institution: "Pedro Alves",       date: "15/09/2024", amount: "- R$ 750,00"   },
];

// Singleton — módulo é avaliado uma única vez por processo Node.
let store: Transaction[] = [...SEED];
let nextId = SEED.reduce((max, tx) => Math.max(max, parseInt(tx.id, 10)), 0) + 1;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function parseAmountValue(amount: string): number {
  const sign = amount.includes("+") ? 1 : -1;
  const num = parseFloat(
    amount.replace(/[^0-9,.]/g, "").replace(/\./g, "").replace(",", ".")
  );
  return sign * (Number.isNaN(num) ? 0 : num);
}

const PT_MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
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
    (a, b) => dateToSortValue(b.date) - dateToSortValue(a.date)
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

export function getAll(): Transaction[] {
  return store;
}

export function findById(id: string): Transaction | undefined {
  return store.find((tx) => tx.id === id);
}

export function create(data: Omit<Transaction, "id">): Transaction {
  const tx: Transaction = { ...data, id: String(nextId++) };
  store.push(tx);
  return tx;
}

export function update(id: string, data: Omit<Transaction, "id">): Transaction | null {
  const idx = store.findIndex((tx) => tx.id === id);
  if (idx === -1) return null;
  store[idx] = { ...data, id };
  return store[idx];
}

export function remove(id: string): boolean {
  const before = store.length;
  store = store.filter((tx) => tx.id !== id);
  return store.length < before;
}
