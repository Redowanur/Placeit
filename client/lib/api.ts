// Thin client for the FastAPI backend. NEXT_PUBLIC_API_URL is the base URL,
// for example http://127.0.0.1:8000 (set it in .env.local and restart `npm run dev`).
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface Option {
  id: string;
  name: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function messageFrom(body: unknown, status: number): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { loc?: unknown[]; msg?: string }) => {
        const field = Array.isArray(d.loc) ? d.loc.filter((x) => x !== "body").join(".") : "";
        const msg = String(d.msg ?? "").replace(/^Value error, /, "");
        return field ? `${field}: ${msg}` : msg;
      })
      .join(" ");
  }
  return status >= 500 ? "The server had a problem. Try again in a moment." : "The request was rejected.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new ApiError("NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart the dev server.", 0);

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection, and that the backend allows this origin (CORS).", 0);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(messageFrom(body, res.status), res.status);
  }
  return res.json() as Promise<T>;
}

interface Named {
  _id: string;
  name: string;
}

const toOption = (r: Named): Option => ({ id: r._id, name: r.name });

export async function getUniversities(): Promise<Option[]> {
  return (await request<Named[]>("/api/v1/universities")).map(toOption);
}

export async function getDepartments(universityId: string): Promise<Option[]> {
  const rows = await request<Named[]>(`/api/v1/departments?university_id=${encodeURIComponent(universityId)}`);
  return rows.map(toOption);
}

export interface StudentPayload {
  name: string;
  email: string;
  reg_no: number;
  password: string;
  dept_id: string;
  uni_id: string;
  phone: string;
}

export async function createStudent(payload: StudentPayload): Promise<unknown> {
  return request("/api/v1/students", { method: "POST", body: JSON.stringify(payload) });
}