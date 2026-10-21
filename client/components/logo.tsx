import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  inverted = false,
  className,
}: {
  href?: string;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary-500 text-white">
        <Icon name="briefcase" className="size-[18px]" />
      </span>
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          inverted ? "text-white" : "text-heading",
        )}
      >
        Job <span className="text-primary-400">Portal</span>
      </span>
    </Link>
  );
}
