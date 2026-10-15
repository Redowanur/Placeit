"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Empty } from "./ui";
import Link from "next/link";

export function RequireAuth({ role, children }: { role?: Role; children: React.ReactNode }) {
  const { me, ready } = useStore();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [ready, me, router, path]);

  if (!ready || !me) return <div className="mx-auto max-w-6xl px-5 py-24 text-muted">Loading your account…</div>;

  if (role && me.role !== role) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Empty
          title={role === "student" ? "This page is for students" : "This page is for alumni"}
          action={<Link href="/dashboard" className="btn btn-primary">Go to your dashboard</Link>}
        >
          You're signed in as {me.role === "student" ? "a student" : "an alumni member"}.
        </Empty>
      </div>
    );
  }
  return <>{children}</>;
}
