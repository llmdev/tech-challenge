import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Challenge",
  description: "Monorepo with Next.js and design system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // nonce gerado no middleware — libera o script inline de tema na CSP
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="pt-BR">
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
