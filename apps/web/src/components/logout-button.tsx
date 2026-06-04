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
      className="block py-3 px-2 text-sm font-medium transition-colors"
    >
      Sair
    </button>
  );
}
