"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm font-medium text-heading outline-none transition-all duration-200 placeholder:font-normal placeholder:text-muted hover:border-muted focus:border-primary-400 focus:shadow-[0_0_0_3px_rgb(44_177_138_/_0.12)]";

export function FormField({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-heading">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
  className,
}: {
  loading: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "h-12 w-full rounded-xl bg-primary-500 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600 active:bg-primary-700 disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-surface/60 py-12 md:py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="animate-overlay-in rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-heading">{title}</h1>
            <p className="mt-1.5 text-sm text-body">{subtitle}</p>
          </div>
          {children}
          {footer ? (
            <div className="mt-6 border-t border-line pt-4 text-center text-sm text-body">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600"
    >
      <span aria-hidden className="mt-0.5 size-2 shrink-0 rounded-full bg-red-500" />
      {message}
    </div>
  );
}

export function SwitchAuthLink({
  text,
  href,
  linkText,
}: {
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <>
      {text}{" "}
      <Link
        href={href}
        className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
      >
        {linkText}
      </Link>
    </>
  );
}
