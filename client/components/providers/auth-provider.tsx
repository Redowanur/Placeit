"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, type AuthUser, type UserType } from "@/lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  isStudent: boolean;
  isRecruiter: boolean;
  /** Stores the token + user type from `/auth/login`, then hydrates the profile from `/auth/me`. */
  signIn: (accessToken: string, userType: UserType) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "access_token";
const USER_TYPE_KEY = "user_type";
const USER_KEY = "user";

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Hydrate from localStorage and (re)validate the session against /auth/me
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userType = localStorage.getItem(USER_TYPE_KEY);
    let cancelled = false;

    // Restore/validate in a deferred task so this effect body
    // never calls setState synchronously
    const timer = setTimeout(() => {
      if (!token || !userType) {
        setStatus("unauthenticated");
        return;
      }

      // Show the cached profile instantly, then refresh it
      const cached = readStoredUser();
      if (cached) {
        setUser(cached);
        setAccessToken(token);
        setStatus("authenticated");
      }

      fetchCurrentUser(token)
        .then((fresh) => {
          if (cancelled) return;
          setUser(fresh);
          setAccessToken(token);
          setStatus("authenticated");
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        })
        .catch(() => {
          if (cancelled) return;
          if (!cached) {
            clearStorage();
            setStatus("unauthenticated");
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const signIn = useCallback(async (token: string, userType: UserType) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_TYPE_KEY, userType);
    setAccessToken(token);
    setStatus("authenticated");

    try {
      const profile = await fetchCurrentUser(token);
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch {
      // Token was accepted by /login; keep the session without a full profile
    }
  }, []);

  const signOut = useCallback(() => {
    clearStorage();
    setUser(null);
    setAccessToken(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      status,
      isStudent: user?.user_type === "student",
      isRecruiter: user?.user_type === "recruiter",
      signIn,
      signOut,
    }),
    [user, accessToken, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
