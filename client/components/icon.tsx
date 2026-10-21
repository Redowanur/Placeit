import type { SVGProps } from "react";

type IconDef = {
  /** When true the icon is drawn filled instead of stroked. */
  fill?: boolean;
  /** Default stroke width (only for stroked icons). */
  strokeWidth?: number;
  paths: React.ReactNode;
};

const icons = {
  search: {
    paths: (
      <>
        <circle cx="11" cy="11" r="7.5" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  "chevron-down": {
    paths: <path d="m6 9 6 6 6-6" />,
  },
  menu: {
    paths: <path d="M4 6h16M4 12h16M4 18h16" />,
  },
  close: {
    paths: <path d="M18 6 6 18M6 6l12 12" />,
  },
  "arrow-right": {
    paths: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
  },
  briefcase: {
    paths: (
      <>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </>
    ),
  },
  users: {
    paths: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  building: {
    paths: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </>
    ),
  },
  clock: {
    paths: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  "map-pin": {
    paths: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  "dollar-sign": {
    paths: (
      <>
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 6H6" />
      </>
    ),
  },
  bookmark: {
    paths: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  },
  star: {
    fill: true,
    paths: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 23.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    ),
  },
  quote: {
    fill: true,
    paths: (
      <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V216z" />
    ),
  },
  leaf: {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
  },
  factory: {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1M12 18h1M7 18h1" />
      </>
    ),
  },
  "shopping-bag": {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  "hard-hat": {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M4 16a8 8 0 0 1 16 0" />
        <path d="M12 12V5" />
        <path d="M2 16h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2Z" />
      </>
    ),
  },
  bed: {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M12 4v6" />
        <path d="M2 18h20" />
      </>
    ),
  },
  "graduation-cap": {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </>
    ),
  },
  landmark: {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="m2 9 10-6 10 6" />
        <path d="M5 9v9M10 9v9M14 9v9M19 9v9" />
        <path d="M3 18h18" />
      </>
    ),
  },
  car: {
    strokeWidth: 1.7,
    paths: (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
};

export function Icon({ name, strokeWidth, ...props }: IconProps) {
  const icon: IconDef = icons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill={icon.fill ? "currentColor" : "none"}
      stroke={icon.fill ? "none" : "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth ?? icon.strokeWidth ?? 2}
      aria-hidden="true"
      {...props}
    >
      {icon.paths}
    </svg>
  );
}
