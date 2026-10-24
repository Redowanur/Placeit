const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type JobSuggestion = {
  id: string;
  title: string;
  company_name: string;
  posted: string;
};

export type UserType = "student" | "recruiter" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_type: UserType;
  is_verified: boolean;
  // Student only
  reg_no?: number;
  dept_id?: string;
  placement_status?: string;
  // Recruiter only
  company_name?: string;
  designation?: string;
};

export type ApiError = Error & { status?: number };

export async function request<T>(
  path: string,
  init?: RequestInit & { authToken?: string },
): Promise<T> {
  const { authToken, headers, ...rest } = init ?? {};
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") detail = data.detail;
    } catch {
      // ignore body parse errors, keep fallback message
    }
    const error: ApiError = new Error(detail);
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

/* ---------------------------------- */
/* Authentication                     */
/* ---------------------------------- */

export async function login(
  email: string,
  password: string,
): Promise<{ access_token: string; user_type: UserType }> {
  const data = await request<{
    access_token: string;
    token_type: string;
    user_type: UserType;
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { access_token: data.access_token, user_type: data.user_type };
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/auth/me", { authToken: token });
}

/** POSTs the click-token from the emailed link and flips `is_verified`. */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return request<{ message: string }>("/api/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

/** Best-effort: asks the backend to email the verification link after signup. */
export async function sendVerificationEmail(token: string): Promise<void> {
  await request("/api/v1/auth/send-verification", { method: "POST", authToken: token });
}

export type StudentSignUpPayload = {
  name: string;
  email: string;
  reg_no: number;
  password: string;
  dept_id: string;
  uni_id: string;
  phone: string;
};

export async function signUpStudent(payload: StudentSignUpPayload): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type RecruiterSignUpPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  company_name: string;
  designation: string;
};

export async function signUpRecruiter(
  payload: RecruiterSignUpPayload,
): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/recruiter", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ---------------------------------- */
/* Universities & departments         */
/* ---------------------------------- */

export type University = { id: string; name: string };

type UniversityDoc = { _id: string; id?: string; name: string };

export async function fetchUniversities(): Promise<University[]> {
  const docs = await request<UniversityDoc[]>("/api/v1/universities");
  return docs.map((doc) => ({ id: String(doc._id ?? doc.id), name: doc.name }));
}

export async function fetchDepartments(uniId: string): Promise<University[]> {
  const docs = await request<
    { department_id: string; department_name: string }[]
  >(`/api/v1/departments?university_id=${uniId}`);
  return docs.map((doc) => ({ id: doc.department_id, name: doc.department_name }));
}

/* ---------------------------------- */
/* Jobs                               */
/* ---------------------------------- */

export async function fetchJobSuggestions(
  q: string,
  signal?: AbortSignal,
): Promise<JobSuggestion[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/job/suggestion?search_key=${encodeURIComponent(q)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Suggestion request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.suggestions;
}
