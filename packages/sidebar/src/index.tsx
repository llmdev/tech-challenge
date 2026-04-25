import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SidebarItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface SidebarProps {
  items?: SidebarItem[];
  className?: string;
}

const defaultItems: SidebarItem[] = [
  { label: "Início", href: "/", active: true },
  { label: "Transferências", href: "/transferencias" }
];

function Sidebar({ items = defaultItems, className }: SidebarProps) {
  return (
    <nav
      className={cn(
        "bg-card rounded-2xl py-5 px-4 flex-shrink-0",
        className
      )}
    >
      <ul className="space-y-0">
        {items.map((item) => (
          <li key={item.label} className="border-b border-border last:border-b-0">
            <a
              href={item.href ?? "#"}
              className={cn(
                "block py-3 px-2 text-sm font-medium transition-colors",
                item.active
                  ? "text-accent"
                  : "text-foreground hover:text-primary"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { Sidebar };
