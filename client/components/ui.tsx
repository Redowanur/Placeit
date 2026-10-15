import type { ReactNode } from "react";

export function PageHeader({ title, intro, action }: { title: string; intro?: ReactNode; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {intro ? <p className="mt-3 text-lg text-muted">{intro}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <h3 className="text-xl">{title}</h3>
      {children ? <p className="mx-auto mt-2 max-w-md text-muted">{children}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {children}
      {hint ? <span className="ml-2 font-normal text-muted">{hint}</span> : null}
    </label>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "bad" | "ok"; children: ReactNode }) {
  return (
    <div
      role={tone === "bad" ? "alert" : "status"}
      className="rounded-xl border px-4 py-3 text-sm"
      style={{
        color: `var(--${tone})`,
        borderColor: `color-mix(in oklab, var(--${tone}) 40%, transparent)`,
        background: `color-mix(in oklab, var(--${tone}) 9%, transparent)`,
      }}
    >
      <div className="text-ink">{children}</div>
    </div>
  );
}
