// Categorias de transações permitidas.
export const CATEGORIES = [
  { value: "pix", label: "PIX" },
  { value: "conta", label: "Conta" },
  { value: "salario", label: "Salário" },
  { value: "compras", label: "Compras" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "outros", label: "Outros" },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];
