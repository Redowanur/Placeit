"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Label, Notice } from "@/components/ui";
import { useStore } from "@/lib/store";
import { Select } from "@/components/Select";
import { createStudent, getDepartments, getUniversities } from "@/lib/api";
import { useLazyOptions } from "@/lib/useLazyOptions";

const phoneOk = (v: string) => /^1\d{9}$/.test(v);

function Phone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div className="flex">
			<span className="grid place-items-center rounded-l-[10px] border-[1.5px] border-r-0 border-line bg-sunken px-3 text-sm font-semibold text-muted">+880</span>
			<input
				id="phone"
				inputMode="numeric"
				autoComplete="tel-national"
				placeholder="1712345678"
				maxLength={10}
				className="field rounded-l-none"
				value={value}
				onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
			/>
		</div>
	);
}

function StudentForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", universityId: "", departmentId: "", regNo: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const universities = useLazyOptions(getUniversities, "all");
  const departments = useLazyOptions(() => getDepartments(f.universityId), f.universityId || null);

  const text = (k: "name" | "email" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!f.universityId) return setError("Choose your university.");
    if (!f.departmentId) return setError("Choose your department.");
    if (!phoneOk(f.phone)) return setError("Enter a 10 digit mobile number, like 1712345678.");
    if (f.password.length < 8) return setError("Choose a password with at least 8 characters.");

    setSubmitting(true);
    try {
      await createStudent({
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        reg_no: Number(f.regNo),
        password: f.password,
        dept_id: f.departmentId,
        uni_id: f.universityId,
        phone: f.phone,
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error ? <Notice tone="bad">{error}</Notice> : null}
      <div>
        <Label htmlFor="name">Full name</Label>
        <input id="name" required autoComplete="name" className="field" value={f.name} onChange={text("name")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="uni">University</Label>
          <Select
            id="uni"
            placeholder="Select university"
            value={f.universityId}
            options={universities.options}
            loading={universities.status === "loading"}
            error={universities.status === "error" ? universities.error : undefined}
            emptyText="No universities found."
            onOpen={universities.load}
            onChange={(id) => setF({ ...f, universityId: id, departmentId: "" })}
          />
        </div>
        <div>
          <Label htmlFor="dept">Department</Label>
          <Select
            id="dept"
            placeholder={f.universityId ? "Select department" : "Choose a university first"}
            disabled={!f.universityId}
            value={f.departmentId}
            options={departments.options}
            loading={departments.status === "loading"}
            error={departments.status === "error" ? departments.error : undefined}
            emptyText="No departments added for this university yet."
            onOpen={departments.load}
            onChange={(id) => setF({ ...f, departmentId: id })}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="reg">Registration number</Label>
          <input id="reg" inputMode="numeric" required className="field" value={f.regNo} onChange={(e) => setF({ ...f, regNo: e.target.value.replace(/\D/g, "") })} />
        </div>
        <div>
          <Label htmlFor="phone">Mobile number</Label>
          <Phone value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">University email</Label>
        <input id="email" type="email" required autoComplete="email" className="field" value={f.email} onChange={text("email")} />
      </div>
      <div>
        <Label htmlFor="password" hint="at least 8 characters">
          Password
        </Label>
        <input id="password" type="password" required autoComplete="new-password" className="field" value={f.password} onChange={text("password")} />
      </div>
      <button className="btn btn-primary w-full sm:w-auto" disabled={submitting || !f.name || !f.regNo || !f.email}>
        {submitting ? "Creating account…" : "Create student account"}
      </button>
    </form>
  );
}

function AlumniForm() {
	const { db, signupAlumni } = useStore();
	const router = useRouter();
	const [f, setF] = useState({ name: "", email: "", phone: "", password: "", companyName: "", title: "", universityId: "u-sust", gradYear: "2018" });
	const [error, setError] = useState("");
	const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!phoneOk(f.phone)) return setError("Enter a 10 digit mobile number, like 1712345678.");
		if (f.password.length < 8) return setError("Choose a password with at least 8 characters.");
		const year = Number(f.gradYear);
		if (year < 1980 || year > new Date().getFullYear()) return setError("Enter the year you graduated.");
		const res = signupAlumni({
			name: f.name,
			email: f.email,
			phone: `+880 ${f.phone}`,
			companyName: f.companyName,
			title: f.title,
			universityId: f.universityId,
			gradYear: year,
		});
		if (!res.ok) return setError(res.error);
		router.push("/verify");
	}

	return (
		<form onSubmit={submit} className="space-y-5" noValidate>
			{error ? <Notice tone="bad">{error}</Notice> : null}
			<div>
				<Label htmlFor="name">Full name</Label>
				<input id="name" required autoComplete="name" className="field" value={f.name} onChange={set("name")} />
			</div>
			<div className="grid gap-5 sm:grid-cols-2">
				<div>
					<Label htmlFor="company">Company</Label>
					<input id="company" list="companies" required className="field" value={f.companyName} onChange={set("companyName")} />
					<datalist id="companies">
						{db.companies.map((c) => (
							<option key={c.id} value={c.name} />
						))}
					</datalist>
				</div>
				<div>
					<Label htmlFor="title" hint="shown on your card">
						Your role
					</Label>
					<input id="title" required placeholder="Senior Software Engineer" className="field" value={f.title} onChange={set("title")} />
				</div>
			</div>
			<div className="grid gap-5 sm:grid-cols-2">
				<div>
					<Label htmlFor="uni">University you graduated from</Label>
					<select id="uni" className="field" value={f.universityId} onChange={set("universityId")}>
						{db.universities.map((u) => (
							<option key={u.id} value={u.id}>
								{u.short}, {u.city}
							</option>
						))}
					</select>
				</div>
				<div>
					<Label htmlFor="year">Graduation year</Label>
					<input id="year" inputMode="numeric" required className="field" value={f.gradYear} onChange={(e) => setF({ ...f, gradYear: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
				</div>
			</div>
			<div className="grid gap-5 sm:grid-cols-2">
				<div>
					<Label htmlFor="email">Work email</Label>
					<input id="email" type="email" required autoComplete="email" className="field" value={f.email} onChange={set("email")} />
				</div>
				<div>
					<Label htmlFor="phone">Mobile number</Label>
					<Phone value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
				</div>
			</div>
			<div>
				<Label htmlFor="password" hint="at least 8 characters">
					Password
				</Label>
				<input id="password" type="password" required autoComplete="new-password" className="field" value={f.password} onChange={set("password")} />
			</div>
			<button className="btn btn-primary w-full sm:w-auto" disabled={!f.name || !f.companyName || !f.title}>
				Create alumni account
			</button>
		</form>
	);
}

function SignupInner() {
	const router = useRouter();
	const role = useSearchParams().get("role") === "alumni" ? "alumni" : "student";

	const tab = (r: "student" | "alumni", label: string) => (
		<button
			type="button"
			role="tab"
			aria-selected={role === r}
			onClick={() => router.replace(`/signup?role=${r}`)}
			className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${role === r ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
		>
			{label}
		</button>
	);

	return (
		<div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
			<h1 className="text-4xl">Create your account</h1>
			<p className="mt-3 text-muted">
				{role === "student"
					? "You'll join your department's cohort at your university. If nobody from it has signed up, you start it."
					: "Help your juniors find a job. Several people from one company can each have an account."}
			</p>

			<div role="tablist" aria-label="Account type" className="mt-8 flex gap-1 rounded-full bg-sunken p-1">
				{tab("student", "I'm a student")}
				{tab("alumni", "I work at a company")}
			</div>

			<div className="mt-8">{role === "student" ? <StudentForm key="s" /> : <AlumniForm key="a" />}</div>

			<p className="mt-8 text-sm text-muted">
				Already have an account?{" "}
				<Link href="/login" className="link">
					Log in
				</Link>
			</p>
		</div>
	);
}

export default function SignupPage() {
	return (
		<Suspense fallback={null}>
			<SignupInner />
		</Suspense>
	);
}
