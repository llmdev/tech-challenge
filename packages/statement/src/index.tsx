import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TransactionItemData {
  month: string;
  description: string;
  date: string;
  amount: string;
  type: "credit" | "debit";
}

export interface TransactionItemProps extends TransactionItemData {
  className?: string;
}

function TransactionItem({
  month,
  description,
  date,
  amount,
  type,
  className,
}: TransactionItemProps) {
  return (
    <div className={cn("py-3 border-b border-accent/20 last:border-b-0", className)}>
      <p className="text-xs font-semibold text-accent mb-1">{month}</p>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{description}</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{date}</span>
      </div>
      <p
        className={cn(
          "text-sm font-semibold mt-0.5",
          type === "debit" ? "text-destructive" : "text-foreground"
        )}
      >
        {amount}
      </p>
    </div>
  );
}

export interface StatementProps {
  title?: string;
  items?: TransactionItemData[];
  className?: string;
  description?: string;
}

const defaultItems: TransactionItemData[] = [
  {
    month: "Novembro",
    description: "Depósito",
    date: "18/11/2022",
    amount: "R$ 150",
    type: "credit",
  },
  {
    month: "Novembro",
    description: "Depósito",
    date: "21/11/2022",
    amount: "R$ 100",
    type: "credit",
  },
  {
    month: "Novembro",
    description: "Depósito",
    date: "21/11/2022",
    amount: "R$ 50",
    type: "credit",
  },
  {
    month: "Novembro",
    description: "Transferência",
    date: "21/11/2022",
    amount: "-R$ 500",
    type: "debit",
  },
];

function Statement({
  title = "Extrato",
  items = defaultItems,
  className,
  description
}: StatementProps) {
  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <span className="text-sm font-tiny text-foreground">{description}</span>
      </div>

      <div>
        {items.map((item) => (
          <TransactionItem key={`${item.month}-${item.description}-${item.date}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export { Statement, TransactionItem };
