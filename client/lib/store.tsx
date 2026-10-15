"use client";

/*
  Demo data layer.
  Everything below talks to an in-browser database persisted in localStorage.
  When your FastAPI endpoints exist, replace the bodies of these actions with
  fetch() calls and keep the signatures; the pages will not need to change.
*/

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_ALUMNI_ID, DEMO_STUDENT_ID, createSeed } from "./seed";
import { DEMO_CODE } from "./brand";
import { checkInvite, isAlumni, isStudent, studentsOf, type InviteCheck } from "./selectors";
import type { Alumni, Attempt, DB, PlacementStatus, Question, Student, Test, User } from "./types";

const KEY = "dishari:v1";

type Patch = Partial<Omit<Student, "role"> & Omit<Alumni, "role">>;

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export interface StudentSignup {
  name: string;
  email: string;
  phone: string;
  regNo: number;
  universityId: string;
  department: string;
  resumeUrl?: string;
}

export interface AlumniSignup {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  universityId: string;
  gradYear: number;
}

export interface NewTest {
  cohortId: string;
  title: string;
  durationMin: number;
  passMark: number;
  questions: Omit<Question, "id">[];
}

interface Store {
  ready: boolean;
  db: DB;
  me: User | null;
  login: (email: string) => Result;
  loginDemo: (role: "student" | "alumni") => void;
  logout: () => void;
  signupStudent: (input: StudentSignup) => Result<{ outcome: "joined" | "created"; classmates: number }>;
  signupAlumni: (input: AlumniSignup) => Result;
  verify: (code: string) => boolean;
  updateMe: (patch: Patch) => void;
  inviteCheck: (alumniId: string) => InviteCheck;
  invite: (alumniId: string) => Result;
  respond: (invitationId: string, status: "accepted" | "rejected") => void;
  createTest: (input: NewTest) => string;
  submitAttempt: (testId: string, answers: number[]) => Attempt | null;
  setShortlisted: (attemptId: string, value: boolean) => void;
  setStudentStatus: (studentId: string, status: PlacementStatus) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => createSeed());
  const [meId, setMeId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  // Load persisted state after hydration so server and client markup match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { db: DB; meId: string | null };
        if (saved.db?.users) setDb(saved.db);
        if (saved.meId) setMeId(saved.meId);
      }
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ db, meId }));
    } catch {
      /* storage full or blocked */
    }
  }, [db, meId]);

  const me = useMemo(() => db.users.find((u) => u.id === meId) ?? null, [db, meId]);

  const patchUser = useCallback((id: string, patch: Patch) => {
    setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? ({ ...u, ...patch } as User) : u)) }));
  }, []);

  const login: Store["login"] = (email) => {
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return { ok: false, error: "No account uses that email. Check it or create an account." };
    setMeId(user.id);
    return { ok: true };
  };

  const loginDemo: Store["loginDemo"] = (role) => {
    setMeId(role === "student" ? DEMO_STUDENT_ID : DEMO_ALUMNI_ID);
  };

  const logout = () => setMeId(null);

  const signupStudent: Store["signupStudent"] = (input) => {
    const email = input.email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    if (db.users.some((u) => isStudent(u) && u.regNo === input.regNo && db.cohorts.find((c) => c.id === u.cohortId)?.universityId === input.universityId)) {
      return { ok: false, error: "This registration number is already registered at your university." };
    }

    let cohort = db.cohorts.find((c) => c.universityId === input.universityId && c.department === input.department);
    let outcome: "joined" | "created" = "joined";
    let nextDb = db;
    if (!cohort) {
      cohort = { id: uid("co"), universityId: input.universityId, department: input.department };
      outcome = "created";
      nextDb = { ...nextDb, cohorts: [...nextDb.cohorts, cohort] };
    }
    const classmates = studentsOf(nextDb, cohort.id).length;

    const student: Student = {
      id: uid("s"),
      role: "student",
      name: input.name.trim(),
      email,
      phone: input.phone,
      verified: false,
      regNo: input.regNo,
      cohortId: cohort.id,
      status: "not_applied",
      resumeUrl: input.resumeUrl?.trim() || undefined,
      cohortOutcome: outcome,
    };
    setDb({ ...nextDb, users: [...nextDb.users, student] });
    setMeId(student.id);
    return { ok: true, outcome, classmates };
  };

  const signupAlumni: Store["signupAlumni"] = (input) => {
    const email = input.email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    let nextDb = db;
    const name = input.companyName.trim();
    let company = db.companies.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!company) {
      company = { id: uid("c"), name, industry: "Added by alumni", hue: Math.floor(Math.random() * 360) };
      nextDb = { ...nextDb, companies: [...nextDb.companies, company] };
    }
    const user: Alumni = {
      id: uid("a"),
      role: "alumni",
      name: input.name.trim(),
      email,
      phone: input.phone,
      verified: false,
      companyId: company.id,
      title: input.title.trim(),
      universityId: input.universityId,
      gradYear: input.gradYear,
    };
    setDb({ ...nextDb, users: [...nextDb.users, user] });
    setMeId(user.id);
    return { ok: true };
  };

  const verify: Store["verify"] = (code) => {
    if (!me || code.trim() !== DEMO_CODE) return false;
    patchUser(me.id, { verified: true });
    return true;
  };

  const updateMe: Store["updateMe"] = (patch) => {
    if (me) patchUser(me.id, patch);
  };

  const inviteCheck: Store["inviteCheck"] = (alumniId) => {
    if (!isStudent(me)) return { state: "available" };
    const res = checkInvite(db, me.cohortId, alumniId);
    if (res.state === "pending") {
      const mine = db.invitations.some(
        (i) => i.cohortId === me.cohortId && i.alumniId === alumniId && i.status === "pending" && i.invitedBy === me.id,
      );
      return { ...res, mine };
    }
    return res;
  };

  const invite: Store["invite"] = (alumniId) => {
    if (!isStudent(me)) return { ok: false, error: "Only students can invite alumni." };
    if (!me.verified) return { ok: false, error: "Verify your account first." };
    const check = checkInvite(db, me.cohortId, alumniId);
    if (check.state !== "available" && check.state !== "retry") {
      return { ok: false, error: "Your cohort can't invite this person right now." };
    }
    const person = db.users.find((u) => u.id === alumniId);
    if (!isAlumni(person)) return { ok: false, error: "Person not found." };
    setDb((d) => ({
      ...d,
      invitations: [
        ...d.invitations,
        {
          id: uid("i"),
          cohortId: me.cohortId,
          alumniId,
          companyId: person.companyId,
          invitedBy: me.id,
          status: "pending",
          createdAt: now(),
        },
      ],
    }));
    return { ok: true };
  };

  const respond: Store["respond"] = (invitationId, status) => {
    setDb((d) => {
      const inv = d.invitations.find((i) => i.id === invitationId);
      if (!inv) return d;
      let users = d.users;
      if (status === "accepted") {
        // Once a company is on campus, classmates who hadn't applied are now in the process.
        users = users.map((u) =>
          isStudent(u) && u.cohortId === inv.cohortId && u.status === "not_applied"
            ? { ...u, status: "applied" as const }
            : u,
        );
      }
      return {
        ...d,
        users,
        invitations: d.invitations.map((i) => (i.id === invitationId ? { ...i, status, respondedAt: now() } : i)),
      };
    });
  };

  const createTest: Store["createTest"] = (input) => {
    const alumni = me;
    if (!isAlumni(alumni)) return "";
    const id = uid("t");
    const test: Test = {
      id,
      cohortId: input.cohortId,
      alumniId: alumni.id,
      companyId: alumni.companyId,
      title: input.title,
      durationMin: input.durationMin,
      passMark: input.passMark,
      createdAt: now(),
      questions: input.questions.map((q) => ({ ...q, id: uid("q") })),
    };
    setDb((d) => ({ ...d, tests: [...d.tests, test] }));
    return id;
  };

  const submitAttempt: Store["submitAttempt"] = (testId, answers) => {
    if (!isStudent(me)) return null;
    const test = db.tests.find((t) => t.id === testId);
    if (!test) return null;
    if (db.attempts.some((a) => a.testId === testId && a.studentId === me.id)) return null;
    const score = test.questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
    const attempt: Attempt = {
      id: uid("at"),
      testId,
      studentId: me.id,
      answers,
      score,
      total: test.questions.length,
      submittedAt: now(),
      shortlisted: false,
    };
    setDb((d) => ({ ...d, attempts: [...d.attempts, attempt] }));
    return attempt;
  };

  const setShortlisted: Store["setShortlisted"] = (attemptId, value) => {
    setDb((d) => {
      const attempt = d.attempts.find((a) => a.id === attemptId);
      if (!attempt) return d;
      const users = d.users.map((u) => {
        if (!isStudent(u) || u.id !== attempt.studentId) return u;
        if (value && (u.status === "not_applied" || u.status === "applied")) return { ...u, status: "written_test" as const };
        if (!value && u.status === "written_test") return { ...u, status: "applied" as const };
        return u;
      });
      return { ...d, users, attempts: d.attempts.map((a) => (a.id === attemptId ? { ...a, shortlisted: value } : a)) };
    });
  };

  const setStudentStatus: Store["setStudentStatus"] = (studentId, status) => {
    patchUser(studentId, { status });
  };

  const resetDemo = () => {
    setDb(createSeed());
    setMeId(null);
  };

  const value: Store = {
    ready,
    db,
    me,
    login,
    loginDemo,
    logout,
    signupStudent,
    signupAlumni,
    verify,
    updateMe,
    inviteCheck,
    invite,
    respond,
    createTest,
    submitAttempt,
    setShortlisted,
    setStudentStatus,
    resetDemo,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside AppProvider");
  return v;
}
