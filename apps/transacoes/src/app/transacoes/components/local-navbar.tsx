"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/libs/auth-client";
import { Navbar } from "@repo/navbar";

export function LocalNavbar() {
  const { data } = useSession();

  return (
    <Navbar
      userName={data?.user.name || ""}
      actions={
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      }
    />
  );
}
