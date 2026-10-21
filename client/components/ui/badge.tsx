import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Light gray chip used for job meta info (type / salary / location...). */
export function Badge({
  icon,
  children,
  className,
}: {
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-[13px] font-medium text-heading",
        className,
      )}
    >
      {icon ? <Icon name={icon} className="size-4 text-primary-600" /> : null}
      {children}
    </span>
  );
}

/** Solid teal pill used on top of images (e.g. "News" / "Blog"). */
export function PillBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-primary-500 px-3.5 py-1.5 text-xs font-semibold text-white",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-white/90" aria-hidden="true" />
      {children}
    </span>
  );
}
