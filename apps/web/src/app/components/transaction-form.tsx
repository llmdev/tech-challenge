"use client";

import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Input } from "@repo/input";
import { Select } from "@repo/select";
import { Button } from "@repo/button";
import type { Transaction } from "@/mocks/handlers";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  if (Number.isNaN(num)) {
    return `${tipo === "credit" ? "+" : "-"} R$ 0,00`;
  }
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

export interface TransactionFormProps {
  initial?: Transaction;
  onSuccess: () => void;
  onCancel?: () => void;
  variant?: "card" | "inline";
}

export function TransactionForm({
  initial,
  onSuccess,
  onCancel,
  variant = "inline",
}: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    initial ? stateFromTransaction(initial) : { ...EMPTY, date: todayDDMMYYYY() }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCredit = form.tipo === "credit";

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
      const url = initial ? `/api/transacoes/${initial.id}` : "/api/transacoes";
      const method = initial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      if (!initial) {
        setForm({ ...EMPTY, date: todayDDMMYYYY() });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="flex bg-muted p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => set("tipo", "credit")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
            isCredit
              ? "bg-card text-accent shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-base leading-none">↓</span>
          Receita
        </button>
        <button
          type="button"
          onClick={() => set("tipo", "debit")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
            !isCredit
              ? "bg-card text-destructive shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-base leading-none">↑</span>
          Despesa
        </button>
      </div>

      {/* Amount hero */}
      <div className="py-4 text-center">
        <div className="inline-flex items-baseline gap-2">
          <span
            className={cn(
              "text-xl font-light transition-colors duration-300",
              isCredit ? "text-accent/60" : "text-destructive/60"
            )}
          >
            {isCredit ? "+ R$" : "- R$"}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={form.valor}
            onChange={(e) => set("valor", e.target.value)}
            placeholder="0,00"
            required={true}
            className={cn(
              "text-5xl font-light bg-transparent border-none outline-none text-center",
              "placeholder:text-muted-foreground/30 transition-colors duration-300 w-48",
              isCredit ? "text-accent" : "text-destructive"
            )}
          />
        </div>
        <div
          className={cn(
            "mt-3 mx-auto h-px w-24 transition-colors duration-300",
            isCredit ? "bg-accent/30" : "bg-destructive/30"
          )}
        />
      </div>

      {/* Secondary fields — 2-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Descrição"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Ex: Salário"
          required={true}
        />
        <Input
          label="Instituição"
          value={form.institution}
          onChange={(e) => set("institution", e.target.value)}
          placeholder="Ex: Banco Inter"
        />
        <Select
          label="Categoria"
          options={CATEGORY_OPTIONS}
          placeholder="Categoria"
          value={form.category}
          onValueChange={(v) => set("category", v)}
        />
        <Input
          label="Data (DD/MM/AAAA)"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
          placeholder={todayDDMMYYYY()}
          required={true}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Actions */}
      <div className={cn("flex gap-3", onCancel ? "" : "pt-1")}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className={cn(
            "flex-1 transition-colors duration-300",
            isCredit
              ? "bg-accent hover:bg-accent/90 text-accent-foreground"
              : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          )}
          disabled={submitting}
        >
          {submitting
            ? "Salvando..."
            : initial
              ? "Salvar alterações"
              : isCredit
                ? "Registrar receita"
                : "Registrar despesa"}
        </Button>
      </div>
    </form>
  );

  if (variant !== "card") {
    return formContent;
  }

  return (
    <div
      className={cn(
        "bg-card rounded-2xl overflow-hidden transition-shadow duration-300",
        isCredit
          ? "shadow-[0_0_0_1.5px_hsl(var(--accent)/0.25),0_8px_32px_hsl(var(--accent)/0.08)]"
          : "shadow-[0_0_0_1.5px_hsl(var(--destructive)/0.25),0_8px_32px_hsl(var(--destructive)/0.08)]"
      )}
    >
      {/* Top accent strip */}
      <div
        className={cn(
          "h-1 w-full transition-colors duration-300",
          isCredit ? "bg-accent" : "bg-destructive"
        )}
      />

      <div className="px-6 pt-5 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-5">
          Nova transação
        </p>
        {formContent}
      </div>
    </div>
  );
}
