import { Button } from "@repo/button";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PencilIcon, TrashIcon } from "@repo/icons";

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
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
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
  onEdit,
  onDelete,
  className,
}: StatementProps) {
  return (
    <div className={cn("bg-card rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={onEdit}
            className="rounded-full w-9 h-9"
            aria-label="Editar"
          />
          <Button
            size="icon"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={onDelete}
            className="rounded-full w-9 h-9"
            aria-label="Excluir"
          />
        </div>
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
