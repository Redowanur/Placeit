"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clock,
  LoaderCircle,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { fetchJobSuggestions, type JobSuggestion } from "@/lib/api";
import { jobCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full appearance-none rounded-xl bg-transparent text-sm font-medium text-heading outline-none md:rounded-none";

function FieldShell({
  children,
  className,
  bordered = true,
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-line px-3 transition-all duration-200 focus-within:border-primary-400 focus-within:shadow-[0_0_0_3px_rgb(44_177_138_/_0.12)] md:h-14 md:flex-1 md:rounded-none md:border-0",
        bordered && "md:border-l md:border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SelectField({
  name,
  placeholder,
  options,
  label,
}: {
  name: string;
  placeholder: string;
  options: string[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when focus leaves the trigger + option list
  const handleBlur = (event: React.FocusEvent) => {
    if (!shellRef.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={shellRef}
      className="relative md:flex-1 md:min-w-0"
      onBlur={handleBlur}
    >
      <FieldShell
        className={open ? "relative pr-2 border-primary-400" : "relative pr-2"}
      >
        {label ? <span className="sr-only">{label}</span> : null}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className={cn(
            "h-full w-full cursor-pointer appearance-none bg-transparent text-left text-sm font-medium outline-none",
            selected ? "text-heading" : "text-body",
          )}
        >
          {selected || placeholder}
        </button>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 size-4 text-muted transition-transform duration-200 md:right-4",
            open && "rotate-180 text-primary-500",
          )}
        />
      </FieldShell>

      {selected ? <input type="hidden" name={name} value={selected} /> : null}

      {open ? (
        <ul
          id={`category-${name}`}
          role="listbox"
          className="animate-overlay-in absolute left-0 top-[calc(100%+10px)] z-30 w-[min(18rem,calc(100vw-3rem))] origin-top overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-2xl shadow-night-950/15"
        >
          {options.map((option, index) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                onClick={() => {
                  setSelected(option === selected ? "" : option);
                  setOpen(false);
                }}
                className="animate-item-in flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-body transition-colors hover:bg-surface hover:text-heading focus-visible:bg-surface focus-visible:text-heading focus-visible:outline-none"
                style={{ animationDelay: `${index * 25}ms` }}
              >
                <span className="truncate">{option}</span>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary-500 transition-opacity duration-150",
                    selected === option ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SuggestionList({
  suggestions,
  showLoading,
  showError,
  onSelect,
}: {
  suggestions: JobSuggestion[];
  showLoading: boolean;
  showError: boolean;
  onSelect: (title: string) => void;
}) {
  return (
    <div
      id="hero-job-suggestions"
      role="listbox"
      className="animate-overlay-in absolute left-0 top-[calc(100%+10px)] z-30 w-[min(30rem,calc(100vw-3rem))] origin-top overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-night-950/15"
    >
      {showLoading ? (
        <div className="flex items-center gap-2.5 px-4 py-4 text-sm text-body">
          <LoaderCircle className="size-4 animate-spin text-primary-500" />
          Searching jobs...
        </div>
      ) : showError ? (
        <div className="px-4 py-4 text-sm text-body">
          Couldn&#39;t load suggestions. Please try again.
        </div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-4 text-sm text-body">No jobs found.</div>
      ) : (
        <div className="max-h-80 overflow-y-auto overscroll-contain">
          {suggestions.map((job, index) => (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelect(job.title)}
              className="animate-item-in group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600 transition-colors duration-200 group-hover:bg-primary-100">
                <BriefcaseBusiness className="size-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-heading">
                  {job.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-body">
                  <Building2 className="size-3.5 shrink-0 text-muted" />
                  <span className="truncate">{job.company_name}</span>
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-1 text-[11px] font-medium text-muted sm:flex">
                <Clock className="size-3.5" />
                {job.posted}
              </span>
            </button>
          ))}
        </div>
      )}

      <a
        href="/jobs"
        className="group flex w-full items-center justify-center gap-1.5 border-t border-line py-3 text-sm font-semibold text-primary-600 transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700"
      >
        View all
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const titleFieldRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const open = focused && trimmed !== "";

  // Debounced suggestion fetching
  useEffect(() => {
    if (!trimmed) return;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      fetchJobSuggestions(trimmed, controller.signal)
        .then((data) => {
          if (controller.signal.aborted) return;
          setSuggestions(data);
          setError(false);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  // Close the dropdown when focus leaves the input + list
  const handleBlur = (event: React.FocusEvent) => {
    if (!titleFieldRef.current?.contains(event.relatedTarget as Node)) {
      setFocused(false);
    }
  };

  return (
    <form
      action="/jobs"
      method="get"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-2xl bg-white p-3 text-left shadow-2xl shadow-night-950/30 md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-0">
        <FieldShell
          ref={titleFieldRef}
          bordered={false}
          className="relative md:pl-5 md:pr-4"
        >
          <label htmlFor="hero-job-title" className="sr-only">
            Job title or company
          </label>
          <Search className="size-4.5 shrink-0 text-muted" />
          <input
            id="hero-job-title"
            name="title"
            type="text"
            placeholder="Job Title, Company"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (!value.trim()) {
                // Reset suggestion state as soon as the input is emptied
                setSuggestions([]);
                setError(false);
                setLoading(false);
              } else {
                setLoading(true);
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            onKeyDown={(event) => {
              if (event.key === "Escape") setFocused(false);
            }}
            className={cn(
              fieldClass,
              "min-w-0 flex-1 placeholder:font-medium placeholder:text-heading/60",
            )}
          />
          {loading && trimmed ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin text-primary-500" />
          ) : null}

          {open ? (
            <SuggestionList
              showLoading={loading && suggestions.length === 0}
              showError={error}
              suggestions={suggestions}
              onSelect={(title) => {
                setQuery(title);
                window.setTimeout(() => titleFieldRef.current?.focus(), 0);
              }}
            />
          ) : null}
        </FieldShell>

        <SelectField
          name="category"
          placeholder="Select Category"
          label="Category"
          options={jobCategories}
        />

        <div className="md:p-2">
          <Button type="submit" className="h-11 w-full gap-2 px-7 md:h-12 md:w-auto">
            <Search className="size-4.5" />
            Search Job
          </Button>
        </div>
      </div>
    </form>
  );
}
