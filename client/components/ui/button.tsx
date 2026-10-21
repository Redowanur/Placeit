import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
  dark: "bg-night-900 text-white hover:bg-night-800",
  outline:
    "border border-night-950/15 text-heading hover:border-primary-500 hover:text-primary-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

type ButtonProps = {
  children: ReactNode;
  /** Renders an anchor to this destination instead of a button. */
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Name of a leading icon. */
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  type = "button",
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon ? <Icon name={icon} className="size-4.5" /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {content}
    </button>
  );
}
