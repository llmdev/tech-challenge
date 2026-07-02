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

export type TransactionInput = Omit<Transaction, "id">;

export interface TransactionRow {
  id: number;
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string; // já formatada como "DD/MM/YYYY" pelo to_char() na query
  amount: string; // numeric vem como string do node-postgres, sempre positivo
}
