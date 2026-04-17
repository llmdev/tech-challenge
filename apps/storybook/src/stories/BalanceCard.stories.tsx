import type { Meta, StoryObj } from "@storybook/react";
import { BalanceCard } from "@repo/balance-card";

const meta: Meta<typeof BalanceCard> = {
  title: "Design System/BalanceCard",
  component: BalanceCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "sage",
      values: [{ name: "sage", value: "hsl(150, 22%, 88%)" }],
    },
  },
  argTypes: {
    userName: {
      control: "text",
      description: "Nome do usuário para saudação",
    },
    date: {
      control: "text",
      description: "Data atual formatada",
    },
    accountType: {
      control: "text",
      description: "Tipo de conta bancária",
    },
    balance: {
      control: "text",
      description: "Saldo formatado (ex: R$ 2.500,00)",
    },
    balanceVisible: {
      control: "boolean",
      description: "Visibilidade do saldo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    userName: "Joana",
    date: "Quinta-feira, 08/09/2024",
    accountType: "Conta Corrente",
    balance: "R$ 2.500,00",
    balanceVisible: true,
  },
};

export const SaldoOculto: Story = {
  args: {
    userName: "Joana",
    date: "Quinta-feira, 08/09/2024",
    accountType: "Conta Corrente",
    balance: "R$ 2.500,00",
    balanceVisible: false,
  },
};

export const SaldoAlto: Story = {
  args: {
    userName: "Lucas",
    date: "Sexta-feira, 17/04/2026",
    accountType: "Conta Poupança",
    balance: "R$ 15.750,89",
    balanceVisible: true,
  },
};

export const SaldoNegativo: Story = {
  args: {
    userName: "Maria",
    date: "Segunda-feira, 01/01/2024",
    accountType: "Conta Corrente",
    balance: "-R$ 320,00",
    balanceVisible: true,
  },
};
