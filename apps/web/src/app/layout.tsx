import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/app/components/bottom-nav";
import { Navbar } from "@repo/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "@repo/sidebar";
import { StatementContent } from "./components/statement-content";

export const metadata: Metadata = {
  title: "Tech Challenge",
  description: "Monorepo with Next.js and design system",
};
const menuItens = [
  { label: "Início", href: "/", active: true },
  { label: "Transações", href: "/transacoes" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar
            userName="Joana da Silva Oliveira"
            actions={<ThemeToggle />}
          />

          <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-5">
              <Sidebar items={menuItens} className="hidden lg:block w-44 self-start sticky top-6" />

              <div className="flex-1 flex flex-col gap-5 min-w-0">
                {children}
              </div>

              <StatementContent className="lg:w-60 lg:flex-shrink-0" />
            </div>
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
