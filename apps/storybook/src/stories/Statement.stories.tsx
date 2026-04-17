import type { Meta, StoryObj } from "@storybook/react";
import { Statement, TransactionItem } from "@repo/statement";

const meta: Meta<typeof Statement> = {
  title: "Design System/Statement",
  component: Statement,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "sage",
      values: [{ name: "sage", value: "hsl(150, 22%, 88%)" }],
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título do painel de extrato",
    },
    items: {
      description: "Lista de transações",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Statement>;

export const Default: Story = {};

export const VáriosMeses: Story = {
  args: {
    items: [
      {
        month: "Outubro",
        description: "Depósito",
        date: "05/10/2022",
        amount: "R$ 200",
        type: "credit",
      },
      {
        month: "Novembro",
        description: "Depósito",
        date: "18/11/2022",
        amount: "R$ 150",
        type: "credit",
      },
      {
        month: "Novembro",
        description: "Depósito",
        date: "21/11/2022",
        amount: "R$ 100",
        type: "credit",
      },
      {
        month: "Novembro",
        description: "Transferência",
        date: "21/11/2022",
        amount: "-R$ 500",
        type: "debit",
      },
      {
        month: "Dezembro",
        description: "PIX Recebido",
        date: "10/12/2022",
        amount: "R$ 750",
        type: "credit",
      },
    ],
  },
};

export const SomenteDebitos: Story = {
  args: {
    items: [
      {
        month: "Janeiro",
        description: "Transferência",
        date: "05/01/2024",
        amount: "-R$ 1.200",
        type: "debit",
      },
      {
        month: "Janeiro",
        description: "Boleto",
        date: "10/01/2024",
        amount: "-R$ 350",
        type: "debit",
      },
      {
        month: "Janeiro",
        description: "Saque",
        date: "15/01/2024",
        amount: "-R$ 200",
        type: "debit",
      },
    ],
  },
};

export const SomenteCreditos: Story = {
  args: {
    items: [
      {
        month: "Março",
        description: "Salário",
        date: "05/03/2024",
        amount: "R$ 5.000",
        type: "credit",
      },
      {
        month: "Março",
        description: "Freelance",
        date: "18/03/2024",
        amount: "R$ 1.200",
        type: "credit",
      },
      {
        month: "Março",
        description: "PIX Recebido",
        date: "22/03/2024",
        amount: "R$ 300",
        type: "credit",
      },
    ],
  },
};

export const ItemAvulso: StoryObj<typeof TransactionItem> = {
  render: () => (
    <div className="w-64 bg-card rounded-2xl p-4">
      <TransactionItem
        month="Novembro"
        description="Depósito"
        date="18/11/2022"
        amount="R$ 150"
        type="credit"
      />
      <TransactionItem
        month="Novembro"
        description="Transferência"
        date="21/11/2022"
        amount="-R$ 500"
        type="debit"
      />
    </div>
  ),
};
