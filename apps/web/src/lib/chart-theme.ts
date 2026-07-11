"use client";

import { useEffect, useState } from "react";

// Paleta categórica validada para 8 séries (ver skill de dataviz) — usada apenas
// nos gráficos, onde o canvas do Chart.js exige cores resolvidas em vez de
// tokens Tailwind. Ordem fixa: nunca reordenar por valor, só por identidade.
const CATEGORICAL_LIGHT = [
  "#2a78d6", // blue
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
  "#e87ba4", // magenta
  "#eb6834", // orange
];

const CATEGORICAL_DARK = [
  "#3987e5",
  "#199e70",
  "#c98500",
  "#008300",
  "#9085e9",
  "#e66767",
  "#d55181",
  "#d95926",
];

export interface ChartColors {
  isDark: boolean;
  accent: string;
  destructive: string;
  primary: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  categorical: string[];
}

function cssVar(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return `hsl(${value})`;
}

function readColors(): ChartColors {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    isDark,
    accent: cssVar("--accent"),
    destructive: cssVar("--destructive"),
    primary: cssVar("--primary"),
    foreground: cssVar("--foreground"),
    mutedForeground: cssVar("--muted-foreground"),
    border: cssVar("--border"),
    categorical: isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT,
  };
}

const FALLBACK_COLORS: ChartColors = {
  isDark: false,
  accent: "hsl(145 63% 40%)",
  destructive: "hsl(0 72% 51%)",
  primary: "hsl(193 52% 27%)",
  foreground: "hsl(193 40% 18%)",
  mutedForeground: "hsl(150 5% 45%)",
  border: "hsl(150 15% 83%)",
  categorical: CATEGORICAL_LIGHT,
};

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(FALLBACK_COLORS);

  useEffect(() => {
    setColors(readColors());

    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
}
