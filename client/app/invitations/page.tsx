"use client";

import { InvitationItem } from "@/components/InvitationItem";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import Link from "next/link";

function Inner() {
  const { db, me } = useStore();
  if (!me) return null;
  const mine = db.invitations.filter((i) => i.alumniId === me.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = mine.filter((i) => i.status === "pending");
  const answered = mine.filter((i) => i.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl px-5 pb-8 pt-12">
      <PageHeader title="Invitations" intro="Cohorts that want you on their campus. Accepting opens the cohort so you can run a screening test." />

      <h2 className="text-2xl">Waiting for you</h2>
      {pending.length ? (
        <ul className="mt-2 border-t border-line">
          {pending.map((i) => (
            <InvitationItem key={i.id} inv={i} />
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <Empty title="No invitations waiting" action={<Link href="/cohorts" className="btn btn-ghost">Browse cohorts</Link>}>
            Students invite alumni from the alumni directory. You'll see new invitations here.
          </Empty>
        </div>
      )}

      {answered.length ? (
        <>
          <h2 className="mt-14 text-2xl">Answered</h2>
          <ul className="mt-2 border-t border-line">
            {answered.map((i) => (
              <InvitationItem key={i.id} inv={i} />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default function InvitationsPage() {
  return (
    <RequireAuth role="alumni">
      <Inner />
    </RequireAuth>
  );
}
