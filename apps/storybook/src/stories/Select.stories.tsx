import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectValue,
  SelectGroup,
} from "@repo/select";

const transactionOptions = [
  { value: "deposito", label: "Depósito" },
  { value: "transferencia", label: "Transferência" },
  { value: "saque", label: "Saque" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
];

const meta: Meta<typeof Select> = {
  title: "Design System/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost", "outline"],
    },
    placeholder: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: transactionOptions,
    placeholder: "Selecione o tipo de transação",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const ComLabel: Story = {
  args: {
    options: transactionOptions,
    placeholder: "Selecione o tipo de transação",
    label: "Tipo de transação",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const Variantes: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Select
        options={transactionOptions}
        placeholder="Variante default"
        variant="default"
        label="Default"
      />
      <Select
        options={transactionOptions}
        placeholder="Variante outline"
        variant="outline"
        label="Outline"
      />
      <Select
        options={transactionOptions}
        placeholder="Variante ghost"
        variant="ghost"
        label="Ghost"
      />
    </div>
  ),
};

export const ComValorSelecionado: Story = {
  args: {
    options: transactionOptions,
    defaultValue: "pix",
    label: "Tipo de transação",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const Primitivos: Story = {
  render: () => (
    <div className="w-72">
      <SelectRoot>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Entradas</SelectLabel>
            <SelectItem value="deposito">Depósito</SelectItem>
            <SelectItem value="pix-entrada">PIX recebido</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Saídas</SelectLabel>
            <SelectItem value="saque">Saque</SelectItem>
            <SelectItem value="transferencia">Transferência</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
};

export const Desabilitado: Story = {
  args: {
    options: transactionOptions,
    placeholder: "Componente desabilitado",
    disabled: true,
    label: "Tipo de transação",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};
