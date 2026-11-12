import { Suspense } from "react";
import { headers } from "next/headers";
import { Statement } from "@repo/statement";
import { Navbar } from "@repo/navbar";
import { Sidebar } from "@repo/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { BottomNav } from "@/app/components/bottom-nav";
import { StatementContent } from "@/app/components/statement-content";
import { getLastStatementItems, getSession } from "@/lib/server-data";
import { StoreProvider } from "@/store/store-provider";

function buildMenuItems(pathname: string) {
  return [
    { label: "Início", href: "/", active: pathname === "/" },
    { label: "Transações", href: "/transacoes", active: pathname.startsWith("/transacoes") },
    { label: "Carteira", href: "/graficos", active: pathname.startsWith("/graficos") },
    { label: "", component: <LogoutButton /> },
  ];
}

const STATEMENT_CLASS = "lg:w-60 lg:flex-shrink-0";

async function StatementSection() {
  const items = await getLastStatementItems();
  return <StatementContent className={STATEMENT_CLASS} initialItems={items} />;
}

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const menuItems = buildMenuItems(pathname);

  const session = await getSession();
  const userName = session?.user?.name ?? "Usuário";

  // StoreProvider envolve a página (HomeContent) e o extrato (StatementContent)
  // para que os dois compartilhem o mesmo store Redux.
  return (
    <StoreProvider>
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

            <div className="flex-1 flex flex-col gap-5 min-w-0">
              {children}
            </div>

            {/* streaming: o extrato não bloqueia o render do conteúdo principal */}
            <Suspense fallback={<Statement items={[]} className={STATEMENT_CLASS} description="5 últimos lançamentos" />}>
              <StatementSection />
            </Suspense>
          </div>
        </main>

        <BottomNav />
      </div>
    </StoreProvider>
  );
}
