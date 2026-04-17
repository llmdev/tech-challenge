import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/button";
import { SearchIcon, PlusIcon, TrashIcon } from "@repo/icons";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Botão versátil com suporte a variantes, tamanhos, ícones e renderização como filho (asChild). Use `size=\"icon\"` para botões quadrados com ícone único, ou a prop `icon` para combinar ícone com texto.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Estilo visual do botão",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description:
        'Tamanho do botão. Use `"icon"` para botões quadrados que contêm apenas um ícone',
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o botão",
    },
    asChild: {
      control: "boolean",
      description: "Renderiza como componente filho usando Radix Slot",
    },
    icon: {
      control: false,
      description:
        "Ícone exibido à esquerda do conteúdo. Aceita qualquer `ReactNode` (ex: componente de ícone SVG)",
    },
    children: {
      control: "text",
      description: "Conteúdo do botão",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

/**
 * Use a prop `icon` para exibir um ícone à esquerda do texto.
 * O ícone aceita qualquer `ReactNode` — componentes SVG, bibliotecas de ícones, etc.
 */
export const WithIcon: Story = {
  args: {
    children: "Buscar",
    icon: <SearchIcon />,
    variant: "default",
    size: "default",
  },
};

/**
 * Use `size="icon"` combinado com a prop `icon` para criar botões quadrados de ação.
 * Sempre adicione `aria-label` para garantir acessibilidade quando não há texto visível.
 *
 * ```tsx
 * <Button size="icon" icon={<PlusIcon />} aria-label="Adicionar item" />
 * ```
 */
export const IconOnly: Story = {
  args: {
    size: "icon",
    icon: <PlusIcon />,
    "aria-label": "Adicionar item",
  },
};

/**
 * Botões de ícone funcionam com todas as variantes. Útil para ações destrutivas
 * discretas como excluir um item de uma lista.
 */
export const IconOnlyDestructive: Story = {
  args: {
    size: "icon",
    variant: "destructive",
    icon: <TrashIcon />,
    "aria-label": "Remover item",
  },
};

/**
 * Botões de ícone com variante `ghost` são ideais para toolbars e ações secundárias,
 * pois mantêm o foco visual no conteúdo ao redor.
 */
export const IconOnlyGhost: Story = {
  args: {
    size: "icon",
    variant: "ghost",
    icon: <SearchIcon />,
    "aria-label": "Buscar",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Com ícone (prop icon)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" icon={<PlusIcon />}>
            Adicionar
          </Button>
          <Button size="default" icon={<SearchIcon />}>
            Buscar
          </Button>
          <Button size="lg" variant="outline" icon={<PlusIcon />}>
            Novo item
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Icon only (size=&quot;icon&quot;)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon" icon={<PlusIcon />} aria-label="Adicionar" />
          <Button
            size="icon"
            variant="outline"
            icon={<SearchIcon />}
            aria-label="Buscar"
          />
          <Button
            size="icon"
            variant="ghost"
            icon={<SearchIcon />}
            aria-label="Buscar"
          />
          <Button
            size="icon"
            variant="destructive"
            icon={<TrashIcon />}
            aria-label="Remover"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">States</p>
        <div className="flex flex-wrap gap-3">
          <Button>Enabled</Button>
          <Button disabled={true}>Disabled</Button>
          <Button size="icon" icon={<PlusIcon />} aria-label="Adicionar" />
          <Button
            size="icon"
            icon={<PlusIcon />}
            aria-label="Adicionar"
            disabled={true}
          />
        </div>
      </div>
    </div>
  ),
};
