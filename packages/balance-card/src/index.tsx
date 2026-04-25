import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EyeIcon, EyeOffIcon } from "@repo/icons";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BalanceCardProps {
  userName?: string;
  date?: string;
  accountType?: string;
  balance?: string;
  balanceVisible?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
}

function BalanceCard({
  userName = "Joana",
  date = "Quinta-feira, 08/09/2024",
  accountType = "Conta Corrente",
  balance = "R$ 2.500,00",
  balanceVisible = true,
  onToggleVisibility,
  className,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground rounded-2xl px-8 pt-8 pb-12",
        className
      )}
    >
      <h1 className="text-2xl font-bold mb-1">Olá, {userName}! :)</h1>
      <p className="text-sm text-primary-foreground/60 mb-10">{date}</p>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold tracking-wide">Saldo</span>
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={balanceVisible ? "Ocultar saldo" : "Exibir saldo"}
          className="focus:outline-none"
        >
          {balanceVisible ? (
            <EyeIcon className="w-5 h-5 text-red-400" />
          ) : (
            <EyeOffIcon className="w-5 h-5 text-red-400" />
          )}
        </button>
      </div>
      <div className="border-b border-red-400/60 mb-3" />
      <p className="text-xs text-primary-foreground/60 mb-1">{accountType}</p>
      <p className="text-4xl font-light tracking-wide">
        {balanceVisible ? balance : "R$ ••••••"}
      </p>
    </div>
  );
}

export { BalanceCard };
