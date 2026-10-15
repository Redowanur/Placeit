"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Option } from "@/lib/api";

interface Props {
  id: string;
  value: string;
  options: Option[];
  onChange: (id: string) => void;
  /** Called each time the list opens. Use it to fetch options. */
  onOpen?: () => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyText?: string;
}

/** Dropdown with a scrollable list (max 15rem tall), keyboard support and loading/error states. */
export function Select({ id, value, options, onChange, onOpen, placeholder, disabled, loading, error, emptyText = "Nothing to choose from yet." }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function openList() {
    if (disabled) return;
    setOpen(true);
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    onOpen?.();
  }

  function choose(o: Option) {
    onChange(o.id);
    setOpen(false);
    button.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "Tab") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    }
  }

  const status = loading ? (
    <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted" role="status">
      <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading…
    </p>
  ) : error ? (
    <div className="px-4 py-3 text-sm" role="alert">
      <p className="text-bad">{error}</p>
      <button type="button" className="link mt-1" onClick={() => onOpen?.()}>
        Try again
      </button>
    </div>
  ) : !options.length ? (
    <p className="px-4 py-3 text-sm text-muted">{emptyText}</p>
  ) : null;

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        disabled={disabled}
        className="field flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-55"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={`truncate ${selected ? "" : "text-muted"}`}>{selected?.name ?? placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
          {status ?? (
            <ul
              ref={list}
              id={listId}
              role="listbox"
              className="max-h-60 overflow-y-auto overscroll-contain py-1 [scrollbar-width:thin]"
            >
              {options.map((o, i) => (
                <li
                  key={o.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={o.id === value}
                  data-active={i === active}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${i === active ? "bg-brand-soft" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(o)}
                >
                  <span>{o.name}</span>
                  {o.id === value ? <Check size={16} className="shrink-0 text-brand" aria-hidden="true" /> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}