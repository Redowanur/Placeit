import type { PlacementStatus, InviteStatus } from "./types";

export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return `+${d.slice(0, 3)} ${d.slice(3, 5)}•• ••• ••${d.slice(-1)}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function hueFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

export const STATUS_LABEL: Record<PlacementStatus, string> = {
  not_applied: "Not applied",
  applied: "Applied",
  written_test: "Written test",
  interview: "Interview",
  placed: "Placed",
  not_placed: "Not placed",
};

export const STATUS_COLOR: Record<PlacementStatus, string> = {
  not_applied: "var(--neutral)",
  applied: "var(--info)",
  written_test: "var(--warn)",
  interview: "#8a63d2",
  placed: "var(--ok)",
  not_placed: "var(--bad)",
};

export const STATUS_ORDER: PlacementStatus[] = [
  "not_applied",
  "applied",
  "written_test",
  "interview",
  "placed",
  "not_placed",
];

export const INVITE_LABEL: Record<InviteStatus, string> = {
  pending: "Waiting for reply",
  accepted: "Accepted",
  rejected: "Declined",
};

export const INVITE_COLOR: Record<InviteStatus, string> = {
  pending: "var(--warn)",
  accepted: "var(--ok)",
  rejected: "var(--bad)",
};
