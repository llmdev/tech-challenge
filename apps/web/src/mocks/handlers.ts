import { http, HttpResponse } from "msw";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  institution: string;
  date: string;
  amount: string;
}

export interface MonthGroup {
  month: string;
  transactions: Transaction[];
}

const mockTransferencias: MonthGroup[] = [
  {
    month: "Novembro 2024",
    transactions: [
      {
        id: "1",
        type: "credit",
        description: "Depósito recebido",
        institution: "Banco Inter",
        date: "21/11/2024",
        amount: "+ R$ 1.500,00",
      },
      {
        id: "2",
        type: "debit",
        description: "Transferência enviada",
        institution: "João Silva",
        date: "18/11/2024",
        amount: "- R$ 500,00",
      },
      {
        id: "3",
        type: "debit",
        description: "Pagamento de fatura",
        institution: "Cartão Nubank",
        date: "15/11/2024",
        amount: "- R$ 890,00",
      },
      {
        id: "4",
        type: "credit",
        description: "Pix recebido",
        institution: "Maria Oliveira",
        date: "10/11/2024",
        amount: "+ R$ 250,00",
      },
    ],
  },
  {
    month: "Outubro 2024",
    transactions: [
      {
        id: "5",
        type: "debit",
        description: "Conta de luz",
        institution: "CEMIG",
        date: "05/10/2024",
        amount: "- R$ 89,50",
      },
      {
        id: "6",
        type: "debit",
        description: "Transferência enviada",
        institution: "Carlos Mendes",
        date: "03/10/2024",
        amount: "- R$ 300,00",
      },
      {
        id: "7",
        type: "credit",
        description: "Salário",
        institution: "Empresa XYZ Ltda.",
        date: "01/10/2024",
        amount: "+ R$ 5.000,00",
      },
    ],
  },
  {
    month: "Setembro 2024",
    transactions: [
      {
        id: "8",
        type: "debit",
        description: "Pagamento de boleto",
        institution: "COPASA",
        date: "28/09/2024",
        amount: "- R$ 45,00",
      },
      {
        id: "9",
        type: "credit",
        description: "Pix recebido",
        institution: "Ana Paula",
        date: "20/09/2024",
        amount: "+ R$ 180,00",
      },
      {
        id: "10",
        type: "debit",
        description: "Transferência enviada",
        institution: "Pedro Alves",
        date: "15/09/2024",
        amount: "- R$ 750,00",
      },
    ],
  },
];

export const handlers = [
  http.get("/api/transferencias", () => {
    return HttpResponse.json(mockTransferencias);
  }),
];
