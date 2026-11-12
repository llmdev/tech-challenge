"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useChartColors } from "@/lib/chart-theme";
import { currency, summaryTotals } from "@/lib/transacoes-analytics";
import { type Transaction, listAllTransactionsUseCase } from "@repo/core";

// Placeholder com a mesma altura dos gráficos (h-72) para não gerar layout shift
function ChartSkeleton() {
  return <div className="h-72 rounded-xl bg-muted/50 animate-pulse" />;
}

// chart.js + react-chartjs-2 (~66 kB gzip) ficam num chunk separado, baixado
// só quando os gráficos vão renderizar — fora do JS inicial da rota.
const loadCharts = () => import("./graficos-charts");
const MonthlyChart = dynamic(() => loadCharts().then((m) => m.MonthlyChart), {
  ssr: false,
  loading: ChartSkeleton,
});
const BalanceChart = dynamic(() => loadCharts().then((m) => m.BalanceChart), {
  ssr: false,
  loading: ChartSkeleton,
});
const CategoryChart = dynamic(() => loadCharts().then((m) => m.CategoryChart), {
  ssr: false,
  loading: ChartSkeleton,
});
const InstitutionChart = dynamic(() => loadCharts().then((m) => m.InstitutionChart), {
  ssr: false,
  loading: ChartSkeleton,
});

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

const SUMMARY_LABELS = ["Total de entradas", "Total de saídas", "Saldo do período"];

function SummaryCards({ transactions }: { transactions: Transaction[] | null }) {
  const totals = useMemo(() => (transactions ? summaryTotals(transactions) : null), [transactions]);

  const cards = totals
    ? [
        { value: totals.entradas, className: "text-accent" },
        { value: totals.saidas, className: "text-destructive" },
        { value: totals.saldo, className: totals.saldo >= 0 ? "text-accent" : "text-destructive" },
      ]
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {SUMMARY_LABELS.map((label, i) => (
        <div key={label} className="bg-card rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {label}
          </p>
          {cards ? (
            <p className={`text-xl font-bold whitespace-nowrap ${cards[i].className}`}>
              {currency.format(cards[i].value)}
            </p>
          ) : (
            <p className="text-xl font-bold">
              <span className="inline-block h-[1em] w-28 rounded bg-muted animate-pulse align-middle" />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function GraficosContent() {
  // null = carregando; a estrutura da página é a mesma nos dois estados (sem CLS)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const colors = useChartColors();

  useEffect(() => {
    listAllTransactionsUseCase.execute().then(setTransactions);
  }, []);

  const chart = (Chart: typeof MonthlyChart) =>
    transactions ? <Chart transactions={transactions} colors={colors} /> : <ChartSkeleton />;

  return (
    <div className="flex flex-col gap-5">
      <SummaryCards transactions={transactions} />

      <ChartCard title="Entradas vs. saídas" description="Comparativo mensal dos últimos meses">
        {chart(MonthlyChart)}
      </ChartCard>

      <ChartCard title="Saldo acumulado" description="Evolução do saldo ao longo do tempo">
        {chart(BalanceChart)}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Gastos por categoria" description="Total de saídas agrupado por categoria">
          {chart(CategoryChart)}
        </ChartCard>

        <ChartCard title="Movimentação por instituição" description="Entradas e saídas somadas por instituição">
          {chart(InstitutionChart)}
        </ChartCard>
      </div>
    </div>
  );
}
