"use client";

import { useEffect, useState } from "react";
import { Modal } from "@repo/modal";
import { Input } from "@repo/input";
import { Select } from "@repo/select";
import { Button } from "@repo/button";
import type { Transaction } from "@/mocks/handlers";

const TIPO_OPTIONS = [
  { value: "credit", label: "Receita" },
  { value: "debit", label: "Despesa" },
];

const CATEGORY_OPTIONS = [
  { value: "salario", label: "Salário" },
  { value: "pix", label: "PIX" },
  { value: "receita", label: "Receita" },
  { value: "transf", label: "Transferência" },
  { value: "fatura", label: "Fatura" },
  { value: "boleto", label: "Boleto" },
  { value: "conta", label: "Conta" },
  { value: "outros", label: "Outros" },
];

function todayDDMMYYYY(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function parseAmountString(amount: string): string {
  return amount.replace(/[^0-9,]/g, "").replace(",", ".");
}

function formatAmount(raw: string, tipo: "credit" | "debit"): string {
  const num = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(num)) return `${tipo === "credit" ? "+" : "-"} R$ 0,00`;
  const formatted = num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${tipo === "credit" ? "+" : "-"} R$ ${formatted}`;
}

interface FormState {
  tipo: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string;
  valor: string;
}

const EMPTY: FormState = {
  tipo: "credit",
  category: "",
  description: "",
  institution: "",
  date: "",
  valor: "",
};

function stateFromTransaction(tx: Transaction): FormState {
  return {
    tipo: tx.type,
    category: tx.category,
    description: tx.description,
    institution: tx.institution,
    date: tx.date,
    valor: parseAmountString(tx.amount),
  };
}

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
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? stateFromTransaction(initial)
          : { ...EMPTY, date: todayDDMMYYYY() }
      );
      setError(null);
    }
  }, [open, initial]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: Omit<Transaction, "id"> = {
      type: form.tipo,
      category: form.category,
      description: form.description,
      institution: form.institution,
      date: form.date,
      amount: formatAmount(form.valor, form.tipo),
    };

    try {
      const url = initial
        ? `/api/transferencias/${initial.id}`
        : "/api/transferencias";
      const method = initial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  }

  const title = initial ? "Editar transferência" : "Nova transferência";

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Tipo"
          options={TIPO_OPTIONS}
          value={form.tipo}
          onValueChange={(v) => set("tipo", v as "credit" | "debit")}
        />

        <Select
          label="Categoria"
          options={CATEGORY_OPTIONS}
          placeholder="Selecione a categoria"
          value={form.category}
          onValueChange={(v) => set("category", v)}
        />

        <Input
          label="Descrição"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Ex: Pagamento de fatura"
          required
        />

        <Input
          label="Instituição"
          value={form.institution}
          onChange={(e) => set("institution", e.target.value)}
          placeholder="Ex: Banco Inter"
        />

        <Input
          label="Data (DD/MM/AAAA)"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          placeholder="25/04/2026"
          required
        />

        <Input
          label="Valor (R$)"
          value={form.valor}
          onChange={(e) => set("valor", e.target.value)}
          placeholder="0,00"
          inputMode="decimal"
          required
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? "Salvando..." : initial ? "Salvar" : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
