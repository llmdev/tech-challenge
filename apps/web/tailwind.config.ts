import type { Config } from "tailwindcss";
import { defaultTheme, defaultThemePlugin } from "@repo/theme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/button/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/navbar/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/sidebar/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/balance-card/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/transaction-form/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/statement/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/select/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: defaultTheme,
  },
  plugins: [defaultThemePlugin],
};

export default config;
