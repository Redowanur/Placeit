"use client";

import { useCallback, useRef, useState } from "react";
import type { Option } from "./api";

type Status = "idle" | "loading" | "ready" | "error";
interface State {
  key: string | null;
  status: Status;
  options: Option[];
  error: string;
}

const IDLE: State = { key: null, status: "idle", options: [], error: "" };

/**
 * Options that are fetched the first time `load()` is called (for example when a dropdown opens).
 * When `key` changes, the previous result is discarded, and late responses for an old key are ignored.
 */
export function useLazyOptions(fetcher: () => Promise<Option[]>, key: string | null) {
  const [state, setState] = useState<State>(IDLE);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const current = state.key === key ? state : IDLE;

  const load = useCallback(() => {
    if (!key) return;
    if (state.key === key && (state.status === "loading" || state.status === "ready")) return;
    setState({ key, status: "loading", options: [], error: "" });
    fetcherRef
      .current()
      .then((options) => setState((s) => (s.key === key ? { key, status: "ready", options, error: "" } : s)))
      .catch((e) =>
        setState((s) =>
          s.key === key ? { key, status: "error", options: [], error: e instanceof Error ? e.message : "Something went wrong." } : s,
        ),
      );
  }, [key, state.key, state.status]);

  return { options: current.options, status: current.status, error: current.error, load };
}