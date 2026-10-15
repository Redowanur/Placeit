"use client";

import { useState } from "react";
import { StatusChip } from "@/components/Chips";
import { RequireAuth } from "@/components/RequireAuth";
import { Label, Notice, PageHeader } from "@/components/ui";
import { cohortById, cohortName, companyById, isAlumni, isStudent, uniById } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import type { Alumni, Student } from "@/lib/types";

function StudentProfile({ me }: { me: Student }) {
  const { db, updateMe } = useStore();
  const [url, setUrl] = useState(me.resumeUrl ?? "");
  const [saved, setSaved] = useState(false);
  const cohort = cohortById(db, me.cohortId)!;

  return (
    <>
      <dl className="grid max-w-xl grid-cols-[8rem_1fr] gap-y-3">
        <dt className="text-muted">Email</dt><dd>{me.email}</dd>
        <dt className="text-muted">Phone</dt><dd>{me.phone}</dd>
        <dt className="text-muted">University</dt><dd>{uniById(db, cohort.universityId)?.name}</dd>
        <dt className="text-muted">Cohort</dt><dd>{cohortName(db, cohort)}</dd>
        <dt className="text-muted">Registration</dt><dd>{me.regNo}</dd>
        <dt className="text-muted">Placement</dt><dd><StatusChip status={me.status} /></dd>
      </dl>

      <form
        className="mt-12 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          updateMe({ resumeUrl: url.trim() || undefined });
          setSaved(true);
        }}
      >
        <h2 className="text-2xl">Resume link</h2>
        <p className="mt-2 text-sm text-muted">Optional. Alumni connected with your cohort can open it from the student list.</p>
        <div className="mt-4">
          <Label htmlFor="resume">Link to your resume</Label>
          <input id="resume" type="url" className="field" placeholder="https://drive.google.com/…" value={url} onChange={(e) => { setUrl(e.target.value); setSaved(false); }} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button className="btn btn-primary">Save resume link</button>
          {saved ? <span className="text-sm text-ok" role="status">Saved</span> : null}
        </div>
      </form>
    </>
  );
}

function AlumniProfile({ me }: { me: Alumni }) {
  const { db, updateMe } = useStore();
  const [title, setTitle] = useState(me.title);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <dl className="grid max-w-xl grid-cols-[8rem_1fr] gap-y-3">
        <dt className="text-muted">Email</dt><dd>{me.email}</dd>
        <dt className="text-muted">Phone</dt><dd>{me.phone}</dd>
        <dt className="text-muted">Company</dt><dd>{companyById(db, me.companyId)?.name}</dd>
        <dt className="text-muted">Studied at</dt><dd>{uniById(db, me.universityId)?.name}, class of {me.gradYear}</dd>
      </dl>
      <form
        className="mt-12 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          updateMe({ title: title.trim() });
          setSaved(true);
        }}
      >
        <h2 className="text-2xl">Your role</h2>
        <p className="mt-2 text-sm text-muted">Shown on your ID card in the alumni directory.</p>
        <div className="mt-4">
          <Label htmlFor="title">Role</Label>
          <input id="title" className="field" value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button className="btn btn-primary" disabled={!title.trim()}>Save role</button>
          {saved ? <span className="text-sm text-ok" role="status">Saved</span> : null}
        </div>
      </form>
    </>
  );
}

function Inner() {
  const { me, resetDemo } = useStore();
  if (!me) return null;
  return (
    <div className="mx-auto max-w-4xl px-5 pb-8 pt-12">
      <PageHeader title={me.name} intro={me.verified ? "Your account is verified." : undefined} />
      {!me.verified ? <div className="mb-8 max-w-xl"><Notice tone="warn">This account isn't verified yet. Verify it from the banner above to unlock contacts.</Notice></div> : null}
      {isStudent(me) ? <StudentProfile me={me} /> : isAlumni(me) ? <AlumniProfile me={me} /> : null}

      <div className="mt-16 max-w-xl border-t border-line pt-6">
        <h2 className="text-lg">Demo data</h2>
        <p className="mt-1 text-sm text-muted">Everything here is stored in this browser. Reset it to get the original sample data back.</p>
        <button className="btn btn-ghost btn-sm mt-3" onClick={() => { if (confirm("Reset all demo data and log out?")) resetDemo(); }}>
          Reset demo data
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <Inner />
    </RequireAuth>
  );
}
