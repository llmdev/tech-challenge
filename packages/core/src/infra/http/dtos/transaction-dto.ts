export interface TransactionsPaginatedResponse {
  items: Transaction[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}


export interface Transaction {
  id: string
  type: string
  category: string
  description: string
  institution: string
  date: string
  amount: string
}

export type TransactionInput = Omit<Transaction, "id">
