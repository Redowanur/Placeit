"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { InviteChip } from "./Chips";
import { cohortById, cohortName, studentsOf, uniById, userById } from "@/lib/selectors";
import { formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Invitation } from "@/lib/types";

/** One invitation as seen by the alumni who received it. */
export function InvitationItem({ inv }: { inv: Invitation }) {
  const { db, me, respond } = useStore();
  const cohort = cohortById(db, inv.cohortId);
  if (!cohort) return null;
  const uni = uniById(db, cohort.universityId);
  const by = userById(db, inv.invitedBy);
  const size = studentsOf(db, cohort.id).length;

  return (
    <li className="grid gap-4 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl">
            <Link href={`/cohorts/${cohort.id}`} className="hover:underline">
              {cohortName(db, cohort)}
            </Link>
          </h3>
          <InviteChip status={inv.status} />
        </div>
        <p className="mt-1 text-sm text-muted">
          {uni?.name}. {size} graduating students.
        </p>
        <p className="mt-1 text-sm text-muted">
          Invited by {by?.name ?? "a student"} on {formatDate(inv.createdAt)}.
        </p>
      </div>

      {inv.status === "pending" ? (
        me?.verified ? (
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => respond(inv.id, "accepted")}>
              <Check size={16} aria-hidden="true" /> Accept
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => respond(inv.id, "rejected")}>
              <X size={16} aria-hidden="true" /> Decline
            </button>
          </div>
        ) : (
          <Link href="/verify" className="btn btn-ghost btn-sm">
            Verify to respond
          </Link>
        )
      ) : inv.status === "accepted" ? (
        <Link href={`/cohorts/${cohort.id}`} className="btn btn-ghost btn-sm">
          Open cohort
        </Link>
      ) : null}
    </li>
  );
}
