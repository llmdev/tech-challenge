import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { BalanceCard } from "@repo/balance-card";
import { TransactionForm } from "@repo/transaction-form";
import { Statement } from "@repo/statement";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        userName="Joana da Silva Oliveira"
        actions={<ThemeToggle />}
      />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto flex gap-5 h-full">
          <Sidebar className="w-44" />

          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <BalanceCard
              userName="Joana"
              date="Quinta-feira, 08/09/2024"
              accountType="Conta Corrente"
              balance="R$ 2.500,00"
              balanceVisible={true}
            />
            <TransactionForm />
          </div>

          <Statement className="w-60 flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
