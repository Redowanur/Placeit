"use client";

import { MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Label, Notice } from "@/components/ui";
import { DEMO_CODE } from "@/lib/brand";
import { cohortById, cohortName, isStudent, studentsOf } from "@/lib/selectors";
import { useStore } from "@/lib/store";

function VerifyInner() {
  const { me, db, verify } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  if (!me) return null;

  const cohort = isStudent(me) ? cohortById(db, me.cohortId) : undefined;
  const classmates = cohort ? studentsOf(db, cohort.id).length - 1 : 0;

  if (me.verified) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <ShieldCheck size={36} className="text-ok" aria-hidden="true" />
        <h1 className="mt-4 text-4xl">You're verified</h1>
        <p className="mt-3 text-muted">
          {isStudent(me)
            ? "Contact numbers are unlocked and your cohort can invite alumni."
            : "You can now accept invitations and open the cohorts that contact you."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn btn-primary">
            Go to your dashboard
          </Link>
          <Link href={isStudent(me) ? "/alumni" : "/cohorts"} className="btn btn-ghost">
            {isStudent(me) ? "Browse alumni" : "Browse cohorts"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      {cohort && isStudent(me) && me.cohortOutcome ? (
        <div className="mb-10">
          <Notice tone="ok">
            {me.cohortOutcome === "joined" ? (
              <>
                You joined <strong>{cohortName(db, cohort)}</strong> with {classmates} {classmates === 1 ? "classmate" : "classmates"}.
              </>
            ) : (
              <>
                You're the first from your department, so we started the <strong>{cohortName(db, cohort)}</strong> cohort for you. Classmates who sign up later will join it.
              </>
            )}
          </Notice>
        </div>
      ) : null}

      <MailCheck size={36} className="text-brand" aria-hidden="true" />
      <h1 className="mt-4 text-4xl">Verify your account</h1>
      <p className="mt-3 text-muted">
        We sent a 6 digit code to <strong className="text-ink">{me.email}</strong>. Enter it to unlock {isStudent(me) ? "contact numbers and invitations" : "invitations and cohorts"}.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!verify(code)) setError("That code didn't match. Check the latest email and try again.");
        }}
      >
        {error ? <Notice tone="bad">{error}</Notice> : null}
        <div>
          <Label htmlFor="code">Verification code</Label>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="field max-w-48 text-center font-display text-2xl tracking-[0.4em]"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
          />
        </div>
        <button className="btn btn-primary" disabled={code.length !== 6}>
          Verify account
        </button>
      </form>

      <p className="mt-8 rounded-xl bg-sunken px-4 py-3 text-sm text-muted">
        Demo mode: no email is sent. Use <strong className="text-ink">{DEMO_CODE}</strong>.
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <RequireAuth>
      <VerifyInner />
    </RequireAuth>
  );
}
