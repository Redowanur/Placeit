"use client";

import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import { Tone } from "./Chips";
import { companyById, invitationsOfCohort, statusCounts, studentsOf, uniById } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import type { Cohort } from "@/lib/types";

export function CohortRow({ cohort, compact = false }: { cohort: Cohort; compact?: boolean }) {
  const { db } = useStore();
  const uni = uniById(db, cohort.universityId);
  const students = studentsOf(db, cohort.id);
  const invs = invitationsOfCohort(db, cohort.id);
  const connected = [...new Set(invs.filter((i) => i.status === "accepted").map((i) => i.companyId))];
  const waiting = invs.filter((i) => i.status === "pending").length;

  return (
    <li className="grid gap-4 border-b border-line py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-8">
      <div>
        <h3 className="text-2xl">
          <Link href={`/cohorts/${cohort.id}`} className="hover:underline">
            {cohort.department}, {uni?.short}
          </Link>
        </h3>
        <p className="mt-1 text-muted">
          {uni?.name}, {uni?.city}
        </p>
        <p className="mt-3 text-sm">
          <strong className="font-semibold">{students.length}</strong> graduating {students.length === 1 ? "student" : "students"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {connected.map((id) => (
            <Tone key={id} tone="ok">
              Connected with {companyById(db, id)?.name}
            </Tone>
          ))}
          {waiting ? <Tone tone="warn">{waiting} invitation{waiting > 1 ? "s" : ""} waiting</Tone> : null}
          {!connected.length && !waiting ? <Tone tone="neutral">No company yet</Tone> : null}
        </div>
      </div>
      {!compact ? (
        <div className="self-center">
          <ProgressBar counts={statusCounts(students)} />
        </div>
      ) : null}
    </li>
  );
}
