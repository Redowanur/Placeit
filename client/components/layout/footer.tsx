import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";
import {
  footerAbout,
  footerCategories,
  footerCompany,
  footerNewsletter,
} from "@/lib/data";

const columnTitle =
  "font-display text-base font-semibold text-white";

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className={columnTitle}>{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href="/"
              className="text-sm text-white/60 transition-colors hover:text-primary-400"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-night-950 text-white/70">
      <Container className="grid gap-12 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.4fr] lg:gap-8">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
            {footerAbout}
          </p>
        </div>

        <FooterColumn title="Company" items={footerCompany} />
        <FooterColumn title="Job Categories" items={footerCategories} />

        <div>
          <p className={columnTitle}>Newsletter</p>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
            {footerNewsletter}
          </p>
          <form className="mt-5">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter Address"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary-500"
            />
            <button
              type="submit"
              className="mt-3 h-12 w-full rounded-xl bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Subscribe now
            </button>
          </form>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © Copyright, Job Portal, 2026. All rights
            reserved. Designed by Next Squad.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="underline-offset-4 transition-colors hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <Link href="/" className="underline-offset-4 transition-colors hover:text-white hover:underline">
              Terms &amp; Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
