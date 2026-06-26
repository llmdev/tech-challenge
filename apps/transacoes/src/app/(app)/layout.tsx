import { headers } from "next/headers";
import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { BottomNav } from "@/components/bottom-nav";
import { auth } from "../../libs/auth";

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
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const userName = session?.user?.name ?? "Usuário";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        userName={userName}
        actions={
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        }
      />

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
