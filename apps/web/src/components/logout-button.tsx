"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Sair da conta"
      className="text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors px-2 py-1 rounded hover:bg-primary-foreground/10"
    >
      Sair
    </button>
  );
}
