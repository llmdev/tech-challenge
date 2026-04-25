import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@repo/input";

const meta: Meta<typeof Input> = {
  title: "Design System/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Digite algo...",
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
    label: "Valor",
    placeholder: "00,00",
    textAlign: "center",
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
      <Input label="Default" variant="default" placeholder="Variante default" />
      <Input label="Outline" variant="outline" placeholder="Variante outline" />
      <Input label="Ghost" variant="ghost" placeholder="Variante ghost" />
    </div>
  ),
};

export const Tamanhos: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Input label="Pequeno" size="sm" placeholder="size sm" />
      <Input label="Padrão" size="default" placeholder="size default" />
      <Input label="Grande" size="lg" placeholder="size lg" />
    </div>
  ),
};

export const Desabilitado: Story = {
  args: {
    label: "Valor",
    defaultValue: "100,00",
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const Alinhamentos: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Input label="Esquerda" textAlign="left" defaultValue="00,00" />
      <Input label="Centro" textAlign="center" defaultValue="00,00" />
      <Input label="Direita" textAlign="right" defaultValue="00,00" />
    </div>
  ),
};
