"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Avatar } from "@/components/Avatar";
import { InviteChip, StatusChip, Tone } from "@/components/Chips";
import { ProgressBar } from "@/components/ProgressBar";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { cohortById, cohortName, companyById, invitationsOfCohort, statusCounts, studentsOf, uniById, userById } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import type { Student } from "@/lib/types";

function Classmates({ me, classmates }: { me: Student; classmates: Student[] }) {
  const sorted = [...classmates].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">Classmates and their placement status</caption>
        <thead>
          <tr className="border-b-2 border-ink text-sm">
            <th scope="col" className="py-3 pr-4 font-semibold">Name</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Registration no.</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
            <th scope="col" className="py-3 font-semibold">Resume</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id} className="border-b border-line">
              <th scope="row" className="py-3 pr-4 font-medium">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} size={34} />
                  <span>
                    {s.name}
                    {s.id === me.id ? <span className="ml-2 text-sm font-normal text-muted">(you)</span> : null}
                  </span>
                </div>
              </th>
              <td className="py-3 pr-4 text-muted">{s.regNo}</td>
              <td className="py-3 pr-4">
                <StatusChip status={s.status} />
              </td>
              <td className="py-3">
                {s.resumeUrl ? (
                  <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5 text-sm">
                    <FileText size={15} aria-hidden="true" /> Open
                  </a>
                ) : (
                  <span className="text-sm text-muted">Not added</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Companies({ cohortId, me }: { cohortId: string; me: Student }) {
  const { db } = useStore();
  const invs = invitationsOfCohort(db, cohortId);

  if (!invs.length) {
    return (
      <Empty title="Your cohort hasn't contacted any company yet" action={<Link href="/alumni" className="btn btn-primary">Browse alumni</Link>}>
        Invite someone who works where you want to work. Once they accept, their screening test shows up here.
      </Empty>
    );
  }

  return (
    <ul className="border-t border-line">
      {invs.map((i) => {
        const person = userById(db, i.alumniId);
        const by = userById(db, i.invitedBy);
        const tests = db.tests.filter((t) => t.alumniId === i.alumniId && t.cohortId === cohortId);
        return (
          <li key={i.id} className="border-b border-line py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl">{companyById(db, i.companyId)?.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  {person?.name}
                  {person && "title" in person ? `, ${person.title}` : ""}
                </p>
                <p className="text-sm text-muted">
                  Invited by {by?.id === me.id ? "you" : by?.name} on {formatDate(i.createdAt)}
                </p>
              </div>
              <InviteChip status={i.status} />
            </div>

            {i.status === "accepted"
              ? tests.map((t) => {
                  const attempt = db.attempts.find((a) => a.testId === t.id && a.studentId === me.id);
                  return (
                    <div key={t.id} className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sunken px-4 py-3">
                      <div>
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-sm text-muted">
                          {t.questions.length} questions, {t.durationMin} minutes, pass mark {t.passMark}%
                        </p>
                      </div>
                      {attempt ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            You scored {attempt.score}/{attempt.total}
                          </span>
                          {attempt.shortlisted ? <Tone tone="ok">Shortlisted</Tone> : <Tone tone="neutral">Under review</Tone>}
                        </div>
                      ) : (
                        <Link href={`/tests/${t.id}`} className="btn btn-accent btn-sm">
                          Take the test
                        </Link>
                      )}
                    </div>
                  );
                })
              : null}

            {i.status === "rejected" ? (
              <p className="mt-3 text-sm text-muted">
                They declined. You can{" "}
                <Link href="/alumni" className="link">
                  invite them again
                </Link>
                .
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Inner() {
  const { me, db } = useStore();
  const router = useRouter();
  const tab = useSearchParams().get("tab") === "companies" ? "companies" : "classmates";
  if (!me || me.role !== "student") return null;

  const cohort = cohortById(db, me.cohortId)!;
  const uni = uniById(db, cohort.universityId);
  const classmates = studentsOf(db, cohort.id);

  const tabBtn = (id: "classmates" | "companies", label: string, count: number) => (
    <button
      role="tab"
      aria-selected={tab === id}
      onClick={() => router.replace(id === "classmates" ? "/cohort" : "/cohort?tab=companies")}
      className={`-mb-px border-b-2 px-1 pb-3 pt-1 font-semibold transition-colors ${tab === id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"}`}
    >
      {label} <span className="ml-1 text-sm font-normal text-muted">{count}</span>
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <PageHeader
        title={cohortName(db, cohort)}
        intro={`${uni?.name}. Everyone graduating from your department, and every company talking to you all.`}
        action={
          <Link href="/alumni" className="btn btn-primary">
            Invite alumni
          </Link>
        }
      />
      <div className="mb-10 max-w-3xl">
        <ProgressBar counts={statusCounts(classmates)} />
      </div>

      <div role="tablist" className="mb-6 flex gap-8 border-b border-line">
        {tabBtn("classmates", "Classmates", classmates.length)}
        {tabBtn("companies", "Companies", invitationsOfCohort(db, cohort.id).length)}
      </div>

      {tab === "classmates" ? <Classmates me={me} classmates={classmates} /> : <Companies cohortId={cohort.id} me={me} />}
    </div>
  );
}

export default function CohortPage() {
  return (
    <RequireAuth role="student">
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </RequireAuth>
  );
}
