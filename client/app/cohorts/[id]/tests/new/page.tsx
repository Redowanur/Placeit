"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty, Label, Notice, PageHeader } from "@/components/ui";
import { cohortById, cohortName, invitationsOfCohort } from "@/lib/selectors";
import { useStore } from "@/lib/store";

interface Draft {
  text: string;
  options: string[];
  correct: number;
}

const blank = (): Draft => ({ text: "", options: ["", "", "", ""], correct: 0 });

function Builder() {
  const { id } = useParams<{ id: string }>();
  const { db, me, createTest } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [durationMin, setDuration] = useState("15");
  const [passMark, setPassMark] = useState("60");
  const [qs, setQs] = useState<Draft[]>([blank()]);
  const [error, setError] = useState("");

  const cohort = cohortById(db, id);
  const allowed = !!me && !!cohort && me.verified && invitationsOfCohort(db, id).some((i) => i.alumniId === me.id && i.status === "accepted");

  if (!cohort || !allowed) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Empty title="You can't create a test for this cohort" action={<Link href="/cohorts" className="btn btn-ghost">Back to cohorts</Link>}>
          Tests are available after you verify your account and accept the cohort's invitation.
        </Empty>
      </div>
    );
  }

  const update = (i: number, patch: Partial<Draft>) => setQs(qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const dur = Number(durationMin);
    const pass = Number(passMark);
    if (!title.trim()) return setError("Give the test a title.");
    if (!(dur >= 1 && dur <= 180)) return setError("Duration must be between 1 and 180 minutes.");
    if (!(pass >= 1 && pass <= 100)) return setError("Pass mark must be between 1 and 100 percent.");
    for (const [n, q] of qs.entries()) {
      if (!q.text.trim() || q.options.some((o) => !o.trim())) return setError(`Question ${n + 1} needs a question and all four options.`);
    }
    createTest({
      cohortId: id,
      title: title.trim(),
      durationMin: dur,
      passMark: pass,
      questions: qs.map((q) => ({ text: q.text.trim(), options: q.options.map((o) => o.trim()), correct: q.correct })),
    });
    router.push(`/cohorts/${id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-12">
      <PageHeader title="Create a screening test" intro={`For ${cohortName(db, cohort)}. Students answer online, you review the scores and shortlist.`} />
      <form onSubmit={submit} className="space-y-8" noValidate>
        {error ? <Notice tone="bad">{error}</Notice> : null}

        <div className="grid gap-5 sm:grid-cols-[1fr_8rem_8rem]">
          <div>
            <Label htmlFor="title">Test title</Label>
            <input id="title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Backend fundamentals" />
          </div>
          <div>
            <Label htmlFor="dur">Minutes</Label>
            <input id="dur" inputMode="numeric" className="field" value={durationMin} onChange={(e) => setDuration(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div>
            <Label htmlFor="pass">Pass mark %</Label>
            <input id="pass" inputMode="numeric" className="field" value={passMark} onChange={(e) => setPassMark(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>

        <ol className="space-y-8">
          {qs.map((q, i) => (
            <li key={i} className="rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg">Question {i + 1}</h2>
                {qs.length > 1 ? (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setQs(qs.filter((_, j) => j !== i))} aria-label={`Remove question ${i + 1}`}>
                    <Trash2 size={15} aria-hidden="true" /> Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-3">
                <Label htmlFor={`q-${i}`}>Question</Label>
                <textarea id={`q-${i}`} rows={2} className="field" value={q.text} onChange={(e) => update(i, { text: e.target.value })} />
              </div>
              <fieldset className="mt-4">
                <legend className="mb-1.5 text-sm font-semibold">
                  Options <span className="font-normal text-muted">(select the correct one)</span>
                </legend>
                <div className="space-y-2.5">
                  {q.options.map((o, k) => (
                    <div key={k} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correct === k}
                        onChange={() => update(i, { correct: k })}
                        className="size-5 accent-[var(--brand)]"
                        aria-label={`Option ${k + 1} is correct`}
                      />
                      <input
                        className="field"
                        value={o}
                        aria-label={`Option ${k + 1}`}
                        onChange={(e) => update(i, { options: q.options.map((x, m) => (m === k ? e.target.value : x)) })}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => setQs([...qs, blank()])}>
            <Plus size={16} aria-hidden="true" /> Add a question
          </button>
          <button className="btn btn-primary">Publish test</button>
          <Link href={`/cohorts/${id}`} className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function NewTestPage() {
  return (
    <RequireAuth role="alumni">
      <Builder />
    </RequireAuth>
  );
}
