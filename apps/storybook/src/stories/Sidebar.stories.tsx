import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "@repo/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Design System/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      description: "Lista de itens de navegação",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const InícioAtivo: Story = {
  args: {
    items: [
      { label: "Início", href: "/", active: true },
      { label: "Transferências", href: "/transferencias" },
      { label: "Investimentos", href: "/investimentos" },
      { label: "Outros serviços", href: "/outros-servicos" },
    ],
  },
};

export const TransferênciasAtiva: Story = {
  args: {
    items: [
      { label: "Início", href: "/" },
      { label: "Transferências", href: "/transferencias", active: true },
      { label: "Investimentos", href: "/investimentos" },
      { label: "Outros serviços", href: "/outros-servicos" },
    ],
  },
};

export const SemItemAtivo: Story = {
  args: {
    items: [
      { label: "Início", href: "/" },
      { label: "Transferências", href: "/transferencias" },
      { label: "Investimentos", href: "/investimentos" },
      { label: "Outros serviços", href: "/outros-servicos" },
    ],
  },
};
