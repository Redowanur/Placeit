"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, GraduationCap } from "lucide-react";
import {
  AuthError,
  AuthShell,
  FormField,
  SubmitButton,
  SwitchAuthLink,
  inputClass,
} from "@/components/auth/form-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchUniversities,
  fetchDepartments,
  login,
  sendVerificationEmail,
  signUpRecruiter,
  signUpStudent,
  type University,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const selectClass = cn(
  inputClass,
  "cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2398a2b3%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-9",
);

/* --------------------------------- */
/* Student sign up                   */
/* --------------------------------- */

function StudentSignUpForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    reg_no: "",
    phone: "",
    password: "",
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<University[]>([]);
  const [uniId, setUniId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchUniversities()
      .then((data) => {
        if (!cancelled) setUniversities(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load universities. Refresh to try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!uniId) return;
    let cancelled = false;
    fetchDepartments(uniId)
      .then((data) => {
        if (!cancelled) {
          setDepartments(data);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load departments. Try selecting again.");
      });
    return () => {
      cancelled = true;
    };
  }, [uniId]);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpStudent({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        reg_no: Number(form.reg_no),
        password: form.password,
        dept_id: deptId,
        uni_id: uniId,
        phone: form.phone.trim(),
      });

      // Auto login after a successful registration
      const { access_token, user_type } = await login(form.email.trim(), form.password);
      await signIn(access_token, user_type);

      // Fire and forget — email verification link
      sendVerificationEmail(access_token).catch(() => {
        // Verification can be requested again later from the app
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthError message={error} />
      {loadError ? <p className="text-xs font-medium text-amber-600">{loadError}</p> : null}

      <FormField label="Full name" htmlFor="student-name">
        <input
          id="student-name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="Your name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email" htmlFor="student-email">
          <input
            id="student-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="Registration no." htmlFor="student-regno">
          <input
            id="student-regno"
            type="number"
            required
            min={1}
            placeholder="e.g. 202314010"
            value={form.reg_no}
            onChange={(event) => update("reg_no", event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="University" htmlFor="student-university">
          <select
            id="student-university"
            required
            value={uniId}
            onChange={(event) => {
              setUniId(event.target.value);
              // Reset the dependent department selection
              setDepartments([]);
              setDeptId("");
            }}
            className={cn(selectClass, uniId ? "" : "text-muted")}
          >
            <option value="" disabled>
              Select university
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Department" htmlFor="student-department">
          <select
            id="student-department"
            required
            value={deptId}
            disabled={!uniId}
            onChange={(event) => setDeptId(event.target.value)}
            className={cn(
              selectClass,
              "disabled:cursor-not-allowed disabled:opacity-60",
              deptId ? "" : "text-muted",
            )}
          >
            <option value="" disabled>
              {uniId ? "Select department" : "Pick university first"}
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="student-phone">
          <input
            id="student-phone"
            type="tel"
            required
            placeholder="+8801XXXXXXXX"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="Password" htmlFor="student-password">
          <input
            id="student-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <SubmitButton loading={loading}>
        <GraduationCap className="size-4.5" />
        Create student account
      </SubmitButton>
    </form>
  );
}

/* --------------------------------- */
/* Recruiter sign up                 */
/* --------------------------------- */

function RecruiterSignUpForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    company_name: "",
    designation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpRecruiter({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        company_name: form.company_name.trim(),
        designation: form.designation.trim(),
      });

      // Auto login after a successful registration
      const { access_token, user_type } = await login(form.email.trim(), form.password);
      await signIn(access_token, user_type);

      // Fire and forget — email verification link
      sendVerificationEmail(access_token).catch(() => {
        // Verification can be requested again later from the app
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthError message={error} />

      <FormField label="Full name" htmlFor="recruiter-name">
        <input
          id="recruiter-name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="Your name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Work email" htmlFor="recruiter-email">
          <input
            id="recruiter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="Phone" htmlFor="recruiter-phone">
          <input
            id="recruiter-phone"
            type="tel"
            required
            placeholder="+8801XXXXXXXX"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Company name" htmlFor="recruiter-company">
          <input
            id="recruiter-company"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="Must be a registered company"
            value={form.company_name}
            onChange={(event) => update("company_name", event.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="Designation" htmlFor="recruiter-designation">
          <input
            id="recruiter-designation"
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="e.g. HR Manager"
            value={form.designation}
            onChange={(event) => update("designation", event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Password" htmlFor="recruiter-password">
        <input
          id="recruiter-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          className={inputClass}
        />
      </FormField>

      <SubmitButton loading={loading}>
        <Building2 className="size-4.5" />
        Create recruiter account
      </SubmitButton>
    </form>
  );
}

/* --------------------------------- */
/* Page                              */
/* --------------------------------- */

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Pick your role and join our community"
      footer={
        <SwitchAuthLink text="Already have an account?" href="/login" linkText="Log in" />
      }
    >
      <Tabs defaultValue="student">
        <TabsList aria-label="Account type">
          <TabsTrigger value="student">
            <GraduationCap className="size-4.5" />
            Student
          </TabsTrigger>
          <TabsTrigger value="recruiter">
            <Building2 className="size-4.5" />
            Recruiter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="animate-overlay-in">
          <StudentSignUpForm />
        </TabsContent>
        <TabsContent value="recruiter" className="animate-overlay-in">
          <RecruiterSignUpForm />
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}
