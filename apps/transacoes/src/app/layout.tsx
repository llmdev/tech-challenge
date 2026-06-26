import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transações",
  description: "Gerenciamento de transações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
