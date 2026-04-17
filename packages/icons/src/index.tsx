import * as React from "react";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  size?: number;
}

function createIcon(
  displayName: string,
  children: React.ReactNode,
  defaultStrokeWidth = "2"
) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, size = 24, strokeWidth = defaultStrokeWidth, ...props }, ref) => (
      <svg
        ref={ref}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={displayName}
        {...props}
      >
        {children}
      </svg>
    )
  );
  Icon.displayName = displayName;
  return Icon;
}

export const UserCircleIcon = createIcon(
  "UserCircleIcon",
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" />
  </>,
  "1.5"
);

export const EyeIcon = createIcon(
  "EyeIcon",
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOffIcon = createIcon(
  "EyeOffIcon",
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>
);

export const ChevronDownIcon = createIcon(
  "ChevronDownIcon",
  <path d="M6 9l6 6 6-6" />,
  "2.5"
);

export const PencilIcon = createIcon(
  "PencilIcon",
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>
);

export const TrashIcon = createIcon(
  "TrashIcon",
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </>
);

export const SearchIcon = createIcon(
  "SearchIcon",
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const PlusIcon = createIcon(
  "PlusIcon",
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);
