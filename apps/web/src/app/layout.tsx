import type { Metadata } from "next";
import "./globals.css";
import { MockProvider } from "@/components/mock-provider";
import { BottomNav } from "@/app/components/bottom-nav";

export const metadata: Metadata = {
  title: "Tech Challenge",
  description: "Monorepo with Next.js and design system",
};

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
        <MockProvider>{children}</MockProvider>
        <BottomNav />
      </body>
    </html>
  );
}
