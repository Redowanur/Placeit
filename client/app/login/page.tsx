"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Label, Notice } from "@/components/ui";
import { useStore } from "@/lib/store";

function LoginForm() {
  const { login, loginDemo } = useStore();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email);
    if (!res.ok) return setError(res.error);
    router.push(next);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-14 md:grid-cols-[1fr_0.9fr] md:py-20">
      <div>
        <h1 className="text-4xl">Log in</h1>
        <p className="mt-3 text-muted">Use the email you signed up with.</p>

        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          {error ? <Notice tone="bad">{error}</Notice> : null}
          <div>
            <Label htmlFor="email">Email</Label>
            <input id="email" type="email" autoComplete="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <input id="password" type="password" autoComplete="current-password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="mt-1.5 text-xs text-muted">Demo mode: the password isn't checked yet.</p>
          </div>
          <button className="btn btn-primary w-full sm:w-auto" disabled={!email || !password}>
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="link">
            Create an account
          </Link>
        </p>
      </div>

      <aside className="self-start rounded-2xl bg-sunken p-6">
        <h2 className="text-xl">Just looking around?</h2>
        <p className="mt-2 text-sm text-muted">Open a ready-made, verified account to try each side of the platform.</p>
        <div className="mt-5 flex flex-col gap-3">
          <button
            className="btn btn-ghost justify-start"
            onClick={() => {
              loginDemo("student");
              router.push("/dashboard");
            }}
          >
            Try as Nusrat, a CSE student at SUST
          </button>
          <button
            className="btn btn-ghost justify-start"
            onClick={() => {
              loginDemo("alumni");
              router.push("/dashboard");
            }}
          >
            Try as Rafiq, a senior engineer at Nodi Tech
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
