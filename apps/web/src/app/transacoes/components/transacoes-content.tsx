"use client";

import { useCallback, useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Button } from "@repo/button";
import { Input } from "@repo/input";
import { EyeIcon, PencilIcon, TrashIcon, SearchIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@repo/icons";
import type { MonthGroup, Transaction } from "@/mocks/handlers";
import { TransactionModal } from "./transaction-modal";

type Filter = "all" | "credit" | "debit";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Todas",
  credit: "Entradas",
  debit: "Saídas",
};

function applySearch(groups: MonthGroup[], term: string): MonthGroup[] {
  if (!term.trim()) return groups;
  const lower = term.toLowerCase();
  return groups
    .map((group) => ({
      ...group,
      transactions: group.transactions.filter(
        (tx) =>
          tx.description.toLowerCase().includes(lower) ||
          tx.institution.toLowerCase().includes(lower)
      ),
    }))
    .filter((group) => group.transactions.length > 0);
}

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

function parseAmount(amount: string): number {
  const sign = amount.includes("+") ? 1 : -1;
  const num = parseFloat(
    amount.replace(/[^0-9,.]/g, "").replace(/\./g, "").replace(",", ".")
  );
  return sign * (Number.isNaN(num) ? 0 : num);
}

function calculateBalance(groups: MonthGroup[]): number {
  return groups
    .flatMap((g) => g.transactions)
    .reduce((acc, tx) => acc + parseAmount(tx.amount), 0);
}

export function TransacoesContent() {
  const [allGroups, setAllGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | undefined>(undefined);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("/api/transacoes")
      .then((res) => res.json())
      .then((data: MonthGroup[]) => {
        setAllGroups(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(id: string) {
    await fetch(`/api/transacoes/${id}`, { method: "DELETE" });
    fetchData();
  }

  function openCreate() {
    setEditTarget(undefined);
    setModalOpen(true);
  }

  function openEdit(tx: Transaction) {
    setEditTarget(tx);
    setModalOpen(true);
  }

  const searchedGroups = applySearch(allGroups, search);
  const filteredGroups = applyFilter(searchedGroups, filter);
  const count = totalTransactions(filteredGroups);
  const balanceValue = calculateBalance(filteredGroups);

  return (
    <>
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editTarget}
        onSuccess={fetchData}
      />

      {/* Cabeçalho e filtros */}
      <div className="bg-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Carregando..." : `${count} transações encontradas`}
            </p>
          </div>
          <Button size="sm" icon={<PlusIcon className="w-4 h-4" />} onClick={openCreate} className="flex-shrink-0">
            <span className="hidden sm:inline">Nova transação</span>
            <span className="sm:hidden sr-only">Nova</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar transações..."
              variant="outline"
              size="sm"
              className="pl-9"
            />
          </div>

          <div className="flex gap-1 p-1 bg-muted rounded-lg self-start">
            {(["all", "credit", "debit"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
      <TransacoesList
        groups={filteredGroups}
        loading={loading}
        balanceValue={balanceValue}
        filter={filter}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </>
  );
}

const BALANCE_LABEL: Record<Filter, string> = {
  all: "Saldo total",
  credit: "Total de entradas",
  debit: "Total de saídas",
};

function TransacoesList({
  groups,
  loading,
  balanceValue,
  filter,
  onEdit,
  onDelete,
}: {
  groups: MonthGroup[];
  loading: boolean;
  balanceValue: number;
  filter: Filter;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const isNegative = balanceValue < 0;
  const colorClass = loading ? "text-muted-foreground" : isNegative ? "text-destructive" : "text-accent";

  const balanceRow = (
    <div
      className={`relative flex items-center justify-between rounded-xl px-5 py-4 mb-6 overflow-hidden border-l-[3px] ${
        loading
          ? "bg-muted/40 border-l-border"
          : isNegative
            ? "bg-destructive/5 border-l-destructive"
            : "bg-accent/10 border-l-accent"
      }`}
    >
      {/* decorative blurred orb */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
          loading ? "opacity-0" : isNegative ? "bg-destructive/20" : "bg-accent/20"
        }`}
      />

      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
          {BALANCE_LABEL[filter]}
        </p>
        <p className={`text-2xl font-bold tracking-tight tabular-nums ${colorClass}`}>
          {loading ? "—" : (
            <NumberFlow
              value={balanceValue}
              locales="pt-BR"
              format={{ style: "currency", currency: "BRL" }}
            />
          )}
        </p>
      </div>

      <div
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
          loading ? "bg-muted" : isNegative ? "bg-destructive/10" : "bg-accent/15"
        }`}
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full bg-muted-foreground/20" />
        ) : isNegative ? (
          <ChevronDownIcon className="w-4 h-4 text-destructive" />
        ) : (
          <ChevronUpIcon className="w-4 h-4 text-accent" />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6">
        {balanceRow}
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6">
        {balanceRow}
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Nenhuma transação encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6">
      {balanceRow}
      <div className="space-y-8">
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
                className="flex items-center gap-2 sm:gap-4 py-3 px-2 sm:px-3 rounded-xl hover:bg-muted/50 transition-colors group border-b border-border/60 last:border-b-0"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base font-semibold select-none ${
                    tx.type === "credit"
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {tx.type === "credit" ? "↓" : "↑"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {tx.institution}
                  </p>
                </div>

                <span className="hidden sm:block text-xs text-muted-foreground w-24 text-right flex-shrink-0">
                  {tx.date}
                </span>

                <span
                  className={`text-sm font-semibold text-right flex-shrink-0 ${
                    tx.type === "credit" ? "text-accent" : "text-destructive"
                  }`}
                >
                  {tx.amount}
                </span>

                <div className="flex gap-0.5 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<EyeIcon className="w-4 h-4" />}
                    aria-label="Ver detalhes"
                    className="w-8 h-8 rounded-full hidden sm:inline-flex"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<PencilIcon className="w-4 h-4" />}
                    aria-label="Editar"
                    className="w-8 h-8 rounded-full"
                    onClick={() => onEdit(tx)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4" />}
                    aria-label="Excluir"
                    className="w-8 h-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(tx.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
