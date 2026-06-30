import { headers } from "next/headers";
import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { BottomNav } from "@/components/bottom-nav";
import { auth } from "../../libs/auth";
import { LocalNavbar } from "./components/local-navbar";

const menuItems = [
  { label: "Início", href: "/", active: false },
  { label: "Transações", href: "/transacoes", active: true },
  { label: "", component: <LogoutButton /> },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LocalNavbar />

      <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-5">
          <Sidebar
            items={menuItems}
            className="hidden lg:block w-44 self-start sticky top-6"
          />

          <div className="flex-1 flex flex-col gap-5 min-w-0">{children}</div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
