import type { Meta, StoryObj } from "@storybook/react";
import { TransactionForm } from "@repo/transaction-form";

const meta: Meta<typeof TransactionForm> = {
  title: "Design System/TransactionForm",
  component: TransactionForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "sage",
      values: [{ name: "sage", value: "hsl(150, 22%, 88%)" }],
    },
  },
  argTypes: {
    transactionTypes: {
      description: "Tipos de transação disponíveis no dropdown",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionForm>;

export const Default: Story = {};

export const TiposPersonalizados: Story = {
  args: {
    transactionTypes: [
      { value: "deposito", label: "Depósito" },
      { value: "transferencia", label: "Transferência" },
      { value: "saque", label: "Saque" },
      { value: "pix", label: "PIX" },
      { value: "boleto", label: "Boleto" },
    ],
  },
};
