export interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string; // "DD/MM/YYYY"
  amount: string; // "+ R$ X,XX" ou "- R$ X,XX"
}

export interface PaginatedTransactions {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
