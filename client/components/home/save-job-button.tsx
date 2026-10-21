"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function SaveJobButton({ label }: { label: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((value) => !value)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved jobs` : `Save ${label}`}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-lg border transition-colors",
        saved
          ? "border-primary-200 bg-primary-50 text-primary-600"
          : "border-line text-muted hover:border-primary-300 hover:text-primary-600",
      )}
    >
      <Icon name="bookmark" className={cn("size-5", saved && "fill-current")} />
    </button>
  );
}
