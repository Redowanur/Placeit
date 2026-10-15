"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export function VerifyBanner() {
  const { me, ready } = useStore();
  if (!ready || !me || me.verified) return null;
  return (
    <div className="border-b border-line bg-accent-soft">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 text-sm">
        <ShieldAlert size={18} className="shrink-0 text-warn" aria-hidden="true" />
        <p className="text-ink">
          Your account isn't verified yet. Contact numbers and invitations stay locked until it is.
        </p>
        <Link href="/verify" className="link ml-auto">
          Verify now
        </Link>
      </div>
    </div>
  );
}
