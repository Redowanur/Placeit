import type { Alumni, Cohort, DB, Invitation, PlacementStatus, Student, User } from "./types";

export const isStudent = (u: User | null | undefined): u is Student => u?.role === "student";
export const isAlumni = (u: User | null | undefined): u is Alumni => u?.role === "alumni";

export const studentsOf = (db: DB, cohortId: string) =>
  db.users.filter((u): u is Student => u.role === "student" && u.cohortId === cohortId);

export const alumniList = (db: DB) => db.users.filter(isAlumni);

export const userById = (db: DB, id: string) => db.users.find((u) => u.id === id);
export const companyById = (db: DB, id: string) => db.companies.find((c) => c.id === id);
export const uniById = (db: DB, id: string) => db.universities.find((u) => u.id === id);
export const cohortById = (db: DB, id: string) => db.cohorts.find((c) => c.id === id);

export function cohortName(db: DB, cohort: Cohort): string {
  const uni = uniById(db, cohort.universityId);
  return `${cohort.department}, ${uni?.short ?? ""}`;
}

export function statusCounts(students: Student[]): Record<PlacementStatus, number> {
  const base: Record<PlacementStatus, number> = {
    not_applied: 0,
    applied: 0,
    written_test: 0,
    interview: 0,
    placed: 0,
    not_placed: 0,
  };
  for (const s of students) base[s.status] += 1;
  return base;
}

export const invitationsOfCohort = (db: DB, cohortId: string) =>
  db.invitations
    .filter((i) => i.cohortId === cohortId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export type InviteCheck =
  | { state: "available" }
  | { state: "retry" }
  | { state: "pending"; byName: string; mine: boolean }
  | { state: "accepted" }
  | { state: "company-locked"; companyName: string; phase: "pending" | "accepted" };

/** Can this cohort invite this person right now? */
export function checkInvite(db: DB, cohortId: string, alumniId: string): InviteCheck {
  const person = db.users.find((u) => u.id === alumniId);
  if (!isAlumni(person)) return { state: "available" };
  const invs = invitationsOfCohort(db, cohortId);

  const own = invs.find((i) => i.alumniId === alumniId);
  if (own?.status === "pending") {
    const by = userById(db, own.invitedBy);
    return { state: "pending", byName: by?.name ?? "a classmate", mine: false };
  }
  if (own?.status === "accepted") return { state: "accepted" };

  const lock = invs.find(
    (i) => i.companyId === person.companyId && i.alumniId !== alumniId && i.status !== "rejected",
  );
  if (lock) {
    return {
      state: "company-locked",
      companyName: companyById(db, person.companyId)?.name ?? "this company",
      phase: lock.status === "accepted" ? "accepted" : "pending",
    };
  }
  return own?.status === "rejected" ? { state: "retry" } : { state: "available" };
}

/** For an alumni looking at a cohort: is a colleague already connected? */
export function colleagueLock(db: DB, cohortId: string, alumni: Alumni): Invitation | undefined {
  return invitationsOfCohort(db, cohortId).find(
    (i) => i.companyId === alumni.companyId && i.alumniId !== alumni.id && i.status !== "rejected",
  );
}

/** The company currently engaged with a cohort, if any. */
export function engagedInvitation(db: DB, cohortId: string): Invitation | undefined {
  const invs = invitationsOfCohort(db, cohortId);
  return invs.find((i) => i.status === "accepted") ?? invs.find((i) => i.status === "pending");
}
