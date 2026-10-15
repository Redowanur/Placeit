export type Role = "student" | "alumni";

export type PlacementStatus =
  | "not_applied"
  | "applied"
  | "written_test"
  | "interview"
  | "placed"
  | "not_placed";

export type InviteStatus = "pending" | "accepted" | "rejected";

export interface University {
  id: string;
  name: string;
  short: string;
  city: string;
  emailDomain: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  hue: number;
}

export interface Cohort {
  id: string;
  universityId: string;
  department: string;
}

interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
}

export interface Student extends BaseUser {
  role: "student";
  regNo: number;
  cohortId: string;
  status: PlacementStatus;
  resumeUrl?: string;
  /** set on signup so the verify page can say how the cohort was formed */
  cohortOutcome?: "joined" | "created";
}

export interface Alumni extends BaseUser {
  role: "alumni";
  companyId: string;
  title: string;
  universityId: string;
  gradYear: number;
}

export type User = Student | Alumni;

export interface Invitation {
  id: string;
  cohortId: string;
  alumniId: string;
  companyId: string;
  invitedBy: string; // student id
  status: InviteStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number;
}

export interface Test {
  id: string;
  cohortId: string;
  alumniId: string;
  companyId: string;
  title: string;
  durationMin: number;
  passMark: number; // percent
  questions: Question[];
  createdAt: string;
}

export interface Attempt {
  id: string;
  testId: string;
  studentId: string;
  answers: number[];
  score: number;
  total: number;
  submittedAt: string;
  shortlisted: boolean;
}

export interface DB {
  universities: University[];
  companies: Company[];
  cohorts: Cohort[];
  users: User[];
  invitations: Invitation[];
  tests: Test[];
  attempts: Attempt[];
}
