"use client";

import Link from "next/link";
import { Tone } from "@/components/Chips";
import { CohortRow } from "@/components/CohortRow";
import { IdCard } from "@/components/IdCard";
import { Avatar } from "@/components/Avatar";
import { BRAND } from "@/lib/brand";
import { useStore } from "@/lib/store";
import { alumniList } from "@/lib/selectors";

const studentSteps = [
  "Browse alumni without an account. You'll see who works where, and their role.",
  "Create an account and verify it. That unlocks their contact numbers.",
  "You join your department's cohort at your university. If you're the first, we start it.",
  "Invite alumni to your campus. Each person can be invited once at a time, and a declined invitation can be sent again.",
  "Follow your classmates' placement status and every company your cohort has contacted.",
];

const alumniSteps = [
  "Browse graduating cohorts from every university without an account.",
  "Create an account and verify it to connect.",
  "Accept or decline invitations from cohorts.",
  "Open any cohort that contacted you and see who's in it.",
  "Run an online screening test to shortlist students before you visit campus.",
];

export default function Home() {
  const { db, ready, me } = useStore();
  const alumni = alumniList(db);
  const rafiq = alumni.find((a) => a.id === "a-rafiq")!;
  const sadia = alumni.find((a) => a.id === "a-sadia")!;
  const tasnim = alumni.find((a) => a.id === "a-tasnim")!;
  const connectedCompanies = new Set(db.invitations.filter((i) => i.status !== "rejected").map((i) => i.companyId)).size;
  const unis = new Set(db.cohorts.map((c) => c.universityId)).size;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <h1 className="text-[2.6rem] sm:text-6xl">Your seniors already work where you want to work.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            {BRAND.name} connects graduating cohorts with alumni inside companies. Invite them to your campus, take their screening test, and get shortlisted together.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ready && me ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to your dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup?role=student" className="btn btn-primary">
                  I'm a final-year student
                </Link>
                <Link href="/signup?role=alumni" className="btn btn-ghost">
                  I work at a company
                </Link>
              </>
            )}
          </div>
          <p className="mt-5 text-sm text-muted">
            No account yet? You can{" "}
            <Link href="/alumni" className="link">
              browse alumni
            </Link>{" "}
            and{" "}
            <Link href="/cohorts" className="link">
              browse cohorts
            </Link>{" "}
            first.
          </p>
        </div>

        <div className="relative mx-auto grid w-full max-w-md grid-cols-1 gap-0 sm:max-w-lg sm:grid-cols-2 sm:gap-5" aria-label="Example alumni ID cards">
          <div className="shake sm:mt-0" style={{ transformOrigin: "50% 0" }}>
            <div className="lanyard" aria-hidden="true" />
            <IdCard person={rafiq} tilt={-2} />
          </div>
          <div className="hidden sm:mt-10 sm:block">
            <div className="lanyard" aria-hidden="true" />
            <IdCard person={sadia} tilt={2.5} />
          </div>
        </div>
      </section>

      {/* Quiet live sentence */}
      <section className="border-y border-line bg-sunken">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-[1.05rem]">
          <strong className="font-semibold">{db.cohorts.length} cohorts</strong> from {unis} universities are talking to{" "}
          <strong className="font-semibold">{connectedCompanies} companies</strong> through {alumni.length} alumni.
        </p>
      </section>

      {/* Two journeys */}
      <section className="mx-auto max-w-6xl px-5 py-20" id="how-it-works">
        <h2 className="max-w-2xl text-3xl sm:text-4xl">Two doors in, one conversation between them</h2>
        <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <h3 className="text-2xl">If you're graduating</h3>
            <ol className="mt-5 space-y-5 border-l-2 border-line pl-6">
              {studentSteps.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.15rem] top-0.5 grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-brand-ink">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-2xl">If you already work somewhere</h3>
            <ol className="mt-5 space-y-5 border-l-2 border-line pl-6">
              {alumniSteps.map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.15rem] top-0.5 grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-ink">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* The one rule worth explaining */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 rounded-[28px] bg-brand-soft px-6 py-10 sm:px-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl">One company talks to a cohort through one person at a time</h2>
            <p className="mt-4 max-w-xl text-muted">
              When someone at a company is invited or accepts, their colleagues can't connect with that cohort. It keeps students from getting duplicate calls, and it keeps companies from stepping on each other.
            </p>
          </div>
          <ul className="space-y-3" aria-label="Example">
            <li className="flex items-center gap-3 rounded-2xl bg-surface p-4">
              <Avatar name={rafiq.name} size={42} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{rafiq.name}</p>
                <p className="text-sm text-muted">Nodi Tech, accepted CSE, SUST</p>
              </div>
              <Tone tone="ok">Connected</Tone>
            </li>
            <li className="flex items-center gap-3 rounded-2xl bg-surface p-4 opacity-80">
              <Avatar name={tasnim.name} size={42} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{tasnim.name}</p>
                <p className="text-sm text-muted">Nodi Tech, same cohort</p>
              </div>
              <Tone tone="neutral">Locked</Tone>
            </li>
          </ul>
        </div>
      </section>

      {/* Cohorts peek */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Cohorts graduating now</h2>
          <Link href="/cohorts" className="link">
            See all cohorts
          </Link>
        </div>
        <ul className="mt-6 border-t border-line">
          {db.cohorts.slice(0, 4).map((c) => (
            <CohortRow key={c.id} cohort={c} compact />
          ))}
        </ul>
      </section>
    </>
  );
}
