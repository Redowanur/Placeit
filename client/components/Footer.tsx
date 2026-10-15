import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8 px-5 py-10">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold">
            {BRAND.name} <span lang="bn" className="font-normal text-muted">{BRAND.bangla}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Final-year cohorts and the seniors who already work in industry, in one place. Contact details unlock only after verification.
          </p>
        </div>
        <nav className="flex gap-10 text-sm" aria-label="Footer">
          <ul className="space-y-2">
            <li><Link className="text-muted hover:text-ink" href="/alumni">Browse alumni</Link></li>
            <li><Link className="text-muted hover:text-ink" href="/cohorts">Browse cohorts</Link></li>
          </ul>
          <ul className="space-y-2">
            <li><Link className="text-muted hover:text-ink" href="/signup">Create account</Link></li>
            <li><Link className="text-muted hover:text-ink" href="/login">Log in</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
