import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  UserCircleIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  PlusIcon,
  type IconProps,
} from "@repo/icons";

type IconEntry = {
  name: string;
  component: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  tags: string[];
};

const ALL_ICONS: IconEntry[] = [
  {
    name: "UserCircleIcon",
    component: UserCircleIcon,
    tags: ["user", "avatar", "profile", "person", "account"],
  },
  {
    name: "EyeIcon",
    component: EyeIcon,
    tags: ["eye", "visible", "show", "view", "visibility"],
  },
  {
    name: "EyeOffIcon",
    component: EyeOffIcon,
    tags: ["eye", "hidden", "hide", "invisible", "visibility"],
  },
  {
    name: "ChevronDownIcon",
    component: ChevronDownIcon,
    tags: ["chevron", "arrow", "down", "expand", "dropdown", "select"],
  },
  {
    name: "PencilIcon",
    component: PencilIcon,
    tags: ["pencil", "edit", "write", "modify", "pen"],
  },
  {
    name: "TrashIcon",
    component: TrashIcon,
    tags: ["trash", "delete", "remove", "bin", "destroy"],
  },
  {
    name: "SearchIcon",
    component: SearchIcon,
    tags: ["search", "find", "magnifier", "lookup", "filter"],
  },
  {
    name: "PlusIcon",
    component: PlusIcon,
    tags: ["plus", "add", "create", "new", "insert"],
  },
];

function IconGallery() {
  const [query, setQuery] = React.useState("");
  const [copiedName, setCopiedName] = React.useState<string | null>(null);

  const filtered = query.trim()
    ? ALL_ICONS.filter(
        ({ name, tags }) =>
          name.toLowerCase().includes(query.toLowerCase()) ||
          tags.some((t) => t.includes(query.toLowerCase()))
      )
    : ALL_ICONS;

  function handleCopy(name: string) {
    navigator.clipboard.writeText(`<${name} />`);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="relative max-w-sm">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum ícone encontrado para &quot;{query}&quot;.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map(({ name, component: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleCopy(name)}
            title={`Copiar <${name} />`}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer group"
          >
            <Icon size={28} className="text-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground font-mono text-center leading-tight group-hover:text-foreground transition-colors">
              {copiedName === name ? (
                <span className="text-primary font-semibold">Copiado!</span>
              ) : (
                name
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Design System/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Biblioteca de ícones SVG do design system. Todos os ícones aceitam as props `size` (número, padrão `24`), `className`, `strokeWidth` e quaisquer atributos SVG nativos. Clique em um ícone na galeria para copiar o snippet de importação.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Galeria interativa com busca por nome ou tag.
 * Clique em um ícone para copiar `<NomeDoIcone />` para a área de transferência.
 */
export const Gallery: Story = {
  render: () => <IconGallery />,
};

/**
 * Todos os ícones herdam a cor do texto via `currentColor`.
 * Use `className` com cores Tailwind para customizar.
 *
 * ```tsx
 * <TrashIcon className="text-destructive" />
 * <EyeIcon className="text-primary" size={20} />
 * ```
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {ALL_ICONS.map(({ name, component: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <Icon size={24} className="text-foreground" />
            <span className="text-[10px] text-muted-foreground font-mono">foreground</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {ALL_ICONS.map(({ name, component: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <Icon size={24} className="text-primary" />
            <span className="text-[10px] text-muted-foreground font-mono">primary</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {ALL_ICONS.map(({ name, component: Icon }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <Icon size={24} className="text-destructive" />
            <span className="text-[10px] text-muted-foreground font-mono">destructive</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * A prop `size` controla `width` e `height` do SVG em pixels.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[12, 16, 20, 24, 32, 48].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <SearchIcon size={size} />
          <span className="text-xs text-muted-foreground font-mono">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * A prop `strokeWidth` controla a espessura do traço. Útil para hierarquia visual.
 */
export const StrokeWeights: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[1, 1.5, 2, 2.5, 3].map((weight) => (
        <div key={weight} className="flex flex-col items-center gap-2">
          <PencilIcon size={28} strokeWidth={weight} />
          <span className="text-xs text-muted-foreground font-mono">{weight}</span>
        </div>
      ))}
    </div>
  ),
};
