import type { CSSProperties } from "react";
import { INVITE_COLOR, INVITE_LABEL, STATUS_COLOR, STATUS_LABEL } from "@/lib/format";
import type { InviteStatus, PlacementStatus } from "@/lib/types";

export function StatusChip({ status }: { status: PlacementStatus }) {
  return (
    <span className="chip" style={{ "--c": STATUS_COLOR[status] } as CSSProperties}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function InviteChip({ status }: { status: InviteStatus }) {
  return (
    <span className="chip" style={{ "--c": INVITE_COLOR[status] } as CSSProperties}>
      {INVITE_LABEL[status]}
    </span>
  );
}

export function Tone({ tone, children }: { tone: "ok" | "warn" | "bad" | "info" | "neutral"; children: React.ReactNode }) {
  return (
    <span className="chip" style={{ "--c": `var(--${tone})` } as CSSProperties}>
      {children}
    </span>
  );
}
