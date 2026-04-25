import { http, HttpResponse } from "msw";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string; // "DD/MM/YYYY"
  amount: string; // "+ R$ X,XX" or "- R$ X,XX"
}

export interface MonthGroup {
  month: string;
  transactions: Transaction[];
}

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "msw_transferencias";

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

function loadStore(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {}
  return [...SEED];
}

function saveStore(data: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ── Mutable flat store ────────────────────────────────────────────────────────

let store: Transaction[] = loadStore();
let nextId = store.reduce((max, tx) => Math.max(max, parseInt(tx.id, 10)), 0) + 1;

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseAmountValue(amount: string): number {
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

function groupByMonth(transactions: Transaction[]): MonthGroup[] {
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

  return Array.from(map.entries()).map(([month, transactions]) => ({
    month,
    transactions,
  }));
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export const handlers = [
  http.get("/api/saldo", () => {
    const total = store.reduce((acc, tx) => acc + parseAmountValue(tx.amount), 0);
    const formatted = total.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return HttpResponse.json({ balance: `R$ ${formatted}` });
  }),

  http.get("/api/transferencias", () => {
    return HttpResponse.json(groupByMonth(store));
  }),

  http.post("/api/transferencias", async ({ request }) => {
    const body = (await request.json()) as Omit<Transaction, "id">;
    const created: Transaction = { ...body, id: String(nextId++) };
    store.push(created);
    saveStore(store);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put("/api/transferencias/:id", async ({ request, params }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as Omit<Transaction, "id">;
    const idx = store.findIndex((tx) => tx.id === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    store[idx] = { ...body, id };
    saveStore(store);
    return HttpResponse.json(store[idx]);
  }),

  http.delete("/api/transferencias/:id", ({ params }) => {
    const { id } = params as { id: string };
    store = store.filter((tx) => tx.id !== id);
    saveStore(store);
    return new HttpResponse(null, { status: 204 });
  }),
];
