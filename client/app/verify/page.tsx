"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CircleAlert } from "lucide-react";

import { verifyEmail } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function VerifyEmailPage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const requested = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-invocation double-verifying
    if (requested.current) return;
    requested.current = true;

    // Defer verification work out of the effect body
    const timer = setTimeout(() => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        setState({
          kind: "error",
          message: "No verification token found in the link.",
        });
        return;
      }

      verifyEmail(token)
        .then((data) => setState({ kind: "success", message: data.message }))
        .catch((err: unknown) =>
          setState({
            kind: "error",
            message:
              err instanceof Error
                ? err.message
                : "Something went wrong. Please try again.",
          }),
        );
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-surface/60 py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="animate-overlay-in flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          {state.kind === "loading" ? (
            <>
              <span className="size-10 animate-spin rounded-full border-3 border-line border-t-primary-500" />
              <p className="text-sm text-body">Verifying your account…</p>
            </>
          ) : state.kind === "success" ? (
            <>
              <span className="grid size-14 place-items-center rounded-full bg-primary-50 text-primary-500">
                <BadgeCheck className="size-7" />
              </span>
              <h1 className="font-display text-xl font-bold text-heading">
                Email verified
              </h1>
              <p className="text-sm text-body">{state.message}</p>
              <Link
                href="/"
                className="mt-2 h-11 rounded-xl bg-primary-500 px-6 text-sm font-semibold leading-[2.75rem] text-white transition-colors hover:bg-primary-600"
              >
                Go to home
              </Link>
            </>
          ) : (
            <>
              <span className="grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
                <CircleAlert className="size-7" />
              </span>
              <h1 className="font-display text-xl font-bold text-heading">
                Verification failed
              </h1>
              <p className="text-sm text-body">{state.message}</p>
              <Link
                href="/login"
                className="mt-2 h-11 rounded-xl border border-line px-6 text-sm font-semibold text-heading leading-[2.6rem] transition-colors hover:border-primary-400 hover:text-primary-600"
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
