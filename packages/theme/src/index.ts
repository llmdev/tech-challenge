import plugin from "tailwindcss/plugin";

type CSSVars = Record<string, string>;

export const defaultThemeVars: CSSVars = {
  "--background": "150 22% 88%",
  "--foreground": "193 40% 18%",
  "--card": "0 0% 100%",
  "--card-foreground": "193 40% 18%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "193 40% 18%",
  "--primary": "193 52% 27%",
  "--primary-foreground": "0 0% 98%",
  "--secondary": "150 20% 78%",
  "--secondary-foreground": "193 40% 18%",
  "--muted": "150 12% 82%",
  "--muted-foreground": "150 5% 45%",
  "--accent": "145 63% 40%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 72% 51%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "150 15% 83%",
  "--input": "0 0% 100%",
  "--ring": "193 52% 27%",
  "--radius": "0.75rem",
};

export const darkThemeVars: CSSVars = {
  "--background": "193 40% 10%",
  "--foreground": "150 20% 95%",
  "--card": "193 40% 15%",
  "--card-foreground": "150 20% 95%",
  "--popover": "193 40% 15%",
  "--popover-foreground": "150 20% 95%",
  "--primary": "193 52% 45%",
  "--primary-foreground": "0 0% 98%",
  "--secondary": "193 30% 20%",
  "--secondary-foreground": "150 20% 90%",
  "--muted": "193 30% 20%",
  "--muted-foreground": "150 10% 60%",
  "--accent": "145 63% 45%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 62.8% 40%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "193 30% 22%",
  "--input": "193 30% 22%",
  "--ring": "193 52% 45%",
};

export const defaultTheme = {
  colors: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
};

export const defaultThemePlugin = plugin(({ addBase }) => {
  addBase({
    ":root": defaultThemeVars,
    ".dark": darkThemeVars,
  });
});
