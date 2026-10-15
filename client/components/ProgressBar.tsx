import type { CSSProperties } from "react";
import { STATUS_COLOR, STATUS_LABEL, STATUS_ORDER } from "@/lib/format";
import type { PlacementStatus } from "@/lib/types";

export function ProgressBar({ counts }: { counts: Record<PlacementStatus, number> }) {
  const total = STATUS_ORDER.reduce((n, s) => n + counts[s], 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-sunken" role="img" aria-label="Placement status of the cohort">
        {STATUS_ORDER.map((s) =>
          counts[s] ? (
            <div key={s} style={{ width: `${(counts[s] / total) * 100}%`, background: STATUS_COLOR[s] }} title={`${STATUS_LABEL[s]}: ${counts[s]}`} />
          ) : null,
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {STATUS_ORDER.map((s) => (
          <li key={s} className="flex items-center gap-2 text-muted">
            <span className="size-2.5 rounded-full" style={{ background: STATUS_COLOR[s] } as CSSProperties} />
            <span>
              {STATUS_LABEL[s]} <strong className="font-semibold text-ink">{counts[s]}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
