"use client";

import { signOut } from "@/libs/auth-client";

export function LogoutButton() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
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
