"use client";

import { FileText, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { InviteChip, StatusChip, Tone } from "@/components/Chips";
import { ProgressBar } from "@/components/ProgressBar";
import { Empty, Notice, PageHeader } from "@/components/ui";
import { formatDate, maskPhone, STATUS_LABEL } from "@/lib/format";
import {
  cohortById,
  cohortName,
  colleagueLock,
  companyById,
  invitationsOfCohort,
  isAlumni,
  isStudent,
  statusCounts,
  studentsOf,
  uniById,
  userById,
} from "@/lib/selectors";
import { useStore } from "@/lib/store";
import type { Alumni, PlacementStatus, Test } from "@/lib/types";

const STAGES: PlacementStatus[] = ["written_test", "interview", "placed", "not_placed"];

function TestResults({ test }: { test: Test }) {
  const { db, setShortlisted, setStudentStatus } = useStore();
  const attempts = db.attempts.filter((a) => a.testId === test.id).sort((a, b) => b.score - a.score);
  const total = studentsOf(db, test.cohortId).length;
  const need = Math.ceil((test.passMark / 100) * test.questions.length);

  return (
    <section className="border-t border-line py-6" aria-label={test.title}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl">{test.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {test.questions.length} questions, {test.durationMin} minutes, pass mark {test.passMark}% ({need} correct). {attempts.length} of {total} students have taken it.
          </p>
        </div>
      </div>

      {attempts.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Student</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Score</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Shortlist</th>
                <th scope="col" className="py-2.5 font-semibold">Stage</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                const student = userById(db, a.studentId);
                if (!isStudent(student)) return null;
                const pass = a.score >= need;
                return (
                  <tr key={a.id} className="border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {student.name}
                    </th>
                    <td className="py-3 pr-4">
                      <span className="mr-2">
                        {a.score}/{a.total}
                      </span>
                      <Tone tone={pass ? "ok" : "neutral"}>{pass ? "Passed" : "Below pass mark"}</Tone>
                    </td>
                    <td className="py-3 pr-4">
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="size-4 accent-[var(--brand)]" checked={a.shortlisted} onChange={(e) => setShortlisted(a.id, e.target.checked)} />
                        <span>{a.shortlisted ? "Shortlisted" : "Shortlist"}</span>
                      </label>
                    </td>
                    <td className="py-3">
                      {a.shortlisted ? (
                        <>
                          <label htmlFor={`stage-${a.id}`} className="sr-only">
                            Stage for {student.name}
                          </label>
                          <select
                            id={`stage-${a.id}`}
                            className="field !min-h-9 !w-auto !py-1 text-sm"
                            value={student.status}
                            onChange={(e) => setStudentStatus(student.id, e.target.value as PlacementStatus)}
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <span className="text-muted">Not shortlisted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">Nobody has taken this test yet. Results appear here as students submit.</p>
      )}
    </section>
  );
}

function Engagement({ cohortId, me }: { cohortId: string; me: Alumni }) {
  const { db, respond } = useStore();
  const own = invitationsOfCohort(db, cohortId).find((i) => i.alumniId === me.id);
  const lock = colleagueLock(db, cohortId, me);
  const company = companyById(db, me.companyId);

  if (own?.status === "pending") {
    return (
      <Notice tone="warn">
        <p className="font-semibold">{userById(db, own.invitedBy)?.name} invited you on {formatDate(own.createdAt)}.</p>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => respond(own.id, "accepted")}>
            Accept invitation
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => respond(own.id, "rejected")}>
            Decline
          </button>
        </div>
      </Notice>
    );
  }
  if (own?.status === "accepted") {
    return <Notice tone="ok">You're connected with this cohort. Create a screening test to shortlist students before you visit campus.</Notice>;
  }
  if (lock) {
    const colleague = userById(db, lock.alumniId);
    return (
      <Notice tone="info">
        <p>
          {colleague?.name} from {company?.name} is already {lock.status === "accepted" ? "connected with" : "talking to"} this cohort. Only one person per company can connect at a time.
        </p>
      </Notice>
    );
  }
  if (own?.status === "rejected") {
    return <Notice tone="info">You declined this cohort's invitation. They can invite you again.</Notice>;
  }
  return <Notice tone="info">This cohort hasn't invited you yet. Students send invitations from the alumni directory.</Notice>;
}

export default function CohortDetail() {
  const { id } = useParams<{ id: string }>();
  const { db, me, ready } = useStore();
  const cohort = cohortById(db, id);

  if (!cohort) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Empty title="We couldn't find that cohort" action={<Link href="/cohorts" className="btn btn-primary">See all cohorts</Link>} />
      </div>
    );
  }

  const uni = uniById(db, cohort.universityId);
  const students = studentsOf(db, cohort.id);
  const invs = invitationsOfCohort(db, cohort.id);
  const connected = [...new Set(invs.filter((i) => i.status === "accepted").map((i) => i.companyId))];

  const alumniMe = isAlumni(me) ? me : null;
  const verifiedAlumni = alumniMe?.verified ? alumniMe : null;
  const isConnected = verifiedAlumni ? invs.some((i) => i.alumniId === verifiedAlumni.id && i.status === "accepted") : false;
  const myTests = verifiedAlumni ? db.tests.filter((t) => t.cohortId === cohort.id && t.alumniId === verifiedAlumni.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <PageHeader
        title={cohortName(db, cohort)}
        intro={`${uni?.name}, ${uni?.city}. ${students.length} graduating students.`}
        action={
          isStudent(me) && me.cohortId === cohort.id ? (
            <Link href="/cohort" className="btn btn-primary">
              Open your cohort
            </Link>
          ) : undefined
        }
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {connected.map((c) => (
          <Tone key={c} tone="ok">
            Connected with {companyById(db, c)?.name}
          </Tone>
        ))}
        {invs.filter((i) => i.status === "pending").length ? <Tone tone="warn">{invs.filter((i) => i.status === "pending").length} invitation(s) waiting</Tone> : null}
      </div>

      <div className="mb-10 max-w-3xl">
        <ProgressBar counts={statusCounts(students)} />
      </div>

      {/* Gates */}
      {ready && !me ? (
        <div className="rounded-2xl bg-sunken p-6">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-muted" aria-hidden="true" />
            <h2 className="text-xl">Log in to meet this cohort</h2>
          </div>
          <p className="mt-2 max-w-xl text-muted">Students' names and details open up to verified alumni. Create an alumni account to accept invitations from cohorts like this one.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/signup?role=alumni`} className="btn btn-primary">
              Create alumni account
            </Link>
            <Link href={`/login?next=/cohorts/${cohort.id}`} className="btn btn-ghost">
              Log in
            </Link>
          </div>
        </div>
      ) : null}

      {isStudent(me) && me.cohortId !== cohort.id ? (
        <Notice tone="info">Student lists are only shown to alumni and to the cohort's own students.</Notice>
      ) : null}

      {alumniMe && !alumniMe.verified ? (
        <Notice tone="warn">
          <Link href="/verify" className="link">
            Verify your account
          </Link>{" "}
          to open this cohort and respond to invitations.
        </Notice>
      ) : null}

      {verifiedAlumni ? (
        <div className="space-y-12">
          <Engagement cohortId={cohort.id} me={verifiedAlumni} />

          <section aria-labelledby="members-h">
            <h2 id="members-h" className="text-2xl">
              Students
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="sr-only">Students in this cohort</caption>
                <thead>
                  <tr className="border-b-2 border-ink text-sm">
                    <th scope="col" className="py-3 pr-4 font-semibold">Name</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Resume</th>
                    <th scope="col" className="py-3 font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {[...students].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
                    <tr key={s.id} className="border-b border-line">
                      <th scope="row" className="py-3 pr-4 font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size={34} />
                          {s.name}
                        </div>
                      </th>
                      <td className="py-3 pr-4">
                        <StatusChip status={s.status} />
                      </td>
                      <td className="py-3 pr-4">
                        {s.resumeUrl ? (
                          <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5 text-sm">
                            <FileText size={15} aria-hidden="true" /> Open
                          </a>
                        ) : (
                          <span className="text-sm text-muted">Not added</span>
                        )}
                      </td>
                      <td className="py-3 text-sm">{isConnected ? s.phone : <span className="text-muted">{maskPhone(s.phone)}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isConnected ? <p className="mt-3 text-sm text-muted">Phone numbers unlock once you accept this cohort's invitation.</p> : null}
          </section>

          {isConnected ? (
            <section aria-labelledby="tests-h">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="tests-h" className="text-2xl">
                  Screening tests
                </h2>
                <Link href={`/cohorts/${cohort.id}/tests/new`} className="btn btn-primary btn-sm">
                  <Plus size={16} aria-hidden="true" /> Create a test
                </Link>
              </div>
              <div className="mt-4">
                {myTests.length ? (
                  myTests.map((t) => <TestResults key={t.id} test={t} />)
                ) : (
                  <Empty title="No screening test yet">Write a short multiple-choice test. Students in this cohort can take it online, and you shortlist from the results.</Empty>
                )}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {/* Public: who contacted this cohort */}
      {!me && invs.length ? (
        <section className="mt-12" aria-labelledby="pub-h">
          <h2 id="pub-h" className="text-2xl">
            Who this cohort has contacted
          </h2>
          <ul className="mt-3 border-t border-line">
            {invs.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 border-b border-line py-3.5">
                <span className="font-semibold">{companyById(db, i.companyId)?.name}</span>
                <InviteChip status={i.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
