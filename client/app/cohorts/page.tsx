"use client";

import { useState } from "react";
import { CohortRow } from "@/components/CohortRow";
import { Empty, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function Cohorts() {
  const { db } = useStore();
  const [uni, setUni] = useState("all");
  const list = db.cohorts.filter((c) => uni === "all" || c.universityId === uni);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12">
      <PageHeader
        title="Cohorts about to graduate"
        intro="Every department at every university gets one cohort. Sign in as a verified alumni to open a cohort and meet its students."
        action={
          <div>
            <label htmlFor="uni" className="sr-only">
              University
            </label>
            <select id="uni" className="field min-w-56" value={uni} onChange={(e) => setUni(e.target.value)}>
              <option value="all">All universities</option>
              {db.universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.short}, {u.city}
                </option>
              ))}
            </select>
          </div>
        }
      />
      {list.length ? (
        <ul className="border-t border-line">
          {list.map((c) => (
            <CohortRow key={c.id} cohort={c} />
          ))}
        </ul>
      ) : (
        <Empty title="No cohorts from this university yet">The first student to sign up from a department starts its cohort.</Empty>
      )}
    </div>
  );
}
