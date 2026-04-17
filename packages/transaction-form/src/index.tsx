import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@repo/button";
import { ChevronDownIcon } from "@repo/icons";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function DecorativeSquares() {
  return (
    <div className="absolute right-0 bottom-0 overflow-hidden rounded-2xl pointer-events-none">
      <div className="relative w-40 h-40">
        <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/20 rounded-sm" />
        <div className="absolute bottom-4 right-16 w-12 h-12 bg-white/15 rounded-sm" />
        <div className="absolute bottom-16 right-4 w-10 h-10 bg-white/10 rounded-sm" />
        <div className="absolute bottom-20 right-20 w-8 h-8 bg-white/20 rounded-sm" />
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/10 rounded-sm" />
      </div>
    </div>
  );
}

export interface TransactionFormProps {
  transactionTypes?: { value: string; label: string }[];
  className?: string;
}

const defaultTransactionTypes = [
  { value: "deposito", label: "Depósito" },
  { value: "transferencia", label: "Transferência" },
  { value: "saque", label: "Saque" },
];

function TransactionForm({
  transactionTypes = defaultTransactionTypes,
  className,
}: TransactionFormProps) {
  return (
    <div
      className={cn(
        "bg-muted rounded-2xl p-8 relative overflow-hidden",
        className
      )}
    >
      <DecorativeSquares />

      <h2 className="text-xl font-bold text-foreground mb-6 relative z-10">
        Nova transação
      </h2>

      <div className="space-y-4 relative z-10">
        <div className="relative">
          <select
            defaultValue=""
            className="w-full appearance-none bg-white border border-border rounded-md px-4 py-3 pr-10 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
          >
            <option value="" disabled={true}>
              Selecione o tipo de transação
            </option>
            {transactionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
        </div>

        <div>
          <label htmlFor="transaction-amount" className="text-xs text-muted-foreground mb-1.5 block font-medium">
            Valor
          </label>
          <input
            id="transaction-amount"
            type="text"
            defaultValue="00,00"
            className="w-full bg-white border border-border rounded-md px-4 py-3 text-sm text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <Button size="default">Concluir transação</Button>
      </div>
    </div>
  );
}

export { TransactionForm };
