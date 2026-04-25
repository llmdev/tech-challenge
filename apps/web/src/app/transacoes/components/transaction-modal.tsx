"use client";

import { Modal } from "@repo/modal";
import { TransactionForm } from "@/app/components/transaction-form";
import type { Transaction } from "@/mocks/handlers";

export interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Transaction;
  onSuccess: () => void;
}

export function TransactionModal({
  open,
  onOpenChange,
  initial,
  onSuccess,
}: TransactionModalProps) {
  const title = initial ? "Editar transferência" : "Nova transferência";

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <TransactionForm
        key={initial?.id ?? "new"}
        initial={initial}
        onSuccess={() => {
          onOpenChange(false);
          onSuccess();
        }}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
