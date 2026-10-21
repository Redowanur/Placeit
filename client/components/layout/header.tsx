"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-night-950/95 text-white backdrop-blur">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Logo inverted />

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                link.active ? "text-primary-400" : "text-white/70 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          className="grid size-10 place-items-center rounded-lg border border-white/15 text-white md:hidden"
        >
          <Icon name={open ? "close" : "menu"} className="size-5" />
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-night-950 md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  link.active
                    ? "bg-white/5 text-primary-400"
                    : "text-white/75 hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3 border-t border-white/10 pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-primary-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Register
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
