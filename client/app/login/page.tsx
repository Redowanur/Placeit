"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  AuthError,
  AuthShell,
  FormField,
  SubmitButton,
  SwitchAuthLink,
  inputClass,
} from "@/components/auth/form-fields";
import { useAuth } from "@/hooks/use-auth";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { access_token, user_type } = await login(email.trim(), password);
      await signIn(access_token, user_type);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your account to continue"
      footer={
        <SwitchAuthLink
          text="Don't have an account?"
          href="/signup"
          linkText="Sign up"
        />
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthError message={error} />

        <FormField label="Email" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </FormField>

        <FormField label="Password" htmlFor="login-password">
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </FormField>

        <SubmitButton loading={loading}>Log in</SubmitButton>
      </form>
    </AuthShell>
  );
}
