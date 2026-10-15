import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="2" width="24" height="28" rx="7" fill="var(--brand)" />
      <rect x="12" y="5" width="8" height="2.6" rx="1.3" fill="var(--bg)" />
      <circle cx="16" cy="16" r="4.2" fill="var(--brand-ink)" />
      <path d="M9 25.2c1.3-3 4-4.4 7-4.4s5.7 1.4 7 4.4" stroke="var(--brand-ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} home`}>
      <Mark />
      <span className="font-display text-xl font-extrabold tracking-tight">{BRAND.name}</span>
      <span className="hidden text-sm text-muted sm:inline" lang="bn">
        {BRAND.bangla}
      </span>
    </Link>
  );
}
