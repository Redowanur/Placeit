"use client";

import { ClipboardList, FileText } from "lucide-react";
import Link from "next/link";
import { InviteChip, StatusChip } from "@/components/Chips";
import { InvitationItem } from "@/components/InvitationItem";
import { ProgressBar } from "@/components/ProgressBar";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/format";
import {
  cohortById,
  cohortName,
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
import type { Alumni, Student } from "@/lib/types";

function StudentDashboard({ me }: { me: Student }) {
  const { db } = useStore();
  const cohort = cohortById(db, me.cohortId)!;
  const classmates = studentsOf(db, cohort.id);
  const invs = invitationsOfCohort(db, cohort.id);
  const openTests = db.tests.filter(
    (t) =>
      t.cohortId === cohort.id &&
      !db.attempts.some((a) => a.testId === t.id && a.studentId === me.id) &&
      invs.some((i) => i.alumniId === t.alumniId && i.status === "accepted"),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <h1 className="text-3xl sm:text-4xl">Hi {me.name.split(" ")[0]}</h1>
      <p className="mt-2 text-lg text-muted">
        {cohortName(db, cohort)}. {classmates.length} students in your cohort.
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-12">
          {openTests.length ? (
            <section aria-labelledby="tests-h">
              <h2 id="tests-h" className="text-2xl">
                A screening test is waiting
              </h2>
              <ul className="mt-4 space-y-3">
                {openTests.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-soft px-5 py-4">
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-sm text-muted">
                        From {userById(db, t.alumniId)?.name} at {companyById(db, t.companyId)?.name}. {t.questions.length} questions, {t.durationMin} minutes.
                      </p>
                    </div>
                    <Link href={`/tests/${t.id}`} className="btn btn-accent btn-sm">
                      Take the test
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="progress-h">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="progress-h" className="text-2xl">
                How your cohort is doing
              </h2>
              <Link href="/cohort" className="link text-sm">
                See classmates
              </Link>
            </div>
            <div className="mt-4">
              <ProgressBar counts={statusCounts(classmates)} />
            </div>
          </section>

          <section aria-labelledby="co-h">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="co-h" className="text-2xl">
                Companies your cohort has contacted
              </h2>
              <Link href="/cohort?tab=companies" className="link text-sm">
                See all
              </Link>
            </div>
            {invs.length ? (
              <ul className="mt-3 border-t border-line">
                {invs.slice(0, 4).map((i) => {
                  const person = userById(db, i.alumniId);
                  return (
                    <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
                      <div>
                        <p className="font-semibold">{companyById(db, i.companyId)?.name}</p>
                        <p className="text-sm text-muted">
                          {person?.name}, invited {formatDate(i.createdAt)}
                        </p>
                      </div>
                      <InviteChip status={i.status} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-4">
                <Empty title="Your cohort hasn't invited anyone yet" action={<Link href="/alumni" className="btn btn-primary">Browse alumni</Link>}>
                  Pick someone who works where you want to work and invite them to your campus.
                </Empty>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-8 lg:border-l lg:border-line lg:pl-8">
          <div>
            <h2 className="text-lg">Your status</h2>
            <div className="mt-2">
              <StatusChip status={me.status} />
            </div>
          </div>
          <div>
            <h2 className="text-lg">Resume</h2>
            {me.resumeUrl ? (
              <a href={me.resumeUrl} target="_blank" rel="noreferrer" className="link mt-2 inline-flex items-center gap-2 break-all text-sm">
                <FileText size={16} aria-hidden="true" /> View your resume link
              </a>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">Add a link so alumni can see your background.</p>
                <Link href="/profile" className="btn btn-ghost btn-sm mt-3">
                  Add resume link
                </Link>
              </>
            )}
          </div>
          <div>
            <Link href="/alumni" className="btn btn-primary w-full">
              Invite alumni to campus
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AlumniDashboard({ me }: { me: Alumni }) {
  const { db } = useStore();
  const company = companyById(db, me.companyId);
  const uni = uniById(db, me.universityId);
  const mine = db.invitations.filter((i) => i.alumniId === me.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = mine.filter((i) => i.status === "pending");
  const accepted = mine.filter((i) => i.status === "accepted");
  const myTests = db.tests.filter((t) => t.alumniId === me.id);
  const awaiting = db.attempts.filter((a) => myTests.some((t) => t.id === a.testId) && !a.shortlisted).length;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <h1 className="text-3xl sm:text-4xl">Hi {me.name.split(" ")[0]}</h1>
      <p className="mt-2 text-lg text-muted">
        {me.title} at {company?.name}. {uni?.short}, class of {me.gradYear}.
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-12">
          <section aria-labelledby="inv-h">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="inv-h" className="text-2xl">
                Invitations waiting for you
              </h2>
              <Link href="/invitations" className="link text-sm">
                See all
              </Link>
            </div>
            {pending.length ? (
              <ul className="mt-2 border-t border-line">
                {pending.slice(0, 3).map((i) => (
                  <InvitationItem key={i.id} inv={i} />
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Empty title="Nothing waiting right now">Students invite alumni from the alumni directory. New invitations show up here.</Empty>
              </div>
            )}
          </section>

          <section aria-labelledby="coh-h">
            <h2 id="coh-h" className="text-2xl">
              Cohorts you're connected with
            </h2>
            {accepted.length ? (
              <ul className="mt-3 border-t border-line">
                {accepted.map((i) => {
                  const c = cohortById(db, i.cohortId)!;
                  return (
                    <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
                      <div>
                        <p className="font-semibold">{cohortName(db, c)}</p>
                        <p className="text-sm text-muted">{studentsOf(db, c.id).length} students</p>
                      </div>
                      <Link href={`/cohorts/${c.id}`} className="btn btn-ghost btn-sm">
                        Open cohort
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-muted">Accept an invitation to connect with a cohort.</p>
            )}
          </section>
        </div>

        <aside className="space-y-8 lg:border-l lg:border-line lg:pl-8">
          <div>
            <h2 className="flex items-center gap-2 text-lg">
              <ClipboardList size={18} aria-hidden="true" /> Screening tests
            </h2>
            <p className="mt-2 text-sm text-muted">
              {myTests.length ? `${myTests.length} created. ${awaiting} result${awaiting === 1 ? "" : "s"} still to review.` : "You haven't created one yet. Open a connected cohort to start."}
            </p>
          </div>
          <Link href="/cohorts" className="btn btn-ghost w-full">
            Browse cohorts
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Inner() {
  const { me } = useStore();
  if (isStudent(me)) return <StudentDashboard me={me} />;
  if (isAlumni(me)) return <AlumniDashboard me={me} />;
  return null;
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}

