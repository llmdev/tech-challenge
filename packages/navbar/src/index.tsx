import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserCircleIcon } from "@repo/icons";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NavbarProps {
  userName?: string;
  className?: string;
  actions?: React.ReactNode;
}

function Navbar({
  userName = "Joana da Silva Oliveira",
  className,
  actions,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "bg-primary text-primary-foreground flex items-center justify-between px-4 sm:px-8 py-3 h-14",
        className
      )}
    >
      <div className="flex items-center gap-2">{actions}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-none">{userName}</span>
        <div className="w-10 h-10 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center">
          <UserCircleIcon className="w-6 h-6 opacity-80" />
        </div>
      </div>
    </header>
  );
}

export { Navbar };
