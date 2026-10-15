"use client";

import { Check, Lock, Phone, Send } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { maskPhone } from "@/lib/format";
import { isStudent, companyById, uniById } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import type { Alumni } from "@/lib/types";
import { Avatar } from "./Avatar";

/** The alumni ID card. Phone number is masked until a verified student looks at it. */
export function IdCard({ person, footer, tilt = 0 }: { person: Alumni; footer?: ReactNode; tilt?: number }) {
  const { db, me } = useStore();
  const company = companyById(db, person.companyId);
  const uni = uniById(db, person.universityId);
  const canReveal = isStudent(me) && me.verified;

  return (
    <article className="id-card" style={{ "--co": company?.hue ?? 190, transform: tilt ? `rotate(${tilt}deg)` : undefined } as CSSProperties}>
      <div className="flex justify-center pt-3">
        <span className="id-slot" aria-hidden="true" />
      </div>
      <div className="px-5 pb-4 pt-3">
        <div className="flex items-center gap-4">
          <Avatar name={person.name} size={56} />
          <div className="min-w-0">
            <h3 className="truncate text-xl">{person.name}</h3>
            <p className="truncate text-sm text-muted">{person.title}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted">Company</dt>
          <dd className="font-semibold">{company?.name}</dd>
          <dt className="text-muted">Studied at</dt>
          <dd>
            {uni?.short}, class of {person.gradYear}
          </dd>
        </dl>
      </div>
      <hr className="perforation" />
      <div className="px-5 py-3.5">
        <div className="flex items-center gap-2.5 text-sm">
          {canReveal ? <Phone size={16} className="text-brand" aria-hidden="true" /> : <Lock size={16} className="text-muted" aria-hidden="true" />}
          {canReveal ? (
            <a href={`tel:${person.phone.replace(/\s|-/g, "")}`} className="font-semibold tracking-wide hover:underline">
              {person.phone}
            </a>
          ) : (
            <span className="select-none font-semibold tracking-wide text-muted blur-[0.5px]" aria-label="Phone number hidden">
              {maskPhone(person.phone)}
            </span>
          )}
        </div>
        {!canReveal ? (
          <p className="mt-1.5 text-xs text-muted">
            {!me ? (
              <>
                <Link href="/login" className="link">Log in</Link> or <Link href="/signup" className="link">create an account</Link> and verify to see this number.
              </>
            ) : isStudent(me) ? (
              <>
                <Link href="/verify" className="link">Verify your account</Link> to see this number.
              </>
            ) : (
              "Numbers are visible to verified students."
            )}
          </p>
        ) : null}
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </article>
  );
}

export function InviteAction({ alumniId }: { alumniId: string }) {
  const { me, inviteCheck, invite } = useStore();
  if (!isStudent(me)) return null;
  if (!me.verified) {
    return (
      <Link href="/verify" className="btn btn-ghost btn-sm w-full">
        Verify to invite
      </Link>
    );
  }
  const check = inviteCheck(alumniId);

  if (check.state === "available" || check.state === "retry") {
    return (
      <div>
        <button type="button" className="btn btn-primary btn-sm w-full" onClick={() => invite(alumniId)}>
          <Send size={15} aria-hidden="true" />
          {check.state === "retry" ? "Invite again" : "Invite to our campus"}
        </button>
        {check.state === "retry" ? <p className="mt-1.5 text-xs text-muted">They declined before. You can try again.</p> : null}
      </div>
    );
  }
  if (check.state === "pending") {
    return (
      <p className="flex items-center gap-2 text-sm text-warn">
        <Check size={16} aria-hidden="true" />
        {check.mine ? "You invited them. Waiting for a reply." : `${check.byName} already invited them.`}
      </p>
    );
  }
  if (check.state === "accepted") {
    return (
      <p className="flex items-center gap-2 text-sm text-ok">
        <Check size={16} aria-hidden="true" />
        Accepted your cohort's invitation.
      </p>
    );
  }
  return (
    <p className="text-sm text-muted">
      {check.companyName} is already {check.phase === "accepted" ? "connected with" : "talking to"} your cohort through a colleague.
    </p>
  );
}
