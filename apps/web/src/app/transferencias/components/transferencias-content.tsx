"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/button";
import { EyeIcon, PencilIcon, TrashIcon, SearchIcon, PlusIcon } from "@repo/icons";
import type { MonthGroup, Transaction } from "@/mocks/handlers";

type Filter = "all" | "credit" | "debit";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Todas",
  credit: "Entradas",
  debit: "Saídas",
};

function applyFilter(groups: MonthGroup[], filter: Filter): MonthGroup[] {
  if (filter === "all") return groups;
  return groups
    .map((group) => ({
      ...group,
      transactions: group.transactions.filter((tx) => tx.type === filter),
    }))
    .filter((group) => group.transactions.length > 0);
}

function totalTransactions(groups: MonthGroup[]): number {
  return groups.reduce((acc, g) => acc + g.transactions.length, 0);
}

export function TransferenciasContent() {
  const [allGroups, setAllGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/transferencias")
      .then((res) => res.json())
      .then((data: MonthGroup[]) => {
        setAllGroups(data);
        setLoading(false);
      });
  }, []);

  const filteredGroups = applyFilter(allGroups, filter);
  const count = totalTransactions(filteredGroups);

  return (
    <>
      {/* Cabeçalho e filtros */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transferências</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Carregando..." : `${count} transações encontradas`}
            </p>
          </div>
          <Button icon={<PlusIcon className="w-4 h-4" />}>
            Nova transferência
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transferência..."
              readOnly
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none cursor-default"
            />
          </div>

          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["all", "credit", "debit"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === f
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      <TransferenciasList groups={filteredGroups} loading={loading} />
    </>
  );
}

function TransferenciasList({
  groups,
  loading,
}: {
  groups: MonthGroup[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 space-y-8">
      {groups.map((group) => (
        <div key={group.month}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {group.month}
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {group.transactions.length} transações
            </span>
          </div>

          <div>
            {group.transactions.map((tx: Transaction) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors group border-b border-border/60 last:border-b-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base font-semibold select-none ${
                    tx.type === "credit"
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {tx.type === "credit" ? "↓" : "↑"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {tx.institution}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground w-24 text-right flex-shrink-0">
                  {tx.date}
                </span>

                <span
                  className={`text-sm font-semibold w-32 text-right flex-shrink-0 ${
                    tx.type === "credit" ? "text-accent" : "text-destructive"
                  }`}
                >
                  {tx.amount}
                </span>

                <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<EyeIcon className="w-4 h-4" />}
                    aria-label="Ver detalhes"
                    className="w-8 h-8 rounded-full"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<PencilIcon className="w-4 h-4" />}
                    aria-label="Editar"
                    className="w-8 h-8 rounded-full"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4" />}
                    aria-label="Excluir"
                    className="w-8 h-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
