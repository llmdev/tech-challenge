"use client";

// Carregado sob demanda por graficos-content.tsx (next/dynamic): chart.js e
// react-chartjs-2 ficam fora do JS inicial da rota /graficos.
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { useMemo } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import type { Transaction } from "@repo/core";
import type { ChartColors } from "@/lib/chart-theme";
import {
  currency,
  gastosPorCategoria,
  monthlyEntradasSaidas,
  movimentacaoPorInstituicao,
  saldoAcumulado,
} from "@/lib/transacoes-analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

function withAlpha(hsl: string, alpha: number): string {
  return hsl.replace(/\)$/, ` / ${alpha})`);
}

function baseOptions<TType extends "bar" | "line">(colors: ChartColors): ChartOptions<TType> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: { color: colors.foreground, font: { size: 12, weight: 600 } },
      },
      tooltip: {
        backgroundColor: colors.isDark ? "hsl(193 40% 15%)" : "hsl(0 0% 100%)",
        titleColor: colors.foreground,
        bodyColor: colors.foreground,
        borderColor: colors.border,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: colors.mutedForeground, font: { size: 11 } },
      },
      y: {
        grid: { color: colors.border, drawTicks: false },
        border: { display: false },
        ticks: { color: colors.mutedForeground, font: { size: 11 } },
      },
    },
  } as unknown as ChartOptions<TType>;
}

export function MonthlyChart({ transactions, colors }: { transactions: Transaction[]; colors: ChartColors }) {
  const monthly = useMemo(() => monthlyEntradasSaidas(transactions), [transactions]);

  const data = {
    labels: monthly.map((m) => m.label),
    datasets: [
      {
        label: "Entradas",
        data: monthly.map((m) => m.entradas),
        backgroundColor: colors.accent,
        borderRadius: 4,
        maxBarThickness: 24,
      },
      {
        label: "Saídas",
        data: monthly.map((m) => m.saidas),
        backgroundColor: colors.destructive,
        borderRadius: 4,
        maxBarThickness: 24,
      },
    ],
  };

  const base = baseOptions<"bar">(colors);
  const options: ChartOptions<"bar"> = {
    ...base,
    plugins: {
      ...base.plugins,
      legend: { display: true, position: "top", align: "start", labels: { color: colors.foreground, boxWidth: 12, boxHeight: 12, usePointStyle: true, pointStyle: "circle" } },
      tooltip: {
        ...base.plugins?.tooltip,
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${currency.format(ctx.parsed.y ?? 0)}` },
      },
    },
  };

  if (monthly.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-72">
      <Bar data={data} options={options} />
    </div>
  );
}

export function CategoryChart({ transactions, colors }: { transactions: Transaction[]; colors: ChartColors }) {
  const categories = useMemo(() => gastosPorCategoria(transactions), [transactions]);

  const data = {
    labels: categories.map((c) => c.label),
    datasets: [
      {
        label: "Gasto",
        data: categories.map((c) => c.total),
        backgroundColor: categories.map((_, i) => colors.categorical[i % colors.categorical.length]),
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  };

  const base = baseOptions<"bar">(colors);
  const options: ChartOptions<"bar"> = {
    ...base,
    indexAxis: "y" as const,
    plugins: {
      ...base.plugins,
      tooltip: {
        ...base.plugins?.tooltip,
        callbacks: { label: (ctx) => currency.format(ctx.parsed.x ?? 0) },
      },
    },
    scales: {
      x: {
        grid: { color: colors.border, drawTicks: false },
        border: { display: false },
        ticks: { color: colors.mutedForeground, font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: colors.foreground, font: { size: 12, weight: 600 } },
      },
    },
  };

  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={{ height: Math.max(180, categories.length * 44) }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function BalanceChart({ transactions, colors }: { transactions: Transaction[]; colors: ChartColors }) {
  const points = useMemo(() => saldoAcumulado(transactions), [transactions]);

  const data = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label: "Saldo acumulado",
        data: points.map((p) => p.saldo),
        borderColor: colors.primary,
        backgroundColor: withAlpha(colors.primary, 0.1),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: colors.primary,
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const base = baseOptions<"line">(colors);
  const options: ChartOptions<"line"> = {
    ...base,
    plugins: {
      ...base.plugins,
      tooltip: {
        ...base.plugins?.tooltip,
        callbacks: { label: (ctx) => currency.format(ctx.parsed.y ?? 0) },
      },
    },
    scales: {
      ...base.scales,
      x: {
        ...base.scales?.x,
        ticks: { color: colors.mutedForeground, font: { size: 11 }, maxTicksLimit: 8, autoSkip: true },
      },
    },
  };

  if (points.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  );
}

export function InstitutionChart({ transactions, colors }: { transactions: Transaction[]; colors: ChartColors }) {
  const institutions = useMemo(() => movimentacaoPorInstituicao(transactions), [transactions]);

  const data = {
    labels: institutions.map((i) => i.institution),
    datasets: [
      {
        data: institutions.map((i) => i.total),
        backgroundColor: institutions.map((_, i) => colors.categorical[i % colors.categorical.length]),
        borderColor: colors.isDark ? "hsl(193 40% 15%)" : "hsl(0 0% 100%)",
        borderWidth: 2,
      },
    ],
  };

  if (institutions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-72">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: colors.foreground, boxWidth: 12, boxHeight: 12, usePointStyle: true, pointStyle: "circle", padding: 16 },
            },
            tooltip: {
              backgroundColor: colors.isDark ? "hsl(193 40% 15%)" : "hsl(0 0% 100%)",
              titleColor: colors.foreground,
              bodyColor: colors.foreground,
              borderColor: colors.border,
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
              callbacks: { label: (ctx) => `${ctx.label}: ${currency.format(ctx.parsed as number)}` },
            },
          },
        }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
      Sem dados suficientes para este período.
    </div>
  );
}
