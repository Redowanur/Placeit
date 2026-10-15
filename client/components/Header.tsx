"use client";

import { LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAlumni, isStudent } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { me, ready, db, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const pending = isAlumni(me)
    ? db.invitations.filter((i) => i.alumniId === me.id && i.status === "pending").length
    : 0;

  const links: Array<{ href: string; label: string; badge?: number }> = [
    { href: "/alumni", label: "Alumni" },
    { href: "/cohorts", label: "Cohorts" },
  ];
  if (isStudent(me)) links.unshift({ href: "/dashboard", label: "Dashboard" }, { href: "/cohort", label: "My cohort" });
  if (isAlumni(me)) links.unshift({ href: "/dashboard", label: "Dashboard" }, { href: "/invitations", label: "Invitations", badge: pending });

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors ${
                active(l.href) ? "bg-brand-soft text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
              {l.badge ? (
                <span className="ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-ink">
                  {l.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            {!ready ? (
              <span className="h-10 w-40" />
            ) : me ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-4 text-sm font-semibold hover:border-ink">
                  <Avatar name={me.name} size={32} />
                  <span className="max-w-32 truncate">{me.name.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-full text-muted hover:text-ink"
                  aria-label="Log out"
                  title="Log out"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Create account
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-bg px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between border-b border-line py-3 font-medium">
                {l.label}
                {l.badge ? <span className="rounded-full bg-accent px-2 text-xs font-bold text-accent-ink">{l.badge}</span> : null}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            {me ? (
              <>
                <Link href="/profile" className="btn btn-ghost btn-sm">
                  <UserRound size={16} /> Profile
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
