import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { Button } from "@repo/button";
import { EyeIcon, PencilIcon, TrashIcon, SearchIcon, PlusIcon } from "@repo/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarItems = [
  { label: "Início", href: "/" },
  { label: "Transferências", href: "/transferencias", active: true },
  { label: "Investimentos", href: "/investimentos" },
  { label: "Outros serviços", href: "/outros-servicos" },
];

interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  institution: string;
  date: string;
  amount: string;
}

interface MonthGroup {
  month: string;
  transactions: Transaction[];
}

const transactionGroups: MonthGroup[] = [
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

export default function Transferencias() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar userName="Joana da Silva Oliveira" actions={<ThemeToggle />} />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto flex gap-5">
          <Sidebar className="w-44 self-start sticky top-6" items={sidebarItems} />

          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Cabeçalho e filtros */}
            <div className="bg-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Transferências</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {transactionGroups.reduce((acc, g) => acc + g.transactions.length, 0)} transações encontradas
                  </p>
                </div>
                <Button icon={<PlusIcon className="w-4 h-4" />}>
                  Nova transferência
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar transferência..."
                    readOnly
                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none cursor-default"
                  />
                </div>

                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm font-medium rounded-md bg-card text-foreground shadow-sm"
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Entradas
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Saídas
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de transações */}
            <div className="bg-card rounded-2xl p-6 space-y-8">
              {transactionGroups.map((group) => (
                <div key={group.month}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {group.month}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {group.transactions.length} transações
                    </span>
                  </div>

                  <div>
                    {group.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors group border-b border-border/60 last:border-b-0"
                      >
                        {/* Indicador de tipo */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base font-semibold select-none ${
                            tx.type === "credit"
                              ? "bg-accent/15 text-accent"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {tx.type === "credit" ? "↓" : "↑"}
                        </div>

                        {/* Descrição */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {tx.description}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {tx.institution}
                          </p>
                        </div>

                        {/* Data */}
                        <span className="text-xs text-muted-foreground w-24 text-right flex-shrink-0">
                          {tx.date}
                        </span>

                        {/* Valor */}
                        <span
                          className={`text-sm font-semibold w-32 text-right flex-shrink-0 ${
                            tx.type === "credit" ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {tx.amount}
                        </span>

                        {/* Ações */}
                        <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            icon={<EyeIcon className="w-4 h-4" />}
                            aria-label="Ver detalhes"
                            className="w-8 h-8 rounded-full"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            icon={<PencilIcon className="w-4 h-4" />}
                            aria-label="Editar"
                            className="w-8 h-8 rounded-full"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            icon={<TrashIcon className="w-4 h-4" />}
                            aria-label="Excluir"
                            className="w-8 h-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
