import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
