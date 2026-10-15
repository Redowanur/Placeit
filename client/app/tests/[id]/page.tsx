"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tone } from "@/components/Chips";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty } from "@/components/ui";
import { companyById, invitationsOfCohort, isStudent, userById } from "@/lib/selectors";
import { useStore } from "@/lib/store";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function Runner() {
  const { id } = useParams<{ id: string }>();
  const { db, me, submitAttempt } = useStore();
  const test = db.tests.find((t) => t.id === id);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [left, setLeft] = useState(0);
  const submitted = useRef(false);

  const finish = useCallback(
    (a: number[]) => {
      if (submitted.current) return;
      submitted.current = true;
      submitAttempt(id, a);
    },
    [id, submitAttempt],
  );

  useEffect(() => {
    if (!started || !test) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, test]);

  useEffect(() => {
    if (started && left <= 0 && test) finish(test.questions.map((_, i) => answers[i] ?? -1));
  }, [left, started, test, answers, finish]);

  if (!isStudent(me) || !test) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Empty title="We couldn't find that test" action={<Link href="/dashboard" className="btn btn-primary">Back to dashboard</Link>} />
      </div>
    );
  }

  const allowed = me.cohortId === test.cohortId && invitationsOfCohort(db, test.cohortId).some((i) => i.alumniId === test.alumniId && i.status === "accepted");
  if (!allowed || !me.verified) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Empty title="This test isn't open to you" action={<Link href="/dashboard" className="btn btn-primary">Back to dashboard</Link>}>
          Tests are open to verified students in the cohort that the alumni is connected with.
        </Empty>
      </div>
    );
  }

  const attempt = db.attempts.find((a) => a.testId === test.id && a.studentId === me.id);
  const author = userById(db, test.alumniId);
  const company = companyById(db, test.companyId);

  if (attempt) {
    const need = Math.ceil((test.passMark / 100) * test.questions.length);
    return (
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-4xl">
          You scored {attempt.score} out of {attempt.total}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tone tone={attempt.score >= need ? "ok" : "neutral"}>{attempt.score >= need ? "Above the pass mark" : "Below the pass mark"}</Tone>
          {attempt.shortlisted ? <Tone tone="ok">Shortlisted</Tone> : <Tone tone="neutral">Under review</Tone>}
        </div>
        <p className="mt-5 text-muted">
          {author?.name} at {company?.name} reviews results and shortlists students. You'll see your status on your cohort page.
        </p>
        <ol className="mt-8 space-y-6">
          {test.questions.map((q, i) => {
            const mine = attempt.answers[i];
            const right = mine === q.correct;
            return (
              <li key={q.id} className="border-t border-line pt-4">
                <p className="font-semibold">{q.text}</p>
                <p className="mt-1.5 text-sm">
                  <span className={right ? "text-ok" : "text-bad"}>{mine >= 0 ? `Your answer: ${q.options[mine]}` : "No answer"}</span>
                  {!right ? <span className="block text-muted">Correct: {q.options[q.correct]}</span> : null}
                </p>
              </li>
            );
          })}
        </ol>
        <Link href="/cohort?tab=companies" className="btn btn-primary mt-10">
          Back to your cohort
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-4xl">{test.title}</h1>
        <p className="mt-3 text-muted">
          Set by {author?.name}, {company?.name}.
        </p>
        <ul className="mt-6 space-y-1.5">
          <li>{test.questions.length} multiple-choice questions</li>
          <li>{test.durationMin} minutes, and the test submits itself when time runs out</li>
          <li>Pass mark {test.passMark}%</li>
          <li>You can take it once</li>
        </ul>
        <button
          className="btn btn-primary mt-8"
          onClick={() => {
            setAnswers(test.questions.map(() => -1));
            setLeft(test.durationMin * 60);
            setStarted(true);
          }}
        >
          Start the test
        </button>
      </div>
    );
  }

  const unanswered = answers.filter((a) => a < 0).length;
  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-8">
      <div className="sticky top-16 z-10 -mx-5 mb-8 flex items-center justify-between gap-4 border-b border-line bg-bg/95 px-5 py-3 backdrop-blur">
        <p className="truncate font-display text-lg font-bold">{test.title}</p>
        <p className={`flex items-center gap-2 font-semibold ${left <= 60 ? "text-bad" : ""}`} role="timer" aria-live="off">
          <Clock size={18} aria-hidden="true" /> {fmt(Math.max(left, 0))}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          finish(answers);
        }}
      >
        <ol className="space-y-9">
          {test.questions.map((q, i) => (
            <li key={q.id}>
              <fieldset>
                <legend className="mb-3 text-lg font-semibold">
                  {i + 1}. {q.text}
                </legend>
                <div className="space-y-2">
                  {q.options.map((o, k) => (
                    <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 transition-colors ${answers[i] === k ? "border-brand bg-brand-soft" : "border-line hover:border-ink"}`}>
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="size-4 accent-[var(--brand)]"
                        checked={answers[i] === k}
                        onChange={() => setAnswers(answers.map((a, j) => (j === i ? k : a)))}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button className="btn btn-primary">Submit answers</button>
          {unanswered ? <p className="text-sm text-muted">{unanswered} unanswered</p> : null}
        </div>
      </form>
    </div>
  );
}

export default function TestPage() {
  return (
    <RequireAuth role="student">
      <Runner />
    </RequireAuth>
  );
}
