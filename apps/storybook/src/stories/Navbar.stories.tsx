import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@repo/navbar";

const meta: Meta<typeof Navbar> = {
  title: "Design System/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    userName: {
      control: "text",
      description: "Nome do usuário exibido na barra de navegação",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    userName: "Joana da Silva Oliveira",
  },
};

export const ShortName: Story = {
  args: {
    userName: "Lucas Moura",
  },
};

export const LongName: Story = {
  args: {
    userName: "Maria Fernanda de Albuquerque Santos",
  },
};
