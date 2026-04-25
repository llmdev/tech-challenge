import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { HomeContent } from "./components/home-content";
import { StatementContent } from "./components/statement-content";

const menuItens = [
  { label: "Início", href: "/", active: true },
  { label: "Transações", href: "/transacoes" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        userName="Joana da Silva Oliveira"
        actions={<ThemeToggle />}
      />

      <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-5">
          <Sidebar items={menuItens} className="hidden lg:block w-44 self-start sticky top-6" />

          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <HomeContent />
          </div>

          <StatementContent className="lg:w-60 lg:flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
