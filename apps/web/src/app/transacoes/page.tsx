import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { TransferenciasContent } from "./components/transferencias-content";

const sidebarItems = [
  { label: "Início", href: "/" },
  { label: "Transações", href: "/transacoes", active: true },
];

export default function Transferencias() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar userName="Joana da Silva Oliveira" actions={<ThemeToggle />} />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto flex gap-5">
          <Sidebar className="w-44 self-start sticky top-6" items={sidebarItems} />

          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <TransferenciasContent />
          </div>
        </div>
      </main>
    </div>
  );
}
