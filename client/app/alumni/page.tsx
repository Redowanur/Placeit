"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { IdCard, InviteAction } from "@/components/IdCard";
import { Empty, PageHeader } from "@/components/ui";
import { alumniList, companyById, isStudent } from "@/lib/selectors";
import { useStore } from "@/lib/store";

export default function AlumniDirectory() {
  const { db, me } = useStore();
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("all");

  const all = alumniList(db);
  const companiesWithPeople = useMemo(
    () => db.companies.filter((c) => all.some((a) => a.companyId === c.id)),
    [db.companies, all],
  );

  const list = all.filter((a) => {
    const co = companyById(db, a.companyId);
    const hay = `${a.name} ${a.title} ${co?.name ?? ""}`.toLowerCase();
    return (company === "all" || a.companyId === company) && hay.includes(q.trim().toLowerCase());
  });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <PageHeader
        title="Alumni who can show you the way"
        intro={
          isStudent(me) && me.verified
            ? "Invite someone to your campus. If a colleague at their company is already talking to your cohort, you'll see that here."
            : "Everyone below graduated and now works at a company. Numbers stay hidden until you log in with a verified student account."
        }
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="q" className="sr-only">
            Search by name, role or company
          </label>
          <input id="q" className="field pl-10" placeholder="Search by name, role or company" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="company" className="sr-only">
            Company
          </label>
          <select id="company" className="field" value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="all">All companies</option>
            {companiesWithPeople.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {list.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <li key={a.id}>
              <IdCard person={a} footer={isStudent(me) ? <InviteAction alumniId={a.id} /> : undefined} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          title="No one matches that search"
          action={
            <button className="btn btn-ghost" onClick={() => { setQ(""); setCompany("all"); }}>
              Clear search
            </button>
          }
        >
          Try a company name or a role like "backend".
        </Empty>
      )}
    </div>
  );
}
